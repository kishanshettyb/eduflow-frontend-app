import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllAdmins,
  useGetAllStaffs,
  useGetAllSchoolStaffs,
  useGetSingleAdmin,
  useGetSingleQualification,
  useGetSingleWorkExperience,
  useGetSingleStaff,
  useGetStaffType
} from '../../../queries/superadmin/admins';

// Mock API responses
jest.mock('../../api/superadmin/admins/adminApi', () => ({
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
      data: { id: 1, name: 'Admin A' } // Mocked response data
    })
  ),
  getSingleQualification: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, qualification: 'Masters Degree' } // Mocked response data
    })
  ),
  getSingleWorkExperience: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, experience: '5 years' } // Mocked response data
    })
  ),
  getSingleStaff: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Staff A' } // Mocked response data
    })
  )
}));

jest.mock('@/services/api/admin/staff/staffApi', () => ({
  getStaffType: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, type: 'Full-Time' },
        { id: 2, type: 'Part-Time' }
      ] // Mocked response data
    })
  )
}));

describe('useGetAllAdmins', () => {
  test('fetches all admins', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useGetAllAdmins(schoolId), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Admin A' },
      { id: 2, name: 'Admin B' }
    ]);
  }, 10000);
});

describe('useGetAllStaffs', () => {
  test('fetches all staff', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const payload = {};
    const { result, waitFor } = renderHook(() => useGetAllStaffs(schoolId, payload), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Staff A' },
      { id: 2, name: 'Staff B' }
    ]);
  }, 10000);
});

describe('useGetAllSchoolStaffs', () => {
  test('fetches all school staff', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useGetAllSchoolStaffs(schoolId), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'School Staff A' },
      { id: 2, name: 'School Staff B' }
    ]);
  }, 10000);
});

describe('useGetSingleAdmin', () => {
  test('fetches a single admin by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const id = 1;
    const { result, waitFor } = renderHook(() => useGetSingleAdmin(schoolId, id), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Admin A' });
  }, 10000);
});

describe('useGetSingleQualification', () => {
  test('fetches a single qualification by staff ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const staffId = 1;
    const { result, waitFor } = renderHook(() => useGetSingleQualification(schoolId, staffId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, qualification: "Master's Degree" });
  }, 10000);
});

describe('useGetSingleWorkExperience', () => {
  test('fetches a single work experience by staff ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const staffId = 1;
    const { result, waitFor } = renderHook(() => useGetSingleWorkExperience(schoolId, staffId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, experience: '5 years' });
  }, 10000);
});

describe('useGetSingleStaff', () => {
  test('fetches a single staff by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const id = 1;
    const { result, waitFor } = renderHook(() => useGetSingleStaff(schoolId, id), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, name: 'Staff A' });
  }, 10000);
});

describe('useGetStaffType', () => {
  test('fetches all staff types', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const { result, waitFor } = renderHook(() => useGetStaffType(schoolId), { wrapper });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, type: 'Full-Time' },
      { id: 2, type: 'Part-Time' }
    ]);
  }, 10000);
});
