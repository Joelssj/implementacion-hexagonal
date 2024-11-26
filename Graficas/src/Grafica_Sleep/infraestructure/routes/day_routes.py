from flask import Blueprint, request, jsonify
from Grafica_Sleep.infraestructure.db_config import get_predictions_collection

from Grafica_Sleep.application.prediction_service import predict_sleep_hours
from Grafica_Sleep.application.save_prediction import save_prediction

day_bp = Blueprint("day", __name__)

@day_bp.route("/api/v1/sleep/daily", methods=["POST"])
def register_daily_sleep():
    """
    Endpoint para registrar horas de sueño diarias.
    """
    data = request.json
    user_uuid = data.get("user_uuid")
    hours = data.get("hours")

    if not user_uuid or hours is None:
        return jsonify({"error": "user_uuid y hours son requeridos"}), 400

    try:
        # Obtener la colección de MongoDB
        collection = get_predictions_collection()

        # Días de la semana
        week_days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]

        # Buscar o crear el documento del usuario
        user_data = collection.find_one({"user_uuid": user_uuid})

        if not user_data:
            # Si no existe, crea un nuevo documento con las horas del día actual
            new_data = {
                "user_uuid": user_uuid,
                "current_week_hours": [hours],
                "current_week_days": [week_days[0]],  # Primer día de la semana
                "predictions": None,
                "days": []
            }
            collection.insert_one(new_data)
            return jsonify({
                "message": "Primer día registrado.",
                "current_week_hours": [hours],
                "current_week_days": [week_days[0]]
            }), 201

        # Actualizar el documento existente con el nuevo día
        current_week_hours = user_data.get("current_week_hours", [])
        current_week_days = user_data.get("current_week_days", [])

        current_week_hours.append(hours)
        current_week_days.append(week_days[len(current_week_hours) - 1])

        if len(current_week_hours) == 7:
            # Generar predicción si se tienen los 7 días completos
            prediction = predict_sleep_hours(current_week_hours)

            # Guardar predicción en MongoDB
            prediction_id = save_prediction(user_uuid, prediction, current_week_hours)

            # Resetear las horas y los días de la semana en MongoDB
            collection.update_one(
                {"user_uuid": user_uuid},
                {"$set": {"current_week_hours": [], "current_week_days": []}}
            )

            return jsonify({
                "message": "Semana completa. Predicción generada y guardada.",
                "prediction_id": prediction_id,
                "prediction": prediction,
                "current_week": {
                    "days": current_week_days,
                    "hours": current_week_hours
                }
            }), 201

        # Si no se han completado 7 días, actualizar las horas y días acumulados
        collection.update_one(
            {"user_uuid": user_uuid},
            {"$set": {"current_week_hours": current_week_hours, "current_week_days": current_week_days}}
        )

        return jsonify({
            "message": "Horas registradas exitosamente.",
            "current_week_hours": current_week_hours,
            "current_week_days": current_week_days
        }), 200

    except Exception as e:
        return jsonify({"error": f"Error al registrar horas: {e}"}), 500
