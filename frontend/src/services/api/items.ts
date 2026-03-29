import axiosInstance from './axios';
import { Item } from '@/types';

export const itemsApi = {
  list: async (params?: {
    q?: string;
    category_id?: number;
    max_price?: number;
    limit?: number;
    offset?: number;
  }): Promise<Item[]> => {
    const { data } = await axiosInstance.get('/items/', { params });
    return data;
  },

  get: async (id: number): Promise<Item> => {
    const { data } = await axiosInstance.get(`/items/${id}`);
    return data;
  },

  create: async (itemData: any): Promise<Item> => {
    const { data } = await axiosInstance.post('/items/', itemData);
    return data;
  },

  uploadImage: async (itemId: number, file: File): Promise<{ image_url: string }> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await axiosInstance.post(`/items/${itemId}/image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/items/${id}`);
  },
};
