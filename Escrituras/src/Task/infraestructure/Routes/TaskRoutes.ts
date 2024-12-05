/*import express from 'express';
import { MongoTaskRepository } from '../adapters/MongoTaskRepository';
import { SaveTaskUseCase } from '../../application/SaveTaskUseCase';
import { TaskController } from '../controller/TaskController';

const router = express.Router();

// Repositorios
const taskRepository = new MongoTaskRepository();

// Casos de uso
const saveTaskUseCase = new SaveTaskUseCase(taskRepository);

// Controladores
const taskController = new TaskController(saveTaskUseCase);

// Rutas
router.post('/create', (req, res) => taskController.saveTask(req, res));
router.put('/update/:id', (req, res) => taskController.updateTaskStatus(req, res));

export default router;*/




import express from 'express';
import { TaskController } from '../controller/TaskController';
import { GetTaskTimelineController } from '../controller/GetTaskController';
import { MongoTaskRepository } from '../adapters/MongoTaskRepository';
import { SaveTaskUseCase } from '../../application/SaveTaskUseCase';
import { GetTaskTimelineUseCase } from '../../application/GetTaskTimelineUseCase';
import { GetAllTasksUseCase } from '../../application/GetAllTasksUseCase';
import { GetAllTasksController } from '../controller/GetAllTasksController';
import { GetTasksByCompletionStatusUseCase } from '../../application/GetTasksByCompletionStatusUseCase';
import { GetTasksByCompletionStatusController } from '../controller/GetTasksByCompletionStatusController';


const router = express.Router();

// Repositorio común
const taskRepository = new MongoTaskRepository();

// Casos de uso
const saveTaskUseCase = new SaveTaskUseCase(taskRepository);
const getTaskTimelineUseCase = new GetTaskTimelineUseCase(taskRepository);
const getTasksByCompletionStatusUseCase = new GetTasksByCompletionStatusUseCase(taskRepository);

const getAllTasksUseCase = new GetAllTasksUseCase(taskRepository);
const getAllTasksController = new GetAllTasksController(getAllTasksUseCase);

// Controladores
const taskController = new TaskController(saveTaskUseCase);
const getTaskTimelineController = new GetTaskTimelineController(getTaskTimelineUseCase);
const getTasksByCompletionStatusController = new GetTasksByCompletionStatusController(getTasksByCompletionStatusUseCase);

// Rutas
router.post('/create', (req, res) => taskController.saveTask(req, res));
router.put('/update/:id', (req, res) => taskController.updateTaskStatus(req, res));
router.get('/get/grafica', (req, res) => getTaskTimelineController.handle(req, res));
router.get('/get', (req, res) => getAllTasksController.handle(req, res));
//router.get('/get/tareas', (req, res) => getTasksByCompletionStatusController.handle(req, res));
router.get('/get/tareas/:userUuid', (req, res) => getTasksByCompletionStatusController.handle(req, res));

export default router;
