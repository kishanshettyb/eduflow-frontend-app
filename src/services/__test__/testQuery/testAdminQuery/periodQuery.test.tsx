import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllPeriod,
  useViewPeriod,
  useGetPeriodbyID,
  useGetDeletebyID
} from '../../../queries/admin/period';

jest.mock('../../../api/admin/period/periodApi', () => ({
  getAllPeriod: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Period 1' },
        { id: 2, name: 'Period 2' }
      ] // Mocked response data
    })
  ),
  viewPeriod: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Period 1' },
        { id: 2, name: 'Period 2' }
      ] // Mocked response data
    })
  ),
  getPeriodbyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Period 1' } // Mocked response data
    })
  )
}));

describe('useGetAllPeriod', () => {
  test('fetches all periods', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAllPeriod(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Period 1' },
      { id: 2, name: 'Period 2' }
    ]);
  }, 10000);
});

describe('useViewPeriod', () => {
  test('fetches periods for viewing', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useViewPeriod(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Period 1' },
      { id: 2, name: 'Period 2' }
    ]);
  }, 10000);
});

describe('useGetPeriodbyID', () => {
  test('fetches period by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const periodId = 1;
    const { result, waitFor } = renderHook(() => useGetPeriodbyID(schoolId, periodId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Period 1' });
  }, 10000);
});

describe('useGetDeletebyID', () => {
  test('fetches period for delete by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const periodId = 1;
    const { result, waitFor } = renderHook(() => useGetDeletebyID(schoolId, periodId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Period 1' });
  }, 10000);
});
