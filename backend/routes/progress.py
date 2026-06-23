"""Progress Blueprint — /api/progress"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import progress_service
from utils.validators import validate_progress_entry
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

progress_bp = Blueprint("progress", __name__, url_prefix="/api/progress")


@progress_bp.route("", methods=["GET"])
@jwt_required()
def list_entries():
    """GET /api/progress?goal_id=<id> — list entries, optionally filtered."""
    user_id = int(get_jwt_identity())
    goal_id = request.args.get("goal_id", type=int)
    entries = progress_service.get_entries(user_id=user_id, goal_id=goal_id)
    return jsonify({"data": entries, "count": len(entries)}), 200


@progress_bp.route("/heatmap", methods=["GET"])
@jwt_required()
def heatmap():
    """GET /api/progress/heatmap — date→minutes map for calendar view."""
    user_id = int(get_jwt_identity())
    data = progress_service.get_heatmap_data(user_id=user_id)
    return jsonify({"data": data}), 200


@progress_bp.route("/<int:entry_id>", methods=["GET"])
@jwt_required()
def get_entry(entry_id):
    """GET /api/progress/:id — return a single entry."""
    user_id = int(get_jwt_identity())
    entry = progress_service.get_entry_by_id(entry_id, user_id)
    if not entry:
        return jsonify({"error": f"Progress entry {entry_id} not found."}), 404
    return jsonify({"data": entry}), 200


@progress_bp.route("", methods=["POST"])
@jwt_required()
def create_entry():
    """POST /api/progress — log a new progress entry."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)
    logger.info(f"Received create progress request: {data}")

    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    errors = validate_progress_entry(data)
    logger.info(f"Validation errors: {errors}")
    if errors:
        return jsonify({"errors": errors}), 422

    entry = progress_service.create_entry(data, user_id)
    if not entry:
        return jsonify({"error": f"Goal {data.get('goal_id')} not found."}), 404

    return jsonify({"data": entry, "message": "Progress entry created."}), 201


@progress_bp.route("/<int:entry_id>", methods=["PUT"])
@jwt_required()
def update_entry(entry_id):
    """PUT /api/progress/:id — update a progress entry."""
    user_id = int(get_jwt_identity())
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    entry = progress_service.update_entry(entry_id, data, user_id)
    if not entry:
        return jsonify({"error": f"Progress entry {entry_id} not found."}), 404

    return jsonify({"data": entry, "message": "Progress entry updated."}), 200


@progress_bp.route("/<int:entry_id>", methods=["DELETE"])
@jwt_required()
def delete_entry(entry_id):
    """DELETE /api/progress/:id — delete a progress entry."""
    user_id = int(get_jwt_identity())
    deleted = progress_service.delete_entry(entry_id, user_id)
    if not deleted:
        return jsonify({"error": f"Progress entry {entry_id} not found."}), 404
    return jsonify({"message": f"Progress entry {entry_id} deleted."}), 200
