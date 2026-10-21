"""Face detection and LBPH recognition (opencv-contrib-python).

Fixes applied
-------------
* More lenient detectMultiScale params so faces are found in webcam frames
  and typical passport/ID-style photos.
* Cascade is loaded once per process (module-level singleton) instead of
  on every call – avoids silent failures on some OpenCV builds.
* Multi-pass detection: first tries tighter params, then falls back to
  very relaxed params so partial / off-angle faces still register.
* Preprocessing: bilateral denoise before detection for noisy webcam images.
* predict_from_bgr now returns a clear (None, None) vs (None, distance)
  so callers can distinguish "no face" from "low confidence".
* model_ready() also validates the file is non-zero bytes.
"""

from __future__ import annotations

import cv2
import numpy as np
from pathlib import Path

DATA_ROOT = Path(__file__).resolve().parent.parent / "data"
FACES_DIR = DATA_ROOT / "faces"
MODEL_PATH = DATA_ROOT / "lbph_model.yml"

CASCADE_PATH = Path(cv2.data.haarcascades) / "haarcascade_frontalface_default.xml"
EYE_CASCADE_PATH = Path(cv2.data.haarcascades) / "haarcascade_eye.xml"
FACE_SIZE = (100, 100)

# LBPH: lower distance = better match; reject if above threshold
MAX_CONFIDENCE_DISTANCE = 400.0

# ── module-level cascade singletons ───────────────────────────────────────────
_CASCADE: cv2.CascadeClassifier | None = None
_EYE_CASCADE: cv2.CascadeClassifier | None = None


def _get_cascade() -> cv2.CascadeClassifier:
    global _CASCADE
    if _CASCADE is None or _CASCADE.empty():
        _CASCADE = cv2.CascadeClassifier(str(CASCADE_PATH))
        if _CASCADE.empty():
            raise RuntimeError(
                f"Could not load Haar cascade from {CASCADE_PATH}. "
                "Make sure opencv-contrib-python is installed correctly."
            )
    return _CASCADE


def _get_eye_cascade() -> cv2.CascadeClassifier:
    global _EYE_CASCADE
    if _EYE_CASCADE is None or _EYE_CASCADE.empty():
        _EYE_CASCADE = cv2.CascadeClassifier(str(EYE_CASCADE_PATH))
        if _EYE_CASCADE.empty():
            raise RuntimeError(
                f"Could not load Haar eye cascade from {EYE_CASCADE_PATH}."
            )
    return _EYE_CASCADE


def _ensure_dirs() -> None:
    FACES_DIR.mkdir(parents=True, exist_ok=True)


# ── face detection helpers ────────────────────────────────────────────────────

def _preprocess(bgr: np.ndarray) -> np.ndarray:
    """Denoise + equalise for better cascade hits on webcam images."""
    # Mild bilateral filter to reduce noise without blurring edges
    denoised = cv2.bilateralFilter(bgr, d=5, sigmaColor=50, sigmaSpace=50)
    gray = cv2.cvtColor(denoised, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    return gray


def _detect_faces(gray: np.ndarray) -> list:
    """
    Three-pass face detection — from strict (close, clear) to lenient
    (small/distant faces). Returns (x,y,w,h) tuples sorted largest-first.
    """
    cascade = _get_cascade()

    # Pass 1 – strict: close, well-lit faces
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.1,
        minNeighbors=5,
        minSize=(60, 60),
        flags=cv2.CASCADE_SCALE_IMAGE,
    )
    if len(faces) > 0:
        return sorted(faces, key=lambda f: f[2] * f[3], reverse=True)

    # Pass 2 – moderate: webcam / off-angle faces
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.05,
        minNeighbors=3,
        minSize=(40, 40),
        flags=cv2.CASCADE_SCALE_IMAGE,
    )
    if len(faces) > 0:
        return sorted(faces, key=lambda f: f[2] * f[3], reverse=True)

    # Pass 3 – lenient: small / distant faces (across a room)
    # minNeighbors=2 still filters most non-face objects.
    faces = cascade.detectMultiScale(
        gray,
        scaleFactor=1.03,
        minNeighbors=2,
        minSize=(20, 20),
        flags=cv2.CASCADE_SCALE_IMAGE,
    )
    if len(faces) > 0:
        return sorted(faces, key=lambda f: f[2] * f[3], reverse=True)

    return []


