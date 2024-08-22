import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createAcademicYear,
  isConfirmDefaultAcademicYear,
  updateAcademicYear
} from '@/services/api/admin/acedamicyear/acedamicyearApi';
import { AcademicYear } from '@/types/admin/academicYearTypes';
import { useToast } from '@/components/ui/use-toast';

import { useRouter } from 'next/navigation';
export function useCreateAcademicYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AcademicYear) => createAcademicYear(data),
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
        title: 'AcademicYear Created Successfully'
      });
      router.push('/admin/academic-years');
      queryClient.invalidateQueries('academic-years');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete AcademicYear',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createAcademicYear'] });
      }
    }
  });
}

export function useConfirmDefaultYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: ({
      schoolId,
      academicYearId,
      permission
    }: {
      schoolId: number;
      academicYearId: number;
      permission: boolean;
    }) => isConfirmDefaultAcademicYear(schoolId, academicYearId, permission),
    onMutate: () => {
      console.log('Default year Updated...');
    },
    onError: (error) => {
      console.log('Error Default year');
      toast({
        variant: 'destructive',
        title: 'Unable to add default year',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Default year updated successfully');
      toast({
        variant: 'default',
        title: 'Default year updated successfully'
      });
      queryClient.invalidateQueries('academicYears');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['academicYears'] });
      }
    }
  });
}

export function useUpdateAcademicYear() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: AcademicYear) => updateAcademicYear(data),
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
        title: 'AcademicYear Updated Successfully'
      });
      router.push('/admin/academic-years');
      queryClient.invalidateQueries('academic-years');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Updated AcademicYear',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createAcademicYear'] });
      }
    }
  });
}
