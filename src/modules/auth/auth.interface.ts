// src/modules/auth/auth.interface.ts

export type UserRole = 'contributor' | 'maintainer';

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
  role?: UserRole; 
}

export interface ILoginPayload {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role: UserRole; 
  created_at: Date;
  updated_at: Date;
}