from pymongo import MongoClient
import os
from datetime import datetime

# Inicializar cliente de MongoDB como una variable global para reutilizar la conexión
mongo_client = None

def get_mongo_client():
    """
    Devuelve un cliente de MongoDB utilizando la URI definida en el archivo .env.
    """
    global mongo_client
    if mongo_client is None:  # Si no existe el cliente, se crea uno
        mongo_uri = os.getenv("MONGO_URI")
        if not mongo_uri:
            raise ValueError("❌ MONGO_URI no está definido en las variables de entorno.")
        try:
            mongo_client = MongoClient(mongo_uri)
            print("✔️ Conexión exitosa a MongoDB")
        except Exception as e:
            raise ConnectionError(f"❌ Error al conectar a MongoDB: {e}")
    return mongo_client

def get_predictions_collection():
    """
    Devuelve la colección `sleep` desde la base de datos `graficas`.
    """
    client = get_mongo_client()

    # Nombre de la base de datos explícito (según tu configuración)
    db_name = "graficas"  # Cambia esto si tu base de datos tiene un nombre diferente
    collection_name = "sleep"  # Cambia esto si la colección tiene un nombre diferente

    # Conectar a la base de datos y la colección
    db = client[db_name]
    print(f"✔️ Usando base de datos: {db_name}, colección: {collection_name}")
    return db[collection_name]

def get_feelings_collection():
    """
    Devuelve la colección `feelings` desde la base de datos `graficas`.
    """
    client = get_mongo_client()

    # Nombre de la base de datos explícito (según tu configuración)
    db_name = "graficas"  # Cambia esto si tu base de datos tiene un nombre diferente
    collection_name = "feelings"  # Cambia esto si la colección tiene un nombre diferente

    # Conectar a la base de datos y la colección
    db = client[db_name]
    print(f"✔️ Usando base de datos: {db_name}, colección: {collection_name}")
    return db[collection_name]

def save_prediction(prediction_data, current_week_hours):
    """
    Guarda los datos de predicción junto con las horas de la semana actual en la colección MongoDB.
    
    :param prediction_data: Diccionario con los datos de predicción (predicciones, límites, etc.).
    :param current_week_hours: Lista de horas reales de la semana actual.
    """
    collection = get_predictions_collection()

    # Crear documento a insertar
    prediction_document = {
        "prediction": prediction_data,  # Datos de predicción
        "current_week_hours": current_week_hours,  # Horas de la semana actual
        "timestamp": datetime.utcnow()  # Timestamp de cuando se guarda
    }

    try:
        result = collection.insert_one(prediction_document)
        print(f"✔️ Predicción y horas de la semana guardadas con éxito. ID del documento: {result.inserted_id}")
        return result.inserted_id
    except Exception as e:
        print(f"❌ Error al guardar en MongoDB: {e}")
        raise
