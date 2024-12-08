

Integrantes del equipo:
221204 - Joel de Jesus Lopez Ruiz
221199 - Carlos Eduardo Gumeta Navarro
221198 - Jesus Alejandro Guillen Luna

Cada uno de estas carpetas es una API que funciona de manera individual, con su propio servidor y configuración. Cada API escucha en un puerto específico, lo que permite su operación independiente y facilita su integración en un sistema modular.

La API Gateway actúa como un punto de entrada unificado al sistema, gestionando y direccionando las solicitudes entrantes a la API correspondiente según el servicio requerido. Por ejemplo, si tienes una API de usuarios en el puerto 3001 y otra de pagos en el puerto 3002, la API Gateway se encarga de enrutar las solicitudes al puerto adecuado, garantizando una experiencia transparente para el cliente. Además, permite añadir capas adicionales como autenticación, balanceo de carga y transformación de datos.

Cada API tiene su propio servidor, lo que significa que puedes ejecutarlas y administrarlas de forma separada. Para ejecutar la API de usuarios, primero debes instalar las siguientes dependencias:


# Instalar las dependencias necesarias
npm install

para ejecutar cada una de las apis se utiliza
npm run start:dev

Para poner en funcionamiento todo, tienes que correr primero el apigateway, ya que todas las apis utilizan su puerto para funcionar, cada uno de esos puertos esta en el archivo .env de la apigateway.
Debes tener conexion a mongodb, postgrest y mysql.

Para que funcionen los eventos, tiene que tener corriendo tu rabbit en una instancia Ec2.




#Dependencias que se deben instalar

npm install @aws-sdk/client-s3@^3.606.0
npm install @aws-sdk/lib-storage@^3.606.0
npm install @types/amqplib@^0.10.5
npm install @types/firebase@^3.2.1
npm install @types/jsonwebtoken@^9.0.5
npm install amqplib@^0.10.4
npm install aws-sdk@^2.1651.0
npm install cors@^2.8.5
npm install dotenv@^16.4.5
npm install express@^4.18.2
npm install firebase@^10.7.1
npm install jsonwebtoken@^9.0.2
npm install mercadopago@^1.5.1
npm install mongodb@^6.7.0
npm install mongoose@^8.4.3
npm install multer@^1.4.5-lts.1
npm install mysql2@^3.6.5
npm install nodemailer@^6.9.15
npm install pg@^8.13.1
npm install puppeteer@^23.5.3
npm install qrcode-terminal@^0.12.0
npm install signale@^1.4.0
npm install twilio@^5.3.4
npm install uuid@^10.0.0
npm install whatsapp-web.js@^1.26.0


Descripción de cada una:
@aws-sdk/client-s3: Cliente para interactuar con Amazon S3 para almacenar y recuperar objetos.
@aws-sdk/lib-storage: Biblioteca para simplificar la gestión de cargas y descargas en S3.
@types/amqplib: Definiciones de tipo TypeScript para trabajar con AMQP (Advanced Message Queuing Protocol).
@types/firebase: Tipos para usar Firebase con TypeScript.
@types/jsonwebtoken: Tipos de TypeScript para trabajar con JWT (tokens JSON Web).
amqplib: Cliente para AMQP que permite la conexión con brokers como RabbitMQ.
aws-sdk: Biblioteca para interactuar con los servicios de Amazon AWS.
cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing) en aplicaciones Express.
dotenv: Carga variables de entorno desde un archivo .env a process.env.
express: Framework minimalista para crear servidores y aplicaciones web.
firebase: Biblioteca para trabajar con los servicios de Firebase, como autenticación y bases de datos.
jsonwebtoken: Biblioteca para crear, firmar y verificar JWT.
mercadopago: SDK para integrar pagos de Mercado Pago.
mongodb: Controlador para trabajar con bases de datos MongoDB.
mongoose: ODM para MongoDB, facilita el modelado y la validación de datos.
multer: Middleware para manejar archivos en solicitudes HTTP.
mysql2: Cliente para interactuar con bases de datos MySQL.
nodemailer: Biblioteca para enviar correos electrónicos desde Node.js.
pg: Cliente para interactuar con bases de datos PostgreSQL.
puppeteer: Controlador para automatizar navegadores web como Chrome.
qrcode-terminal: Genera códigos QR para la terminal.
signale: Herramienta para simplificar el registro (logging) en consola.
twilio: Biblioteca para integrar servicios de comunicación de Twilio (SMS, llamadas, etc.).
uuid: Genera identificadores únicos universales (UUIDs).
whatsapp-web.js: Biblioteca para interactuar con WhatsApp Web desde Node.js.



