import numpy as np
from flask import Blueprint, Flask, request, jsonify
from Grafica_sentimiento.db_operations import (
    guardar_emocion,
    obtener_emociones_usuario,
    eliminar_emociones_usuario,
    guardar_prediccion,
    obtener_prediccion,
    guardar_sentimientos_registrados  # Asegúrate de que esta función esté correctamente definida en db_operations.py
)
from Grafica_sentimiento.prediction import entrenar_modelo  # Importamos la función de entrenamiento

# Crear el blueprint
emociones_blueprint = Blueprint('emociones', __name__)

# Lista de emociones permitidas
EMOCIONES_VALIDAS = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

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

        # Asegúrate de convertir intervalos a listas si es un ndarray
        if isinstance(intervalo_superior, np.ndarray):
            intervalo_superior = intervalo_superior.tolist()
        if isinstance(intervalo_inferior, np.ndarray):
            intervalo_inferior = intervalo_inferior.tolist()

        # Guardar la predicción en MongoDB
        guardar_prediccion(useruuid, emocion_predicha, [list(intervalo_superior), list(intervalo_inferior)], emociones_usuario)

        # Guardar los sentimientos registrados en la base de datos
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


def create_app():
    app = Flask(__name__)
    app.register_blueprint(emociones_blueprint, url_prefix='/api')
    return app







































# import numpy as np
# from flask import Blueprint, Flask, request, jsonify
# from Grafica_sentimiento.db_operations import (
#     guardar_emocion,
#     obtener_emociones_usuario,
#     eliminar_emociones_usuario,
#     guardar_prediccion,
#     obtener_prediccion
# )
# from Grafica_sentimiento.prediction import entrenar_modelo  # Importamos la función de entrenamiento

# # Crear el blueprint
# emociones_blueprint = Blueprint('emociones', __name__)

# # Lista de emociones permitidas
# EMOCIONES_VALIDAS = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# @emociones_blueprint.route('/emociones', methods=['POST'])
# def registrar_emocion():
#     data = request.get_json()
#     useruuid = data.get('useruuid')
#     emocion = data.get('emocion')

#     if not useruuid or not emocion:
#         return jsonify({"message": "Faltan datos: useruuid o emocion"}), 400

#     if emocion not in EMOCIONES_VALIDAS:
#         return jsonify({"message": f"Emoción inválida. Opciones válidas: {', '.join(EMOCIONES_VALIDAS)}"}), 400

#     # Guardar la emoción en la base de datos
#     guardar_emocion(useruuid, emocion)

#     # Obtener las emociones del usuario
#     emociones_usuario = obtener_emociones_usuario(useruuid)
    
#     # Si hay suficientes datos (7 días), entrenamos el modelo y hacemos la predicción
#     if len(emociones_usuario) >= 7:
#         # Entrenamos el modelo y obtenemos la predicción de la emoción y los intervalos de confianza
#         emocion_predicha, intervalo_superior, intervalo_inferior = entrenar_modelo(emociones_usuario)

#         # Convertir la predicción (que podría ser un ndarray) a lista de Python si es necesario
#         if isinstance(emocion_predicha, np.ndarray):
#             emocion_predicha = emocion_predicha.tolist()

#         # Guardar la predicción en MongoDB
#         guardar_prediccion(useruuid, emocion_predicha, [list(intervalo_superior), list(intervalo_inferior)])

#         # Eliminar las emociones registradas de los últimos 7 días
#         eliminar_emociones_usuario(useruuid)

#         # Responder con la predicción y la información
#         respuesta = {
#             "id": useruuid,
#             "message": "Emoción registrada y predicción realizada",
#             "sentimientos_registrados": emociones_usuario,
#             "predicción": {
#                 "emocion": emocion_predicha,
#                 "intervalos_confianza": {
#                     "superior": list(intervalo_superior),
#                     "inferior": list(intervalo_inferior)
#                 }
#             }
#         }

#         return jsonify(respuesta)
#     else:
#         return jsonify({
#             "id": useruuid,
#             "message": "Emoción registrada. Aún faltan días para realizar una predicción."
#         })

# @emociones_blueprint.route('/emociones', methods=['GET'])
# def obtener_emociones():
#     useruuid = request.args.get('useruuid')

#     # Depuración: Imprimir el valor de useruuid
#     print(f"Received useruuid: {useruuid}")

#     if not useruuid:
#         return jsonify({"message": "Falta el parámetro 'useruuid'"}), 400

#     # Obtener las emociones del usuario (últimos 7 días)
#     emociones_usuario = obtener_emociones_usuario(useruuid)

#     # Obtener la predicción más reciente del usuario
#     prediccion = obtener_prediccion(useruuid)

#     # Si no hay predicción, devolver mensaje
#     if not prediccion:
#         return jsonify({"message": "No hay predicción aún. Asegúrate de haber registrado suficientes emociones."}), 400

#     # Crear la respuesta
#     respuesta = {
#         "id": useruuid,
#         "prediccion": {
#             "emocion": prediccion["emocion"],
#             "intervalos_confianza": prediccion["intervalos_confianza"]
#         }
#     }

#     # Incluir las emociones de la última semana si existen
#     if emociones_usuario:
#         respuesta["ultima_semana_registrada"] = emociones_usuario[-7:]  # Últimos 7 días

