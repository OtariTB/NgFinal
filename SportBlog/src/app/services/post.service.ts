import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post } from '../models/post.model';

export type CreatePostRequest = Pick<Post, 'title' | 'content' | 'image' | 'category'>;
export type UpdatePostRequest = Partial<CreatePostRequest>;

@Injectable({ providedIn: 'root' })
export class PostService {
  constructor(private readonly http: HttpClient) {}

  getPosts(): Observable<Post[]> {
    return this.http.get<Post[]>('/api/posts');
  }

  getPostsByCategory(category: string): Observable<Post[]> {
    return this.http.get<Post[]>(`/api/posts?category=${encodeURIComponent(category)}`);
  }

  getPostsByAuthor(authorId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`/api/posts?authorId=${encodeURIComponent(authorId)}`);
  }

  getPost(id: string): Observable<Post> {
    return this.http.get<Post>(`/api/posts/${encodeURIComponent(id)}`);
  }

  createPost(req: CreatePostRequest): Observable<Post> {
    return this.http.post<Post>('/api/posts', req);
  }

  updatePost(id: string, req: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(`/api/posts/${encodeURIComponent(id)}`, req);
  }

  deletePost(id: string): Observable<void> {
    return this.http.delete<void>(`/api/posts/${encodeURIComponent(id)}`);
  }
}

