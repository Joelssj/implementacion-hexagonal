import numpy as np
import pandas as pd
from statsmodels.tsa.holtwinters import ExponentialSmoothing

def generar_prediccion_sueno(horas_sueño):
    """
    Genera la predicción para la próxima semana usando Holt-Winters.
    """
    # Crear datos históricos simulados (puedes reemplazar esto por tus datos reales)
    np.random.seed(42)
    horas_historicas = []
    for _ in range(20):
        semana = [6 + np.random.normal(0, 1) for _ in range(7)]  # Patrón semanal centrado en 6 horas
        horas_historicas.extend(semana)
    
    horas_historicas = np.array(horas_historicas)

    # Combinar los datos históricos con los actuales para entrenamiento
    datos_entrenamiento = np.concatenate([horas_historicas, horas_sueño])

    # Ajustar el modelo Holt-Winters con parámetros optimizados
    modelo_hw = ExponentialSmoothing(
        datos_entrenamiento,
        trend="add",
        seasonal="add",
        seasonal_periods=7,
        initialization_method="estimated"  # Estima los valores iniciales
    )
    modelo_hw_fit = modelo_hw.fit(optimized=True)  # Optimiza los parámetros

    # Generar predicciones para la próxima semana
    predicciones_hw = modelo_hw_fit.forecast(steps=7)

    # Simular intervalos de confianza (basados en la desviación estándar)
    std_dev = np.std(datos_entrenamiento[-28:])  # Usar las últimas 4 semanas para calcular la variación
    predicciones_superior = predicciones_hw + std_dev
    predicciones_inferior = predicciones_hw - std_dev

    return predicciones_hw, predicciones_inferior, predicciones_superior
