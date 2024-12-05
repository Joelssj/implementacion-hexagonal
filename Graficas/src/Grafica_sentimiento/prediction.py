# import numpy as np
# import tensorflow as tf
# from sklearn.preprocessing import LabelEncoder
# from datetime import datetime
# from Grafica_sentimiento.database import get_emotions_collection  # Asegúrate de tener esta función para acceder a la base de datos

# # Lista de emociones posibles
# emociones = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# # Función para entrenar el modelo de predicción basado en las emociones
# def entrenar_modelo(useruuid, emociones_usuario):
#     """
#     Entrena un modelo LSTM para predecir emociones basadas en los datos de la semana.
#     """
#     # Codificar las emociones de texto a números
#     encoder = LabelEncoder()
#     encoder.fit(emociones)

#     # Convertir las emociones registradas del usuario en valores numéricos
#     semana_actual_encoded = encoder.transform(emociones_usuario)

#     # Obtener datos históricos de la base de datos (emisiones registradas en las últimas semanas)
#     emociones_historicas = obtener_datos_historicos_usuario(useruuid)  # Pasamos el useruuid aquí

#     # Si hay menos de 7 días de datos, usamos 20 semanas aleatorias
#     if len(emociones_historicas) < 7:
#         emociones_historicas += generar_datos_aleatorios(20)  # Usamos 20 semanas de datos aleatorios para completar

#     # Creamos un conjunto de datos histórico para entrenamiento
#     historico = emociones_historicas[-20:]  # Usamos las últimas 20 semanas (o menos si no hay suficientes datos)

#     # Crear datos de entrenamiento: cada día es una entrada y el siguiente día es la etiqueta
#     X_train = []
#     y_train = []
#     for semana in historico:
#         for i in range(len(semana) - 1):  # Crear pares (entrada, etiqueta)
#             X_train.append(semana[i])
#             y_train.append(semana[i + 1])
    
#     X_train = np.array(X_train).reshape((-1, 1, 1))  # Reshape para LSTM
#     y_train = np.array(y_train)  # Etiquetas

#     # Crear el modelo LSTM
#     model = tf.keras.Sequential([
#         tf.keras.layers.LSTM(100, activation='relu', input_shape=(1, 1)),
#         tf.keras.layers.Dense(len(emociones), activation='softmax')  # Salida ajustada a las emociones
#     ])

#     # Compilar el modelo
#     model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

#     # Entrenar el modelo
#     model.fit(X_train, y_train, epochs=200, verbose=1)

#     # Predicción para la semana futura utilizando los últimos 7 días
#     X_test = semana_actual_encoded.reshape((-1, 1, 1))  # Cada día como entrada inicial
#     prediccion = []
#     for i in range(7):  # Predicción para 7 días
#         probas = model.predict(X_test[i].reshape(1, 1, 1), verbose=0)
#         emocion_predicha = np.argmax(probas)  # Tomamos la clase con la mayor probabilidad
#         prediccion.append(emocion_predicha)

#     # Calcular intervalos de confianza
#     intervalo_superior = np.clip(np.array(prediccion) + 1, 0, len(emociones) - 1)  # Aumentamos el índice para el intervalo superior
#     intervalo_inferior = np.clip(np.array(prediccion) - 1, 0, len(emociones) - 1)  # Disminuimos el índice para el intervalo inferior

#     # Convertir a listas para almacenar en MongoDB
#     intervalo_superior_lista = intervalo_superior.tolist()
#     intervalo_inferior_lista = intervalo_inferior.tolist()

#     # Decodificar las predicciones
#     prediccion_decoded = encoder.inverse_transform(prediccion)

#     return prediccion_decoded, intervalo_superior_lista, intervalo_inferior_lista

# # Obtener los datos históricos del usuario de la base de datos
# def obtener_datos_historicos_usuario(useruuid):
#     """
#     Recupera los datos históricos de emociones del usuario desde la base de datos.
#     """
#     collection = get_emotions_collection()
#     # Obtener las emociones del usuario, ordenadas por fecha
#     emociones = list(collection.find({'useruuid': useruuid}).sort('fecha', -1))
#     return [e['emocion'] for e in emociones]

# # Función para generar datos aleatorios (20 semanas)
# def generar_datos_aleatorios(num_semanas):
#     """
#     Genera datos aleatorios para simular 20 semanas de emociones.
#     """
#     emociones_aleatorias = []
#     for _ in range(num_semanas):
#         emociones_aleatorias.append(np.random.choice(emociones, size=7))  # 7 días por semana
#     return emociones_aleatorias





















import numpy as np
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder

