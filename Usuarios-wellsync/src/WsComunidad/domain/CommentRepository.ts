// src/domain/CommentRepository.ts
import { Comment } from "./Comment";

export interface CommentRepository {
  createComment(comment: Comment): Promise<void>;
  getAllComments(): Promise<Comment[]>;
  getCommentsByUser(userId: string): Promise<Comment[]>;
}
