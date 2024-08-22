import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllExamType,
  useViewExamType,
  useGetExamTypebyID,
  useGetDeletebyID
} from '../../../queries/admin/examType';

jest.mock('../../../api/admin/examtype/examtypeApi', () => ({
  getAllExamType: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Exam Type 1' },
        { id: 2, name: 'Exam Type 2' }
      ] // Mocked response data
    })
  ),
  viewExamType: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Exam Type 1' },
        { id: 2, name: 'Exam Type 2' }
      ] // Mocked response data
    })
  ),
  getExamTypebyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Exam Type 1' } // Mocked response data
    })
  )
}));

describe('useGetAllExamType', () => {
  test('fetches all exam types', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAllExamType(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Exam Type 1' },
      { id: 2, name: 'Exam Type 2' }
    ]);
  }, 10000);
});

describe('useViewExamType', () => {
  test('fetches exam types for viewing', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useViewExamType(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Exam Type 1' },
      { id: 2, name: 'Exam Type 2' }
    ]);
  }, 10000);
});

describe('useGetExamTypebyID', () => {
  test('fetches exam type by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const examTypeId = 1;
    const { result, waitFor } = renderHook(() => useGetExamTypebyID(schoolId, examTypeId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Exam Type 1' });
  }, 10000);
});

describe('useGetDeletebyID', () => {
  test('fetches exam type for delete by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const examTypeId = 1;
    const { result, waitFor } = renderHook(() => useGetDeletebyID(schoolId, examTypeId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Exam Type 1' });
  }, 10000);
});
