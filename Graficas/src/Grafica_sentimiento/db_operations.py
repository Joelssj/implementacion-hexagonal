from Grafica_sentimiento.database import get_emotions_collection, get_predictions_collection
from Grafica_sentimiento.prediction import entrenar_modelo  # Importamos la función de entrenamiento
from flask import Blueprint, Flask, request, jsonify
import numpy as np
from datetime import datetime

# Crear el blueprint
emociones_blueprint = Blueprint('emociones', __name__)

# Lista de emociones permitidas
EMOCIONES_VALIDAS = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# Funciones de operaciones con base de datos
@emociones_blueprint.route('/emociones', methods=['POST'])
def registrar_emocion():
    data = request.get_json()
    useruuid = data.get('useruuid')
    emocion = data.get('emocion')

    if not useruuid or not emocion:
        return jsonify({"message": "Faltan datos: useruuid o emocion"}), 400

    if emocion not in EMOCIONES_VALIDAS:
        return jsonify({"message": f"Emoción inválida. Opciones válidas: {', '.join(EMOCIONES_VALIDAS)}"}), 400

    # Guardar la emoción en la base de datos
    guardar_emocion(useruuid, emocion)

    # Obtener las emociones del usuario
    emociones_usuario = obtener_emociones_usuario(useruuid)
    
    # Si hay suficientes datos (7 días), entrenamos el modelo y hacemos la predicción
    if len(emociones_usuario) >= 7:
        # Entrenamos el modelo y obtenemos la predicción de la emoción y los intervalos de confianza
        emocion_predicha, intervalo_superior, intervalo_inferior = entrenar_modelo(emociones_usuario)

        # Convertir la predicción (que podría ser un ndarray) a lista de Python si es necesario
        if isinstance(emocion_predicha, np.ndarray):
            emocion_predicha = emocion_predicha.tolist()

        # Guardar la predicción en MongoDB
        guardar_prediccion(useruuid, emocion_predicha, [list(intervalo_superior), list(intervalo_inferior)], emociones_usuario)

        # Guardar los sentimientos registrados
        guardar_sentimientos_registrados(useruuid, emociones_usuario)

        # Eliminar las emociones registradas de los últimos 7 días
        eliminar_emociones_usuario(useruuid)

        # Responder con la predicción y la información
        respuesta = {
            "id": useruuid,
            "message": "Emoción registrada y predicción realizada",
            "sentimientos_registrados": emociones_usuario,
            "predicción": {
                "emocion": emocion_predicha,
                "intervalos_confianza": {
                    "superior": list(intervalo_superior),
                    "inferior": list(intervalo_inferior)
                }
            }
        }

        return jsonify(respuesta)
    else:
        return jsonify({
            "id": useruuid,
            "message": "Emoción registrada. Aún faltan días para realizar una predicción."
        })

@emociones_blueprint.route('/emociones', methods=['GET'])
def obtener_emociones():
    useruuid = request.args.get('useruuid')

    if not useruuid:
        return jsonify({"message": "Falta el parámetro 'useruuid'"}), 400

    # Obtener la predicción más reciente del usuario
    prediccion = obtener_prediccion(useruuid)

    # Si no hay predicción, devolver mensaje
    if not prediccion:
        return jsonify({"message": "No hay predicción aún. Asegúrate de haber registrado suficientes emociones."}), 400

    # Crear la respuesta
    respuesta = {
        "id": useruuid,
        "prediccion": {
            "emocion": prediccion["emocion"],
            "intervalos_confianza": prediccion["intervalos_confianza"]
        },
        "sentimientos_registrados": prediccion["sentimientos_registrados"]  # Incluir los sentimientos registrados
    }

    return jsonify(respuesta)


# Funciones para manipular los datos
def guardar_emocion(useruuid, emocion):
    collection = get_emotions_collection()
    fecha_actual = datetime.now()
    collection.insert_one({
        'useruuid': useruuid,
        'emocion': emocion,
        'fecha': fecha_actual  # Añadir la fecha de la emoción registrada
    })

def obtener_emociones_usuario(useruuid):
    collection = get_emotions_collection()
    # Aseguramos que las emociones se ordenen por fecha en orden ascendente
    emociones = list(collection.find({'useruuid': useruuid}).sort('fecha', 1))  # 1 es para ascendente
    return [e['emocion'] for e in emociones]    

def eliminar_emociones_usuario(useruuid):
    collection = get_emotions_collection()
    collection.delete_many({'useruuid': useruuid})