def _largest_face_rect(bgr: np.ndarray) -> tuple[int, int, int, int] | None:
    """Return (x, y, w, h) of largest frontal face, or None."""
    if bgr is None or bgr.size == 0:
        return None
    gray = _preprocess(bgr)
    faces = _detect_faces(gray)
    if not faces:
        return None
    x, y, w, h = faces[0]
    return int(x), int(y), int(w), int(h)


def detect_face_gray(bgr: np.ndarray) -> np.ndarray | None:
    """Return aligned grayscale face ROI or None."""
    rect = _largest_face_rect(bgr)
    if rect is None:
        return None
    x, y, w, h = rect
    gray = _preprocess(bgr)
    roi = gray[y: y + h, x: x + w]
    return cv2.resize(roi, FACE_SIZE)


def face_crop_bgr(bgr: np.ndarray) -> np.ndarray | None:
    """Color crop of detected face for preview."""
    rect = _largest_face_rect(bgr)
    if rect is None:
        return None
    x, y, w, h = rect
    return bgr[y: y + h, x: x + w].copy()


# ── image conversion ───────────────────────────────────────────────────────────

def pil_to_bgr(image_input) -> np.ndarray:
    """Convert Streamlit UploadedFile / PIL Image / ndarray to BGR."""
    from io import BytesIO
    from PIL import Image

    if image_input is None:
        raise ValueError("No image input")

    if isinstance(image_input, np.ndarray):
        if image_input.ndim == 3 and image_input.shape[2] >= 3:
            rgb = image_input[:, :, :3]
            return cv2.cvtColor(rgb, cv2.COLOR_RGB2BGR)
        raise ValueError("Unsupported array shape")

    if isinstance(image_input, Image.Image):
        pil_image = image_input
        if pil_image.mode != "RGB":
            pil_image = pil_image.convert("RGB")
        arr = np.array(pil_image)
        return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)

    # Streamlit UploadedFile / file-like
    if hasattr(image_input, "read"):
        if hasattr(image_input, "seek"):
            image_input.seek(0)
        data = image_input.read()
        pil_image = Image.open(BytesIO(data))
    else:
        pil_image = Image.open(image_input)

    if pil_image.mode != "RGB":
        pil_image = pil_image.convert("RGB")
    arr = np.array(pil_image)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)


# ── training ───────────────────────────────────────────────────────────────────

def save_training_sample(student_id: int, bgr: np.ndarray) -> bool:
    face = detect_face_gray(bgr)
    if face is None:
        return False
    _ensure_dirs()
    folder = FACES_DIR / str(student_id)
    folder.mkdir(parents=True, exist_ok=True)
    n = len(list(folder.glob("*.png")))
    path = folder / f"sample_{n:04d}.png"
    cv2.imwrite(str(path), face)
    return True


def _load_training_set():
    images: list[np.ndarray] = []
    labels: list[int] = []
    if not FACES_DIR.is_dir():
        return images, labels
    for sub in sorted(FACES_DIR.iterdir(), key=lambda p: p.name):
        if not sub.is_dir():
            continue
        try:
            sid = int(sub.name)
        except ValueError:
            continue
        for png in sorted(sub.glob("*.png")):
            img = cv2.imread(str(png), cv2.IMREAD_GRAYSCALE)
            if img is None:
                continue
            if img.shape != FACE_SIZE[::-1]:
                img = cv2.resize(img, FACE_SIZE)
            images.append(img)
            labels.append(sid)
    return images, labels


def train_and_save() -> tuple[int, int]:
    """Train LBPH on all saved faces. Returns (num_samples, num_students)."""
    images, labels = _load_training_set()
    _ensure_dirs()
    if not images:
        if MODEL_PATH.exists():
            MODEL_PATH.unlink(missing_ok=True)
        return 0, 0
    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.train(images, np.array(labels, dtype=np.int32))
    recognizer.write(str(MODEL_PATH))
    unique = len(set(labels))
    return len(images), unique


