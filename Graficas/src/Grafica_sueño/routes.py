from flask import Blueprint, request, jsonify
from Grafica_sueño.db_operations import registrar_horas_sueño, obtener_ultima_prediccion
from Grafica_sueño.models import generar_prediccion_sueno
import pandas as pd

sueno_bp = Blueprint('sueno', __name__)

@sueno_bp.route('/registrar', methods=['POST'])
def registrar_sueno():
    """
    Registra las horas de sueño para un usuario y genera la predicción de la próxima semana.
    """
    data = request.get_json()
    user_uuid = data.get("user_uuid")
    horas_sueño = data.get("horas_sueño")

    if not user_uuid or not horas_sueño:
        return jsonify({"error": "Faltan datos"}), 400

    # Registrar las horas de sueño
    registrar_horas_sueño(user_uuid, horas_sueño)

    # Generar la predicción para la próxima semana
    prediccion_hw, intervalo_inferior, intervalo_superior = generar_prediccion_sueno(horas_sueño)

    # Guardar la predicción en la base de datos
    prediccion_data = {
        "user_uuid": user_uuid,
        "prediccion": prediccion_hw.tolist(),
        "intervalo_inferior": intervalo_inferior.tolist(),
        "intervalo_superior": intervalo_superior.tolist(),
        "fecha": pd.to_datetime("today")
    }

    # Se guarda la predicción en la colección de predicciones
    predicciones_collection = get_predicciones_sueno_collection()
    predicciones_collection.insert_one(prediccion_data)

    return jsonify({"message": "Horas de sueño registradas y predicción generada"}), 200


@sueno_bp.route('/prediccion/<user_uuid>', methods=['GET'])
def obtener_prediccion(user_uuid):
    """
    Obtiene la última predicción de horas de sueño para un usuario.
    """
    prediccion = obtener_ultima_prediccion(user_uuid)

    if not prediccion:
        return jsonify({"error": "No se encontró predicción para este usuario"}), 404

    return jsonify({
        "user_uuid": user_uuid,
        "prediccion": prediccion["prediccion"],
        "intervalo_inferior": prediccion["intervalo_inferior"],
        "intervalo_superior": prediccion["intervalo_superior"]
    }), 200

