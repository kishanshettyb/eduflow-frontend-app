import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllResourcesMenu = async (schoolId: number, roleName: string) => {
  return await axiosInstance.get(`features/schools/${schoolId}/roleName/${roleName}`);
};
