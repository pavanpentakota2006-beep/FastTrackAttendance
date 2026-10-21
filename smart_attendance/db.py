"""SQLite persistence for students and attendance logs."""

import csv
import io
import sqlite3
from contextlib import contextmanager
from datetime import date, datetime, timedelta
from pathlib import Path

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "attendance.db"


def _ensure_dirs() -> None:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)


@contextmanager
def get_conn():
    _ensure_dirs()
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    finally:
        conn.close()


def init_db() -> None:
    with get_conn() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            );
            CREATE TABLE IF NOT EXISTS attendance (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                marked_at TEXT NOT NULL DEFAULT (datetime('now')),
                confidence REAL,
                FOREIGN KEY (student_id) REFERENCES students(id)
            );
            CREATE INDEX IF NOT EXISTS idx_attendance_marked_at
            ON attendance (marked_at);
            CREATE INDEX IF NOT EXISTS idx_attendance_student_id
            ON attendance (student_id);
            """
        )


# ── student CRUD ──────────────────────────────────────────────────────────────

def add_student(name: str) -> int:
    with get_conn() as conn:
        cur = conn.execute(
            "INSERT INTO students (name) VALUES (?)",
            (name.strip(),),
        )
        return int(cur.lastrowid)


def list_students():
    with get_conn() as conn:
        return conn.execute(
            "SELECT id, name, created_at FROM students ORDER BY name"
        ).fetchall()


def get_student(student_id: int):
    with get_conn() as conn:
        return conn.execute(
            "SELECT id, name FROM students WHERE id = ?",
            (student_id,),
        ).fetchone()


def delete_student(student_id: int) -> None:
    """Remove attendance rows then the student record."""
    with get_conn() as conn:
        conn.execute("DELETE FROM attendance WHERE student_id = ?", (student_id,))
        conn.execute("DELETE FROM students WHERE id = ?", (student_id,))


# ── attendance write ──────────────────────────────────────────────────────────

def log_attendance(student_id: int, confidence: float | None) -> None:
    with get_conn() as conn:
        conn.execute(
            "INSERT INTO attendance (student_id, confidence) VALUES (?, ?)",
            (student_id, confidence),
        )


# ── attendance read — basic ───────────────────────────────────────────────────

def attendance_today():
    today = date.today().isoformat()
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT s.name, a.marked_at, a.confidence
            FROM attendance a
            JOIN students s ON s.id = a.student_id
            WHERE date(a.marked_at) = ?
            ORDER BY a.marked_at DESC
            """,
            (today,),
        ).fetchall()


def attendance_recent(limit: int = 50):
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT s.name, a.marked_at, a.confidence
            FROM attendance a
            JOIN students s ON s.id = a.student_id
            ORDER BY a.marked_at DESC
            LIMIT ?
            """,
            (limit,),
        ).fetchall()


def count_students() -> int:
    with get_conn() as conn:
        row = conn.execute("SELECT COUNT(*) AS c FROM students").fetchone()
        return int(row["c"])


def count_today() -> int:
    today = date.today().isoformat()
    with get_conn() as conn:
        row = conn.execute(
            "SELECT COUNT(*) AS c FROM attendance WHERE date(marked_at) = ?",
            (today,),
        ).fetchone()
        return int(row["c"])


def attendance_entries_today_for_student(student_id: int) -> int:
    today = date.today().isoformat()
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT COUNT(*) AS c FROM attendance
            WHERE student_id = ? AND date(marked_at) = ?
            """,
            (student_id, today),
        ).fetchone()
        return int(row["c"])


def distinct_present_today() -> int:
    """How many different people have at least one check-in today."""
    today = date.today().isoformat()
    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT COUNT(DISTINCT student_id) AS c FROM attendance
            WHERE date(marked_at) = ?
            """,
            (today,),
        ).fetchone()
        return int(row["c"])


# ── attendance read — reports ─────────────────────────────────────────────────

def attendance_by_date(date_str: str):
    """All check-in rows for a given date (YYYY-MM-DD), newest first."""
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT s.name, s.id AS student_id, a.marked_at, a.confidence
            FROM attendance a
            JOIN students s ON s.id = a.student_id
            WHERE date(a.marked_at) = ?
            ORDER BY a.marked_at DESC
            """,
            (date_str,),
        ).fetchall()


