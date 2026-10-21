"""
Smart Attendance — complete face capture, auto-attendance, verified reports.
"""

from __future__ import annotations

import sys
from datetime import date, datetime, timedelta
from pathlib import Path

import cv2
import streamlit as st

_ROOT = Path(__file__).resolve().parent.parent
if str(_ROOT) not in sys.path:
    sys.path.insert(0, str(_ROOT))

from smart_attendance import db, face_engine

st.set_page_config(
    page_title="Smart Attendance System",
    page_icon="🎓",
    layout="wide",
)

# ── custom CSS ────────────────────────────────────────────────────────────────
st.markdown(
    """
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
    html, body, [class*="css"] { font-family: 'Inter', sans-serif; }

    .att-card {
        background: linear-gradient(135deg,#0f2027,#203a43,#2c5364);
        border-radius: 16px; padding: 24px; margin-bottom: 16px;
        border: 1px solid rgba(255,255,255,0.08);
    }
    .present-badge {
        display:inline-block; background:#16a34a; color:#fff;
        border-radius:8px; padding:3px 12px; font-weight:700; font-size:0.85rem;
    }
    .absent-badge {
        display:inline-block; background:#dc2626; color:#fff;
        border-radius:8px; padding:3px 12px; font-weight:700; font-size:0.85rem;
    }
    .verified-badge {
        display:inline-block; background:#2563eb; color:#fff;
        border-radius:6px; padding:2px 10px; font-size:0.78rem;
    }
    .metric-box {
        background:rgba(255,255,255,0.05); border-radius:12px;
        padding:16px; text-align:center; border:1px solid rgba(255,255,255,0.1);
    }
    .metric-num { font-size:2rem; font-weight:700; color:#38bdf8; }
    .metric-lbl { font-size:0.8rem; color:#94a3b8; margin-top:4px; }
    </style>
    """,
    unsafe_allow_html=True,
)

db.init_db()


# ── auto-retrain on startup ───────────────────────────────────────────────────
def _auto_retrain_if_needed() -> None:
    if not face_engine.model_ready():
        samples, _ = face_engine.training_stats()
        if samples > 0:
            face_engine.train_and_save()


_auto_retrain_if_needed()


def _bgr_to_rgb(img):
    return cv2.cvtColor(img, cv2.COLOR_BGR2RGB)


def _image_source_block(key_prefix: str, *, label: str):
    mode = st.radio(
        "Image source", ["📷 Webcam", "🖼️ Upload photo"],
        horizontal=True, key=f"{key_prefix}_src",
    )
    if "Webcam" in mode:
        w = st.camera_input(label, key=f"{key_prefix}_cam")
        if w is None:
            return None
        return face_engine.pil_to_bgr(w)
    up = st.file_uploader(
        "Choose a photo (JPG/PNG)", type=["jpg", "jpeg", "png", "webp"],
        key=f"{key_prefix}_up",
    )
    if up is None:
        return None
    return face_engine.pil_to_bgr(up)


# ── sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## ⚙️ Settings")
    max_dist = st.slider(
        "Max match distance",
        min_value=40.0, max_value=400.0,
        value=float(face_engine.MAX_CONFIDENCE_DISTANCE),
        step=5.0,
        help="Lower = stricter. ~65 if wrong people matched. 400 = lenient.",
    )
    allow_repeat = st.checkbox(
        "Allow multiple check-ins per day", value=True,
        help="Uncheck to allow only one log per person per day.",
    )
    liveness_check = st.checkbox(
        "🛡️ Anti-Spoofing / Liveness Check", value=True,
        help="Rejects flat paper printouts, low texture, and LCD screens using Haar eye cascades and skin texture variance.",
    )
    multi_face_mode = st.checkbox(
        "👥 Multi-Face Classroom Mode", value=True,
        help="Detects and logs all recognized students in a single frame.",
    )
    defaulter_threshold = st.slider(
        "Defaulter Alert Threshold (%)", 50, 90, 75,
        help="Students below this percentage receive automated notices.",
    )
    st.divider()
    st.markdown("**Model status**")
    ready = face_engine.model_ready()
    st.write("🟢 Ready" if ready else "🔴 Not trained")
    samples, people = face_engine.training_stats()
    st.caption(f"{samples} samples · {people} people")
    if not ready and samples > 0:
        if st.button("Train model now"):
            n_img, n_lab = face_engine.train_and_save()
            st.success(f"Trained on {n_img} images, {n_lab} people.")
            st.rerun()

