import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '../../api/auth/authApi';
import { Login } from '@/types/common/loginTypes';
import { useToast } from '@/components/ui/use-toast';
import { changePassword } from '@/services/api/auth/changePasswordApi';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Login) => login(data),
    onMutate: () => {
      console.log('mutate');
    },

    onError: () => {
      console.log('error');
    },

    onSuccess: () => {
      console.log('success');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log(error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['login'] });
      }
    }
  });
}

export function useChangePassword() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => changePassword(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to change password',
        description: error.response?.data || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('success!!!');
      toast({
        variant: 'default',
        title: 'Password changed Successfully'
      });
      queryClient.invalidateQueries('passwords');
    }
  });
}
