import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Customer } from '@/types/superadmin/customerTypes';
import { useToast } from '@/components/ui/use-toast';
import {
  createEnrollment,
  createPromoteEnrollment,
  promoteStudent,
  updateEnrollment
} from '@/services/api/admin/student/enrollment';

import { useRouter } from 'next/navigation';

export function useCreateCEnrollment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Customer) => createEnrollment(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'Enrollment Created Successfully'
      });
      router.push('/admin/students/searchStudent');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete enrollment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createCustomer'] });
      }
    }
  });
}

export function useUpdateEnrollment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: Customer) => updateEnrollment(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'Enrollment Updated Successfully'
      });
      router.push('/admin/students/searchStudent');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete enrollment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createCustomer'] });
      }
    }
  });
}
export function usePromoteStudent() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ studentId, payload }) => promoteStudent(studentId, payload),
    onMutate: () => {
      console.log('Promoting student...');
    },
    onError: (error) => {
      console.log('Error promoting student');
      toast({
        variant: 'destructive',
        title: 'Unable to promote student',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Student promoted successfully');
      toast({
        variant: 'default',
        title: 'Student Promoted Successfully'
      });
      queryClient.invalidateQueries('students');
      router.push('/admin/students/searchStudent');
    },
    onSettled: async (_, error) => {
      console.log('Promotion operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewStudent'] });
      }
    }
  });
}

export function useCreatePromoted() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();
  return useMutation({
    mutationFn: ({ studentId, data }) => createPromoteEnrollment(studentId, data),
    onMutate: () => {
      console.log('Promoting student...');
    },
    onError: (error) => {
      console.log('Error promoting student');
      toast({
        variant: 'destructive',
        title: 'Unable to promote student',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Student promoted successfully');
      toast({
        variant: 'default',
        title: 'Student Promoted Successfully'
      });
      router.push('/admin/students/searchStudent');
      queryClient.invalidateQueries('students');
    },
    onSettled: async (_, error) => {
      console.log('Promotion operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewStudent'] });
      }
    }
  });
}
