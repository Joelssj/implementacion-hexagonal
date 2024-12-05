# from Grafica_sentimiento.routes import create_app as create_app_sentimiento
# from Grafica_sueño.routes import create_app as create_app_sueno

# def create_app():
#     # Crear ambas aplicaciones Flask y unirlas
#     app_sentimiento = create_app_sentimiento()
#     app_sueno = create_app_sueno()

#     # Combinar ambas aplicaciones en una sola (se usará Blueprint)
#     from flask import Flask

#     app = Flask(__name__)

#     # Registrar Blueprints de cada entidad
#     app.register_blueprint(app_sentimiento, url_prefix='/emociones')
#     app.register_blueprint(app_sueno, url_prefix='/sueno')

#     return app

# if __name__ == "__main__":
#     app = create_app()  # Crear la aplicación unificada
#     app.run(debug=True, host='0.0.0.0', port=5000)














from Grafica_sentimiento.routes import create_app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=5000)
