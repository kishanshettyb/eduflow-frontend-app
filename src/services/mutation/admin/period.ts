import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Period } from '@/types/admin/periodTypes';
import { toast, useToast } from '@/components/ui/use-toast';
import { createPeriod, deletePeriod, updatePeriod } from '../../api/admin/period/periodApi';

export function useCreatePeriod() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Period) => createPeriod(data),
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
        title: 'Period Created Successfully'
      });
      queryClient.invalidateQueries('periods');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Period',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createPeriod'] });
      }
    }
  });
}

export function useUpdatePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Period) => updatePeriod(data),
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
        title: 'Period Updated Successfully'
      });
      queryClient.invalidateQueries('periods');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update school',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updatePeriod'] });
      }
    }
  });
}
export function useDeletePeriod() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, periodId }: { schoolId: number; periodId: number }) =>
      deletePeriod(schoolId, periodId),
    onMutate: () => {
      console.log('Deleting Period...');
    },
    onError: (error) => {
      console.log('Error deleting Period');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Period',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Period deleted successfully');
      toast({
        variant: 'default',
        title: 'Period Deleted Successfully'
      });
      queryClient.invalidateQueries('periods');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewPeriod'] });
      }
    }
  });
}
