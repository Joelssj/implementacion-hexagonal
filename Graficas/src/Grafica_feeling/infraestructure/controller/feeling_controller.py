from Grafica_feeling.application.prediction_service import registrar_emocion

def handle_emotion(user_uuid, emocion):
    """
    Registra una emoción y verifica si se debe generar una predicción.
    Devuelve los datos diarios y de la gráfica.
    """
    return registrar_emocion(user_uuid, emocion)
