import express from 'express';
import { MongoStreakRepository } from '../adapter/MongoStreakRepository';
import { MongoTaskRepository } from '../../../Task/infraestructure/adapters/MongoTaskRepository';
import { ManageStreakUseCase } from '../../application/ManageStreakUseCase';
import { StreakController } from '../controller/StreakController';

const router = express.Router();

// Repositorios
const streakRepository = new MongoStreakRepository();
const taskRepository = new MongoTaskRepository();

// Casos de uso
const manageStreakUseCase = new ManageStreakUseCase(streakRepository, taskRepository);

// Controladores
const streakController = new StreakController(manageStreakUseCase);

// Rutas
router.get('/get/:userUuid', (req, res) => streakController.getStreak(req, res));
router.post('/procesar/:userUuid', (req, res) => streakController.processDay(req, res));
router.post('/:userUuid/reset', (req, res) => streakController.resetStreak(req, res));

export default router;

