import { Router } from 'express';
import { GatewayController } from '../controller/GatewayController';
import { ControllerNotification } from '../controller/ControllerNotification';
import { ControllerEscritura } from '../controller/ControllerEscritura';
import { ControllerGrafica } from '../controller/ControllerGrafica';
import { PaymentController } from '../controller/PaymentController';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

const router = Router();

// Rutas para los microservicios que usan el puerto 3010

// **GET** Routes (con parámetros de ruta dinámicos como :uuid)
router.get('/api/v1/lead/get/:uuid', GatewayController.forwardToService);
router.get('/api/v1/lead/getall', GatewayController.forwardToService);
router.get('/api/v1/users/get/:uuid', GatewayController.forwardToService);
router.get('/api/v1/comments/get', GatewayController.forwardToService);
router.get('/api/v1/profile/get/:userUuid', GatewayController.forwardToService);

// **POST** Routes (con parámetros de ruta dinámicos como :uuid)
router.post("/api/v1/profile/picture/:userUuid",upload.single("profilePicture"),GatewayController.forwardToService);
router.post('/api/v1/users/create', GatewayController.forwardToService);
router.post('/api/v1/users/login', GatewayController.forwardToService);
router.post('/api/v1/reset/password-reset', GatewayController.forwardToService);
router.post('/api/v1/reset/validate-token', GatewayController.forwardToService);
router.post('/api/v1/reset/reset-password', GatewayController.forwardToService);
router.post('/api/v1/comments/create', GatewayController.forwardToService);
router.post('/api/v1/lead/create', GatewayController.forwardToService);

// **DELETE** Routes (con parámetros de ruta dinámicos como :uuid)
router.delete('/api/v1/lead/:uuid', GatewayController.forwardToService);
router.delete('/api/v1/users/delete/:uuid', GatewayController.forwardToService);

// **PUT** Routes (con parámetros de ruta dinámicos como :uuid)
router.put('/api/v1/lead/update/:uuid', GatewayController.forwardToService);
router.put('/api/v1/users/update/:uuid', GatewayController.forwardToService);

// Rutas para los microservicios que usan el puerto 3001
router.post('/api/v1/token/validar-token', ControllerNotification.forwardToNotificationService);


// Rutas para el microservicio de escritura en el puerto 3003

// POST Routes
router.post('/api/v1/task/create', ControllerEscritura.forwardToEscrituraService);
router.post('/api/v1/diary/create', ControllerEscritura.forwardToEscrituraService);

// PUT Routes
router.put('/api/v1/task/update/:id', ControllerEscritura.forwardToEscrituraService);

// GET Routes
router.get('/api/v1/task/get', ControllerEscritura.forwardToEscrituraService);
router.get('/api/v1/task/get/tareas/:userUuid', ControllerEscritura.forwardToEscrituraService);
router.get('/api/v1/diary/get', ControllerEscritura.forwardToEscrituraService);

//puerto 5000

// Rutas POST para crear emociones
router.post('/api/emociones', ControllerGrafica.forwardToGraficaService);

// Rutas GET para obtener emociones
router.get('/api/emociones', ControllerGrafica.getEmociones);

// Rutas POST para crear pagos
router.post('/api/v1/payment/create', PaymentController.createPayment);


export default router;
















// import { Router } from 'express';
// import { GatewayController } from '../controller/GatewayController';

// const router = Router();

// // Rutas para los microservicios que usan el puerto 3010
// router.post('/api/v1/users/create', GatewayController.forwardToService);
// router.post('/api/v1/users/login', GatewayController.forwardToService);
// router.post('/api/v1/reset/password-reset', GatewayController.forwardToService);
// router.post('/api/v1/reset/validate-token', GatewayController.forwardToService);
// router.post('/api/v1/reset/reset-password', GatewayController.forwardToService);

// router.post('/api/v1/comments/create', GatewayController.forwardToService);
// router.post('/api/v1/lead/create', GatewayController.forwardToService);

// export default router;















// import { Router } from 'express';
// import { GatewayController } from '../controller/GatewayController';

// const router = Router();

// // Maneja la ruta para 'comments/create' correctamente
// // Rutas específicas
// router.post('/api/v1/comments/create', GatewayController.forwardToService);
// router.post('/api/v1/lead/create', GatewayController.forwardToService);


// export default router;
