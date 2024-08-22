import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast, useToast } from '@/components/ui/use-toast';
import { StandardSubject } from '@/types/admin/standardSubjectType';
import {
  createStandardSubject,
  deleteStandardSubject
} from '@/services/api/admin/standardSubject/standardSubjectApi';

export function useCreateStandardSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: StandardSubject) => createStandardSubject(data),
    onMutate: () => {
      console.log('mutate!!!');
    },
    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'primary',
        title: 'Standard  subject Created Successfully'
      });

      queryClient.invalidateQueries('standard-subjects');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete standard-subject',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createStandardSubject'] });
      }
    }
  });
}
export function useDeleteStandardSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schoolId,
      standardSubjectId
    }: {
      schoolId: number;
      standardSubjectId: number;
    }) => deleteStandardSubject(schoolId, standardSubjectId),
    onMutate: () => {
      console.log('Deleting standard-subject...');
    },
    onError: (error) => {
      console.log('Error deleting standard-subject');
      toast({
        variant: 'destructive',
        title: 'Unable to delete standard-subject',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Standard Subject deleted successfully');
      toast({
        variant: 'primary',
        title: 'Standard-subject Deleted Successfully'
      });
      queryClient.invalidateQueries('standard-subjects');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewStandardSubject'] });
      }
    }
  });
}
