import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { toast } from '@/components/ui/use-toast';

export const useNewPasswordMutation = (onSuccessCallback: () => void) => {
  return useMutation({
    mutationFn: (data: {
      userName: string | null;
      newPassword: string;
      confirmPassword: string;
    }) => {
      return axios.post(`${process.env.NEXT_PUBLIC_BASE_URL}forgot-password/newPassword`, data);
    },
    onSuccess: () => {
      console.log('New password changed successfully');
      toast({
        variant: 'default',
        title: 'New password changed successfully'
      });
      onSuccessCallback();
    },
    onError: (error) => {
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred';
      console.error('Failed to add new password:', errorMessage);

      toast({
        variant: 'destructive',
        title: 'Failed to add new password',
        description: errorMessage,
        status: 'error'
      });
    }
  });
};
