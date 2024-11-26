import pika
import os
import json
from Grafica_Sleep.infraestructure.db_config import get_predictions_collection
from datetime import datetime

def process_user_uuid(user_uuid):
    """
    Procesa el UUID del usuario recibido desde RabbitMQ.
    """
    try:
        collection = get_predictions_collection()

        # Verificar si ya existe un registro para el user_uuid
        existing_doc = collection.find_one({"user_uuid": user_uuid})
        if existing_doc:
            print(f"✔️ El userUuid {user_uuid} ya existe en la base de datos.")
            return

        # Insertar un nuevo documento con estado pendiente
        document = {
            "user_uuid": user_uuid,
            "status": "pending",  # Estado inicial
            "predictions": None,  # Aún no hay predicciones
            "created_at": datetime.utcnow()
        }
        collection.insert_one(document)
        print(f"✔️ userUuid {user_uuid} registrado con estado 'pending'.")
    except Exception as e:
        print(f"❌ Error al procesar userUuid {user_uuid}: {e}")


def start_rabbitmq_consumer():
    """
    Configura el consumidor de RabbitMQ para escuchar eventos de usuario.
    """
    try:
        rabbitmq_uri = os.getenv("RABBITMQ_URI")
        rabbitmq_queue = os.getenv("RABBITMQ_QUEUE")

        if not rabbitmq_uri or not rabbitmq_queue:
            raise ValueError("❌ RabbitMQ URI o Queue no están configurados en las variables de entorno.")

        # Conectar a RabbitMQ
        params = pika.URLParameters(rabbitmq_uri)
        connection = pika.BlockingConnection(params)
        channel = connection.channel()

        # Declarar la cola
        channel.queue_declare(queue=rabbitmq_queue, durable=True)
        print(f"✔️ Conectado a RabbitMQ. Escuchando en la cola '{rabbitmq_queue}'.")

        # Callback para manejar mensajes
        def callback(ch, method, properties, body):
            print("📥 Mensaje recibido de RabbitMQ:")
            print(body)
            try:
                event = json.loads(body)
                user_uuid = event.get('userUuid')

                if user_uuid:
                    process_user_uuid(user_uuid)
                else:
                    print("❌ Mensaje inválido, faltan campos requeridos.")
                ch.basic_ack(delivery_tag=method.delivery_tag)  # Confirmar recepción del mensaje
            except Exception as e:
                print(f"❌ Error al procesar el mensaje: {e}")
                ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

        # Configurar el consumidor
        channel.basic_consume(queue=rabbitmq_queue, on_message_callback=callback)

        print("📡 Esperando mensajes de RabbitMQ. Presiona CTRL+C para salir.")
        channel.start_consuming()

    except Exception as e:
        print(f"❌ Error al conectar con RabbitMQ: {e}")
