import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllAssignedFeePayment,
  useGetEnrollmentbyID,
  useGetEnrollmentFeesPayment,
  useGetFeesPaymentDetailes,
  useGetPDFFeesPaymentDetailes,
  useGetAllPaymentHistory,
  useGetSingleStudentFeesPaymentDetailes,
  useGetEnrollmentIdStudentDetailes,
  useGetFeeStructures,
  useGetUpdateChequeDetailes
} from '../../../queries/admin/feePayment';

// Mock API responses
jest.mock('../../../api/admin/fees/fee', () => ({
  getAllAssignedFeesPayment: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, amount: 100, studentId: 1 },
        { id: 2, amount: 200, studentId: 2 }
      ] // Mocked response data
    })
  ),
  getEnrollmentbyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, studentName: 'John Doe' } // Mocked response data
    })
  ),
  getAllEnrollmentFeesPayment: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, amount: 100, enrollmentId: 1 },
        { id: 2, amount: 200, enrollmentId: 2 }
      ] // Mocked response data
    })
  ),
  getFeesPaymentDetailes: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, amount: 100, paymentDate: '2024-01-01' } // Mocked response data
    })
  ),
  getPDFPaymentDetailes: jest.fn(() =>
    Promise.resolve({
      data: { pdfUrl: 'http://example.com/payment.pdf' } // Mocked response data
    })
  ),
  getAllPaymentHistory: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, paymentDate: '2024-01-01', amount: 100 },
        { id: 2, paymentDate: '2024-02-01', amount: 200 }
      ] // Mocked response data
    })
  ),
  getSingleStudentFeesPaymentDetailes: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, amount: 100, studentId: 1 } // Mocked response data
    })
  ),
  getEnrollmentIdStudentDetailes: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, studentName: 'John Doe' } // Mocked response data
    })
  ),
  getFeeStructures: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Structure A' },
        { id: 2, name: 'Structure B' }
      ] // Mocked response data
    })
  ),
  getUpdateChequeDetailes: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, chequeNumber: '123456' } // Mocked response data
    })
  )
}));

describe('useGetAllAssignedFeePayment', () => {
  test('fetches all assigned fee payments', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const standardIds = [1];
    const sectionIds = [1];
    const { result, waitFor } = renderHook(
      () => useGetAllAssignedFeePayment(schoolId, academicYearId, standardIds, sectionIds),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, amount: 100, studentId: 1 },
      { id: 2, amount: 200, studentId: 2 }
    ]);
  }, 10000);
});

describe('useGetEnrollmentbyID', () => {
  test('fetches enrollment details by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const enrollmentId = 1;
    const { result, waitFor } = renderHook(() => useGetEnrollmentbyID(schoolId, enrollmentId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, studentName: 'John Doe' });
  }, 10000);
});

describe('useGetEnrollmentFeesPayment', () => {
  test('fetches enrollment fees payment details', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const enrollmentId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(
      () => useGetEnrollmentFeesPayment(schoolId, enrollmentId, academicYearId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, amount: 100, enrollmentId: 1 },
      { id: 2, amount: 200, enrollmentId: 2 }
    ]);
  }, 10000);
});

describe('useGetFeesPaymentDetailes', () => {
  test('fetches fee payment details by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const feePaymentId = 1;
    const { result, waitFor } = renderHook(
      () => useGetFeesPaymentDetailes(schoolId, feePaymentId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, amount: 100, paymentDate: '2024-01-01' });
  }, 10000);
});

describe('useGetPDFFeesPaymentDetailes', () => {
  test('fetches PDF URL for fee payment details', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const feePaymentId = 1;
    const academicYearId = 1;
    const enrollmentId = 1;
    const { result, waitFor } = renderHook(
      () => useGetPDFFeesPaymentDetailes(schoolId, feePaymentId, academicYearId, enrollmentId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ pdfUrl: 'http://example.com/payment.pdf' });
  }, 10000);
});

describe('useGetAllPaymentHistory', () => {
  test('fetches all payment history', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const payload = {};
    const { result, waitFor } = renderHook(() => useGetAllPaymentHistory(schoolId, payload), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, paymentDate: '2024-01-01', amount: 100 },
      { id: 2, paymentDate: '2024-02-01', amount: 200 }
    ]);
  }, 10000);
});

describe('useGetSingleStudentFeesPaymentDetailes', () => {
  test('fetches single student fees payment details', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const enrollmentId = 1;
    const { result, waitFor } = renderHook(
      () => useGetSingleStudentFeesPaymentDetailes(schoolId, academicYearId, enrollmentId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, amount: 100, studentId: 1 });
  }, 10000);
});

describe('useGetEnrollmentIdStudentDetailes', () => {
  test('fetches student details by enrollment ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const enrollmentId = 1;
    const { result, waitFor } = renderHook(
      () => useGetEnrollmentIdStudentDetailes(schoolId, enrollmentId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, studentName: 'John Doe' });
  }, 10000);
});

describe('useGetFeeStructures', () => {
  test('fetches fee structures', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const enrollmentId = 1;
    const { result, waitFor } = renderHook(
      () => useGetFeeStructures(schoolId, academicYearId, enrollmentId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Structure A' },
      { id: 2, name: 'Structure B' }
    ]);
  }, 10000);
});

describe('useGetUpdateChequeDetailes', () => {
  test('fetches update cheque details by fee payment ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const feePaymentId = 1;
    const { result, waitFor } = renderHook(
      () => useGetUpdateChequeDetailes(schoolId, feePaymentId),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, chequeNumber: '123456' });
  }, 10000);
});
