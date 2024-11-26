from flask import Blueprint, request, make_response
import matplotlib.pyplot as plt
import io

graph_bp = Blueprint('graph', __name__)

@graph_bp.route('/api/v1/sleep/graph', methods=['POST'])
def generate_sleep_graph():
    """
    Genera una gráfica basada en los datos recibidos y devuelve la imagen.
    """
    data = request.json
    user_uuid = data.get('user_uuid')
    current_hours = data.get('current_hours')
    prediction = data.get('prediction')

    if not user_uuid or not current_hours or not prediction:
        return {"error": "Faltan campos requeridos: 'user_uuid', 'current_hours' y 'prediction'"}, 400

    try:
        # Obtener datos de la predicción
        days = prediction["days"]
        predicted_hours = prediction["predicted_hours"]
        lower_bound = prediction["lower_bound"]
        upper_bound = prediction["upper_bound"]

        # Crear el gráfico
        plt.figure(figsize=(10, 6))

        # Semana actual
        plt.plot(
            days,
            current_hours,
            linestyle='-',
            marker='o',
            color='blue',
            label='Semana Actual (Horas)'
        )

        # Predicciones
        plt.plot(
            days,
            predicted_hours,
            linestyle='--',
            marker='d',
            color='green',
            label='Predicción (Horas)'
        )

        # Intervalo de confianza
        plt.fill_between(
            days,
            lower_bound,
            upper_bound,
            color='lightgreen',
            alpha=0.5,
            label='Intervalo de Confianza'
        )

        # Personalización del gráfico
        plt.title(f"Predicción de Horas de Sueño - Usuario: {user_uuid}", fontsize=14)
        plt.xlabel("Días de la Semana", fontsize=12)
        plt.ylabel("Horas de Sueño", fontsize=12)
        plt.legend(fontsize=10)
        plt.grid(alpha=0.3)

        # Convertir gráfico a imagen binaria
        img = io.BytesIO()
        plt.savefig(img, format='png')
        img.seek(0)
        plt.close()

        # Devolver la imagen como respuesta
        response = make_response(img.read())
        response.headers.set('Content-Type', 'image/png')
        response.headers.set(
            'Content-Disposition',
            'inline',
            filename=f'graph_{user_uuid}.png'
        )
        return response

    except Exception as e:
        return {"error": f"No se pudo generar la gráfica: {str(e)}"}, 500
