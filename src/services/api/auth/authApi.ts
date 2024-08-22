import axios from 'axios';
import { Login } from '@/types/common/loginTypes';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL
});
export const login = async (data: Login) => {
  return await axiosInstance.post('login', data);
};
