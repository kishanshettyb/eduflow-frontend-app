import { Enrollment } from '@/types/admin/enrollmentType';
import { FeeComponent } from '@/types/admin/feecomponentTypes';
import { FeeStructure, FeesPayment } from '@/types/admin/feestuctureTypes';
import axios from 'axios';

import Cookies from 'js-cookie';

const token = Cookies.get('token');
const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  headers: {
    Authorization: `Bearer ${token}`
  }
});
export const getAllFeeComponent = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<FeeComponent[]>(
    `fee-components/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const getFeeComponentbyID = async (schoolId: number, feeComponentId: number) => {
  return await axiosInstance.get<FeeComponent[]>(
    `fee-components/schools/${schoolId}/feeComponents/${feeComponentId}`
  );
};
export const createFeeComponent = async (data: FeeComponent) => {
  await axiosInstance.post('fee-components', data);
};

export const updateFeeComponent = async (data: FeeComponent) => {
  await axiosInstance.put('fee-components', data);
};

export const viewFeeComponent = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<FeeComponent[]>(
    `fee-components/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const deleteFeeComponent = async (schoolId: number, feeComponentId: number) => {
  return await axiosInstance.delete(
    `fee-components/schools/${schoolId}/feeComponents/${feeComponentId}`
  );
};

export const getAllFeeStructure = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<FeeStructure[]>(
    `/fee-structures/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const getFeeStructurebyID = async (schoolId: number, feeStructureId: number) => {
  return await axiosInstance.get<FeeStructure[]>(
    `fee-structures/schools/${schoolId}/feeStructures/${feeStructureId}`
  );
};

export const createFeeStructure = async (data: FeeStructure) => {
  await axiosInstance.post('fee-structures', data);
};

export const updateFeeStructure = async (data: FeeStructure) => {
  await axiosInstance.put('fee-structures', data);
};

export const viewFeeStructure = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<FeeStructure[]>(
    `fee-structures/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const deleteFeeStructure = async (schoolId: number, feeStructureId: number) => {
  return await axiosInstance.delete(
    `fee-structures/delete/schools/${schoolId}/feeStructures/${feeStructureId}`
  );
};

export const getAllAssignedFeesPayment = async (
  schoolId: number,
  acedamicyearId: number,
  standardIds: number,
  sectionIds: number
) => {
  return await axiosInstance.get<FeesPayment[]>(
    `/fee-payments/students/${schoolId}/${acedamicyearId}/${standardIds}/${sectionIds}`
  );
};

export const getEnrollmentbyID = async (schoolId: number, acedamicyearId: number) => {
  return await axiosInstance.get<Enrollment[]>(
    `academic-years/schools/${schoolId}/years/${acedamicyearId}`
  );
};

export const getAllEnrollmentFeesPayment = async (
  schoolId: number,
  acedamicyearId: number,
  enrollmentsIds: number
) => {
  return await axiosInstance.get<FeesPayment[]>(
    `/fee-structures/schools/${schoolId}/enrollments/${enrollmentsIds}/years/${acedamicyearId}`
  );
};

export const createFeePayment = async (data: FeesPayment) => {
  return await axiosInstance.post('fee-payments', data);
};

export const updateOnlinePaymentDetails = async (data: FeesPayment) => {
  return await axiosInstance.put('fee-payments/payment-response', data);
};

export const createFeeStructureMapping = async (data) => {
  await axiosInstance.post('fee-structures/assignStandards', data);
};
export const createStudentFeeStructureMapping = async (data) => {
  await axiosInstance.post('fee-structures/assignStudents', data);
};

export const getFeeStructureAllMapping = async (
  schoolId: number,
  acedamicyearId: number,
  feeStructureId: number
) => {
  return await axiosInstance.get<FeeStructure[]>(
    `fee-structures/schools/${schoolId}/years/${acedamicyearId}/feeStructures/${feeStructureId}`
  );
};

export const getFeesPaymentDetailes = async (schoolId: number, feePaymentId: number) => {
  return await axiosInstance.get<FeesPayment[]>(
    `fee-payments/schools/${schoolId}/feePayments/${feePaymentId}`
  );
};

export const getPDFPaymentDetailes = async (
  schoolId: number,
  feePaymentId: number,
  academicYearId: number,
  enrollmentId: number
): Promise<Blob> => {
  const response = await axiosInstance.get(
    `fee-payments/generate-pdf/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}/feePayments/${feePaymentId}`,
    { responseType: 'blob' } // Specify response type as blob to handle binary data
  );
  return response.data;
};

export const getAllPaymentHistory = async (schoolId: number, payload: unknown) => {
  return await axiosInstance.post<FeesPayment[]>(
    `fee-payments/pagination-filter/schools/${schoolId}`,
    payload
  );
};

export const getSingleStudentFeesPaymentDetailes = async (
  schoolId: number,
  academicYearId: number,
  enrollmentId: number
) => {
  return await axiosInstance.get<FeesPayment[]>(
    `fee-payments/feePayment/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}`
  );
};

export const getEnrollmentIdStudentDetailes = async (schoolId: number, enrollmentId: number) => {
  return await axiosInstance.get<FeesPayment[]>(
    `enrollments/schools/${schoolId}/enrollments/${enrollmentId}`
  );
};

export const getFeeStructures = async (
  schoolId: number,
  enrollmentId: number,
  academicYearId: number
) => {
  return await axiosInstance.get<FeeStructure[]>(
    `fee-structures/schools/${schoolId}/enrollments/${enrollmentId}/years/${academicYearId}`
  );
};

export const getUpdateChequeDetailes = async (schoolId: number, feePaymentId: number) => {
  return await axiosInstance.get<FeesPayment[]>(
    `fee-payments/schools/${schoolId}/feePayments/${feePaymentId}`
  );
};

export const updateCheque = async (data: FeesPayment) => {
  await axiosInstance.put('cheque-details', data);
};

export const getStudentFeeStructure = async (
  schoolId: number,
  enrollmentId: number,
  acaemicYearId: number
) => {
  return await axiosInstance.get(
    `fee-structures/schools/${schoolId}/enrollments/${enrollmentId}/years/${acaemicYearId}`
  );
};

export const getSingleStudentFeesPaymentDetails = async (
  schoolId: number,
  academicYearId: number,
  enrollmentId: number
) => {
  return await axiosInstance.get(
    `fee-payments/feePayment/schools/${schoolId}/years/${academicYearId}/enrollments/${enrollmentId}`
  );
};

export const getFeesPaymentDetailsByPaymentId = async (schoolId: number, feePaymentId: number) => {
  return await axiosInstance.get(`fee-payments/schools/${schoolId}/feePayments/${feePaymentId}`);
};
