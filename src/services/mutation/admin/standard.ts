import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Standard } from '@/types/admin/standardTypes';
import { toast, useToast } from '@/components/ui/use-toast';
import {
  createStandard,
  deleteStandard,
  updateStandard
} from '../../api/admin/standard/standardApi';

export function useCreateStandard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data: Standard) => createStandard(data),
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
        title: 'Standard Created Successfully'
      });

      queryClient.invalidateQueries('standards');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete standard',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createStandard'] });
      }
    }
  });
}
export function useDeleteStandard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, standardId }: { schoolId: number; standardId: number }) =>
      deleteStandard(schoolId, standardId),
    onMutate: () => {
      console.log('Deleting standard...');
    },
    onError: (error) => {
      console.log('Error deleting standard');
      toast({
        variant: 'destructive',
        title: 'Unable to delete standard',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Standard deleted successfully');
      toast({
        variant: 'default',
        title: 'Standard Deleted Successfully'
      });
      queryClient.invalidateQueries('standards');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewStandard'] });
      }
    }
  });
}
export function useUpdateStandard() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Standard) => updateStandard(data),
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
        title: 'Standard Updated Successfully'
      });

      queryClient.invalidateQueries('standards');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update standard',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateStandard'] });
      }
    }
  });
}
