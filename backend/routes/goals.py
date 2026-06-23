"""Goals Blueprint — /api/goals"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services import goal_service
from utils.validators import validate_goal

goals_bp = Blueprint("goals", __name__, url_prefix="/api/goals")


@goals_bp.route("", methods=["GET"])
@jwt_required()
def list_goals():
    """GET /api/goals — return all goals."""
    user_id = get_jwt_identity()
    goals = goal_service.get_all_goals(user_id)
    return jsonify({"data": goals, "count": len(goals)}), 200


@goals_bp.route("/<int:goal_id>", methods=["GET"])
@jwt_required()
def get_goal(goal_id):
    """GET /api/goals/:id — return one goal with its progress entries."""
    user_id = get_jwt_identity()
    goal = goal_service.get_goal_by_id(goal_id, user_id)
    if not goal:
        return jsonify({"error": f"Goal {goal_id} not found."}), 404
    return jsonify({"data": goal}), 200


@goals_bp.route("", methods=["POST"])
@jwt_required()
def create_goal():
    """POST /api/goals — create a new goal."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    errors = validate_goal(data)
    if errors:
        return jsonify({"errors": errors}), 422

    goal = goal_service.create_goal(data, user_id)
    return jsonify({"data": goal, "message": "Goal created."}), 201


@goals_bp.route("/<int:goal_id>", methods=["PUT"])
@jwt_required()
def update_goal(goal_id):
    """PUT /api/goals/:id — update a goal."""
    user_id = get_jwt_identity()
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"error": "Request body must be valid JSON."}), 400

    errors = validate_goal(data)
    if errors:
        return jsonify({"errors": errors}), 422

    goal = goal_service.update_goal(goal_id, data, user_id)
    if not goal:
        return jsonify({"error": f"Goal {goal_id} not found."}), 404

    return jsonify({"data": goal, "message": "Goal updated."}), 200


@goals_bp.route("/<int:goal_id>", methods=["DELETE"])
@jwt_required()
def delete_goal(goal_id):
    """DELETE /api/goals/:id — delete a goal and all its progress entries."""
    user_id = get_jwt_identity()
    deleted = goal_service.delete_goal(goal_id, user_id)
    if not deleted:
        return jsonify({"error": f"Goal {goal_id} not found."}), 404
    return jsonify({"message": f"Goal {goal_id} deleted."}), 200


@goals_bp.route("/stats", methods=["GET"])
@jwt_required()
def stats():
    """GET /api/goals/stats — aggregated dashboard statistics."""
    user_id = get_jwt_identity()
    data = goal_service.get_stats(user_id)
    return jsonify({"data": data}), 200
