import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast, useToast } from '@/components/ui/use-toast';

import { conductExam, createExam, deleteExam, updateExam } from '../api/exam/examApi';
import { Exam } from '@/types/examTypes';

export function useCreateExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Exam) => createExam(data),
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
        title: 'Exam Created Successfully'
      });
      queryClient.invalidateQueries('exam');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Exam',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createExam'] });
      }
    }
  });
}

export function useUpdateExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Exam) => updateExam(data),
    onMutate: () => {
      console.log('mutate');
    },

    onError: () => {
      toast({
        variant: 'destructive',
        title: 'Uh oh! Something went wrong.',
        description: 'There was a problem with your request.'
      });
    },

    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Exam Updated Successfully'
      });
      queryClient.invalidateQueries('exams');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update Exam',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateExam'] });
      }
    }
  });
}
export function useDeleteExam() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, examId }: { schoolId: number; examId: number }) =>
      deleteExam(schoolId, examId),
    onMutate: () => {
      console.log('Deleting Exam ...');
    },
    onError: (error) => {
      console.log('Error deleting Exam ');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Exam ',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Exam  deleted successfully');
      toast({
        default: 'primary',
        title: 'Exam  Deleted Successfully'
      });
      queryClient.invalidateQueries('exams');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewExam'] });
      }
    }
  });
}

export function useConductExam() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Exam) => conductExam(data),
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
        title: 'Exam conducted Successfully'
      });
      queryClient.invalidateQueries('exam');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to conduct Exam',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['conductExam'] });
      }
    }
  });
}
