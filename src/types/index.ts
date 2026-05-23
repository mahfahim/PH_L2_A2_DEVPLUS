export type UserRole = "contributor" | "maintainer";


export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
    role?: UserRole;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface ResponseData<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any;
}