from datetime import datetime, timezone, timedelta
from database import db


class Goal(db.Model):
    """A learning goal created by the user."""

    __tablename__ = "goals"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=True)
    status = db.Column(
        db.String(20),
        nullable=False,
        default="active",
        # Allowed: active | completed | paused
    )
    completion_percent = db.Column(db.Integer, nullable=False, default=0)
    target_days = db.Column(db.Integer, nullable=False, default=10)
    created_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
    )
    updated_at = db.Column(
        db.DateTime(timezone=True),
        nullable=False,
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    # Relationships
    user = db.relationship("User", back_populates="goals")
    progress_entries = db.relationship(
        "ProgressEntry",
        back_populates="goal",
        cascade="all, delete-orphan",
        order_by="ProgressEntry.entry_date",
    )

    def to_dict(self, include_entries=False):
        # Calculate completion percentage dynamically based on unique entry dates
        unique_days = len(set(e.entry_date for e in self.progress_entries))
        calculated_completion = min(100, int((unique_days / self.target_days) * 100)) if self.target_days else 0

        # Calculate deadline
        deadline_date = (self.created_at + timedelta(days=self.target_days)).date()

        data = {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "completion_percent": calculated_completion,
            "target_days": self.target_days,
            "deadline_date": deadline_date.isoformat(),
            "created_at": self.created_at.isoformat(),
            "updated_at": self.updated_at.isoformat(),
            "entry_count": len(self.progress_entries),
        }
        if include_entries:
            data["progress_entries"] = [e.to_dict() for e in self.progress_entries]
        return data

    def __repr__(self):
        return f"<Goal {self.id}: {self.title}>"
