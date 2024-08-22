import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'multipart/form-data'
  }
});

export const studentUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(`uploads/schools/${schoolId}/uploadTypes/student`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const enrollmentUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(`uploads/schools/${schoolId}/uploadTypes/enrollment`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const examUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(`uploads/schools/${schoolId}/uploadTypes/exam`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const staffUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(`uploads/schools/${schoolId}/uploadTypes/staff`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};

export const subjectUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(`uploads/schools/${schoolId}/uploadTypes/subject`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
export const qualificationUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(
    `uploads/schools/${schoolId}/uploadTypes/qualification`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const workExperienceUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(
    `uploads/schools/${schoolId}/uploadTypes/workExperience`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const staffAttendanceUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(
    `uploads/schools/${schoolId}/uploadTypes/staffAttendance`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const standardSubjectUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(
    `uploads/schools/${schoolId}/uploadTypes/standardSubject`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const standardUpload = async (schoolId: number, formData: FormData) => {
  return await axiosInstance.post(`uploads/schools/${schoolId}/uploadTypes/standard`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
};
