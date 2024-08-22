import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAllSubjectType, useGetGroupSubjectTypes } from '../../../queries/admin/subjectType'; // Adjust the import path as needed

// Mock API responses
jest.mock('../../../api/admin/subjectType/subjectTypeApi', () => ({
  getAllSubjectType: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, type: 'Mathematics' },
        { id: 2, type: 'Science' }
      ] // Mocked response data
    })
  ),
  getGroupSubjectTypes: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Physics' },
        { id: 2, name: 'Chemistry' }
      ] // Mocked response data
    })
  )
}));

describe('useGetAllSubjectType', () => {
  test('fetches all subject types', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 2024;
    const { result, waitFor } = renderHook(() => useGetAllSubjectType(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, type: 'Mathematics' },
      { id: 2, type: 'Science' }
    ]);
  }, 10000);
});

describe('useGetGroupSubjectTypes', () => {
  test('fetches group subject types', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 2024;
    const standards = '10th';
    const sections = 'A';
    const { result, waitFor } = renderHook(
      () => useGetGroupSubjectTypes(schoolId, academicYearId, standards, sections),
      { wrapper }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Physics' },
      { id: 2, name: 'Chemistry' }
    ]);
  }, 10000);
});