# ── recognition ────────────────────────────────────────────────────────────────

def predict_from_bgr(
    bgr: np.ndarray,
    *,
    apply_threshold: bool = True,
    max_distance: float | None = None,
) -> tuple[int | None, float | None]:
    """
    LBPH face recognition.

    Returns
    -------
    (student_id, distance)   – confident match
    (None, distance)         – face found but distance exceeds threshold
    (None, None)             – no face detected OR no model on disk
    """
    limit = max_distance if max_distance is not None else MAX_CONFIDENCE_DISTANCE

    if not model_ready():
        return None, None          # ← "no model" branch

    face = detect_face_gray(bgr)
    if face is None:
        return None, None          # ← "no face" branch

    recognizer = cv2.face.LBPHFaceRecognizer_create()
    recognizer.read(str(MODEL_PATH))
    label, confidence = recognizer.predict(face)

    if apply_threshold and confidence > limit:
        return None, float(confidence)   # below threshold
    return int(label), float(confidence)


# ── Anti-Spoofing & Liveness Detection ───────────────────────────────────────

def check_liveness(bgr: np.ndarray, face_rect: tuple[int, int, int, int] | None = None) -> dict:
    """
    Multi-factor Anti-Spoofing & Liveness Verification:
    1. Eye presence in upper facial region (Haar eye cascade).
    2. High-frequency texture & micro-gradient analysis (Laplacian variance test
       to detect blurry printed photos and flat paper).
    3. Chrominance & skin reflection distribution in YCrCb color space
       (to distinguish human skin from LCD screens and B&W printouts).

    Returns:
      {
        "is_live": bool,
        "score": int (0-100),
        "status": "LIVE" | "SPOOF SUSPECTED",
        "details": list[str],
        "warnings": list[str],
      }
    """
    if bgr is None or bgr.size == 0:
        return {"is_live": False, "score": 0, "status": "NO_IMAGE", "details": [], "warnings": ["Empty frame"]}

    if face_rect is None:
        rect = _largest_face_rect(bgr)
        if rect is None:
            return {"is_live": False, "score": 0, "status": "NO_FACE", "details": [], "warnings": ["No face found"]}
        x, y, w, h = rect
    else:
        x, y, w, h = face_rect

    face_crop = bgr[y : y + h, x : x + w]
    if face_crop.size == 0:
        return {"is_live": False, "score": 0, "status": "INVALID_CROP", "details": [], "warnings": ["Invalid crop"]}

    score = 0
    details = []
    warnings = []

    # 1. Texture / Gradient variance check (Paper & Blur test)
    face_gray = cv2.cvtColor(face_crop, cv2.COLOR_BGR2GRAY)
    lap_var = float(cv2.Laplacian(face_gray, cv2.CV_64F).var())
    if lap_var >= 65.0:
        score += 35
        details.append(f"Natural skin micro-texture verified (variance: {lap_var:.1f})")
    elif lap_var >= 35.0:
        score += 20
        details.append(f"Acceptable texture gradient (variance: {lap_var:.1f})")
    else:
        warnings.append(f"Low surface texture variance ({lap_var:.1f}) — flat paper or blur suspected")

    # 2. Eye presence check in upper facial ROI
    eye_cascade = _get_eye_cascade()
    upper_face_gray = face_gray[0 : int(h * 0.65), :]
    eyes = eye_cascade.detectMultiScale(upper_face_gray, scaleFactor=1.1, minNeighbors=3, minSize=(15, 15))
    num_eyes = len(eyes)
    if num_eyes >= 2:
        score += 40
        details.append("Bilateral eye landmarks detected (2 eyes)")
    elif num_eyes == 1:
        score += 25
        details.append("Eye landmark detected (1 eye / angled)")
    else:
        warnings.append("No active eye landmarks detected in upper face")

    # 3. YCrCb Skin Tone Gamut Distribution
    ycrcb = cv2.cvtColor(face_crop, cv2.COLOR_BGR2YCrCb)
    skin_mask = cv2.inRange(ycrcb, np.array([0, 133, 77]), np.array([255, 173, 127]))
    skin_ratio = float(np.count_nonzero(skin_mask)) / float(face_crop.shape[0] * face_crop.shape[1])
    if 0.20 <= skin_ratio <= 0.95:
        score += 25
        details.append(f"Biological chrominance verified (skin coverage: {int(skin_ratio * 100)}%)")
    else:
        warnings.append(f"Abnormal chromatic distribution ({int(skin_ratio * 100)}%) — screen backlight or B&W printout suspected")

    is_live = score >= 50
    status = "LIVE" if is_live else "SPOOF SUSPECTED"

    return {
        "is_live": is_live,
        "score": min(100, score),
        "status": status,
        "details": details,
        "warnings": warnings,
    }


