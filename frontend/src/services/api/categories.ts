import axiosInstance from './axios';
import { Category } from '@/types';

export const categoriesApi = {
  list: async (): Promise<Category[]> => {
    const { data } = await axiosInstance.get('categories/');
    return data;
  },
};
