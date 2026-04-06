import axiosInstance from './axios';
import { Reservation } from '@/types';

export const reservationsApi = {
  list: async (): Promise<Reservation[]> => {
    const { data } = await axiosInstance.get('reservations/');
    return data;
  },

  create: async (itemId: number): Promise<Reservation> => {
    const { data } = await axiosInstance.post('reservations/', { item_id: itemId });
    return data;
  },

  accept: async (id: number): Promise<Reservation> => {
    const { data } = await axiosInstance.post(`reservations/${id}/accept`);
    return data;
  },

  reject: async (id: number): Promise<Reservation> => {
    const { data } = await axiosInstance.post(`reservations/${id}/reject`);
    return data;
  },

  cancel: async (id: number): Promise<Reservation> => {
    const { data } = await axiosInstance.post(`reservations/${id}/cancel`);
    return data;
  },
};
