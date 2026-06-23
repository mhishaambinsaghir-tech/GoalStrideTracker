"""Business logic for ProgressEntry operations."""

from datetime import date
from database import db
from models.progress_entry import ProgressEntry
from models.goal import Goal


def get_entries(user_id: int, goal_id: int | None = None) -> list[dict]:
    query = ProgressEntry.query.join(Goal).filter(Goal.user_id == user_id)
    if goal_id:
        query = query.filter(ProgressEntry.goal_id == goal_id)
    entries = query.order_by(ProgressEntry.entry_date.desc()).all()
    return [e.to_dict() for e in entries]


def get_entry_by_id(entry_id: int, user_id: int) -> dict | None:
    entry = ProgressEntry.query.join(Goal).filter(ProgressEntry.id == entry_id, Goal.user_id == user_id).first()
    return entry.to_dict() if entry else None


def create_entry(data: dict, user_id: int) -> dict | None:
    # Ensure goal exists and belongs to user
    goal = Goal.query.filter_by(id=data["goal_id"], user_id=user_id).first()
    if not goal:
        return None

    entry = ProgressEntry(
        goal_id=data["goal_id"],
        entry_date=date.fromisoformat(data["entry_date"]),
        notes=data.get("notes", "").strip() or None,
        duration_minutes=data.get("duration_minutes", 0) or 0,
    )
    db.session.add(entry)

    # Auto-update goal's updated_at
    from datetime import datetime, timezone
    goal.updated_at = datetime.now(timezone.utc)

    db.session.commit()
    return entry.to_dict()


def update_entry(entry_id: int, data: dict, user_id: int) -> dict | None:
    entry = ProgressEntry.query.join(Goal).filter(ProgressEntry.id == entry_id, Goal.user_id == user_id).first()
    if not entry:
        return None

    if "entry_date" in data:
        entry.entry_date = date.fromisoformat(data["entry_date"])
    if "notes" in data:
        entry.notes = data["notes"].strip() or None
    if "duration_minutes" in data:
        entry.duration_minutes = data["duration_minutes"] or 0

    db.session.commit()
    return entry.to_dict()


def delete_entry(entry_id: int, user_id: int) -> bool:
    entry = ProgressEntry.query.join(Goal).filter(ProgressEntry.id == entry_id, Goal.user_id == user_id).first()
    if not entry:
        return False
    db.session.delete(entry)
    db.session.commit()
    return True


def get_heatmap_data(user_id: int) -> list[dict]:
    """Return all entry dates and total minutes for calendar heatmap rendering."""
    entries = ProgressEntry.query.join(Goal).filter(Goal.user_id == user_id).all()
    # Aggregate by date
    date_map: dict[str, int] = {}
    for e in entries:
        key = e.entry_date.isoformat()
        date_map[key] = date_map.get(key, 0) + (e.duration_minutes or 0)
    return [{"date": k, "minutes": v} for k, v in sorted(date_map.items())]
