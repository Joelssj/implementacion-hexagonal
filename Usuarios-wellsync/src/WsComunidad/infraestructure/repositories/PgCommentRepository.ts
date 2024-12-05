// src/infrastructure/repositories/PgCommentRepository.ts
import { CommentRepository } from "../../domain/CommentRepository";
import { Comment } from "../../domain/Comment";
import { query } from "../../../database/pg/pg";


export class PgCommentRepository implements CommentRepository {
  async createComment(comment: Comment): Promise<void> {
    const sql = `
      INSERT INTO comments (id, user_id, content, created_at)
      VALUES ($1, $2, $3, $4)
    `;
    const params = [comment.id, comment.userId, comment.content, comment.createdAt];
    await query(sql, params);
  }

  async getAllComments(): Promise<any[]> {
    const sql = `
        SELECT
            comments.id,
            comments.content,
            comments.created_at,
            users.uuid AS user_id,
            leads.first_name AS first_name,
            leads.last_name AS last_name,
            profile_pictures.url AS profile_picture
        FROM comments
        JOIN users ON comments.user_id = users.uuid
        JOIN leads ON users.lead_uuid = leads.uuid
        LEFT JOIN profile_pictures ON users.uuid = profile_pictures.user_uuid
        ORDER BY comments.created_at ASC;
    `;
    const result = await query(sql, []); // Agrega un array vacío como segundo argumento

    if (!result || !result.rows || result.rows.length === 0) {
        return [];
    }

    return result.rows.map((row: any) => ({
        id: row.id,
        content: row.content,
        createdAt: row.created_at,
        userId: row.user_id,
        firstName: row.first_name,
        lastName: row.last_name,
        profilePicture: row.profile_picture,
    }));
}


  async getCommentsByUser(userId: string): Promise<any[]> {
    const sql = `
      SELECT 
        comments.id, 
        comments.content, 
        comments.created_at, 
        users.name AS user_name, 
        users.profile_picture AS user_profile_picture
      FROM comments
      JOIN users ON comments.user_id = users.uuid
      WHERE comments.user_id = $1
      ORDER BY comments.created_at DESC
    `;
    const params = [userId];
    const result = await query(sql, params); // Pasar los parámetros correctamente

    if (!result || !result.rows) {
      return []; // Manejar el caso en que no haya resultados
    }

    return result.rows.map((row: any) => ({
      id: row.id,
      userId,
      content: row.content,
      createdAt: row.created_at,
      userName: row.user_name,
      profilePicture: row.user_profile_picture,
    }));
  }



}
