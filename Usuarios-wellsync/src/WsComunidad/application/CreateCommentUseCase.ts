// src/application/CreateCommentUseCase.ts
import { CommentRepository } from "../domain/CommentRepository";
import { Comment } from "../domain/Comment";
import { v4 as uuidv4 } from "uuid";

export class CreateCommentUseCase {
  constructor(private readonly commentRepository: CommentRepository) {}

  async execute(userId: string, content: string): Promise<void> {
    const comment = new Comment(uuidv4(), userId, content);
    await this.commentRepository.createComment(comment);
  }
}
