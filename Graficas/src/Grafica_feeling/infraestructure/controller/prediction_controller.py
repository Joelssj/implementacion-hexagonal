from Grafica_feeling.application.prediction_service import predecir_proxima_semana
import numpy as np

# Datos simulados históricos
EMOCIONES = ['feliz', 'triste', 'neutral', 'enojado', 'aburrido', 'nervioso']
HISTORICO = [np.random.choice(range(len(EMOCIONES)), size=7) for _ in range(20)]  # Simulación de 20 semanas

def get_prediction(semana_actual):
    """
    Genera una predicción para la próxima semana basada en la semana actual.
    """
    prediccion = predecir_proxima_semana(semana_actual, HISTORICO)
    return {
        "semana_actual": semana_actual,
        "prediccion": prediccion
    }
