import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getbulkerror = async (schoolId: number, uploadSummaryId: number) => {
  return await axiosInstance.get(`upload-error/schools/${schoolId}/summery/${uploadSummaryId}`);
};
