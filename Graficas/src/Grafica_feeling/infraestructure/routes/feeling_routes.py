from flask import Blueprint, request, jsonify
from Grafica_feeling.infraestructure.controller.feeling_controller import handle_emotion

feeling_bp = Blueprint("feeling", __name__)

@feeling_bp.route("/api/v1/feeling", methods=["POST"])
def register_feeling():
    """
    Endpoint para registrar una emoción diaria.
    Devuelve el historial y predicción cuando se completa una semana.
    """
    try:
        data = request.json
        user_uuid = data.get("user_uuid")
        emotion = data.get("emotion")

        if not user_uuid or not emotion:
            return jsonify({"error": "user_uuid y emotion son requeridos"}), 400

        result = handle_emotion(user_uuid, emotion)
        return jsonify(result), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
