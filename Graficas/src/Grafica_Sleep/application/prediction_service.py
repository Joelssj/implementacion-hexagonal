import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from Grafica_Sleep.infraestructure.db_config import get_feelings_collection, get_predictions_collection
from datetime import datetime


def predict_sleep_hours(current_hours):
    """
    Realiza la predicción de las horas de sueño de la semana siguiente.

    Parameters:
        current_hours (list): Horas de sueño de la semana actual (lista de 7 elementos).

    Returns:
        dict: Resultados de la predicción con días, predicción y límites.
    """
    if len(current_hours) != 7:
        raise ValueError("❌ La lista 'current_hours' debe contener exactamente 7 elementos.")

    # Crear datos históricos
    dias_semana_actual = np.arange(1, 8).reshape(-1, 1)  # Días representados como números
    horas_semana_actual = np.array(current_hours)

    # Ajustar modelo de regresión polinómica
    grado_polinomio = 3  # Grado del polinomio
    poly = PolynomialFeatures(degree=grado_polinomio)
    X_poly = poly.fit_transform(dias_semana_actual)
    modelo_polinomico = LinearRegression()
    modelo_polinomico.fit(X_poly, horas_semana_actual)

    # Generar predicciones para la semana siguiente
    dias_prediccion = np.arange(1, 8).reshape(-1, 1)
    predicciones_polinomicas = modelo_polinomico.predict(poly.transform(dias_prediccion))

    # Simular intervalos de confianza
    std_dev = np.std(horas_semana_actual)
    predicciones_superior = predicciones_polinomicas + std_dev
    predicciones_inferior = predicciones_polinomicas - std_dev

    # Crear el resultado
    dias_semana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
    resultados = {
        "days": dias_semana,
        "predicted_hours": predicciones_polinomicas.tolist(),
        "lower_bound": predicciones_inferior.tolist(),
        "upper_bound": predicciones_superior.tolist()
    }

    return resultados


def save_prediction(user_uuid, prediction):
    """
    Guarda la predicción en MongoDB.

    Parameters:
        user_uuid (str): Identificador único del usuario.
        prediction (dict): Resultados de la predicción.

    Returns:
        str: ID del documento insertado en MongoDB.
    """
    collection = get_predictions_collection()
    document = {
        "user_uuid": user_uuid,
        "status": "completed",
        "predictions": prediction["predicted_hours"],
        "lower_bound": prediction["lower_bound"],
        "upper_bound": prediction["upper_bound"],
        "days": prediction["days"],
        "updated_at": datetime.utcnow()
    }
    result = collection.insert_one(document)
    return str(result.inserted_id)


def register_sleep_hour(user_uuid, sleep_hour):
    """
    Registra una hora de sueño diaria para un usuario.
    Cuando se acumulan 7 días, genera la predicción.

    Parameters:
        user_uuid (str): Identificador único del usuario.
        sleep_hour (float): Hora de sueño registrada para el día.

    Returns:
        dict: Resultado del registro o predicción.
    """
    # Validar entrada
    if sleep_hour is None:
        return {"error": "La hora de sueño es requerida."}, 400

    # Conexión a la colección de horas de sueño
    feelings_collection = get_feelings_collection()

    # Registrar la hora de sueño en la base de datos
    feelings_collection.insert_one({
        "user_uuid": user_uuid,
        "sleep_hour": sleep_hour,
        "date": datetime.utcnow()
    })

    # Obtener las horas de sueño registradas para el usuario
    user_sleep_data = list(feelings_collection.find({"user_uuid": user_uuid}))
    current_hours = [entry["sleep_hour"] for entry in user_sleep_data]

    # Si el usuario tiene 7 días registrados, generar la predicción
    if len(current_hours) == 7:
        # Generar predicción
        prediction = predict_sleep_hours(current_hours)

        # Guardar la predicción en la base de datos
        save_prediction(user_uuid, prediction)

        # Limpiar los datos registrados de la semana actual
        feelings_collection.delete_many({"user_uuid": user_uuid})

        return {
            "message": "Semana completa. Predicción generada.",
            "current_hours": current_hours,
            "prediction": prediction
        }

    # Si aún no hay 7 días registrados, devolver el progreso
    return {
        "message": f"Hora registrada exitosamente. Actualmente tienes {len(current_hours)} días registrados.",
        "current_hours": current_hours
    }
