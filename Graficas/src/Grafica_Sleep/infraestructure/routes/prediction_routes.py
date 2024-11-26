from flask import Blueprint, request, jsonify
from Grafica_Sleep.application.prediction_service import predict_sleep_hours
from Grafica_Sleep.application.save_prediction import save_prediction


prediction_bp = Blueprint('prediction', __name__)

@prediction_bp.route('/api/v1/sleep', methods=['POST'])
def predict():
    """
    Realiza la predicción y guarda los resultados.
    """
    try:
        data = request.json
        user_uuid = data.get('user_uuid')
        current_hours = data.get('current_hours')  # Horas de la semana actual

        # Validar entrada
        if not user_uuid or not current_hours:
            return jsonify({"error": "user_uuid y current_hours son requeridos"}), 400

        # Generar predicción basada en las horas actuales
        prediction = predict_sleep_hours(current_hours)

        # Guardar en MongoDB junto con las horas actuales
        prediction_id = save_prediction(user_uuid, prediction, current_hours)

        return jsonify({
            "message": "Predicción realizada y guardada con éxito",
            "prediction_id": prediction_id,
            "prediction": prediction
        }), 201

    except Exception as e:
        print(f"❌ Error en el endpoint /api/v1/sleep: {e}")
        return jsonify({"error": "Error al realizar la predicción"}), 500
