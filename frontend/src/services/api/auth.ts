import axiosInstance from './axios';
import { User, AuthResponse } from '@/types';

export const authApi = {
  signup: async (userData: any): Promise<User> => {
    const { data } = await axiosInstance.post('/auth/signup', userData);
    return data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const params = new URLSearchParams();
    params.append('username', email);
    params.append('password', password);

    const { data } = await axiosInstance.post('/auth/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return data;
  },

  getMe: async (): Promise<User> => {
    const { data } = await axiosInstance.get('/users/me');
    return data;
  },
};
