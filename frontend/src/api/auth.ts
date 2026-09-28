import { apiClient } from './client';
import { LoginCredentials, RegisterCredentials, AuthResponse, User } from '../types';

export const authApi = {
  login: (credentials: LoginCredentials) => 
    apiClient.post<AuthResponse>('/api/auth/login', credentials),
    
  register: (credentials: RegisterCredentials) => 
    apiClient.post<User>('/api/auth/register', credentials),
    
  getMe: () => 
    apiClient.get<User>('/api/auth/me'),
};
