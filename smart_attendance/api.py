"""
FastAPI REST API Server for Smart Attendance & Anti-Spoofing Engine.
Exposes endpoints for enrollment, face verification, liveness checks,
and attendance records for React and mobile clients.
"""

from __future__ import annotations

import base64
import io
from datetime import date
from typing import Optional

import cv2
import numpy as np
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from PIL import Image

from smart_attendance import db, face_engine

app = FastAPI(
    title="Smart Attendance & Liveness Engine API",
    description="REST API for multi-face recognition, anti-spoofing verification, and attendance analytics.",
    version="2.0.0",
)

# Enable CORS for React / Vite dev servers & production frontends
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

db.init_db()


def _decode_base64_image(b64_str: str) -> np.ndarray:
    """Decode base64 string (with or without data:image/png;base64 header) to BGR."""
    if "," in b64_str:
        b64_str = b64_str.split(",", 1)[1]
    raw = base64.b64decode(b64_str)
    pil_img = Image.open(io.BytesIO(raw))
    if pil_img.mode != "RGB":
        pil_img = pil_img.convert("RGB")
    arr = np.array(pil_img)
    return cv2.cvtColor(arr, cv2.COLOR_RGB2BGR)


# ── Pydantic Request Models ───────────────────────────────────────────────────

class VerifyRequest(BaseModel):
    image_base64: str
    liveness_check: bool = True
    multi_face: bool = True
    max_distance: float = 400.0
    auto_log: bool = True


class EnrollRequest(BaseModel):
    name: str
    image_base64: str


class DefaulterNoticeRequest(BaseModel):
    threshold: float = 75.0
    days: int = 30


# ── Health & Status Endpoints ─────────────────────────────────────────────────

@app.get("/api/health")
def get_health():
    samples, people = face_engine.training_stats()
    return {
        "status": "healthy",
        "model_ready": face_engine.model_ready(),
        "enrolled_students": db.count_students(),
        "total_face_samples": samples,
        "today_checkins": db.count_today(),
        "present_distinct_today": db.distinct_present_today(),
    }


@app.get("/api/students")
def list_students():
    students = db.list_students()
    res = []
    for s in students:
        res.append({
            "id": s["id"],
            "name": s["name"],
            "created_at": s["created_at"],
            "samples_count": face_engine.count_samples_for_student(s["id"]),
        })
    return {"students": res, "total": len(res)}


# ── Face Enrollment & Training ────────────────────────────────────────────────

@app.post("/api/enroll")
def enroll_student(req: EnrollRequest):
    if not req.name.strip():
        raise HTTPException(status_code=400, detail="Student name cannot be empty")

    try:
        bgr = _decode_base64_image(req.image_base64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

    # Check for face in image
    if not face_engine.face_detected(bgr):
        raise HTTPException(status_code=422, detail="No face detected in provided enrollment photo. Ensure good lighting.")

    sid = db.add_student(req.name.strip())
    saved = face_engine.save_training_sample(sid, bgr)
    if not saved:
        raise HTTPException(status_code=500, detail="Could not crop or save face sample")

    n_images, n_labels = face_engine.train_and_save()
    return {
        "success": True,
        "student_id": sid,
        "name": req.name.strip(),
        "samples_enrolled": face_engine.count_samples_for_student(sid),
        "total_trained_images": n_images,
        "total_trained_students": n_labels,
        "message": f"Successfully enrolled {req.name.strip()} and updated LBPH model.",
    }


# ── Face Verification & Instant Attendance Logging ────────────────────────────

@app.post("/api/verify")
def verify_attendance(req: VerifyRequest):
    try:
        bgr = _decode_base64_image(req.image_base64)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image format: {e}")

    if not face_engine.model_ready():
        raise HTTPException(status_code=503, detail="Face recognition model is not trained yet. Enroll at least one student.")

    students_map = {int(r["id"]): r["name"] for r in db.list_students()}

    # Run Multi-face & Liveness Detection
    matches = face_engine.predict_all_from_bgr(
        bgr,
        apply_threshold=True,
        max_distance=req.max_distance,
        check_liveness_flag=req.liveness_check,
    )

    if not matches:
        return {
            "faces_detected": 0,
            "matches": [],
            "message": "No face detected in camera frame.",
        }

    results = []
    for m in matches:
        sid = m["student_id"]
        is_verified = m["is_verified"]
        name = students_map.get(sid, "Unknown") if sid is not None else "Unknown"
        conf = m["confidence"]
        liveness = m["liveness"]

        logged = False
        already_logged = False
        if is_verified and sid is not None and req.auto_log:
            prior = db.attendance_entries_today_for_student(sid)
            if prior > 0:
                already_logged = True
            db.log_attendance(sid, conf)
            logged = True

        results.append({
            "face_idx": m["face_idx"],
            "student_id": sid,
            "name": name,
            "confidence_distance": conf,
            "is_verified": is_verified,
            "is_live": liveness.get("is_live", True),
            "liveness_score": liveness.get("score", 100),
            "liveness_details": liveness.get("details", []),
            "liveness_warnings": liveness.get("warnings", []),
            "attendance_logged": logged,
            "multiple_checkin": already_logged,
            "bounding_box": m["rect"],
        })

    return {
        "faces_detected": len(matches),
        "verified_count": sum(1 for r in results if r["is_verified"]),
        "matches": results,
    }


# ── Attendance Analytics & Reports ────────────────────────────────────

@app.get("/api/attendance/today")
def get_today_attendance():
    rows = db.attendance_today()
    return {
        "date": date.today().isoformat(),
        "count": len(rows),
        "records": [
            {
                "name": r["name"],
                "marked_at": r["marked_at"],
                "confidence_distance": r["confidence"],
            }
            for r in rows
        ],
    }


@app.get("/api/attendance/defaulters")
def get_defaulters(threshold: float = Query(75.0), days: int = Query(30)):
    report = db.get_defaulters_report(threshold=threshold, days=days)
    defaulters = [r for r in report if r["is_defaulter"]]
    return {
        "threshold": threshold,
        "evaluation_window_days": days,
        "total_enrolled": len(report),
        "defaulters_count": len(defaulters),
        "defaulters": defaulters,
    }


@app.post("/api/notifications/defaulters")
def send_defaulter_alerts(req: DefaulterNoticeRequest):
    dispatched = db.send_defaulter_notifications(threshold=req.threshold, days=req.days)
    return {
        "threshold": req.threshold,
        "total_notices_sent": len(dispatched),
        "dispatched_notices": dispatched,
    }