# ── tabs ──────────────────────────────────────────────────────────────────────
tab_dash, tab_enroll, tab_manage, tab_att, tab_rep = st.tabs([
    "🏠 Dashboard",
    "➕ Enroll Faces",
    "🗂️ Manage Faces",
    "📸 Auto Attendance",
    "📊 Reports",
])


# ══════════════════════════════════════════════════════════════════════════════
# DASHBOARD
# ══════════════════════════════════════════════════════════════════════════════
with tab_dash:
    st.title("🎓 Smart Attendance System")
    st.caption("AI-powered face recognition · automatic check-in · verified reports")
    st.divider()

    c1, c2, c3, c4, c5 = st.columns(5)
    metrics = [
        ("People Enrolled", db.count_students(), "👥"),
        ("Check-ins Today", db.count_today(), "✅"),
        ("Present Today", db.distinct_present_today(), "🟢"),
        ("Face Samples", face_engine.training_stats()[0], "📷"),
        ("Model Trained", "Yes" if face_engine.model_ready() else "No", "🤖"),
    ]
    for col, (lbl, val, icon) in zip([c1, c2, c3, c4, c5], metrics):
        with col:
            st.markdown(
                f'<div class="metric-box">'
                f'<div class="metric-num">{icon}</div>'
                f'<div class="metric-num">{val}</div>'
                f'<div class="metric-lbl">{lbl}</div>'
                f'</div>',
                unsafe_allow_html=True,
            )

    st.divider()
    col_a, col_b = st.columns(2)
    with col_a:
        st.markdown("### How it works")
        st.markdown(
            "1. **Enroll Faces** — Add a person and capture 3-5 face samples\n"
            "2. **Auto Attendance** — Point camera → face detected → attendance logged instantly\n"
            "3. **Reports** — Full Present/Absent table with CSV export"
        )
    with col_b:
        st.markdown("### Today's summary")
        today_rows = db.attendance_today()
        if not today_rows:
            st.info("No check-ins recorded yet today.")
        else:
            for r in today_rows[:5]:
                conf = r["confidence"]
                c_str = f"{conf:.0f}" if conf is not None else "—"
                st.write(f"✅ **{r['name']}** — {r['marked_at'][11:19]}  *(dist {c_str})*")
            if len(today_rows) > 5:
                st.caption(f"…and {len(today_rows)-5} more. See Reports tab.")