def predict_all_from_bgr(
    bgr: np.ndarray,
    *,
    apply_threshold: bool = True,
    max_distance: float | None = None,
    check_liveness_flag: bool = True,
) -> list[dict]:
    """
    Multi-Face Recognition:
    Detects and recognizes EVERY face in the frame simultaneously (Classroom / Group mode).
    Runs LBPH recognition and optional anti-spoofing on each face.

    Returns a list of dicts:
      [
        {
          "face_idx": 1,
          "rect": (x, y, w, h),
          "student_id": int | None,
          "confidence": float | None,
          "is_verified": bool,
          "liveness": dict,
        },
        ...
      ]
    """
    limit = max_distance if max_distance is not None else MAX_CONFIDENCE_DISTANCE
    gray = _preprocess(bgr)
    faces = _detect_faces(gray)
    if not faces:
        return []

    recognizer = None
    if model_ready():
        recognizer = cv2.face.LBPHFaceRecognizer_create()
        recognizer.read(str(MODEL_PATH))

    results = []
    for idx, (x, y, w, h) in enumerate(faces):
        roi_gray = gray[y : y + h, x : x + w]
        if roi_gray.size == 0:
            continue
        face_100 = cv2.resize(roi_gray, FACE_SIZE)

        label_id: int | None = None
        conf: float | None = None
        if recognizer is not None:
            lbl, c = recognizer.predict(face_100)
            conf = float(c)
            if not apply_threshold or conf <= limit:
                label_id = int(lbl)

        # Anti-spoofing
        liveness_data = check_liveness(bgr, (int(x), int(y), int(w), int(h))) if check_liveness_flag else {"is_live": True, "score": 100, "status": "BYPASSED", "details": [], "warnings": []}

        is_verified = (label_id is not None) and (liveness_data["is_live"] if check_liveness_flag else True)

        results.append({
            "face_idx": idx + 1,
            "rect": (int(x), int(y), int(w), int(h)),
            "student_id": label_id,
            "confidence": conf,
            "is_verified": is_verified,
            "liveness": liveness_data,
        })

    return results


