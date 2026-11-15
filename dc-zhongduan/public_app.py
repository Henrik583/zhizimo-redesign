"""Streamlit Community Cloud entrypoint for the shared terminal."""

from pathlib import Path

source = Path(__file__).resolve().with_name("app.py")
namespace = {"__name__": "__main__", "__file__": str(source), "PUBLIC_MODE": True}
exec(compile(source.read_bytes(), str(source), "exec"), namespace)
