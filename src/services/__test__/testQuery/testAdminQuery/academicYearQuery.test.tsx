import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAcademicYearbyID, useViewAcademicYear } from '../../../queries/admin/academicYear';

jest.mock('../../../api/admin/acedamicyear/acedamicyearApi', () => ({
  getAcademicYearbyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: '2023-2024' } // Mocked response data
    })
  ),
  viewAcademicYear: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: '2023-2024' },
        { id: 2, name: '2024-2025' }
      ] // Mocked response data
    })
  )
}));

describe('useViewAcademicYear', () => {
  test('fetches academic year data', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useViewAcademicYear(schoolId), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: '2023-2024' },
      { id: 2, name: '2024-2025' }
    ]);
  }, 10000);
});

describe('useGetAcademicYearbyID', () => {
  test('fetches academic year by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAcademicYearbyID(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: '2023-2024' });
  }, 10000);
});
