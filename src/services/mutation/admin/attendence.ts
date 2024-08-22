import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';
import {
  createStaffAttendance,
  createStudentAttendance,
  updateStaffAttendance,
  updateStudentAttendance
} from '@/services/api/admin/attendances/attendancesApi';
import { useRouter } from 'next/navigation';

export function useCreateStaffAttendance() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { schoolId: number; attendanceDate: Date; data }) =>
      createStaffAttendance(data.schoolId, data.attendanceDate, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to create staff attendance',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Staff attendance created successfully'
      });
      router.push('/admin/attendance/staff-attendances');
      queryClient.invalidateQueries('staffAttendances');
    }
  });
}

export function useUpdateStaffAttendance() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { schoolId: number; data }) =>
      updateStaffAttendance(data.schoolId, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to update staff attendance',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Staff attendance updated successfully'
      });
      router.push('/admin/attendance/staff-attendances');
      queryClient.invalidateQueries('staffAttendances');
    }
  });
}

export function useCreateStudentAttendance() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { schoolId: number; attendanceDate: Date; data }) =>
      createStudentAttendance(data.schoolId, data.attendanceDate, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to create student attendance',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Student  attendance created successfully'
      });
      router.push('/teacher/attendances/studentAttendance');
      queryClient.invalidateQueries('student-Attendance');
    }
  });
}

export function useUpdateStudentAttendance() {
  const queryClient = useQueryClient();
  const router = useRouter();
  return useMutation({
    mutationFn: (data: { schoolId: number; data }) =>
      updateStudentAttendance(data.schoolId, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to update student attendance',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Student attendance updated successfully'
      });
      router.push('/teacher/attendances/studentAttendance');
      queryClient.invalidateQueries('student-Attendance');
    }
  });
}
