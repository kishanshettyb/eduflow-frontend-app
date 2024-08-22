import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllFeeComponent,
  useViewFeeComponent,
  useGetSingleFeeComponent,
  useGetFeeComponentbyID,
  useGetDeletebyID
} from '../../../queries/admin/feecomponent';

// Mocking API calls
jest.mock('../../../api/admin/fees/fee', () => ({
  getAllFeeComponent: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Fee Component 1' },
        { id: 2, name: 'Fee Component 2' }
      ]
    })
  ),
  viewFeeComponent: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Fee Component 1' },
        { id: 2, name: 'Fee Component 2' }
      ]
    })
  ),
  getFeeComponentbyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Fee Component 1' }
    })
  )
}));

describe('Fee Component Hooks', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  test('useGetAllFeeComponent fetches all fee components', async () => {
    const schoolId = 1;
    const academicYearId = 1;

    const { result, waitFor } = renderHook(() => useGetAllFeeComponent(schoolId, academicYearId), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data).toEqual({
      data: [
        { id: 1, name: 'Fee Component 1' },
        { id: 2, name: 'Fee Component 2' }
      ]
    });
  });

  test('useViewFeeComponent fetches fee components for viewing', async () => {
    const schoolId = 1;
    const academicYearId = 1;

    const { result, waitFor } = renderHook(() => useViewFeeComponent(schoolId, academicYearId), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data).toEqual({
      data: [
        { id: 1, name: 'Fee Component 1' },
        { id: 2, name: 'Fee Component 2' }
      ]
    });
  });

  test('useGetSingleFeeComponent fetches a single fee component', async () => {
    const schoolId = 1;
    const feeComponentId = 1;

    const { result, waitFor } = renderHook(
      () => useGetSingleFeeComponent(schoolId, feeComponentId),
      { wrapper }
    );

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data).toEqual({
      data: [
        { id: 1, name: 'Fee Component 1' },
        { id: 2, name: 'Fee Component 2' }
      ]
    });
  });

  test('useGetFeeComponentbyID fetches fee component by ID', async () => {
    const schoolId = 1;
    const feeComponentId = 1;

    const { result, waitFor } = renderHook(() => useGetFeeComponentbyID(schoolId, feeComponentId), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data).toEqual({
      data: { id: 1, name: 'Fee Component 1' }
    });
  });

  test('useGetDeletebyID fetches fee component for delete by ID', async () => {
    const schoolId = 1;
    const feeComponentId = 1;

    const { result, waitFor } = renderHook(() => useGetDeletebyID(schoolId, feeComponentId), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data).toEqual({
      data: { id: 1, name: 'Fee Component 1' }
    });
  });
});
