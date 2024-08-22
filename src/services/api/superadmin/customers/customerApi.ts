import axios from 'axios';
import { Customer } from '@/types/superadmin/customerTypes';
import Cookies from 'js-cookie';

const token = Cookies.get('token');

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

export const getAllCustomers = async () => {
  return await axiosInstance.get<Customer[]>('customers');
};

export const getSingleCustomer = async (id: number) => {
  return await axiosInstance.get<Customer[]>(`customers/${id}`);
};

export const createCustomer = async (data: Customer) => {
  await axiosInstance.post('customers', data);
};

export const updateCustomer = async (data: Customer) => {
  await axiosInstance.put('customers', data);
};
