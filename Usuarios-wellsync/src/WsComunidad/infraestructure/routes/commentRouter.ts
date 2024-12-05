// src/infrastructure/routes/commentRouter.ts
import { Router } from "express";
import { CommentController } from "../controllers/CommentController";
import { PgCommentRepository } from "../repositories/PgCommentRepository";
import { CreateCommentUseCase } from "../../application/CreateCommentUseCase";
import { ListCommentsUseCase } from "../../application/ListCommentsUseCase";

// Instancias
const commentRepository = new PgCommentRepository();
const createCommentUseCase = new CreateCommentUseCase(commentRepository);
const listCommentsUseCase = new ListCommentsUseCase(commentRepository);
const commentController = new CommentController(
  createCommentUseCase,
  listCommentsUseCase
);

// Rutas
const router = Router();
router.post("/create", (req, res) => commentController.create(req, res));
router.get("/get", (req, res) => commentController.listAll(req, res));
router.get("/user/:userId", (req, res) => commentController.listByUser(req, res));

export { router as commentRouter };
