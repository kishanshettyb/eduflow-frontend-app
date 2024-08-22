import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Student } from '@/types/admin/studentTypes';
import { toast, useToast } from '@/components/ui/use-toast';
import { deleteStudentFile, updateStudentDocuments } from '../../api/admin/student/studentApi';
import { submitStudentDocuments } from '../../api/admin/student/studentApi';

export function useUploadStudentDocument() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Student) => submitStudentDocuments(data),
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
        title: 'Document Uploaded Successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete student',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}

export function useUpdateUploadStudentDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Student) => updateStudentDocuments(data),
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
        title: 'Document Updated Successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update Document',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}

export function useDeleteStudentFile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ studentDocumentId }: { studentDocumentId: number }) =>
      deleteStudentFile(studentDocumentId),
    onMutate: () => {
      console.log('Deleting Files...');
    },
    onError: (error) => {
      console.log('Error deleting Files');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Files',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Files deleted successfully');
      toast({
        variant: 'default',
        title: 'Files Deleted Successfully'
      });
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}
