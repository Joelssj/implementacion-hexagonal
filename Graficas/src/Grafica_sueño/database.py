from pymongo import MongoClient

# Conexión a MongoDB (asegúrate de poner tu URI correctamente)
client = MongoClient("mongodb+srv://joelssj:Yw8UiR6B3mtO8q7C@cluster0.3eskh.mongodb.net/graficas-senti")
db = client['sueño_db']  # Nombre de la base de datos
sueno_collection = db['suenos']  # Colección para almacenar las horas de sueño
predicciones_collection = db['predicciones_sueno']  # Colección para almacenar las predicciones

# Función para obtener la colección de horas de sueño
def get_sueno_collection():
    return sueno_collection

# Función para obtener la colección de predicciones
def get_predicciones_sueno_collection():
    return predicciones_collection
