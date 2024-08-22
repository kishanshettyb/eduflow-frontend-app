import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/components/ui/use-toast';
import {
  updateAttachment,
  updateAttachmentProfile,
  updateStudentAttachment
} from '@/services/api/attachment/attachmentApi';

export function useUpdateAttachement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { schoolId: number; attachmentId: number; formData }) =>
      updateAttachment(data.schoolId, data.attachmentId, data.formData),

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
        title: 'Image Uploaded Successfully'
      });
      queryClient.invalidateQueries('attachement');
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
        await queryClient.invalidateQueries({ queryKey: ['updateattachement'] });
      }
    }
  });
}

export function updateAttachmentProfiles() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation({
    mutationFn: (data: { schoolId: number; staffId: number; formData }) =>
      updateAttachmentProfile(data.schoolId, data.staffId, data.formData),

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
        title: 'Image Uploaded Successfully'
      });
      queryClient.invalidateQueries('attachementprofile');
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
        await queryClient.invalidateQueries({ queryKey: ['updateattachement'] });
      }
    }
  });
}

export function updateStudentAttachments() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const queryClient = useQueryClient();

  // eslint-disable-next-line react-hooks/rules-of-hooks
  return useMutation({
    mutationFn: (data: { schoolId: number; studentId: number; formData }) =>
      updateStudentAttachment(data.schoolId, data.studentId, data.formData),

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
        title: 'Image Uploaded Successfully'
      });
      queryClient.invalidateQueries('attachementstudentprofile');
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
        await queryClient.invalidateQueries({ queryKey: ['updateattachement'] });
      }
    }
  });
}
