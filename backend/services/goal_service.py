"""Business logic for Goal operations."""

from datetime import date
from database import db
from models.goal import Goal
from models.progress_entry import ProgressEntry


def compute_completion_percent(goal: Goal) -> int:
    """
    Simple heuristic: completion_percent is user-controlled.
    This helper recalculates based on recent streak activity
    and can be extended with AI/ML later.
    Currently returns the stored value without change.
    """
    return goal.completion_percent


def get_all_goals(user_id: int) -> list[dict]:
    goals = Goal.query.filter_by(user_id=user_id).order_by(Goal.created_at.desc()).all()
    return [g.to_dict() for g in goals]


def get_goal_by_id(goal_id: int, user_id: int) -> dict | None:
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return None
    return goal.to_dict(include_entries=True)


def create_goal(data: dict, user_id: int) -> dict:
    goal = Goal(
        user_id=user_id,
        title=data["title"].strip(),
        description=data.get("description", "").strip() or None,
        status=data.get("status", "active"),
        target_days=int(data.get("target_days", 10)),
    )
    db.session.add(goal)
    db.session.commit()
    return goal.to_dict()


def update_goal(goal_id: int, data: dict, user_id: int) -> dict | None:
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return None

    if "title" in data:
        goal.title = data["title"].strip()
    if "description" in data:
        goal.description = data["description"].strip() or None
    if "status" in data:
        goal.status = data["status"]
    if "target_days" in data:
        goal.target_days = int(data["target_days"])

    from datetime import datetime, timezone
    goal.updated_at = datetime.now(timezone.utc)

    db.session.commit()
    return goal.to_dict(include_entries=True)


def delete_goal(goal_id: int, user_id: int) -> bool:
    goal = Goal.query.filter_by(id=goal_id, user_id=user_id).first()
    if not goal:
        return False
    db.session.delete(goal)
    db.session.commit()
    return True


def get_stats(user_id: int) -> dict:
    """Aggregate stats for the dashboard."""
    goals = Goal.query.filter_by(user_id=user_id).all()
    total_goals = len(goals)
    active_goals = sum(1 for g in goals if g.status == "active")
    completed_goals = sum(1 for g in goals if g.status == "completed")

    entries = ProgressEntry.query.join(Goal).filter(Goal.user_id == user_id).all()
    total_minutes = sum(e.duration_minutes or 0 for e in entries)
    total_hours = round(total_minutes / 60, 1)

    # Streak: consecutive days with at least one entry (up to today)
    today = date.today()
    entry_dates = sorted({e.entry_date for e in entries}, reverse=True)
    streak = 0
    current = today
    for d in entry_dates:
        if d == current:
            streak += 1
            from datetime import timedelta
            current = current - timedelta(days=1)
        elif d < current:
            break

    return {
        "total_goals": total_goals,
        "active_goals": active_goals,
        "completed_goals": completed_goals,
        "total_hours": total_hours,
        "current_streak": streak,
    }
