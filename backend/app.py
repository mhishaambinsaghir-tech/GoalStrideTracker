"""Flask application factory."""

import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from config import get_config
from database import init_db
from models import db  # noqa: F401 — ensure models are imported for migrations

# ── Import models here so Flask-Migrate detects them ──────────────────────────
from models.user import User  # noqa: F401
from models.goal import Goal  # noqa: F401
from models.progress_entry import ProgressEntry  # noqa: F401

from routes.goals import goals_bp
from routes.progress import progress_bp


def create_app(config_override=None):
    app = Flask(__name__)

    # Load config
    cfg = config_override or get_config()
    app.config.from_object(cfg)

    # Ensure the database directory exists (SQLite)
    db_uri = app.config.get("SQLALCHEMY_DATABASE_URI", "")
    if db_uri.startswith("sqlite:///"):
        db_path = db_uri.replace("sqlite:///", "")
        os.makedirs(os.path.dirname(db_path), exist_ok=True)

    # Enable CORS — allow React dev server
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Init JWT
    jwt = JWTManager(app)

    # Init DB + migrations
    init_db(app)

    # Register blueprints
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(goals_bp)
    app.register_blueprint(progress_bp)

    @app.route("/api/health")
    def health():
        return {"status": "ok", "message": "GoalStrideTracker API is running."}, 200

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, host="0.0.0.0", port=5000)
