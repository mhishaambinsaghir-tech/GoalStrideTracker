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

    if "status" in data and data["status"] not in ALLOWED_STATUSES:
        errors.append(
            f"'status' must be one of: {', '.join(sorted(ALLOWED_STATUSES))}."
        )

    pct = data.get("completion_percent")
    if pct is not None:
        try:
            pct = int(pct)
            if not (0 <= pct <= 100):
                raise ValueError()
        except (ValueError, TypeError):
            errors.append("'completion_percent' must be an integer between 0 and 100.")

    target_days = data.get("target_days")
    if target_days is not None:
        try:
            target_days = int(target_days)
            if target_days < 1:
                raise ValueError()
        except (ValueError, TypeError):
            errors.append("'target_days' must be a positive integer.")

    return errors


def validate_progress_entry(data: dict) -> list[str]:
    """Return a list of validation error messages for a ProgressEntry payload."""
    errors = []

    goal_id = data.get("goal_id")
    if not goal_id:
        errors.append("'goal_id' is required.")
    else:
        try:
            int(goal_id)
        except (ValueError, TypeError):
            errors.append("'goal_id' must be a valid integer.")

    entry_date = data.get("entry_date")
    if not entry_date:
        errors.append("'entry_date' is required (format: YYYY-MM-DD).")
    else:
        try:
            date.fromisoformat(str(entry_date))
        except ValueError:
            errors.append("'entry_date' must be a valid date string (YYYY-MM-DD).")

    duration = data.get("duration_minutes")
    if duration is not None:
        try:
            duration = int(duration)
            if duration < 0:
                raise ValueError()
        except (ValueError, TypeError):
            errors.append("'duration_minutes' must be a non-negative integer.")

    return errors
