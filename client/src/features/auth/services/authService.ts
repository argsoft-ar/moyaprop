import { api } from '../../../services/api';
import { User } from '../context/AuthContext';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    user: User;
  };
}

export const authService = {
  login: async (email: string, password: string): Promise<{ token: string; user: User }> => {
    const response = await api.post<LoginResponse>('/auth/login', { email, password });
    return response.data.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<{ success: boolean; data: User }>('/auth/me');
    return response.data.data;
  }
};
