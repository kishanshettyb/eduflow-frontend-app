import axios from 'axios';
import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const getstudentTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/students/schools/${schoolId}`, {
    responseType: 'blob'
  });
};
export const getenrollmentTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/enrollments/template-download/schools/${schoolId}`, {
    responseType: 'blob'
  });
};

export const getexamTemplate = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get(
    `exports/template/exam/schools/${schoolId}/years/${academicYearId}`,
    {
      responseType: 'blob'
    }
  );
};

export const getstaffTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/staffs/schools/${schoolId}`, {
    responseType: 'blob'
  });
};

export const getsubjectTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/subjects/schools/${schoolId}`, {
    responseType: 'blob'
  });
};
export const getqualificationTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/qualifications/schools/${schoolId}`, {
    responseType: 'blob'
  });
};

export const getworkExperienceTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/workExperiences/schools/${schoolId}`, {
    responseType: 'blob'
  });
};

export const getstaffAttendanceTemplate = async (schoolId: number) => {
  return await axiosInstance.get(`exports/template/staff-attendance/schools/${schoolId}`, {
    responseType: 'blob'
  });
};

export const getstandardSubjectTemplate = async (schoolId: number) => {
  return await axiosInstance.get(
    `exports/standard-subject/template-download/schools/${schoolId}`,

    {
      responseType: 'blob'
    }
  );
};

export const getstandardTemplate = async (schoolId: number, academicYearId: number) => {
  return await axiosInstance.get(
    `exports/template/standard/schools/${schoolId}/years/${academicYearId}`,
    {
      responseType: 'blob'
    }
  );
};
