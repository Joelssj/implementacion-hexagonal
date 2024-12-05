from pymongo import MongoClient

# Conexión a MongoDB
client = MongoClient("mongodb+srv://joelssj:Yw8UiR6B3mtO8q7C@cluster0.3eskh.mongodb.net/graficas-senti")
db = client['emociones_db']  # Nombre de la base de datos
emociones_collection = db['emociones']  # Colección para almacenar emociones

# Obtener la colección de emociones
def get_emotions_collection():
    return db['emociones']

# Obtener la colección de predicciones
def get_predictions_collection():
    return db['predicciones_emociones']
