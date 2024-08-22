import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllStaffAttendanceByRange,
  useGetAllStaffAttendances,
  useGetAllStaffAttendancesByMonth,
  useGetAllStudentAttendancesByDate
} from '@/services/queries/admin/attendance';

// Mock the API functions
jest.mock('@/services/api/admin/attendances/attendancesApi', () => ({
  getStaffAttendance: jest.fn(() =>
    Promise.resolve({ data: { id: 1, attendance: 'Staff Attendance' } })
  ),
  getStaffsAttendanceByDate: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, attendance: 'Staff Attendance 1' },
        { id: 2, attendance: 'Staff Attendance 2' }
      ]
    })
  ),
  getStaffsAttendanceByMonth: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, attendance: 'Staff Attendance for Month 1' },
        { id: 2, attendance: 'Staff Attendance for Month 2' }
      ]
    })
  ),
  getStaffsAttendanceByRange: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, attendance: 'Staff Attendance for Range 1' },
        { id: 2, attendance: 'Staff Attendance for Range 2' }
      ]
    })
  ),
  getStudentAttendance: jest.fn(() =>
    Promise.resolve({ data: { id: 1, attendance: 'Student Attendance' } })
  ),
  getStudentsAttendanceByDate: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, attendance: 'Student Attendance 1' },
        { id: 2, attendance: 'Student Attendance 2' }
      ]
    })
  ),
  getSudentsAttendanceByRange: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, attendance: 'Student Attendance for Range 1' },
        { id: 2, attendance: 'Student Attendance for Range 2' }
      ]
    })
  )
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Attendance Hooks', () => {
  it('should fetch staff attendances by date', async () => {
    const { result, waitFor } = renderHook(() => useGetAllStaffAttendances(1, '2024-07-01'), {
      wrapper
    });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({
      data: [
        { id: 1, attendance: 'Staff Attendance 1' },
        { id: 2, attendance: 'Staff Attendance 2' }
      ]
    });
  });

  it('should fetch staff attendances by month', async () => {
    const { result, waitFor } = renderHook(
      () => useGetAllStaffAttendancesByMonth(1, '2024', 'July'),
      { wrapper }
    );
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({
      data: [
        { id: 1, attendance: 'Staff Attendance for Month 1' },
        { id: 2, attendance: 'Staff Attendance for Month 2' }
      ]
    });
  });

  it('should fetch student attendances by date', async () => {
    const { result, waitFor } = renderHook(
      () => useGetAllStudentAttendancesByDate(1, '10th', 'A', '2024-07-01'),
      { wrapper }
    );
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({
      data: [
        { id: 1, attendance: 'Student Attendance 1' },
        { id: 2, attendance: 'Student Attendance 2' }
      ]
    });
  });

  it('should fetch staff attendances by range', async () => {
    const { result, waitFor } = renderHook(
      () => useGetAllStaffAttendanceByRange(1, { startDate: '2024-01-01', endDate: '2024-12-31' }),
      { wrapper }
    );
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({
      data: [
        { id: 1, attendance: 'Staff Attendance for Range 1' },
        { id: 2, attendance: 'Staff Attendance for Range 2' }
      ]
    });
  });
});
