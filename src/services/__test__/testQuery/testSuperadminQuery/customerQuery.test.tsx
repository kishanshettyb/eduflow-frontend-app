import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAllCustomers, useGetSingleCustomer } from '../../../queries/superadmin/cutomer';
import * as api from '../../../api/superadmin/customers/customerApi';

jest.mock('../../../api/superadmin/customers/customerApi', () => ({
  getAllCustomers: jest.fn(),
  getSingleCustomer: jest.fn()
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

const customerId = 1;

describe('useGetAllCustomers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('fetches all customers successfully', async () => {
    const mockData = {
      data: [
        { id: 1, name: 'Customer 1' },
        { id: 2, name: 'Customer 2' }
      ]
    };
    api.getAllCustomers.mockResolvedValueOnce(mockData);

    const { result, waitFor } = renderHook(() => useGetAllCustomers(), { wrapper });

    await waitFor(() => result.current.isSuccess);

    expect(result.current.data).toEqual(mockData);
    expect(api.getAllCustomers).toHaveBeenCalledTimes(1);
  });

  // test('handles error while fetching customers', async () => {
  //   // Mock API error
  //   const mockError = new Error('Failed to fetch customers');
  //   api.getAllCustomers.mockRejectedValueOnce(mockError);

  //   // Render hook
  //   const { result, waitFor } = renderHook(() => useGetAllCustomers(), { wrapper });

  //   // Wait for error state
  //   await waitFor(() => result.current.isError);

  //   // Check error
  //   expect(result.current.error).toEqual(mockError);
  //   expect(api.getAllCustomers).toHaveBeenCalledTimes(1);
  // });
});

describe('useGetSingleCustomer', () => {
  beforeEach(() => {
    // Clear any previous mock call data
    jest.clearAllMocks();
  });

  test('fetches a single customer successfully', async () => {
    // Mock API response
    const mockData = { data: { id: customerId, name: 'Customer 1' } };
    api.getSingleCustomer.mockResolvedValueOnce(mockData);

    // Render hook
    const { result, waitFor } = renderHook(() => useGetSingleCustomer(customerId), { wrapper });

    // Wait for success state
    await waitFor(() => result.current.isSuccess);

    // Check data
    expect(result.current.data).toEqual(mockData);
    expect(api.getSingleCustomer).toHaveBeenCalledWith(customerId);
  });

  // test('handles error while fetching a single customer', async () => {
  //   // Mock API error
  //   const mockError = new Error('Failed to fetch customer');
  //   api.getSingleCustomer.mockRejectedValueOnce(mockError);

  //   // Render hook
  //   const { result, waitFor } = renderHook(() => useGetSingleCustomer(customerId), { wrapper });

  //   // Wait for error state
  //   await waitFor(() => result.current.isError);

  //   // Check error
  //   expect(result.current.error).toEqual(mockError);
  //   expect(api.getSingleCustomer).toHaveBeenCalledWith(customerId);
  // });

  test('does not fetch if ID is null', async () => {
    // Render hook
    const { result } = renderHook(() => useGetSingleCustomer(null), { wrapper });

    // Check that data is undefined because the query should be disabled
    expect(result.current.data).toBeUndefined();
    expect(api.getSingleCustomer).not.toHaveBeenCalled();
  });
});
