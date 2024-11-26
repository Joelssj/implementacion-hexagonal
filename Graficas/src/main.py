import sys
import os

# Agregar la carpeta raíz al PYTHONPATH dinámicamente
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

import threading
from flask import Flask, jsonify
from Grafica_Sleep.infraestructure.consumidor import start_rabbitmq_consumer
from Grafica_Sleep.infraestructure.routes.prediction_routes import prediction_bp
from Grafica_Sleep.infraestructure.routes.graph_routes import graph_bp
from Grafica_Sleep.infraestructure.routes.day_routes import day_bp
from Grafica_feeling.infraestructure.routes.feeling_routes import feeling_bp
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Crear la aplicación Flask
app = Flask(__name__)

# Registrar blueprints
app.register_blueprint(prediction_bp)  # Rutas de predicción
app.register_blueprint(graph_bp)       # Rutas para gráficas
app.register_blueprint(day_bp)         # Rutas para emociones diarias
app.register_blueprint(feeling_bp)     # Rutas para sentimientos

@app.route("/")
def index():
    """
    Ruta principal para verificar el estado de la API.
    """
    return jsonify({
        "message": "Bienvenido a la API de predicción de emociones y sentimientos.",
        "status": "running"
    })

def run_flask():
    """
    Inicia la aplicación Flask.
    """
    flask_port = int(os.getenv("FLASK_PORT", 5000))  # Puerto configurado en .env
    app.run(debug=True, port=flask_port, use_reloader=False)

if __name__ == "__main__":
    # Crear hilos para Flask y RabbitMQ
    flask_thread = threading.Thread(target=run_flask)
    rabbitmq_thread = threading.Thread(target=start_rabbitmq_consumer)

    # Iniciar los hilos
    flask_thread.start()
    rabbitmq_thread.start()

    # Esperar a que los hilos terminen
    flask_thread.join()
    rabbitmq_thread.join()
