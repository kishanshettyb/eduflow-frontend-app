import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllStudent,
  useGetSingleStudent,
  useFilteredStudents,
  useGetNotEnrolledStudent
} from '../../../queries/admin/student';

// Mock API responses
jest.mock('@/services/api/admin/student/studentApi', () => ({
  getAllStudent: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Alice', standard: 1 },
        { id: 2, name: 'Bob', standard: 2 }
      ] // Mocked response data
    })
  ),
  getSingleStudent: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Alice', standard: 1 } // Mocked response data
    })
  ),
  getFilteredStudents: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Alice', standard: 1 },
        { id: 2, name: 'Bob', standard: 2 }
      ] // Mocked response data
    })
  ),
  getStudentWithNoEnrollment: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 3, name: 'Charlie' },
        { id: 4, name: 'David' }
      ] // Mocked response data
    })
  )
}));

describe('useGetAllStudent', () => {
  test('fetches all students', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAllStudent(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Alice', standard: 1 },
      { id: 2, name: 'Bob', standard: 2 }
    ]);
  }, 10000);
});

describe('useGetSingleStudent', () => {
  test('fetches a single student by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const id = 1;
    const { result, waitFor } = renderHook(() => useGetSingleStudent(schoolId, id), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Alice', standard: 1 });
  }, 10000);
});

describe('useFilteredStudents', () => {
  test('fetches filtered students based on provided criteria', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const isActive = 'active';
    const standard = 1;
    const section = 'A';
    const { result, waitFor } = renderHook(
      () => useFilteredStudents(schoolId, academicYearId, isActive, standard, section),
      {
        wrapper
      }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Alice', standard: 1 },
      { id: 2, name: 'Bob', standard: 2 }
    ]);
  }, 10000);
});

describe('useGetNotEnrolledStudent', () => {
  test('fetches students with no enrollment', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useGetNotEnrolledStudent(schoolId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 3, name: 'Charlie' },
      { id: 4, name: 'David' }
    ]);
  }, 10000);
});