# Lista de emociones posibles
emociones = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# Función para entrenar el modelo de predicción basado en las emociones
def entrenar_modelo(emociones_usuario):
    """
    Entrena un modelo LSTM para predecir emociones basadas en los datos de la semana.
    """
    # Codificar las emociones de texto a números
    encoder = LabelEncoder()
    encoder.fit(emociones)

    # Convertir las emociones registradas del usuario en valores numéricos
    semana_actual_encoded = encoder.transform(emociones_usuario)

    # Simular datos históricos (puedes reemplazar esto por tus datos históricos reales)
    historico = []
    for _ in range(20):  # Simulamos 20 semanas de datos históricos
        historico.append(np.random.choice(range(len(emociones)), size=7))  # Generamos 7 emociones por semana
    historico = np.array(historico)

    # Crear datos de entrenamiento: cada día es una entrada y el siguiente día es la etiqueta
    X_train = []
    y_train = []
    for semana in historico:
        for i in range(len(semana) - 1):  # Crear pares (entrada, etiqueta)
            X_train.append(semana[i])
            y_train.append(semana[i + 1])
    
    X_train = np.array(X_train).reshape((-1, 1, 1))  # Reshape para LSTM
    y_train = np.array(y_train)  # Etiquetas

    # Crear el modelo LSTM
    model = tf.keras.Sequential([
        tf.keras.layers.LSTM(100, activation='relu', input_shape=(1, 1)),  # Más unidades por mayor capacidad
        tf.keras.layers.Dense(len(emociones), activation='softmax')  # Salida ajustada a las emociones
    ])

    # Compilar el modelo
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Entrenar el modelo
    model.fit(X_train, y_train, epochs=200, verbose=1)

    # Predicción para la semana futura utilizando los últimos 7 días
    X_test = semana_actual_encoded.reshape((-1, 1, 1))  # Cada día como entrada inicial
    prediccion = []
    for i in range(7):  # Predicción para 7 días
        probas = model.predict(X_test[i].reshape(1, 1, 1), verbose=0)
        emocion_predicha = np.argmax(probas)  # Tomamos la clase con la mayor probabilidad
        prediccion.append(emocion_predicha)

    # Calcular intervalos de confianza
    intervalo_superior = np.clip(np.array(prediccion) + 1, 0, len(emociones) - 1)  # Aumentamos el índice para el intervalo superior
    intervalo_inferior = np.clip(np.array(prediccion) - 1, 0, len(emociones) - 1)  # Disminuimos el índice para el intervalo inferior

    # Convertir a listas para almacenar en MongoDB
    intervalo_superior_lista = intervalo_superior.tolist()
    intervalo_inferior_lista = intervalo_inferior.tolist()

    # Decodificar las predicciones
    prediccion_decoded = encoder.inverse_transform(prediccion)

    return prediccion_decoded, intervalo_superior_lista, intervalo_inferior_lista
























# import numpy as np
# import tensorflow as tf
# from sklearn.preprocessing import LabelEncoder
# from Grafica_sentimiento.database import get_feelings_collection

# # Lista de emociones permitidas
# EMOCIONES = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

# def generar_modelo_lstm(historico):
#     """
#     Crea, compila y entrena un modelo LSTM con los datos históricos proporcionados.
#     """
#     X_train = []
#     y_train = []
#     for semana in historico:
#         for i in range(len(semana) - 1):
#             X_train.append(semana[i])
#             y_train.append(semana[i + 1])

#     # Preparar los datos para LSTM
#     X_train = np.array(X_train).reshape((-1, 1, 1)) / len(EMOCIONES)  # Normalizar
#     y_train = np.array(y_train)

#     # Crear el modelo
#     model = tf.keras.Sequential([
#         tf.keras.layers.Input(shape=(1, 1)),
#         tf.keras.layers.LSTM(128, activation='relu', return_sequences=True),
#         tf.keras.layers.BatchNormalization(),
#         tf.keras.layers.Dropout(0.3),
#         tf.keras.layers.LSTM(64, activation='relu'),
#         tf.keras.layers.BatchNormalization(),
#         tf.keras.layers.Dense(len(EMOCIONES), activation='softmax')
#     ])

#     # Compilar el modelo
#     model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

#     # Entrenar el modelo
#     model.fit(X_train, y_train, epochs=150, verbose=0)  # Más épocas para mejorar el aprendizaje

#     return model

# def entrenar_modelo(emociones_usuario):
#     """
#     Función que recibe las emociones del usuario durante los últimos 7 días y predice la siguiente semana.
#     """
#     # Suponiendo que las emociones están en formato de lista de strings
#     encoder = LabelEncoder()
#     encoder.fit(EMOCIONES)

#     # Codificar las emociones de usuario
#     emociones_codificadas = encoder.transform(emociones_usuario)  # Esto convierte las emociones en números

#     # Crear el historial con las emociones del usuario
#     historico = [emociones_codificadas]

#     # Entrenar el modelo
#     model = generar_modelo_lstm(historico)

#     # Predecir las emociones para la próxima semana
#     X_test = np.array(emociones_codificadas).reshape((-1, 1, 1)) / len(EMOCIONES)  # Normalizamos

#     prediccion = []

#     for i in range(7):  # Predecir 7 días para la siguiente semana
#         probas = model.predict(X_test[i].reshape(1, 1, 1), verbose=0)
#         emocion_predicha = np.argmax(probas)
#         prediccion.append(emocion_predicha)

#     # Decodificar la predicción
#     prediccion_decoded = encoder.inverse_transform(prediccion)

#     return prediccion_decoded.tolist()
