import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetAllDepartments } from '@/services/queries/superadmin/departments';
import * as api from '@/services/api/superadmin/customers/department/department';

// Mock the API function
jest.mock('../../../api/superadmin/customers/department/department', () => ({
  getAllDepartment: jest.fn()
}));

// Create a QueryClient instance
const queryClient = new QueryClient();

// Wrapper for QueryClientProvider
const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetAllDepartments', () => {
  const schoolId = 1;

  beforeEach(() => {
    // Reset the mocks before each test
    jest.clearAllMocks();
  });

  test('fetches departments successfully', async () => {
    // Mock data
    const mockData = {
      data: [
        { id: 1, name: 'Department 1' },
        { id: 2, name: 'Department 2' }
      ]
    };
    api.getAllDepartment.mockResolvedValueOnce(mockData);

    // Render hook
    const { result, waitFor } = renderHook(() => useGetAllDepartments(schoolId), { wrapper });

    // Wait for the hook to update
    await waitFor(() => result.current.isSuccess);

    // Check if the data is correct
    expect(result.current.data).toEqual(mockData);
    expect(api.getAllDepartment).toHaveBeenCalledTimes(1);
    expect(api.getAllDepartment).toHaveBeenCalledWith(schoolId);
  });

  // test('handles error while fetching departments', async () => {
  //   // Mock error
  //   const mockError = new Error('Failed to fetch departments');
  //   api.getAllDepartment.mockRejectedValueOnce(mockError);

  //   // Render hook
  //   const { result, waitFor } = renderHook(() => useGetAllDepartments(schoolId), { wrapper });

  //   // Wait for the hook to update
  //   await waitFor(() => result.current.isError);

  //   // Check if the error is correct
  //   expect(result.current.error).toEqual(mockError);
  //   expect(api.getAllDepartment).toHaveBeenCalledTimes(1);
  // });

  // test('does not fetch if schoolId is null', async () => {
  //   // Render hook with null schoolId
  //   const { result } = renderHook(() => useGetAllDepartments(null), { wrapper });

  //   // Check that no data is fetched
  //   expect(result.current.data).toBeUndefined();
  //   expect(api.getAllDepartment).not.toHaveBeenCalled();
  // });

  test('fetches departments with different schoolId', async () => {
    const newSchoolId = 2;
    // Mock data for a different schoolId
    const mockData = {
      data: [
        { id: 3, name: 'Department 3' },
        { id: 4, name: 'Department 4' }
      ]
    };
    api.getAllDepartment.mockResolvedValueOnce(mockData);

    // Render hook with a different schoolId
    const { result, waitFor } = renderHook(() => useGetAllDepartments(newSchoolId), { wrapper });

    // Wait for the hook to update
    await waitFor(() => result.current.isSuccess);

    // Check if the data is correct for the new schoolId
    expect(result.current.data).toEqual(mockData);
    expect(api.getAllDepartment).toHaveBeenCalledTimes(1);
    expect(api.getAllDepartment).toHaveBeenCalledWith(newSchoolId);
  });
});
