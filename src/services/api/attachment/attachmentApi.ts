import { Attachmnet } from '@/types/attachmnetTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});

export const viewAttachment = async (schoolId: number, attachmentId: number) => {
  const response = await axiosInstance.get<Attachmnet[]>(
    `attachments/schools/${schoolId}/attachments/${attachmentId}/view`,
    {
      responseType: 'blob'
    }
  );

  if (response.status !== 200) {
    throw new Error('Error fetching profile image');
  }

  const blob = response.data;
  return URL.createObjectURL(blob);
};

export const downloadAttachment = async (schoolId: number, attachmentId: number) => {
  const response = await axiosInstance.get<Blob>(
    `attachments/schools/${schoolId}/attachments/${attachmentId}/download`,
    {
      responseType: 'blob'
    }
  );

  if (response.status !== 200) {
    throw new Error('Error fetching attachment');
  }

  return URL.createObjectURL(response.data);
};

export const updateStudentAttachment = async (
  schoolId: number,
  studentId: number,
  formData: FormData
) => {
  return await axiosInstance.put(
    `students/schools/${schoolId}/students/${studentId}/deleteAttachment/false`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const updateAttachmentProfile = async (
  schoolId: number,
  staffId: number,
  formData: FormData
) => {
  return await axiosInstance.put(
    `staffs/schools/${schoolId}/staffs/${staffId}/updatePhoto`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }
  );
};

export const getPDFPaymentDetails = async (
  schoolId: number,
  academicYearId: number,
  enrollmentId: number,
  feePaymentId: number
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `fee-payments/generate-pdf/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}/feePayments/${feePaymentId}`,
    { responseType: 'blob' } // Specify response type as blob to handle binary data
  );
  if (response.status !== 200) {
    throw new Error('Error fetching profile image');
  }

  const blob = response.data;
  return URL.createObjectURL(blob);
};
