import express from 'express';
import { DiaryController } from '../controller/DiaryController';
import { MongoDiaryRepository } from '../adapter/MongoDiaryRepository';
import { SaveDiaryUseCase } from '../../application/SaveDiaryUseCase';
import { uploadSingleImage } from '../middleware/MulterMiddleware';
import { GetAllDiariesUseCase } from '../../application/GetAllDiariesUseCase';

import { GetAllDiariesController } from '../controller/GetAllDiariesController';


const router = express.Router();
const diaryRepository = new MongoDiaryRepository();
const saveDiaryUseCase = new SaveDiaryUseCase(diaryRepository);
const diaryController = new DiaryController(saveDiaryUseCase);
const getAllDiariesUseCase = new GetAllDiariesUseCase(diaryRepository);
const getAllDiariesController = new GetAllDiariesController(getAllDiariesUseCase);

// Ruta para guardar un diario
router.post('/create', uploadSingleImage, (req, res) => diaryController.saveDiary(req, res));
router.get('/get', (req, res) => getAllDiariesController.handle(req, res));


export default router;
