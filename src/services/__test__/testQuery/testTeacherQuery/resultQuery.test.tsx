import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllResultPagination,
  useGetAllResultTable,
  useGetResultStudent
} from '@/services/queries/teacher/result/result';
jest.mock('@/services/api/teacher/result/resultApi', () => ({
  getAllResultTable: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Result 1' },
        { id: 2, name: 'Result 2' }
      ]
    })
  ),
  getAllResultStudent: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Student Result' }
    })
  ),
  getAllResultPagination: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Result Page 1' },
        { id: 2, name: 'Result Page 2' }
      ]
    })
  )
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetAllResultTable', () => {
  test('fetches all result tables', async () => {
    const schoolId = 1;
    const examTypeId = 1;
    const standard = '10th';
    const section = 'A';
    const subjectId = 1;
    const academicYearId = 1;
    const subjectTypeId = 1;

    const { result, waitFor } = renderHook(
      () =>
        useGetAllResultTable(
          schoolId,
          examTypeId,
          standard,
          section,
          subjectId,
          academicYearId,
          subjectTypeId
        ),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Result 1' },
      { id: 2, name: 'Result 2' }
    ]);
  }, 10000);
});

describe('useGetResultStudent', () => {
  test('fetches result for student', async () => {
    const schoolId = 1;
    const academicYearId = 1;
    const examTypeId = 1;
    const studentId = 1;

    const { result, waitFor } = renderHook(
      () => useGetResultStudent(schoolId, academicYearId, examTypeId, studentId),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual({ id: 1, name: 'Student Result' });
  }, 10000);
});

describe('useGetAllResultPagination', () => {
  test('fetches all result pages', async () => {
    const schoolId = 1;
    const payload = { page: 1, limit: 10 };

    const { result, waitFor } = renderHook(() => useGetAllResultPagination(schoolId, payload), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Result Page 1' },
      { id: 2, name: 'Result Page 2' }
    ]);
  }, 10000);
});
