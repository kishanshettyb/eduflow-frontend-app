import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllFeeStructure,
  useViewFeeStructure,
  useGetFeeStructurebyID,
  useGetDeletebyID
} from '../../../queries/admin/feestructure';

jest.mock('../../../api/admin/fees/fee', () => ({
  getAllFeeStructure: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Fee Structure 1' },
        { id: 2, name: 'Fee Structure 2' }
      ] // Mocked response data
    })
  ),
  viewFeeStructure: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Fee Structure 1' },
        { id: 2, name: 'Fee Structure 2' }
      ] // Mocked response data
    })
  ),
  getFeeStructurebyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Fee Structure 1' } // Mocked response data
    })
  )
}));

describe('useGetAllFeeStructure', () => {
  test('fetches all fee structures', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAllFeeStructure(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Fee Structure 1' },
      { id: 2, name: 'Fee Structure 2' }
    ]);
  }, 10000);
});

describe('useViewFeeStructure', () => {
  test('fetches fee structures for viewing', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useViewFeeStructure(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Fee Structure 1' },
      { id: 2, name: 'Fee Structure 2' }
    ]);
  }, 10000);
});

describe('useGetFeeStructurebyID', () => {
  test('fetches fee structure by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const feeStructureId = 1;
    const { result, waitFor } = renderHook(() => useGetFeeStructurebyID(schoolId, feeStructureId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Fee Structure 1' });
  }, 10000);
});

describe('useGetDeletebyID', () => {
  test('fetches fee structure for delete by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const feeStructureId = 1;
    const { result, waitFor } = renderHook(() => useGetDeletebyID(schoolId, feeStructureId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Fee Structure 1' });
  }, 10000);
});
