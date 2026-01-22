import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment } from '../models/comment.model';

type AddCommentRequest = { postId: string; text: string };

@Injectable({ providedIn: 'root' })
export class CommentService {
  constructor(private readonly http: HttpClient) {}

  getCommentsByPost(postId: string): Observable<Comment[]> {
    return this.http.get<Comment[]>(`/api/comments?postId=${encodeURIComponent(postId)}`);
  }

  addComment(postId: string, text: string): Observable<Comment> {
    const req: AddCommentRequest = { postId, text };
    return this.http.post<Comment>('/api/comments', req);
  }
}

