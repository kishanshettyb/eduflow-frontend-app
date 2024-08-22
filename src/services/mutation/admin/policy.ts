import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, useToast } from '@/components/ui/use-toast';
import {
  assignPolicy,
  deletePolicy,
  editPolicy,
  multiplePolicyUpdate
} from '@/services/api/admin/policy/policyApi';
import { PolicyRule } from '@/types/admin/policyType';

export function useMultiplePolicyUpdate() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: PolicyRule) => multiplePolicyUpdate(data),
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
        title: 'Policy updated Successfully'
      });
      queryClient.invalidateQueries('policy-update');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete policy',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['update-policy'] });
      }
    }
  });
}

export function useEditPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { policyRuleId: number; data }) => editPolicy(data.policyRuleId, data.data),

    onMutate: () => {
      console.log('Updating Policy ...');
    },
    onError: (error) => {
      console.log('Error updating policy');
      toast({
        variant: 'destructive',
        title: 'Unable to update policy',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Policy Updated successfully');
      // toast({
      //   variant: 'default',
      //   title: 'Policy Updated Successfully'
      // });
      queryClient.invalidateQueries('policies');
    },
    onSettled: async (_, error) => {
      console.log('edit operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['editpolicy'] });
      }
    }
  });
}

export function useDeletePolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, policyRuleId }: { schoolId: number; policyRuleId: number }) =>
      deletePolicy(schoolId, policyRuleId),

    onMutate: () => {
      console.log('Deleting Policy ...');
    },
    onError: (error) => {
      console.log('Error deleting Policy ');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Policy ',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Policy  deleted successfully');
      toast({
        default: 'primary',
        title: 'Policy  Deleted Successfully'
      });
      queryClient.invalidateQueries('exams');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['deletePolicy'] });
      }
    }
  });
}

export function useAssignPolicy() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { roleName: string; data }) => assignPolicy(data.roleName, data.data),

    onMutate: () => {
      console.log('Updating Policy ...');
    },
    onError: (error) => {
      console.log('Error updating policy');
      toast({
        variant: 'destructive',
        title: 'Unable to update policy',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('resources assign successfully');
      toast({
        variant: 'default',
        title: 'resources assign Successfully'
      });
      queryClient.invalidateQueries('policies');
    },
    onSettled: async (_, error) => {
      console.log('edit operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['assign-resource'] });
      }
    }
  });
}
