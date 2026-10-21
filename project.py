"""Launch the Smart Attendance web UI (Streamlit)."""

import os
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent
APP = ROOT / "smart_attendance" / "app.py"


def main() -> None:
    if not APP.is_file():
        raise SystemExit(f"Missing app: {APP}")
    port = os.environ.get("PORT", "5157")
    if len(sys.argv) > 1 and sys.argv[1].isdigit():
        port = sys.argv[1]

    env = {**os.environ, "STREAMLIT_BROWSER_GATHER_USAGE_STATS": "false"}
    subprocess.run(
        [sys.executable, "-m", "streamlit", "run", str(APP), "--server.port", str(port)],
        cwd=str(ROOT),
        env=env,
        input="\n",
        text=True,
        check=False,
    )


if __name__ == "__main__":
    main()