def annotate_multi_recognition(
    bgr: np.ndarray,
    matches: list[dict],
    id_to_name: dict[int, str],
    max_distance: float = MAX_CONFIDENCE_DISTANCE,
) -> np.ndarray:
    """
    Draw bounding boxes, badges, names, and liveness status for ALL detected faces in the frame.
    """
    out = bgr.copy()
    if not matches:
        h_img, w_img = out.shape[:2]
        cv2.rectangle(out, (0, 0), (w_img - 1, h_img - 1), (0, 0, 220), 3)
        cv2.putText(
            out, "No faces detected",
            (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 220), 2, cv2.LINE_AA,
        )
        return out

    for m in matches:
        x, y, w, h = m["rect"]
        sid = m["student_id"]
        conf = m["confidence"]
        live = m.get("liveness", {})
        is_live = live.get("is_live", True)
        name = id_to_name.get(sid, "Unknown") if sid is not None else "Unknown"

        if m["is_verified"]:
            colour = (0, 210, 80)       # Green — Verified & Live
            status = "VERIFIED"
        elif not is_live:
            colour = (0, 0, 220)        # Red — Spoof Suspected
            status = "SPOOF ALERT"
        elif sid is not None:
            colour = (0, 165, 255)      # Amber — Low Match Confidence
            status = "LOW CONF"
        else:
            colour = (0, 0, 220)        # Red — Unknown Face
            status = "UNKNOWN"

        # Bounding box
        cv2.rectangle(out, (x, y), (x + w, y + h), colour, 2)

        # Corner accents
        corner = 16
        thick = 3
        for cx, cy, dx, dy in [
            (x, y, 1, 1), (x + w, y, -1, 1),
            (x, y + h, 1, -1), (x + w, y + h, -1, -1),
        ]:
            cv2.line(out, (cx, cy), (cx + dx * corner, cy), colour, thick)
            cv2.line(out, (cx, cy), (cx, cy + dy * corner), colour, thick)

        # Top label bar (Name)
        bar_h = 28
        top_y = max(bar_h, y)
        cv2.rectangle(out, (x, top_y - bar_h), (x + w, top_y), colour, -1)
        disp_name = f"#{m['face_idx']}: {name}"
        cv2.putText(
            out, disp_name,
            (x + 4, top_y - 8),
            cv2.FONT_HERSHEY_SIMPLEX, 0.55, (255, 255, 255), 2, cv2.LINE_AA,
        )

        # Bottom badge (Status + Match distance + Liveness)
        badge_h = 24
        cv2.rectangle(out, (x, y + h), (x + w, y + h + badge_h), colour, -1)
        conf_str = f"d:{conf:.0f}" if conf is not None else ""
        live_str = f"L:{live.get('score', 0)}%" if "score" in live else ""
        badge_txt = f"{status} {conf_str} {live_str}".strip()
        cv2.putText(
            out, badge_txt,
            (x + 4, y + h + badge_h - 7),
            cv2.FONT_HERSHEY_SIMPLEX, 0.45, (255, 255, 255), 1, cv2.LINE_AA,
        )

    return out


# ── utility ───────────────────────────────────────────────────────────────────

def draw_faces_on_image(bgr: np.ndarray, label: str = "") -> np.ndarray:
    """
    Return a copy of bgr with green bounding boxes drawn around every
    detected face. If label is given it is printed above the box.
    """
    out = bgr.copy()
    gray = _preprocess(bgr)
    faces = _detect_faces(gray)
    for (x, y, w, h) in faces:
        # Green rectangle around face
        cv2.rectangle(out, (x, y), (x + w, y + h), (0, 220, 80), 2)
        # Filled label bar above box
        bar_h = 28
        cv2.rectangle(out, (x, y - bar_h), (x + w, y), (0, 220, 80), -1)
        text = label if label else "Face detected"
        cv2.putText(
            out, text,
            (x + 4, y - 7),
            cv2.FONT_HERSHEY_SIMPLEX, 0.6, (0, 0, 0), 2, cv2.LINE_AA,
        )
    if not faces:
        # Red border when no face found
        h_img, w_img = out.shape[:2]
        cv2.rectangle(out, (0, 0), (w_img - 1, h_img - 1), (0, 0, 220), 3)
        cv2.putText(
            out, "No face detected",
            (10, 30),
            cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 220), 2, cv2.LINE_AA,
        )
    return out


