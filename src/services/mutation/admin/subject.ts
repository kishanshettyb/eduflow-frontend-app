import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Subject } from '@/types/admin/subjectTypes';
import { toast, useToast } from '@/components/ui/use-toast';
import { createSubject, deleteSubject, updateSubject } from '../../api/admin/subject/subjectApi';

export function useCreateSubject() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Subject) => createSubject(data),
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
        title: 'Subject Created Successfully'
      });
      queryClient.invalidateQueries('subjects');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete subject',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createSubject'] });
      }
    }
  });
}

export function useUpdateSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Subject) => updateSubject(data),
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
        title: 'Subjects Updated Successfully'
      });
      queryClient.invalidateQueries('subjects');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update subject',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateAdmin'] });
      }
    }
  });
}
export function useDeleteSubject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, subjectId }: { schoolId: number; subjectId: number }) =>
      deleteSubject(schoolId, subjectId),
    onMutate: () => {
      console.log('Deleting subject...');
    },
    onError: (error) => {
      console.log('Error deleting subject');
      toast({
        variant: 'destructive',
        title: 'Unable to delete subject',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('subject deleted successfully');
      toast({
        variant: 'default',
        title: 'Subject Deleted Successfully'
      });
      queryClient.invalidateQueries('subject');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewSubject'] });
      }
    }
  });
}