#     return jsonify(respuesta)


# def create_app():
#     app = Flask(__name__)
#     app.register_blueprint(emociones_blueprint, url_prefix='/api')
#     return app






























# import numpy as np  # Agrega esta línea

# from flask import Blueprint, Flask, request, jsonify
# from Grafica_sentimiento.db_operations import (
#     guardar_emocion, 
#     obtener_emociones_usuario, 
#     eliminar_emociones_usuario, 
#     guardar_prediccion
# )
# from Grafica_sentimiento.prediction import entrenar_modelo  # Importamos la función de entrenamiento

# # Crear el blueprint
# emociones_blueprint = Blueprint('emociones', __name__)

# # Lista de emociones permitidas
# EMOCIONES_VALIDAS = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# @emociones_blueprint.route('/emociones', methods=['POST'])
# def registrar_emocion():
#     data = request.get_json()
#     useruuid = data.get('useruuid')
#     emocion = data.get('emocion')

#     if not useruuid or not emocion:
#         return jsonify({"message": "Faltan datos: useruuid o emocion"}), 400

#     if emocion not in EMOCIONES_VALIDAS:
#         return jsonify({"message": f"Emoción inválida. Opciones válidas: {', '.join(EMOCIONES_VALIDAS)}"}), 400

#     # Guardar la emoción en la base de datos
#     guardar_emocion(useruuid, emocion)

#     # Obtener las emociones del usuario
#     emociones_usuario = obtener_emociones_usuario(useruuid)
    
#     # Si hay suficientes datos (7 días), entrenamos el modelo y hacemos la predicción
#     if len(emociones_usuario) >= 7:
#         # Entrenamos el modelo y obtenemos la predicción de la emoción y los intervalos de confianza
#         emocion_predicha, intervalo_superior, intervalo_inferior = entrenar_modelo(emociones_usuario)

#         # Convertir la predicción (que podría ser un ndarray) a lista de Python si es necesario
#         if isinstance(emocion_predicha, np.ndarray):
#             emocion_predicha = emocion_predicha.tolist()

#         # Guardar la predicción en MongoDB
#         guardar_prediccion(useruuid, emocion_predicha, [intervalo_superior, intervalo_inferior])

#         # Eliminar las emociones registradas de los últimos 7 días
#         eliminar_emociones_usuario(useruuid)

#         # Responder con la predicción y la información
#         respuesta = {
#             "id": useruuid,
#             "message": "Emoción registrada y predicción realizada",
#             "sentimientos_registrados": emociones_usuario,
#             "predicción": {
#                 "emocion": emocion_predicha,
#                 "intervalos_confianza": {
#                     "superior": intervalo_superior,
#                     "inferior": intervalo_inferior
#                 }
#             }
#         }

#         return jsonify(respuesta)
#     else:
#         return jsonify({
#             "id": useruuid,
#             "message": "Emoción registrada. Aún faltan días para realizar una predicción."
#         })


# # Función para crear y configurar la aplicación Flask
# def create_app():
#     app = Flask(__name__)

#     # Registrar el blueprint de emociones
#     app.register_blueprint(emociones_blueprint, url_prefix='/api')

#     return app



















# from flask import Flask, Blueprint, request, jsonify
# from Grafica_sentimiento.prediction import entrenar_modelo
# from Grafica_sentimiento.db_operations import guardar_emocion, obtener_emociones_usuario

# # Crear el blueprint
# emociones_blueprint = Blueprint('emociones', __name__)

# # Lista de emociones permitidas (validar que sean correctas)
# EMOCIONES_VALIDAS = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# # Endpoint para registrar las emociones
# @emociones_blueprint.route('/emociones', methods=['POST'])
# def registrar_emocion():
#     # Obtener datos del cuerpo de la solicitud
#     data = request.get_json()
#     useruuid = data.get('useruuid')
#     emocion = data.get('emocion')

#     if not useruuid or not emocion:
#         return jsonify({"message": "Faltan datos: useruuid o emocion"}), 400

#     if emocion not in EMOCIONES_VALIDAS:
#         return jsonify({"message": f"Emoción inválida. Opciones válidas: {', '.join(EMOCIONES_VALIDAS)}"}), 400

#     # Guardar la emoción en la base de datos
#     resultado = guardar_emocion(useruuid, emocion)

#     # Verificar si hay suficientes datos (7 días)
#     emociones_usuario = obtener_emociones_usuario(useruuid)
#     if len(emociones_usuario) >= 7:
#         # Si hay 7 o más días de emociones, hacer la predicción
#         emocion_predicha = entrenar_modelo(emociones_usuario)
#         return jsonify({
#             "id": useruuid,
#             "message": "Emoción registrada y predicción realizada",
#             "predicción": {
#                 "emocion": emocion_predicha
#             }
#         })
#     else:
#         # Si no hay suficientes datos
#         return jsonify({
#             "id": useruuid,
#             "message": "Emoción registrada. Aún faltan días para realizar una predicción."
#         })

# # Función para crear la aplicación Flask
# def create_app():
#     """
#     Crea e inicializa la aplicación Flask.
#     """
#     app = Flask(__name__)

#     # Registrar los blueprints
#     app.register_blueprint(emociones_blueprint, url_prefix='/api')

#     return app

