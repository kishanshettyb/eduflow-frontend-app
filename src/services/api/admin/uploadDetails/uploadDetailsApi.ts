import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getAllUploadDetails = async (schoolId: number, uploadType: number) => {
  return await axiosInstance.get(`upload-summary/schools/${schoolId}/uploadTypes/${uploadType}`);
};
