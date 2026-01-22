import {
  HttpErrorResponse,
  HttpEvent,
  HttpInterceptorFn,
  HttpResponse,
} from '@angular/common/http';
import { Observable, delay, of, throwError } from 'rxjs';
import { AuthTokenPayload } from '../models/auth-token.model';
import { Comment } from '../models/comment.model';
import { Post } from '../models/post.model';
import { User, UserRole } from '../models/user.model';

type DbUser = User & { password: string };
type Db = {
  users: DbUser[];
  posts: Post[];
  comments: Comment[];
};

const DB_KEY = 'sportblog_db_v1';

function nowIso(): string {
  return new Date().toISOString();
}

function makeId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2)}`;
}

function seedDb(): Db {
  const admin: DbUser = {
    id: 'u_admin',
    name: 'Admin',
    email: 'admin@sportblog.com',
    role: 'admin',
    password: 'admin123',
  };
  const user: DbUser = {
    id: 'u_user',
    name: 'User',
    email: 'user@sportblog.com',
    role: 'user',
    password: 'user123',
  };

  const posts: Post[] = [
    {
      id: 'p_1',
      title: 'Matchday Recap: Late Winner Seals the Points',
      category: 'Soccer',
      image: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&w=1400&q=60',
      content:
        'A fast-paced recap of the weekend: tactical adjustments, key injuries, and the moment of brilliance that decided it all. Here are the turning points you need to know.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_2',
      title: 'Training: 5 Finishing Drills You Can Do Solo',
      category: 'Training',
      image: 'https://images.unsplash.com/photo-1522778526097-ce0a22ceb253?auto=format&fit=crop&w=1400&q=60',
      content:
        'Finishing is a skill. This post covers 5 simple drills you can do in 20 minutes: first-touch shots, one-touch volleys, weak-foot reps, cones + strike, and composure practice.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
    {
      id: 'p_3',
      title: 'Tactics: How to Press Without Getting Played Through',
      category: 'Tactics',
      image: 'https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=1400&q=60',
      content:
        'A beginner-friendly breakdown of pressing: triggers, angles, cover shadows, and why the back line matters. We also share 3 common mistakes teams make when they press.',
      authorId: admin.id,
      authorName: admin.name,
      createdAt: nowIso(),
    },
  ];

  const comments: Comment[] = [
    {
      id: 'c_1',
      postId: 'p_1',
      userId: user.id,
      userName: user.name,
      text: 'Loved the recap — that final drive was unreal.',
      createdAt: nowIso(),
    },
  ];

  return { users: [admin, user], posts, comments };
}

function loadDb(): Db {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const seeded = seedDb();
      localStorage.setItem(DB_KEY, JSON.stringify(seeded));
      return seeded;
    }
    return JSON.parse(raw) as Db;
  } catch {
    const seeded = seedDb();
    localStorage.setItem(DB_KEY, JSON.stringify(seeded));
    return seeded;
  }
}

function saveDb(db: Db): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function decodeToken(token: string): AuthTokenPayload | null {
  try {
    return JSON.parse(atob(token)) as AuthTokenPayload;
  } catch {
    return null;
  }
}

function bearerPayload(authorization: string | null): AuthTokenPayload | null {
  if (!authorization) return null;
  const m = authorization.match(/^Bearer\s+(.+)$/i);
  if (!m) return null;
  return decodeToken(m[1]);
}

function tokenForUser(u: User): string {
  const payload: AuthTokenPayload = {
    userId: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    iat: Date.now(),
  };
  return btoa(JSON.stringify(payload));
}

function ok<T>(body: T, status = 200): HttpResponse<T> {
  return new HttpResponse({ status, body });
}

function error(status: number, message: string): Observable<never> {
  return throwError(
    () =>
      new HttpErrorResponse({
        status,
        statusText: message,
        error: { message },
      }),
  );
}

function withoutPassword(u: DbUser): User {
  const { password, ...rest } = u;
  void password;
  return rest;
}

function isAdminRole(role: UserRole | undefined): boolean {
  return role === 'admin';
}

export const mockApiInterceptor: HttpInterceptorFn = (req, next): Observable<HttpEvent<unknown>> => {
  if (!req.url.startsWith('/api/')) return next(req);

  const db = loadDb();
  const method = req.method.toUpperCase();
  const auth = bearerPayload(req.headers.get('Authorization'));

  // Best-effort JSON parsing
  const body: any = req.body ?? {};

  // Parse URL (works even if relative)
  const url = new URL(req.url, 'http://localhost');
  const path = url.pathname; // e.g. /api/posts/123

  // AUTH
  if (method === 'POST' && path === '/api/auth/login') {
    const { email, password } = body as { email?: string; password?: string };
    const found = db.users.find((u) => u.email.toLowerCase() === String(email ?? '').toLowerCase());
    if (!found || found.password !== password) {
      return error(401, 'Invalid email or password');
    }
    const user = withoutPassword(found);
    const token = tokenForUser(user);
    return of(ok({ token, user })).pipe(delay(200));
  }

  if (method === 'POST' && path === '/api/auth/register') {
    const { name, email, password } = body as { name?: string; email?: string; password?: string };
    if (!name || !email || !password) return error(400, 'Missing required fields');
    const exists = db.users.some((u) => u.email.toLowerCase() === String(email).toLowerCase());
    if (exists) return error(409, 'Email already exists');

    const newUser: DbUser = {
      id: makeId('u'),
      name: String(name),
      email: String(email),
      role: 'user',
      password: String(password),
    };
    db.users.push(newUser);
    saveDb(db);

    const user = withoutPassword(newUser);
    const token = tokenForUser(user);
    return of(ok({ token, user }, 201)).pipe(delay(200));
  }

  // POSTS
  if (method === 'GET' && path === '/api/posts') {
    const posts = [...db.posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    return of(ok(posts)).pipe(delay(150));
  }

  const postIdMatch = path.match(/^\/api\/posts\/(.+)$/);
  if (method === 'GET' && postIdMatch) {
    const id = decodeURIComponent(postIdMatch[1]);
    const post = db.posts.find((p) => p.id === id);
    if (!post) return error(404, 'Post not found');
    return of(ok(post)).pipe(delay(150));
  }

  if (method === 'POST' && path === '/api/posts') {
    if (!isAdminRole(auth?.role)) return error(403, 'Admin only');
    const { title, content, image, category } = body as Partial<Post>;
    if (!title || !content || !image || !category) return error(400, 'Missing required fields');

    const post: Post = {
      id: makeId('p'),
      title: String(title),
      content: String(content),
      image: String(image),
      category: String(category),
      authorId: auth!.userId,
      authorName: auth!.name,
      createdAt: nowIso(),
    };
    db.posts.unshift(post);
    saveDb(db);
    return of(ok(post, 201)).pipe(delay(200));
  }

  if (method === 'PUT' && postIdMatch) {
    if (!isAdminRole(auth?.role)) return error(403, 'Admin only');
    const id = decodeURIComponent(postIdMatch[1]);
    const idx = db.posts.findIndex((p) => p.id === id);
    if (idx < 0) return error(404, 'Post not found');

    const existing = db.posts[idx];
    const nextPost: Post = {
      ...existing,
      title: body.title ?? existing.title,
      content: body.content ?? existing.content,
      image: body.image ?? existing.image,
      category: body.category ?? existing.category,
    };
    db.posts[idx] = nextPost;
    saveDb(db);
    return of(ok(nextPost)).pipe(delay(200));
  }

  if (method === 'DELETE' && postIdMatch) {
    if (!isAdminRole(auth?.role)) return error(403, 'Admin only');
    const id = decodeURIComponent(postIdMatch[1]);
    const before = db.posts.length;
    db.posts = db.posts.filter((p) => p.id !== id);
    db.comments = db.comments.filter((c) => c.postId !== id);
    if (db.posts.length === before) return error(404, 'Post not found');
    saveDb(db);
    return of(ok(undefined as any, 204)).pipe(delay(150));
  }

  // COMMENTS
  if (method === 'GET' && path === '/api/comments') {
    const postId = url.searchParams.get('postId');
    if (!postId) return error(400, 'postId is required');
    const comments = db.comments
      .filter((c) => c.postId === postId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    return of(ok(comments)).pipe(delay(150));
  }

  if (method === 'POST' && path === '/api/comments') {
    if (!auth) return error(401, 'Login required');
    const { postId, text } = body as { postId?: string; text?: string };
    if (!postId || !text) return error(400, 'Missing required fields');
    const postExists = db.posts.some((p) => p.id === postId);
    if (!postExists) return error(404, 'Post not found');

    const comment: Comment = {
      id: makeId('c'),
      postId: String(postId),
      userId: auth.userId,
      userName: auth.name,
      text: String(text),
      createdAt: nowIso(),
    };
    db.comments.push(comment);
    saveDb(db);
    return of(ok(comment, 201)).pipe(delay(200));
  }

  return error(404, 'Unknown API route');
};

