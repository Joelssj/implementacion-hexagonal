

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

1. npm install @aws-sdk/client-s3@^3.606.0
2. npm install @aws-sdk/lib-storage@^3.606.0
3. npm install @types/amqplib@^0.10.5
4. npm install @types/firebase@^3.2.1
5. npm install @types/jsonwebtoken@^9.0.5
6. npm install amqplib@^0.10.4
7. npm install aws-sdk@^2.1651.0
8. npm install cors@^2.8.5
9. npm install dotenv@^16.4.5
10. npm install express@^4.18.2
11. npm install firebase@^10.7.1
12. npm install jsonwebtoken@^9.0.2
13. npm install mercadopago@^1.5.1
14. npm install mongodb@^6.7.0
15. npm install mongoose@^8.4.3
16. npm install multer@^1.4.5-lts.1
17. npm install mysql2@^3.6.5
18. npm install nodemailer@^6.9.15
19. npm install pg@^8.13.1
20. npm install puppeteer@^23.5.3
21. npm install qrcode-terminal@^0.12.0
22. npm install signale@^1.4.0
23. npm install twilio@^5.3.4
24. npm install uuid@^10.0.0
25. npm install whatsapp-web.js@^1.26.0


Descripción de cada una:
1. @aws-sdk/client-s3: Cliente para interactuar con Amazon S3 para almacenar y recuperar objetos.
2. @aws-sdk/lib-storage: Biblioteca para simplificar la gestión de cargas y descargas en S3.
3. @types/amqplib: Definiciones de tipo TypeScript para trabajar con AMQP (Advanced Message Queuing Protocol).
4. @types/firebase: Tipos para usar Firebase con TypeScript.
5. @types/jsonwebtoken: Tipos de TypeScript para trabajar con JWT (tokens JSON Web).
6. amqplib: Cliente para AMQP que permite la conexión con brokers como RabbitMQ.
7. aws-sdk: Biblioteca para interactuar con los servicios de Amazon AWS.
8. cors: Middleware para habilitar CORS (Cross-Origin Resource Sharing) en aplicaciones Express.
9. dotenv: Carga variables de entorno desde un archivo .env a process.env.
10. express: Framework minimalista para crear servidores y aplicaciones web.
11. firebase: Biblioteca para trabajar con los servicios de Firebase, como autenticación y bases de datos.
12. jsonwebtoken: Biblioteca para crear, firmar y verificar JWT.
13. mercadopago: SDK para integrar pagos de Mercado Pago.
14. mongodb: Controlador para trabajar con bases de datos MongoDB.
15. mongoose: ODM para MongoDB, facilita el modelado y la validación de datos.
16. multer: Middleware para manejar archivos en solicitudes HTTP.
17. mysql2: Cliente para interactuar con bases de datos MySQL.
18. nodemailer: Biblioteca para enviar correos electrónicos desde Node.js.
19. pg: Cliente para interactuar con bases de datos PostgreSQL.
20. puppeteer: Controlador para automatizar navegadores web como Chrome.
21. qrcode-terminal: Genera códigos QR para la terminal.
22. signale: Herramienta para simplificar el registro (logging) en consola.
23. twilio: Biblioteca para integrar servicios de comunicación de Twilio (SMS, llamadas, etc.).
24. uuid: Genera identificadores únicos universales (UUIDs).
25. whatsapp-web.js: Biblioteca para interactuar con WhatsApp Web desde Node.js.



