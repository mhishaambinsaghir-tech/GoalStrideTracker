"""Reusable validation helpers."""

from datetime import date


ALLOWED_STATUSES = {"active", "completed", "paused"}


def validate_goal(data: dict) -> list[str]:
    """Return a list of validation error messages for a Goal payload."""
    errors = []

    title = data.get("title", "").strip()
    if not title:
        errors.append("'title' is required and cannot be blank.")
    elif len(title) > 200:
        errors.append("'title' must be 200 characters or fewer.")

    return errors


def validate_progress_entry(data: dict) -> list[str]:
    """Return a list of validation error messages for a ProgressEntry payload."""
    errors = []
    return errors
