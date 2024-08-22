/* eslint-disable no-unsafe-optional-chaining */
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { Admin, Qualification, WorkExperience } from '@/types/superadmin/adminTypes';
import { toast } from '@/components/ui/use-toast';
import {
  createAdmin,
  createQualification,
  createWorkExperience,
  updateAdmin,
  updateQualification,
  updateWorkExperience
} from '@/services/api/superadmin/admins/adminApi';
import { deleteQualification, deleteWorkExperience } from '@/services/api/admin/staff/staffApi';

export function useCreateAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Admin) => createAdmin(data),
    onMutate: () => {
      console.log('mutate');
    },

    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to create admin',
        description: error.response.data.message
      });
    },

    onSuccess: async (response) => {
      console.log('Create Admin Success Response:', response);
      toast({
        variant: 'default',
        title: 'Admin Added Successfully'
      });

      // Invalidate queries here to update the cache only on success
      await queryClient.invalidateQueries({ queryKey: ['createAdmin'] });
      queryClient.invalidateQueries('createAdmin');
    },

    onSettled: (_, error) => {
      console.log('settled');
      if (error) {
        console.log(error);
      }
    }
  });
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Admin) => updateAdmin(data),
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

    onSuccess: async (response) => {
      console.log('Update Admin Success Response:', response);
      toast({
        variant: 'default',
        title: 'Admin Updated Successfully'
      });

      await queryClient.invalidateQueries({ queryKey: ['updateAdmin'] });
      queryClient.invalidateQueries('updateAdmin');
    },

    onSettled: (_, error) => {
      console.log('settled');
      if (error) {
        console.log(error);
      }
    }
  });
}

export function useCreateQualification() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Qualification) => createQualification(data),
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

    onSuccess: async (response) => {
      console.log('Create Qualification Success Response:', response);
      toast({
        variant: 'default',
        title: 'Qualification Added Successfully'
      });

      await queryClient.invalidateQueries({ queryKey: ['createQualification'] });
      queryClient.invalidateQueries('createQualification');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Qualification',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createQualification'] });
      }
    }
  });
}

export function useUpdateQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Qualification) => updateQualification(data),
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

    onSuccess: async (response) => {
      console.log('Update Qualification Success Response:', response);
      toast({
        variant: 'default',
        title: 'Qualification Updated Successfully'
      });

      await queryClient.invalidateQueries({ queryKey: ['updateQualification'] });
      queryClient.invalidateQueries('updateQualification');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update Qualification',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateQualification'] });
      }
    }
  });
}

export function useCreateWorkExperience() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: WorkExperience) => createWorkExperience(data),
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

    onSuccess: async (response) => {
      console.log('Create WorkExperience Success Response:', response);
      toast({
        variant: 'default',
        title: 'WorkExperience Added Successfully'
      });

      await queryClient.invalidateQueries({ queryKey: ['createWorkExperience'] });
      queryClient.invalidateQueries('createWorkExperience');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to create WorkExperience',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createWorkExperience'] });
      }
    }
  });
}

export function useUpdateWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: WorkExperience) => updateWorkExperience(data),
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

    onSuccess: async (response) => {
      console.log('Update WorkExperience Success Response:', response);
      toast({
        variant: 'default',
        title: 'WorkExperience Updated Successfully'
      });

      await queryClient.invalidateQueries({ queryKey: ['updateWorkExperience'] });
      queryClient.invalidateQueries('updateWorkExperience');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update WorkExperience',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['updateWorkExperience'] });
      }
    }
  });
}

export function useDeleteQualification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schoolId,
      staffId,
      qualificationId
    }: {
      schoolId: number;
      staffId: number;
      qualificationId: number;
    }) => deleteQualification(schoolId, staffId, qualificationId),
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
        variant: 'primary',
        title: 'Files Deleted Successfully'
      });
      queryClient.invalidateQueries('singleQualification');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}

export function useDeleteWorkExperience() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schoolId,
      staffId,
      workExperienceId
    }: {
      schoolId: number;
      staffId: number;
      workExperienceId: number;
    }) => deleteWorkExperience(schoolId, staffId, workExperienceId),
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
        variant: 'primary',
        title: 'Files Deleted Successfully'
      });
      queryClient.invalidateQueries('singleWorkExperience');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['documents'] });
      }
    }
  });
}
