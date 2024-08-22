import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, useToast } from '@/components/ui/use-toast';
import { Announcement } from '@/types/admin/announcementTypes';
import {
  createAnnouncement,
  deleteAnnouncement,
  dismissNotification,
  publishAnnouncement,
  readNotification,
  updateAnnouncement
} from '@/services/api/announcement/announcementApi';

export function useCreateAnnouncement() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: Announcement) => createAnnouncement(data),
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
        title: 'Announcement Created Successfully'
      });
      queryClient.invalidateQueries('announcements');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Announcement',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createAnnouncement'] });
      }
    }
  });
}

export function useUpdateAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Announcement) => updateAnnouncement(data),
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
        title: 'Announcement Updated Successfully'
      });
      queryClient.invalidateQueries('announcements');
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
        await queryClient.invalidateQueries({ queryKey: ['updateAnnouncement'] });
      }
    }
  });
}
export function useDeleteAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ schoolId, announcementId }: { schoolId: number; announcementId: number }) =>
      deleteAnnouncement(schoolId, announcementId),
    onMutate: () => {
      console.log('Deleting Announcement...');
    },
    onError: (error) => {
      console.log('Error deleting Announcement');
      toast({
        variant: 'destructive',
        title: 'Unable to delete Announcement',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Announcement deleted successfully');
      toast({
        default: 'primary',
        title: 'Announcement Deleted Successfully'
      });
      queryClient.invalidateQueries('announcements');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewAnnouncement'] });
      }
    }
  });
}

export function usePublishAnnouncement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Announcement) => publishAnnouncement(data),
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
        title: 'Announcement Published Successfully'
      });
      queryClient.invalidateQueries('announcements');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to publish',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateAnnouncement'] });
      }
    }
  });
}

export function useReadNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { schoolId: number; payload: unknown }) =>
      readNotification(data.schoolId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries('notifications');
    }
  });
}

export function useDismissNotification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { schoolId: number; payload: unknown }) =>
      dismissNotification(data.schoolId, data.payload),
    onSuccess: () => {
      queryClient.invalidateQueries('notifications');
    }
  });
}
