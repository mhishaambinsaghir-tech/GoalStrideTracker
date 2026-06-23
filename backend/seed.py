"""
Seed script — populates the database with example data.

Run from the backend/ directory:
    python seed.py
"""

from datetime import date, timedelta
from app import create_app
from database import db
from models.user import User
from models.goal import Goal
from models.progress_entry import ProgressEntry


def seed():
    app = create_app()
    with app.app_context():
        # Clear existing data
        ProgressEntry.query.delete()
        Goal.query.delete()
        User.query.delete()
        db.session.commit()

        # Create a default user
        user = User(email="test@example.com")
        user.set_password("password123")
        db.session.add(user)
        db.session.flush()

        today = date.today()

        # ── Goal 1: Learn Unity Game Development ──────────────────────────────
        unity = Goal(
            user_id=user.id,
            title="Learn Unity Game Development",
            description="Master Unity from scratch — C#, physics, animations, and shipping a complete 2D platformer.",
            status="active",
            completion_percent=35,
        )
        db.session.add(unity)
        db.session.flush()  # get unity.id

        unity_entries = [
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=13),
                          notes="Installed Unity Hub and Unity 2022 LTS. Created my first empty project.", duration_minutes=45),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=12),
                          notes="Explored the Unity editor UI. Learned about GameObjects, components, and the Inspector panel.", duration_minutes=60),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=11),
                          notes="Started C# basics — variables, methods, and MonoBehaviour lifecycle (Start, Update).", duration_minutes=90),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=9),
                          notes="Built first simple movement system using Transform.Translate and Rigidbody2D.", duration_minutes=75),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=7),
                          notes="Implemented jump mechanics and basic collision detection. Fixed a bug with double-jump.", duration_minutes=120),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=5),
                          notes="Created simple tilemap level layout. Learned about Sorting Layers and Z-depth.", duration_minutes=60),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=3),
                          notes="Added sprite animation using Animator Controller and Blend Trees for walk/idle/jump.", duration_minutes=90),
            ProgressEntry(goal_id=unity.id, entry_date=today - timedelta(days=1),
                          notes="Health system and simple enemy AI (patrol back and forth). Pickups implemented.", duration_minutes=105),
        ]
        db.session.add_all(unity_entries)

        # ── Goal 2: Learn Pygame ───────────────────────────────────────────────
        pygame_goal = Goal(
            user_id=user.id,
            title="Learn Pygame",
            description="Build 2D games with Python and Pygame — from a basic game window to a complete arcade game.",
            status="active",
            completion_percent=55,
        )
        db.session.add(pygame_goal)
        db.session.flush()

        pygame_entries = [
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=20),
                          notes="Installed pygame via pip. Ran the hello-world window. Understood the game loop.", duration_minutes=30),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=19),
                          notes="Drew shapes and text on screen. Learned about Surface and display.flip().", duration_minutes=45),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=18),
                          notes="Handled keyboard and mouse events. Built a simple player rectangle that moves.", duration_minutes=60),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=16),
                          notes="Added sprite class, loaded PNG assets. Implemented frame-rate independent movement with delta time.", duration_minutes=75),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=14),
                          notes="Bullet shooting mechanic and collision detection using Rect.colliderect().", duration_minutes=90),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=10),
                          notes="Enemy spawning system with increasing difficulty. Added score counter and lives.", duration_minutes=120),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=6),
                          notes="Game over screen and restart flow. Added background music with pygame.mixer.", duration_minutes=60),
            ProgressEntry(goal_id=pygame_goal.id, entry_date=today - timedelta(days=2),
                          notes="Polished: particle effects on enemy death, high score persisted to file, proper game states.", duration_minutes=90),
        ]
        db.session.add_all(pygame_entries)

        # ── Goal 3: Learn React & Modern Frontend ─────────────────────────────
        react_goal = Goal(
            user_id=user.id,
            title="Master React & Modern Frontend",
            description="Deep-dive into React 18 — hooks, context, performance, React Router, and building real apps.",
            status="completed",
            completion_percent=100,
        )
        db.session.add(react_goal)
        db.session.flush()

        react_entries = [
            ProgressEntry(goal_id=react_goal.id, entry_date=today - timedelta(days=30),
                          notes="JSX, components, props, and state with useState.", duration_minutes=90),
            ProgressEntry(goal_id=react_goal.id, entry_date=today - timedelta(days=28),
                          notes="useEffect, dependency arrays, and data fetching with fetch/Axios.", duration_minutes=60),
            ProgressEntry(goal_id=react_goal.id, entry_date=today - timedelta(days=25),
                          notes="React Router v6 — routes, layouts, nested routes, useNavigate.", duration_minutes=75),
            ProgressEntry(goal_id=react_goal.id, entry_date=today - timedelta(days=22),
                          notes="Context API and custom hooks for global state management.", duration_minutes=90),
            ProgressEntry(goal_id=react_goal.id, entry_date=today - timedelta(days=18),
                          notes="Performance: useMemo, useCallback, React.memo, code splitting.", duration_minutes=120),
        ]
        db.session.add_all(react_entries)

        db.session.commit()
        print("✅  Seeded 3 goals and 21 progress entries successfully.")


if __name__ == "__main__":
    seed()
