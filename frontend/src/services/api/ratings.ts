import axiosInstance from './axios';

export const ratingsApi = {
  create: async (ratingData: any) => {
    const { data } = await axiosInstance.post('ratings/', ratingData);
    return data;
  },
};
