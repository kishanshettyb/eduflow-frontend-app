import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllAdmins,
  useGetAllStaffs,
  useGetAllSchoolStaffs
} from '../../../queries/superadmin/admins';

// Mock API responses
jest.mock('../../../api/superadmin/admins', () => ({
  getAllAdmins: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Admin A' },
        { id: 2, name: 'Admin B' }
      ] // Mocked response data
    })
  ),
  getAllStaffs: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Staff A' },
        { id: 2, name: 'Staff B' }
      ] // Mocked response data
    })
  ),
  getAllSchoolStaffs: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'School Staff A' },
        { id: 2, name: 'School Staff B' }
      ] // Mocked response data
    })
  ),
  getSingleAdmin: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Admin A' }
    })
  ),
  getSingleStaff: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Staff A' }
    })
  ),
  getSingleQualification: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, qualification: 'Masters Degree' }
    })
  ),
  getSingleWorkExperience: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, experience: '5 years' }
    })
  )
}));

describe('Admin Queries', () => {
  test('fetches all admins', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useGetAllAdmins(schoolId), { wrapper });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Admin A' },
      { id: 2, name: 'Admin B' }
    ]);
  }, 10000);

  test('fetches all staff', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const payload = {}; // Adjust payload as necessary
    const { result, waitFor } = renderHook(() => useGetAllStaffs(schoolId, payload), { wrapper });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Staff A' },
      { id: 2, name: 'Staff B' }
    ]);
  }, 10000);

  test('fetches all school staff', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useGetAllSchoolStaffs(schoolId), { wrapper });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual([
      { id: 1, name: 'School Staff A' },
      { id: 2, name: 'School Staff B' }
    ]);
  }, 10000);
});
