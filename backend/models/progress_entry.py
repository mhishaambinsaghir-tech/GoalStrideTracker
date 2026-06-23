from datetime import datetime, timezone
from database import db


class ProgressEntry(db.Model):
    """A single day's progress log for a goal."""

    __tablename__ = "progress_entries"

    id = db.Column(db.Integer, primary_key=True)
    goal_id = db.Column(
        db.Integer,
        db.ForeignKey("goals.id", ondelete="CASCADE"),
        nullable=False,
    )
    entry_date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text, nullable=True)
    duration_minutes = db.Column(db.Integer, nullable=True, default=0)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )

    # Back-reference to goal
    goal = db.relationship("Goal", back_populates="progress_entries")

    def to_dict(self):
        return {
            "id": self.id,
            "goal_id": self.goal_id,
            "entry_date": self.entry_date.isoformat(),
            "notes": self.notes,
            "duration_minutes": self.duration_minutes,
            "created_at": self.created_at.isoformat(),
        }

    def __repr__(self):
        return f"<ProgressEntry {self.id}: goal={self.goal_id} date={self.entry_date}>"
