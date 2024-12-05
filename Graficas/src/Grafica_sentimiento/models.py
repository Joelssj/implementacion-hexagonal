from Grafica_sentimiento.database import emociones_collection
from datetime import datetime, timedelta

# Función para obtener las últimas 20 semanas de datos
def obtener_semanas(useruuid):
    # Obtener la fecha actual
    fecha_actual = datetime.now()

    # Calcular la fecha hace 20 semanas
    fecha_limite = fecha_actual - timedelta(weeks=20)

    # Consultar las emociones del usuario desde la base de datos
    query = {"useruuid": useruuid, "dia": {"$gte": fecha_limite}}  # Filtrar por useruuid y fecha

    # Obtener los registros de emociones de la base de datos
    emociones = list(emociones_collection.find(query).sort("dia", 1))  # Ordenar por fecha ascendente

    # Organizar las emociones por semana
    semanas = []
    semana_actual = []

    # Supongamos que cada semana tiene 7 días
    for emocion in emociones:
        semana_actual.append(emocion)
        if len(semana_actual) == 7:
            semanas.append(semana_actual)
            semana_actual = []

    return semanas


# Función para eliminar las emociones procesadas de un usuario
def eliminar_emociones_usuario(useruuid):
    # Eliminar las emociones del usuario que hayan sido procesadas (en este caso, las de la semana más reciente)
    fecha_limite = datetime.now() - timedelta(weeks=1)  # Eliminar las emociones de hace una semana o más

    # Eliminar registros en la base de datos
    result = emociones_collection.delete_many({"useruuid": useruuid, "dia": {"$lte": fecha_limite}})

    return result.deleted_count  # Retorna la cantidad de registros eliminados

