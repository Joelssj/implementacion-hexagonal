import numpy as np
import tensorflow as tf
from sklearn.preprocessing import LabelEncoder
from Grafica_feeling.infraestructure.db_config import get_feelings_collection, get_predictions_collection

# Lista de emociones permitidas
EMOCIONES = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']

def generar_modelo_lstm(historico):
    """
    Crea, compila y entrena un modelo LSTM con los datos históricos proporcionados.
    """
    X_train = []
    y_train = []
    for semana in historico:
        for i in range(len(semana) - 1):
            X_train.append(semana[i])
            y_train.append(semana[i + 1])

    # Preparar los datos para LSTM
    X_train = np.array(X_train).reshape((-1, 1, 1)) / len(EMOCIONES)  # Normalizar
    y_train = np.array(y_train)

    # Crear el modelo
    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(1, 1)),
        tf.keras.layers.LSTM(128, activation='relu', return_sequences=True),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.LSTM(64, activation='relu'),
        tf.keras.layers.BatchNormalization(),
        tf.keras.layers.Dense(len(EMOCIONES), activation='softmax')
    ])

    # Compilar el modelo
    model.compile(optimizer='adam', loss='sparse_categorical_crossentropy', metrics=['accuracy'])

    # Entrenar el modelo
    model.fit(X_train, y_train, epochs=150, verbose=0)  # Más épocas para mejorar el aprendizaje

    return model


def registrar_emocion(user_uuid, emocion):
    """
    Registra una emoción diaria para un usuario.
    Genera la predicción de la próxima semana automáticamente al completar 7 días.
    """
    emocion = emocion.strip().lower()
    if emocion not in EMOCIONES:
        return {"error": f"Emoción '{emocion}' no es válida. Opciones válidas: {', '.join(EMOCIONES)}"}, 400

    encoder = LabelEncoder()
    encoder.fit(EMOCIONES)

    feelings_collection = get_feelings_collection()
    predictions_collection = get_predictions_collection()

    # Registrar la emoción
    feelings_collection.insert_one({"user_uuid": user_uuid, "emotion": emocion})

    # Obtener las emociones registradas
    emociones_usuario = list(feelings_collection.find({"user_uuid": user_uuid}))
    emociones_diarias = [e["emotion"] for e in emociones_usuario]
    emociones_codificadas = list(map(int, encoder.transform(emociones_diarias)))

    if len(emociones_diarias) == 7:  # Si hay 7 emociones, generar predicción
        semana_actual_encoded = encoder.transform(emociones_diarias)

        # Obtener datos históricos
        datos_historicos = list(feelings_collection.find())
        historico = []

        for registro in datos_historicos:
            emocion_codificada = encoder.transform([registro["emotion"]])[0]
            historico.append(emocion_codificada)

        historico = [historico[i:i + 7] for i in range(0, len(historico), 7) if len(historico[i:i + 7]) == 7]

        # Simular datos si hay menos de 20 semanas reales
        if len(historico) < 20:
            historico_simulado = []
            for _ in range(20):
                semana_simulada = np.random.permutation(range(len(EMOCIONES)))  # Balance estricto
                historico_simulado.append(semana_simulada)
            historico.extend(historico_simulado)

        # Entrenar el modelo
        model = generar_modelo_lstm(historico)

        # Predecir emociones para la próxima semana
        X_test = semana_actual_encoded.reshape((-1, 1, 1)) / len(EMOCIONES)
        prediccion = []
        intervalo_superior = []
        intervalo_inferior = []

        for i in range(7):
            probas = model.predict(X_test[i].reshape(1, 1, 1), verbose=0)
            emocion_predicha = np.argmax(probas)
            prediccion.append(emocion_predicha)

            # Calcular intervalo de confianza
            sorted_probas = np.argsort(probas[0])
            intervalo_superior.append(sorted_probas[-1])  # Mayor probabilidad
            intervalo_inferior.append(sorted_probas[-2] if len(sorted_probas) > 1 else sorted_probas[-1])  # Segunda mayor probabilidad

        prediccion_decoded = encoder.inverse_transform(prediccion)
        intervalo_superior_decoded = encoder.inverse_transform(intervalo_superior)
        intervalo_inferior_decoded = encoder.inverse_transform(intervalo_inferior)

        # Guardar predicción y limpiar datos
        predictions_collection.insert_one({
            "user_uuid": user_uuid,
            "prediction": prediccion_decoded.tolist(),
            "intervalo_superior": intervalo_superior_decoded.tolist(),
            "intervalo_inferior": intervalo_inferior_decoded.tolist()
        })
        feelings_collection.delete_many({"user_uuid": user_uuid})

        return {
            "message": "Semana completa. Predicción generada.",
            "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"],
            "emociones_diarias": emociones_diarias,
            "emociones_codificadas": emociones_codificadas,
            "prediccion": prediccion_decoded.tolist(),
            "intervalo_superior": intervalo_superior_decoded.tolist(),
            "intervalo_inferior": intervalo_inferior_decoded.tolist()
        }

    return {
        "message": "Emoción registrada exitosamente.",
        "dias": ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"][:len(emociones_diarias)],
        "emociones_diarias": emociones_diarias,
        "emociones_codificadas": emociones_codificadas
    }
