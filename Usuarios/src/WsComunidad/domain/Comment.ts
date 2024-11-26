// src/domain/Comment.ts
export class Comment {
    constructor(
      public id: string,
      public userId: string,
      public content: string,
      public createdAt: Date = new Date()
    ) {}
  }
  