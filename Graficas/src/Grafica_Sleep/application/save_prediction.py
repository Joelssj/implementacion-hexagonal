from Grafica_Sleep.infraestructure.db_config import get_predictions_collection
from datetime import datetime

def save_prediction(user_uuid, prediction, current_hours):
    """
    Guarda la predicción en la colección `sleep` en MongoDB.
    """
    try:
        collection = get_predictions_collection()

        document = {
            "user_uuid": user_uuid,
            "current_week_hours": current_hours,
            "predictions": prediction["predicted_hours"],
            "days": prediction["days"],
            "lower_bound": prediction["lower_bound"],
            "upper_bound": prediction["upper_bound"],
            "created_at": datetime.utcnow()
        }

        print(f"🌟 Guardando documento en MongoDB: {document}")
        result = collection.insert_one(document)
        print(f"✔️ Predicción guardada con ID: {result.inserted_id}")
        return str(result.inserted_id)
    except Exception as e:
        print(f"❌ Error al guardar predicción: {e}")
        raise
