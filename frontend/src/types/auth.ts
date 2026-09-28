export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}