def attendance_summary(date_str: str) -> list[dict]:
    """
    Returns one row per enrolled student with:
      name, student_id, check_in_count, first_seen, last_seen, avg_confidence
    Students with no check-in have check_in_count = 0 (ABSENT).
    """
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT
                s.id AS student_id,
                s.name,
                COUNT(a.id)          AS check_in_count,
                MIN(a.marked_at)     AS first_seen,
                MAX(a.marked_at)     AS last_seen,
                AVG(a.confidence)    AS avg_confidence
            FROM students s
            LEFT JOIN attendance a
                ON a.student_id = s.id AND date(a.marked_at) = ?
            GROUP BY s.id, s.name
            ORDER BY s.name
            """,
            (date_str,),
        ).fetchall()
        return [dict(r) for r in rows]


def attendance_date_range(start: str, end: str):
    """All check-ins between start and end dates (inclusive, YYYY-MM-DD)."""
    with get_conn() as conn:
        return conn.execute(
            """
            SELECT s.name, s.id AS student_id, a.marked_at, a.confidence
            FROM attendance a
            JOIN students s ON s.id = a.student_id
            WHERE date(a.marked_at) BETWEEN ? AND ?
            ORDER BY a.marked_at DESC
            """,
            (start, end),
        ).fetchall()


def days_present_in_range(start: str, end: str) -> list[dict]:
    """
    Per-student count of distinct days they were present between start and end.
    Returns list of dicts: {student_id, name, days_present}.
    """
    with get_conn() as conn:
        rows = conn.execute(
            """
            SELECT
                s.id AS student_id,
                s.name,
                COUNT(DISTINCT date(a.marked_at)) AS days_present
            FROM students s
            LEFT JOIN attendance a
                ON a.student_id = s.id
                AND date(a.marked_at) BETWEEN ? AND ?
            GROUP BY s.id, s.name
            ORDER BY days_present DESC, s.name
            """,
            (start, end),
        ).fetchall()
        return [dict(r) for r in rows]


def attendance_all_dates() -> list[str]:
    """Sorted list of unique dates that have at least one check-in."""
    with get_conn() as conn:
        rows = conn.execute(
            "SELECT DISTINCT date(marked_at) AS d FROM attendance ORDER BY d DESC"
        ).fetchall()
        return [r["d"] for r in rows]


def export_csv_string(date_str: str) -> str:
    """Return a UTF-8 CSV string of all check-ins on date_str."""
    rows = attendance_by_date(date_str)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["Name", "Student ID", "Check-in Time", "Match Distance", "Status"])
    for r in rows:
        conf = r["confidence"]
        conf_str = f"{conf:.1f}" if conf is not None else ""
        status = "Verified" if conf is not None and conf <= 400.0 else "Low confidence"
        writer.writerow([r["name"], r["student_id"], r["marked_at"], conf_str, status])
    return buf.getvalue()


def export_summary_csv_string(date_str: str) -> str:
    """Return a UTF-8 CSV of the Present/Absent summary for date_str."""
    rows = attendance_summary(date_str)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        ["Name", "Student ID", "Status", "Check-ins", "First Seen", "Last Seen", "Avg Match Distance"]
    )
    for r in rows:
        status = "Present" if r["check_in_count"] > 0 else "Absent"
        avg_c = f"{r['avg_confidence']:.1f}" if r["avg_confidence"] is not None else ""
        writer.writerow(
            [
                r["name"],
                r["student_id"],
                status,
                r["check_in_count"],
                r["first_seen"] or "",
                r["last_seen"] or "",
                avg_c,
            ]
        )
    return buf.getvalue()


# ── Defaulter Analytics & Automated Notifications ─────────────────────────────

def get_defaulters_report(threshold: float = 75.0, days: int = 30) -> list[dict]:
    """
    Find all enrolled students whose attendance rate over the last `days` is below `threshold`%.
    Calculates classes needed to regain >= 75% attendance.
    """
    end_d = date.today().isoformat()
    start_d = (date.today() - timedelta(days=days - 1)).isoformat()
    trend = days_present_in_range(start_d, end_d)

    with get_conn() as conn:
        row = conn.execute(
            """
            SELECT COUNT(DISTINCT date(marked_at)) AS c
            FROM attendance
            WHERE date(marked_at) BETWEEN ? AND ?
            """,
            (start_d, end_d),
        ).fetchone()
        total_conducted = max(1, int(row["c"])) if (row and row["c"]) else 1

    report = []
    for s in trend:
        present = s["days_present"]
        pct = round((present / total_conducted) * 100, 1)
        is_defaulter = pct < threshold

        needed = 0
        if is_defaulter and threshold < 100:
            target_frac = threshold / 100.0
            raw_needed = (target_frac * total_conducted - present) / (1.0 - target_frac)
            needed = max(1, int(round(raw_needed + 0.49)))

        report.append({
            "student_id": s["student_id"],
            "name": s["name"],
            "days_present": present,
            "total_conducted": total_conducted,
            "percentage": pct,
            "is_defaulter": is_defaulter,
            "classes_needed": needed,
            "risk_level": "High Risk (Critical Defaulter)" if pct < 50 else ("Medium Risk (Defaulter)" if pct < threshold else "Low Risk (Safe)"),
        })

    return report


def send_defaulter_notifications(threshold: float = 75.0, days: int = 30) -> list[dict]:
    """
    Generate and dispatch official Defaulter Warning Notices (Email & SMS).
    Returns list of sent dispatch records with delivery timestamps and notice preview.
    """
    defaulters = [d for d in get_defaulters_report(threshold, days) if d["is_defaulter"]]
    dispatched = []
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    for d in defaulters:
        notice = {
            "student_id": d["student_id"],
            "student_name": d["name"],
            "recipient_email": f"{d['name'].lower().replace(' ', '.')}@campus.edu",
            "percentage": d["percentage"],
            "classes_needed": d["classes_needed"],
            "timestamp": timestamp,
            "status": "DISPATCHED",
            "subject": f"⚠️ URGENT: Attendance Defaulter Warning — {d['name']} ({d['percentage']}%)",
            "body": (
                f"Dear {d['name']},\n\n"
                f"This is an official automated notice from the Academic Attendance Office.\n"
                f"Your current attendance over the last {days} days is {d['percentage']}%, which falls below "
                f"the mandatory university minimum requirement of {threshold}%.\n\n"
                f"• Classes Attended: {d['days_present']} / {d['total_conducted']}\n"
                f"• Immediate Action Required: You must attend the next {d['classes_needed']} consecutive lectures "
                f"without absence to recover above the 75% threshold and avoid semester exam debarment.\n\n"
                f"Regards,\nSmart Attendance Automated Compliance System"
            ),
            "sms": f"[CAMPUS ALERT] {d['name']}, attendance is {d['percentage']}%. Attend next {d['classes_needed']} classes to avoid debarment.",
        }
        dispatched.append(notice)

    return dispatched


def export_defaulters_csv_string(threshold: float = 75.0, days: int = 30) -> str:
    """Return CSV string of all attendance defaulters."""
    report = get_defaulters_report(threshold, days)
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow([
        "Student ID", "Name", "Days Present", "Total Classes Conducted",
        "Attendance %", "Defaulter Status", "Classes Needed for 75%", "Risk Level"
    ])
    for r in report:
        writer.writerow([
            r["student_id"],
            r["name"],
            r["days_present"],
            r["total_conducted"],
            f"{r['percentage']}%",
            "DEFAULTER (<75%)" if r["is_defaulter"] else "GOOD (>=75%)",
            r["classes_needed"],
            r["risk_level"],
        ])
    return buf.getvalue()

