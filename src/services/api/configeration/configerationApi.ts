import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const createConfigeration = async (data) => {
  await axiosInstance.post('configuration-settings', data);
};
export const updateConfigeration = async (data) => {
  await axiosInstance.put('configuration-settings', data);
};

export const createSchoolSetting = async (data) => {
  await axiosInstance.post('school-setting', data);
};

export const updateSchoolSetting = async (data) => {
  await axiosInstance.put('school-setting', data);
};

export const getSchoolSettingById = async (schoolId: number, schoolSettingId: number) => {
  return await axiosInstance.get(
    `school-setting/schools/${schoolId}/school-setting/${schoolSettingId}`
  );
};

export const getSchoolConfigeration = async (schoolId: number) => {
  return await axiosInstance.get(`configuration-settings/schools/${schoolId}`);
};