# ══════════════════════════════════════════════════════════════════════════════
# ENROLL FACES
# ══════════════════════════════════════════════════════════════════════════════
with tab_enroll:
    st.subheader("➕ Enroll Faces (Training)")
    st.markdown("Create a person, then capture **3-5** face samples for best accuracy.")

    name = st.text_input("Full name", placeholder="e.g. Alex Kim", key="enroll_name")
    bgr = _image_source_block("enroll", label="Capture face for enrollment")

    col_a, col_b = st.columns(2)
    with col_a:
        create_person = st.button("Create person", key="btn_create")
    with col_b:
        add_sample = st.button("💾 Save face sample", type="primary", key="btn_save_sample")

    if create_person:
        if name.strip():
            sid = db.add_student(name.strip())
            st.session_state["new_student_id"] = sid
            st.success(f"Created **{name.strip()}** (ID {sid}). Now add face samples.")
        else:
            st.warning("Enter a name first.")

    sid = st.session_state.get("new_student_id")

    # Show annotated preview
    if bgr is not None:
        annotated = face_engine.draw_faces_on_image(bgr)
        crop = face_engine.face_crop_bgr(bgr)
        c1, c2 = st.columns([3, 1])
        with c1:
            st.image(_bgr_to_rgb(annotated), caption="📷 Face detection preview", use_container_width=True)
        with c2:
            if crop is not None:
                st.image(_bgr_to_rgb(crop), caption="✅ Cropped face", width=130)
                st.success("Face detected!")
            else:
                st.error("❌ No face\ndetected")

    if sid is not None:
        n_so_far = face_engine.count_samples_for_student(sid)
        if n_so_far == 0:
            st.info("📸 No samples yet — capture at least 3.")
        elif n_so_far < 3:
            st.warning(f"📸 {n_so_far}/3 — add {3 - n_so_far} more.")
        else:
            st.success(f"✅ {n_so_far} sample(s) — ready to train!")

    if sid is not None and bgr is not None and add_sample:
        if face_engine.save_training_sample(sid, bgr):
            n_img, n_lab = face_engine.train_and_save()
            n_so_far = face_engine.count_samples_for_student(sid)
            st.success(f"✅ Sample #{n_so_far} saved. Model retrained ({n_img} images, {n_lab} people).")
        else:
            st.error("❌ No face in image — adjust lighting/angle and retry.")

    st.divider()
    if st.button("🔄 Force retrain model from disk", key="btn_retrain"):
        n_img, n_lab = face_engine.train_and_save()
        if n_img == 0:
            st.warning("No training images on disk.")
        else:
            st.success(f"Trained on {n_img} images, {n_lab} people.")

    st.subheader("Enrolled people")
    rows = db.list_students()
    if not rows:
        st.write("No one enrolled yet.")
    else:
        for r in rows:
            n_s = face_engine.count_samples_for_student(r["id"])
            st.write(f"**{r['name']}** — ID `{r['id']}` — {n_s} sample(s)")


# ══════════════════════════════════════════════════════════════════════════════
# MANAGE FACES
# ══════════════════════════════════════════════════════════════════════════════
with tab_manage:
    st.subheader("🗂️ Manage Faces & People")
    rows = db.list_students()
    if not rows:
        st.info("No enrolled people yet.")
    else:
        labels = {f"{r['name']} (ID {r['id']})": int(r["id"]) for r in rows}
        choice = st.selectbox("Select person", list(labels.keys()), key="manage_pick")
        sid = labels[choice]
        paths = face_engine.list_sample_paths(sid)
        st.caption(f"{len(paths)} face image(s) on disk.")

        if paths:
            names = [p.name for p in paths]
            one = st.selectbox("Sample to delete", names, key="manage_one_sample")
            if st.button("Delete selected sample", key="btn_del_one"):
                by_name = {p.name: p for p in paths}
                target = by_name.get(one)
                if target and face_engine.delete_sample_file(target):
                    n_img, n_lab = face_engine.train_and_save()
                    st.success(f"Removed {one}. Retrained ({n_img} images, {n_lab} people).")
                else:
                    st.error("Could not delete file.")

        c1, c2 = st.columns(2)
        with c1:
            if st.button("Delete ALL samples for this person", key="btn_del_all"):
                n = face_engine.delete_all_samples_for_student(sid)
                n_img, n_lab = face_engine.train_and_save()
                st.success(f"Removed {n} image(s). Retrained ({n_img} images, {n_lab} people).")

        st.divider()
        st.markdown("**⚠️ Remove person completely**")
        sure = st.checkbox("I understand this cannot be undone", key="manage_delete_sure")
        if st.button("🗑️ Delete person from system", type="primary", key="btn_del_person"):
            if not sure:
                st.warning("Check the confirmation box first.")
            else:
                face_engine.delete_all_samples_for_student(sid)
                db.delete_student(sid)
                face_engine.train_and_save()
                if st.session_state.get("new_student_id") == sid:
                    del st.session_state["new_student_id"]
                st.success(f"Removed person ID {sid}.")
                st.rerun()