def guardar_prediccion(useruuid, emocion_predicha, intervalos_confianza, sentimientos_registrados):
    if isinstance(intervalos_confianza, np.ndarray):
        intervalos_confianza = intervalos_confianza.tolist()
    if isinstance(emocion_predicha, np.ndarray):
        emocion_predicha = emocion_predicha.tolist()

    collection = get_predictions_collection()
    documento = {
        'useruuid': useruuid,
        'emocion_predicha': emocion_predicha,
        'intervalos_confianza': intervalos_confianza,
        'sentimientos_registrados': sentimientos_registrados,  # Guardar los sentimientos registrados
        'fecha': datetime.now()
    }
    collection.insert_one(documento)


def obtener_prediccion(useruuid):
    collection = get_predictions_collection()  # Colección de predicciones
    prediccion = collection.find_one({'useruuid': useruuid}, sort=[('fecha', -1)])  # Ordenada por fecha descendente
    if prediccion:
        # Verificar si existe el campo 'sentimientos_registrados'
        if 'sentimientos_registrados' not in prediccion:
            prediccion['sentimientos_registrados'] = []

        return {
            "emocion": prediccion["emocion_predicha"],
            "intervalos_confianza": prediccion["intervalos_confianza"],
            "sentimientos_registrados": prediccion["sentimientos_registrados"]  # Incluir los sentimientos registrados
        }
    return None


def guardar_sentimientos_registrados(useruuid, sentimientos):
    collection = get_emotions_collection()
    collection.update_one(
        {'useruuid': useruuid},
        {'$set': {'sentimientos_registrados': sentimientos}},
        upsert=True  # Si no existe el documento, lo crea
    )
































# from Grafica_sentimiento.database import get_emotions_collection, get_predictions_collection
# from datetime import datetime, timedelta
# import numpy as np

# # Al guardar la emoción, asegurémonos de que la fecha se está almacenando correctamente
# def guardar_emocion(useruuid, emocion):
#     collection = get_emotions_collection()  # Colección de emociones
#     fecha_actual = datetime.now()
#     print(f"Guardando emoción en la fecha: {fecha_actual}")  # Imprime la fecha al guardar
#     collection.insert_one({
#         'useruuid': useruuid,
#         'emocion': emocion,
#         'fecha': fecha_actual  # Añadimos la fecha de la emoción registrada
#     })

# def obtener_emociones_usuario(useruuid):
#     collection = get_emotions_collection()  # Colección de emociones
#     emociones = list(collection.find({'useruuid': useruuid}).sort('fecha', -1))

#     # Depuración: Imprimir el resultado para verificar si las emociones se recuperan
#     print(f"Emociones recuperadas: {emociones}")

#     # Devolvemos solo las emociones
#     return [e['emocion'] for e in emociones]



# # Función para eliminar las emociones registradas de un usuario (después de hacer la predicción)
# def eliminar_emociones_usuario(useruuid):
#     collection = get_emotions_collection()  # Colección de emociones
#     collection.delete_many({'useruuid': useruuid})

# # Función para guardar la predicción en la base de datos
# def guardar_prediccion(useruuid, emocion_predicha, intervalos_confianza):
#     if isinstance(intervalos_confianza, np.ndarray):
#         intervalos_confianza = intervalos_confianza.tolist()
#     if isinstance(emocion_predicha, np.ndarray):
#         emocion_predicha = emocion_predicha.tolist()

#     collection = get_predictions_collection()
#     documento = {
#         'useruuid': useruuid,
#         'emocion_predicha': emocion_predicha,
#         'intervalos_confianza': intervalos_confianza,
#         'fecha': datetime.now()
#     }
#     collection.insert_one(documento)

# # Función para obtener la última predicción realizada para un usuario
# def obtener_prediccion(useruuid):
#     collection = get_predictions_collection()  # Colección de predicciones
#     prediccion = collection.find_one({'useruuid': useruuid}, sort=[('fecha', -1)])  # Ordenada por fecha descendente
#     if prediccion:
#         return {
#             "emocion": prediccion["emocion_predicha"],
#             "intervalos_confianza": prediccion["intervalos_confianza"]
#         }
#     return None




























# from Grafica_sentimiento.database import get_emotions_collection, get_predictions_collection
# from datetime import datetime, timedelta
# import numpy as np

# # Función para guardar la emoción en la base de datos
# def guardar_emocion(useruuid, emocion):
#     collection = get_emotions_collection()  # Colección de emociones
#     collection.insert_one({
#         'useruuid': useruuid,
#         'emocion': emocion,
#         'fecha': datetime.now()  # Añadimos la fecha de la emoción registrada
#     })

