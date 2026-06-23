"""Flask application factory."""

import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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

    # Debug log every request
    @app.before_request
    def log_request_info():
        logger.info(f"📥 {request.method} {request.url}")
        logger.info(f"📋 Headers: {dict(request.headers)}")
        if request.is_json:
            logger.info(f"📦 JSON: {request.get_json(silent=True)}")

    # Init JWT
    jwt = JWTManager(app)

    # JWT error handlers
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        logger.warning("Expired token")
        return jsonify({"error": "Token has expired"}), 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        logger.warning(f"Invalid token: {error}")
        return jsonify({"error": f"Invalid token: {error}"}), 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        logger.warning("Missing token")
        return jsonify({"error": "Missing authorization token"}), 401

    @jwt.revoked_token_loader
    def revoked_token_callback(jwt_header, jwt_payload):
        logger.warning("Revoked token")
        return jsonify({"error": "Token has been revoked"}), 401

    # Init DB + migrations
    init_db(app)

    # Register blueprints
    from routes.auth import auth_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(goals_bp)
    app.register_blueprint(progress_bp)

    @app.route("/api/health")
    def health():
        logger.info("✅ Health check hit!")
        return {"status": "ok", "message": "GoalStrideTracker API is running."}, 200

    @app.errorhandler(Exception)
    def handle_exception(e):
        logger.exception(f"❌ Unhandled exception: {e}")
        return jsonify({"error": "Internal server error"}), 500

    return app


if __name__ == "__main__":
    application = create_app()
    application.run(debug=True, host="0.0.0.0", port=5000)
