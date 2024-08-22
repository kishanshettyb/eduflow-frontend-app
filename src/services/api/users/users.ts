import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getUsersDetails = async (schoolId: number, userName: string) => {
  return await axiosInstance.get(`/users/schools/${schoolId}/userNames/${userName}`);
};
