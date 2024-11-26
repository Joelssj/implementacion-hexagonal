import express from 'express';
import { TaskController } from '../controller/TaskController';
import { GetTaskTimelineController } from '../controller/GetTaskController';
import { MongoTaskRepository } from '../adapters/MongoTaskRepository';
import { SaveTaskUseCase } from '../../application/SaveTaskUseCase';
import { GetTaskTimelineUseCase } from '../../application/GetTaskTimelineUseCase';

const router = express.Router();

// Repositorio común
const taskRepository = new MongoTaskRepository();

// Casos de uso
const saveTaskUseCase = new SaveTaskUseCase(taskRepository);
const getTaskTimelineUseCase = new GetTaskTimelineUseCase(taskRepository);

// Controladores
const taskController = new TaskController(saveTaskUseCase);
const getTaskTimelineController = new GetTaskTimelineController(getTaskTimelineUseCase);

// Rutas
router.post('/create', (req, res) => taskController.saveTask(req, res));
router.put('/update/:id', (req, res) => taskController.updateTaskStatus(req, res));
router.get('/get', (req, res) => getTaskTimelineController.handle(req, res));

export default router;
