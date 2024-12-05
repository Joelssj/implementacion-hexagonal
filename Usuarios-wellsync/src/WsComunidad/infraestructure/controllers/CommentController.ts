// src/interfaces/controllers/CommentController.ts
import { Request, Response } from "express";
import { CreateCommentUseCase } from "../../application/CreateCommentUseCase";
import { ListCommentsUseCase } from "../../application/ListCommentsUseCase";

export class CommentController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly listCommentsUseCase: ListCommentsUseCase
  ) {}

  async create(req: Request, res: Response): Promise<Response> {
    const { userId, content } = req.body;

    try {
      await this.createCommentUseCase.execute(userId, content);
      return res.status(201).json({ message: "Comentario creado con éxito" });
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }

  async listAll(req: Request, res: Response): Promise<Response> {
    try {
      const comments = await this.listCommentsUseCase.listAll();
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(500).json({ error: error });
    }
  }

  async listByUser(req: Request, res: Response): Promise<Response> {
    const { userId } = req.params;

    try {
      const comments = await this.listCommentsUseCase.listByUser(userId);
      return res.status(200).json(comments);
    } catch (error) {
      return res.status(400).json({ error: error });
    }
  }
}
