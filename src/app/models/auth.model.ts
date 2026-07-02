import { Role } from './nav-item';

export interface LoginRequest {
  readonly userName: string;
  readonly password: string;
}

export interface RefreshRequest {
  readonly refreshToken: string;
}

export interface TokenResponse {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly accessTokenExpiresAt: string;
  readonly tokenType: string;
}

/** GET /api/auth/me — role comes back as a string that maps 1:1 to the frontend Role. */
export interface MeResponse {
  readonly id: string;
  readonly userName: string;
  readonly email: string;
  readonly fullName: string;
  readonly employeeCode: string;
  readonly role: Role;
  readonly departmentId: string | null;
  readonly departmentName: string | null;
}