# # Función para obtener las emociones registradas de un usuario (últimos 7 días)
# def obtener_emociones_usuario(useruuid):
#     collection = get_emotions_collection()  # Colección de emociones
#     seven_days_ago = datetime.now() - timedelta(days=7)
#     emociones = list(collection.find({'useruuid': useruuid, 'fecha': {'$gte': seven_days_ago}}).sort('fecha', -1))
    
#     # Devolvemos solo las emociones
#     return [e['emocion'] for e in emociones]

# # Función para eliminar las emociones registradas de un usuario (después de hacer la predicción)
# def eliminar_emociones_usuario(useruuid):
#     collection = get_emotions_collection()  # Colección de emociones
#     collection.delete_many({'useruuid': useruuid})

# # Función para guardar la predicción en la base de datos
# def guardar_prediccion(useruuid, emocion_predicha, intervalos_confianza):
#     # Asegúrate de convertir cualquier objeto numpy.ndarray a lista antes de insertarlo en MongoDB
#     if isinstance(intervalos_confianza, np.ndarray):
#         intervalos_confianza = intervalos_confianza.tolist()

#     # Si las emociones también son un array de Numpy, conviértelas a listas
#     if isinstance(emocion_predicha, np.ndarray):
#         emocion_predicha = emocion_predicha.tolist()

#     # Obtener la colección de predicciones
#     collection = get_predictions_collection()
    
#     # Crear el documento a insertar
#     documento = {
#         'useruuid': useruuid,
#         'emocion_predicha': emocion_predicha,  # Asegúrate de que sea una lista, no un ndarray
#         'intervalos_confianza': intervalos_confianza,  # Ahora es una lista de Python, no un ndarray
#         'fecha': datetime.now()
#     }
    
#     # Insertar el documento en la colección de predicciones
#     collection.insert_one(documento)

# # Función para obtener la última predicción realizada para un usuario
# def obtener_prediccion(useruuid):
#     collection = get_predictions_collection()  # Colección de predicciones
#     prediccion = collection.find_one({'useruuid': useruuid}, sort=[('fecha', -1)])  # Ordenada por fecha descendente
    
#     if prediccion:
#         print("Predicción recuperada:", prediccion)  # Agrega esta línea de depuración
#         return {
#             "emocion": prediccion["emocion_predicha"],
#             "intervalos_confianza": prediccion["intervalos_confianza"]
#         }
#     return None























# from Grafica_sentimiento.database import get_emotions_collection, get_predictions_collection
# from datetime import datetime
# import numpy as np

# # Función para guardar la emoción en la base de datos
# def guardar_emocion(useruuid, emocion):
#     collection = get_emotions_collection()  # Colección de emociones
#     collection.insert_one({
#         'useruuid': useruuid,
#         'emocion': emocion
#     })

# # Función para obtener las emociones registradas de un usuario
# def obtener_emociones_usuario(useruuid):
#     collection = get_emotions_collection()  # Colección de emociones
#     emociones = list(collection.find({'useruuid': useruuid}))
#     return [e['emocion'] for e in emociones]

# # Función para eliminar las emociones registradas de un usuario (después de hacer la predicción)
# def eliminar_emociones_usuario(useruuid):
#     collection = get_emotions_collection()  # Colección de emociones
#     collection.delete_many({'useruuid': useruuid})

# # Función para guardar la predicción en la base de datos
# def guardar_prediccion(useruuid, emocion_predicha, intervalos_confianza):
#     # Asegúrate de convertir cualquier objeto numpy.ndarray a lista antes de insertarlo en MongoDB
#     if isinstance(intervalos_confianza, np.ndarray):
#         intervalos_confianza = intervalos_confianza.tolist()

#     # Si las emociones también son un array de Numpy, conviértelas a listas
#     if isinstance(emocion_predicha, np.ndarray):
#         emocion_predicha = emocion_predicha.tolist()

#     # Obtener la colección de predicciones
#     collection = get_predictions_collection()
    
#     # Crear el documento a insertar
#     documento = {
#         'useruuid': useruuid,
#         'emocion_predicha': emocion_predicha,  # Asegúrate de que sea una lista, no un ndarray
#         'intervalos_confianza': intervalos_confianza,  # Ahora es una lista de Python, no un ndarray
#         'fecha': datetime.now()
#     }
    
#     # Insertar el documento en la colección de predicciones
#     collection.insert_one(documento)