import { UserRole } from './user.model';

export interface AuthTokenPayload {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  iat: number; // issued-at (ms)
}