# ══════════════════════════════════════════════════════════════════════════════
# AUTO ATTENDANCE — captures face → marks instantly
# ══════════════════════════════════════════════════════════════════════════════
with tab_att:
    st.subheader("📸 Auto Attendance — Face → Instant Check-in")
    st.markdown(
        f"Point the webcam at your face. The system detects, recognises, and **automatically** "
        f"marks attendance if the match distance ≤ **{max_dist:.0f}** (set in sidebar)."
    )

    if not face_engine.model_ready():
        samples, people = face_engine.training_stats()
        if samples > 0:
            with st.spinner("⏳ Auto-training model from saved samples…"):
                n_img, n_lab = face_engine.train_and_save()
            st.success(f"✅ Model trained on {n_img} image(s), {n_lab} person(s).")
        else:
            st.warning("🚫 No face samples found. Enroll at least one person first.")
            st.stop()

    bgr = _image_source_block("att", label="📷 Point camera at face(s)")

    if bgr is not None:
        students_map = {int(r["id"]): r["name"] for r in db.list_students()}

        # ── multi-face or single-face recognition with liveness ──────────────
        matches = face_engine.predict_all_from_bgr(
            bgr,
            apply_threshold=True,
            max_distance=max_dist,
            check_liveness_flag=liveness_check,
        )

        annotated = face_engine.annotate_multi_recognition(
            bgr, matches, students_map, max_distance=max_dist
        )

        col_img, col_status = st.columns([3, 2])
        with col_img:
            st.image(_bgr_to_rgb(annotated), caption="🎯 AI Face Detection & Recognition Preview", use_container_width=True)

        with col_status:
            if not matches:
                st.error("❌ **No face detected**\n\nEnsure camera is facing you directly under sufficient lighting.")
            else:
                n_faces = len(matches)
                n_verified = sum(1 for m in matches if m["is_verified"])
                st.markdown(f"### 👥 Detection Summary: **{n_faces} Face(s)**")

                if liveness_check:
                    all_live = all(m.get("liveness", {}).get("is_live", True) for m in matches)
                    if all_live:
                        st.success("🛡️ **Anti-Spoofing Check: PASSED** — Biological skin texture & eye landmarks verified.")
                    else:
                        st.error("🚨 **SPOOF SUSPECTED** — Screen reflection or flat photo print detected! Attendance blocked for unverified faces.")

                st.divider()

                for m in matches:
                    face_idx = m["face_idx"]
                    sid = m["student_id"]
                    conf = m["confidence"]
                    is_verified = m["is_verified"]
                    live_data = m.get("liveness", {})
                    live_score = live_data.get("score", 100)
                    is_live = live_data.get("is_live", True)
                    person_name = students_map.get(sid, "Unknown") if sid is not None else "Unknown"

                    if is_verified and sid is not None:
                        prior = db.attendance_entries_today_for_student(sid)
                        if not allow_repeat and prior > 0:
                            st.warning(
                                f"⚠️ **{person_name}** already checked in today "
                                f"({prior} time(s))."
                            )
                        else:
                            db.log_attendance(sid, conf)
                            time_s = datetime.now().strftime("%H:%M:%S")
                            st.markdown(
                                f'<div class="att-card">'
                                f'<h3 style="color:#38bdf8;margin:0">✅ Marked: {person_name}</h3>'
                                f'<p style="color:#94a3b8;margin:4px 0 0">🕐 {time_s} &nbsp;·&nbsp; '
                                f'Dist: <b>{conf:.1f}</b> &nbsp;·&nbsp; '
                                f'<span class="verified-badge">VERIFIED</span> &nbsp;·&nbsp; '
                                f'<span style="color:#10b981;font-weight:600">Live {live_score}%</span></p>'
                                f'</div>',
                                unsafe_allow_html=True,
                            )
                    elif not is_live:
                        st.error(
                            f"❌ **Face #{face_idx} ({person_name})** — **SPOOF BLOCKED**\n\n"
                            f"Liveness score: {live_score}% (Threshold: 50%). Flat image suspected."
                        )
                    elif sid is None:
                        dist_info = f" (dist {conf:.0f} > {max_dist:.0f})" if conf else ""
                        st.warning(
                            f"❓ **Face #{face_idx}** — Not Recognized{dist_info}.\n\n"
                            "Person not enrolled in the system."
                        )
    else:
        st.info("👆 Capture from webcam or upload a classroom photo to run automatic attendance.")


