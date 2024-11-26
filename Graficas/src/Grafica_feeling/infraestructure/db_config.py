import pymongo
from dotenv import load_dotenv
import os

load_dotenv()

def get_feelings_collection():
    """
    Devuelve la colección de sentimientos desde la base de datos.
    """
    client = pymongo.MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database("grafica_feeling")
    return db.get_collection("feelings")

def get_predictions_collection():
    """
    Devuelve la colección de predicciones desde la base de datos.
    """
    client = pymongo.MongoClient(os.getenv("MONGO_URI"))
    db = client.get_database("grafica_feeling")
    return db.get_collection("predictions")
