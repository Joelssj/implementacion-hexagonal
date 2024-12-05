import numpy as np
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def generar_prediccion_sueno(horas_sueño):
    """
    Genera la predicción para la próxima semana usando el modelo Holt-Winters.
    
    Parámetros:
    - horas_sueño (list): Lista con las horas de sueño ingresadas por el usuario para la semana actual (7 días).
    
    Retorna:
    - predicciones_hw (list): Predicciones para la próxima semana.
    - intervalo_inferior (list): Límite inferior del intervalo de confianza.
    - intervalo_superior (list): Límite superior del intervalo de confianza.
    """
    # Simular datos históricos de sueño (puedes sustituir esto por tus datos reales)
    np.random.seed(42)
    horas_historicas = []
    for _ in range(20):
        semana = [6 + np.random.normal(0, 1) for _ in range(7)]  # Patrón semanal centrado en 6 horas
        horas_historicas.extend(semana)

    horas_historicas = np.array(horas_historicas)

    # Combina los datos históricos con las horas actuales para entrenamiento
    datos_entrenamiento = np.concatenate([horas_historicas, horas_sueño])

    # Ajustar el modelo Holt-Winters con parámetros optimizados
    modelo_hw = ExponentialSmoothing(
        datos_entrenamiento,
        trend="add",         # Tendencia aditiva
        seasonal="add",      # Estacionalidad aditiva
        seasonal_periods=7,  # Período semanal
        initialization_method="estimated"  # Estimación de los valores iniciales
    )

    # Ajustamos el modelo
    modelo_hw_fit = modelo_hw.fit(optimized=True)

    # Generar las predicciones para la próxima semana
    predicciones_hw = modelo_hw_fit.forecast(steps=7)

    # Calcular la desviación estándar de los últimos 28 días (4 semanas) para estimar la variabilidad
    std_dev = np.std(datos_entrenamiento[-28:])

    # Calcular los intervalos de confianza (IC)
    intervalo_superior = predicciones_hw + std_dev
    intervalo_inferior = predicciones_hw - std_dev

    return predicciones_hw.tolist(), intervalo_inferior.tolist(), intervalo_superior.tolist()
