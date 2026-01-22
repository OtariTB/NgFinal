import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../models/user.model';

type LoginRequest = { email: string; password: string };
type RegisterRequest = { name: string; email: string; password: string };
type AuthResponse = { token: string; user: User };

const LS_TOKEN_KEY = 'sportblog_token';
const LS_USER_KEY = 'sportblog_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<User | null>(this.readStoredUser());
  readonly user$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  get currentUser(): User | null {
    return this.userSubject.value;
  }

  get isLoggedIn(): boolean {
    return !!this.userSubject.value && !!this.getToken();
  }

  get isAdmin(): boolean {
    return this.userSubject.value?.role === 'admin';
  }

  login(req: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/login', req).pipe(
      tap((res) => this.persistAuth(res)),
    );
  }

  register(req: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>('/api/auth/register', req).pipe(
      tap((res) => this.persistAuth(res)),
    );
  }

  logout(): void {
    localStorage.removeItem(LS_TOKEN_KEY);
    localStorage.removeItem(LS_USER_KEY);
    this.userSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem(LS_TOKEN_KEY);
  }

  private persistAuth(res: AuthResponse): void {
    localStorage.setItem(LS_TOKEN_KEY, res.token);
    localStorage.setItem(LS_USER_KEY, JSON.stringify(res.user));
    this.userSubject.next(res.user);
  }

  private readStoredUser(): User | null {
    try {
      const raw = localStorage.getItem(LS_USER_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  }
}

