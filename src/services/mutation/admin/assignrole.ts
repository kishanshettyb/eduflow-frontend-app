import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/components/ui/use-toast';

import { assignRole, deleteAssignRole } from '@/services/api/admin/assignrole/assignroleApi';

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { schoolId: number; staffId: number; data }) =>
      assignRole(data.schoolId, data.staffId, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to assign role',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Assign Role  created successfully'
      });

      queryClient.invalidateQueries('assignRole');
    }
  });
}

export function useDeleteAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schoolId,
      staffId,
      roleId
    }: {
      schoolId: number;
      staffId: number;
      roleId: number;
    }) => deleteAssignRole(schoolId, staffId, roleId),
    onMutate: () => {
      console.log('Deleting Assign Role...');
    },
    onError: (error) => {
      console.log('Error deleting Assign Role');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Assign Role',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Assign Role deleted successfully');
      toast({
        variant: 'default',
        title: 'Assign Role Deleted Successfully'
      });
      queryClient.invalidateQueries('delete-role');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['delete-role'] });
      }
    }
  });
}
