from Grafica_sueño.database import get_sueno_collection, get_predicciones_sueno_collection
import pandas as pd

def registrar_horas_sueño(user_uuid, horas_sueño):
    """
    Registra las horas de sueño para un usuario.
    """
    sueno_collection = get_sueno_collection()  # Usamos la conexión a la colección de sueños
    sueno_collection.insert_one({
        "user_uuid": user_uuid,
        "horas_sueño": horas_sueño,
        "fecha": pd.to_datetime("today").strftime("%Y-%m-%d")  # Fecha actual
    })

def obtener_ultima_prediccion(user_uuid):
    """
    Obtiene la última predicción de horas de sueño para un usuario.
    """
    predicciones_collection = get_predicciones_sueno_collection()  # Usamos la colección de predicciones
    prediccion = predicciones_collection.find_one({"user_uuid": user_uuid}, sort=[("fecha", -1)])
    return prediccion
