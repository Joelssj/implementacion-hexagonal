// src/application/ListCommentsUseCase.ts
import { CommentRepository } from "../domain/CommentRepository";

export class ListCommentsUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async listAll(): Promise<any[]> {
    return await this.commentRepository.getAllComments();
  }

  async listByUser(userId: string): Promise<any[]> {
    return await this.commentRepository.getCommentsByUser(userId);
  }
}
