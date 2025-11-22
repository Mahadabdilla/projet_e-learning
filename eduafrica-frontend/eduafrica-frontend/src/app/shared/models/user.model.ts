export enum Role {
  APPRENANT = 'APPRENANT',
  FORMATEUR = 'FORMATEUR',
  MENTOR = 'MENTOR',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  role: Role;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  password: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