def annotate_recognition(
    bgr: np.ndarray,
    name: str | None,
    confidence: float | None,
    max_distance: float = MAX_CONFIDENCE_DISTANCE,
) -> np.ndarray:
    """
    Draw a full face bounding box with name label + colour-coded confidence
    badge on *bgr*.

    Colours:
      - Green  → recognised and distance ≤ max_distance  (verified)
      - Amber  → face found but distance > max_distance   (low confidence)
      - Red    → no face detected or unknown person

    Returns the annotated BGR copy.
    """
    out = bgr.copy()
    gray = _preprocess(bgr)
    faces = _detect_faces(gray)

    if not faces:
        h_img, w_img = out.shape[:2]
        cv2.rectangle(out, (0, 0), (w_img - 1, h_img - 1), (0, 0, 220), 3)
        cv2.putText(
            out, "No face detected",
            (10, 40), cv2.FONT_HERSHEY_SIMPLEX, 1.0, (0, 0, 220), 2, cv2.LINE_AA,
        )
        return out

    x, y, w, h = [int(v) for v in faces[0]]

    # Choose colour based on recognition result
    if name is not None and confidence is not None and confidence <= max_distance:
        colour = (0, 210, 80)       # green — verified
        status = "VERIFIED"
    elif name is not None:
        colour = (0, 165, 255)      # amber — recognised but low confidence
        status = "LOW CONF"
    else:
        colour = (0, 0, 220)        # red — unknown
        status = "UNKNOWN"
        name = "Unknown"

    # Outer bounding box (thick)
    cv2.rectangle(out, (x, y), (x + w, y + h), colour, 3)

    # Corner accent marks
    corner = 18
    thick = 4
    for cx, cy, dx, dy in [
        (x, y, 1, 1), (x + w, y, -1, 1),
        (x, y + h, 1, -1), (x + w, y + h, -1, -1),
    ]:
        cv2.line(out, (cx, cy), (cx + dx * corner, cy), colour, thick)
        cv2.line(out, (cx, cy), (cx, cy + dy * corner), colour, thick)

    # Top label bar — name
    bar_h = 32
    top_y = max(bar_h, y)
    cv2.rectangle(out, (x, top_y - bar_h), (x + w, top_y), colour, -1)
    cv2.putText(
        out, name or "Unknown",
        (x + 6, top_y - 9),
        cv2.FONT_HERSHEY_SIMPLEX, 0.65, (255, 255, 255), 2, cv2.LINE_AA,
    )

    # Bottom badge — status + distance
    badge_h = 28
    cv2.rectangle(out, (x, y + h), (x + w, y + h + badge_h), colour, -1)
    conf_txt = f"dist {confidence:.0f}" if confidence is not None else ""
    badge_txt = f"{status}  {conf_txt}"
    cv2.putText(
        out, badge_txt,
        (x + 6, y + h + badge_h - 8),
        cv2.FONT_HERSHEY_SIMPLEX, 0.50, (255, 255, 255), 1, cv2.LINE_AA,
    )

    return out


def face_detected(bgr: np.ndarray) -> bool:
    return detect_face_gray(bgr) is not None


def model_ready() -> bool:
    """True only when the model file exists AND is non-empty."""
    return MODEL_PATH.is_file() and MODEL_PATH.stat().st_size > 0


def training_stats() -> tuple[int, int]:
    images, labels = _load_training_set()
    return len(images), len(set(labels))


def count_samples_for_student(student_id: int) -> int:
    folder = FACES_DIR / str(student_id)
    if not folder.is_dir():
        return 0
    return len(list(folder.glob("*.png")))


def list_sample_paths(student_id: int) -> list[Path]:
    """Sorted PNG paths under data/faces/<student_id>/."""
    folder = FACES_DIR / str(student_id)
    if not folder.is_dir():
        return []
    return sorted(folder.glob("*.png"))


def _is_under_faces_dir(path: Path) -> bool:
    try:
        path.resolve().relative_to(FACES_DIR.resolve())
    except ValueError:
        return False
    return True


def delete_sample_file(path: Path) -> bool:
    """Remove one training PNG; path must live under data/faces/."""
    path = path.resolve()
    if not _is_under_faces_dir(path) or path.suffix.lower() != ".png":
        return False
    if not path.is_file():
        return False
    path.unlink()
    parent = path.parent
    if parent.is_dir() and not any(parent.iterdir()):
        try:
            parent.rmdir()
        except OSError:
            pass
    return True


def delete_all_samples_for_student(student_id: int) -> int:
    """Delete every training image for this ID. Returns count removed."""
    folder = FACES_DIR / str(student_id)
    if not folder.is_dir():
        return 0
    n = 0
    for p in folder.glob("*.png"):
        p.unlink()
        n += 1
    try:
        folder.rmdir()
    except OSError:
        pass
    return n