# ══════════════════════════════════════════════════════════════════════════════
# REPORTS
# ══════════════════════════════════════════════════════════════════════════════
with tab_rep:
    st.subheader("📊 Attendance Reports")

    # ── date picker ───────────────────────────────────────────────────────────
    if "selected_report_date" not in st.session_state:
        st.session_state["selected_report_date"] = date.today()

    col_date, col_range = st.columns([2, 3])
    with col_range:
        st.markdown("**Quick ranges**")
        qc1, qc2, qc3 = st.columns(3)
        with qc1:
            if st.button("Today", key="q_today"):
                st.session_state["selected_report_date"] = date.today()
                st.rerun()
        with qc2:
            if st.button("Yesterday", key="q_yest"):
                st.session_state["selected_report_date"] = date.today() - timedelta(days=1)
                st.rerun()
        with qc3:
            if st.button("Last 7 days", key="q_7d"):
                st.session_state["selected_report_date"] = date.today() - timedelta(days=6)
                st.rerun()

    with col_date:
        sel_date = st.date_input(
            "📅 Select date",
            value=st.session_state["selected_report_date"],
            key="rep_date_widget",
        )
        st.session_state["selected_report_date"] = sel_date
        date_str = sel_date.isoformat()

    st.divider()

    # ── Present / Absent summary table ───────────────────────────────────────
    st.markdown(f"### 🗓️ Attendance on **{date_str}**")
    summary = db.attendance_summary(date_str)

    if not summary:
        st.info("No students enrolled yet.")
    else:
        n_present = sum(1 for r in summary if r["check_in_count"] > 0)
        n_absent = len(summary) - n_present

        m1, m2, m3 = st.columns(3)
        m1.metric("Total Students", len(summary))
        m2.metric("✅ Present", n_present)
        m3.metric("❌ Absent", n_absent)

        st.markdown("#### Student-wise Status")
        for r in summary:
            present = r["check_in_count"] > 0
            badge = '<span class="present-badge">PRESENT</span>' if present else '<span class="absent-badge">ABSENT</span>'
            first = r["first_seen"][11:19] if r["first_seen"] else "—"
            avg_c = f"{r['avg_confidence']:.0f}" if r["avg_confidence"] is not None else "—"
            checkins = r["check_in_count"]

            with st.expander(
                f"{'✅' if present else '❌'}  {r['name']}  —  {'Present' if present else 'Absent'}"
                + (f"  ·  {checkins} check-in(s)" if present else "")
            ):
                st.markdown(
                    f"{badge} &nbsp; **First seen:** {first} &nbsp;·&nbsp; "
                    f"**Check-ins:** {checkins} &nbsp;·&nbsp; "
                    f"**Avg match dist:** {avg_c}",
                    unsafe_allow_html=True,
                )

        st.divider()

        # ── CSV exports ───────────────────────────────────────────────────────
        st.markdown("#### 📥 Export")
        dl1, dl2 = st.columns(2)
        with dl1:
            summary_csv = db.export_summary_csv_string(date_str)
            st.download_button(
                "⬇️ Download Summary CSV",
                data=summary_csv,
                file_name=f"attendance_summary_{date_str}.csv",
                mime="text/csv",
                key="dl_summary",
            )
        with dl2:
            detail_csv = db.export_csv_string(date_str)
            st.download_button(
                "⬇️ Download Detailed Check-in CSV",
                data=detail_csv,
                file_name=f"attendance_detail_{date_str}.csv",
                mime="text/csv",
                key="dl_detail",
            )

    # ── Detailed check-in log ─────────────────────────────────────────────────
    st.divider()
    st.markdown(f"### 🕐 Check-in Log — {date_str}")
    checkins = db.attendance_by_date(date_str)
    if not checkins:
        st.write("No check-ins on this date.")
    else:
        for r in checkins:
            conf = r["confidence"]
            verified = conf is not None and conf <= max_dist
            c_str = f"{conf:.1f}" if conf is not None else "—"
            badge = "🟢 Verified" if verified else "🟡 Low conf"
            st.write(
                f"**{r['name']}** &nbsp;·&nbsp; {r['marked_at'][11:19]} "
                f"&nbsp;·&nbsp; dist `{c_str}` &nbsp;·&nbsp; {badge}"
            )

    # ── Multi-day trend ───────────────────────────────────────────────────────
    st.divider()
    st.markdown("### 📈 Attendance Trend — Last 30 Days")
    end_d = date.today().isoformat()
    start_d = (date.today() - timedelta(days=29)).isoformat()
    trend = db.days_present_in_range(start_d, end_d)
    if not trend:
        st.info("No attendance data yet.")
    else:
        total_days = 30
        for r in trend:
            pct = int(r["days_present"] / total_days * 100)
            bar = "█" * (r["days_present"]) + "░" * (total_days - r["days_present"])
            st.write(
                f"**{r['name']}** — {r['days_present']}/{total_days} days "
                f"({pct}%)  `{bar}`"
            )

    # ── AI Defaulter Analytics & Automated Notifications ──────────────────────
    st.divider()
    st.markdown("### 🚨 AI Defaulter Monitoring & Automated Warnings")
    st.caption(
        f"Monitors students whose 30-day attendance is below the mandatory university threshold of **{defaulter_threshold}%**."
    )

    defaulters_data = db.get_defaulters_report(threshold=float(defaulter_threshold), days=30)
    critical_defaulters = [d for d in defaulters_data if d["is_defaulter"]]

    col_d1, col_d2, col_d3 = st.columns(3)
    col_d1.metric("Enrolled Evaluated", len(defaulters_data))
    col_d2.metric("Safe (≥ 75%)", len(defaulters_data) - len(critical_defaulters))
    col_d3.metric("Defaulters (< 75%)", len(critical_defaulters), delta=f"-{len(critical_defaulters)}" if critical_defaulters else None, delta_color="inverse")

    if not critical_defaulters:
        st.success(f"🎉 Excellent! All enrolled students maintain attendance above {defaulter_threshold}%.")
    else:
        st.warning(f"⚠️ **{len(critical_defaulters)}** student(s) currently risk exam debarment due to attendance shortage.")

        for d in critical_defaulters:
            is_critical = d["percentage"] < 50
            badge = '<span class="absent-badge">CRITICAL DEFAULTER</span>' if is_critical else '<span style="background:#f59e0b;color:#000;border-radius:6px;padding:3px 10px;font-weight:700;font-size:0.8rem">DEFICIT</span>'
            with st.expander(f"⚠️ {d['name']} — {d['percentage']}% ({d['days_present']}/{d['total_conducted']} days) · Needs {d['classes_needed']} class(es)"):
                st.markdown(
                    f"{badge} &nbsp; **Student ID:** `{d['student_id']}` &nbsp;·&nbsp; "
                    f"**Attendance Rate:** `{d['percentage']}%` &nbsp;·&nbsp; "
                    f"**Consecutive Classes Needed to Reach 75%:** <b style='color:#38bdf8'>{d['classes_needed']}</b>",
                    unsafe_allow_html=True,
                )

        st.markdown("#### ⚡ Automated Action Center")
        act1, act2 = st.columns(2)
        with act1:
            if st.button("📧 Dispatch Defaulter Notices (Email & SMS)", type="primary", key="btn_send_notices"):
                dispatched = db.send_defaulter_notifications(threshold=float(defaulter_threshold), days=30)
                st.success(f"✅ Successfully generated and dispatched {len(dispatched)} formal notices!")
                for n in dispatched:
                    with st.expander(f"📬 Sent to {n['student_name']} ({n['recipient_email']})"):
                        st.markdown(f"**Subject:** `{n['subject']}`")
                        st.text(n["body"])
                        st.caption(f"📱 SMS: {n['sms']}")
        with act2:
            def_csv = db.export_defaulters_csv_string(threshold=float(defaulter_threshold), days=30)
            st.download_button(
                "⬇️ Download Defaulter Report CSV",
                data=def_csv,
                file_name=f"defaulters_report_{date.today().isoformat()}.csv",
                mime="text/csv",
                key="dl_defaulters_csv",
            )

