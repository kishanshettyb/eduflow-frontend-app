import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast, useToast } from '@/components/ui/use-toast';
import {
  createAssignment,
  createAssignmentMapping,
  createAssignmentSubmit,
  createStudentAssignmentMapping,
  deleteAssignment,
  reviewAssignment,
  updateAssignment,
  updateAssignmentSubmit
} from '@/services/api/teacher/assignment/assignmentApi';
import { useRouter } from 'next/navigation';

export function useCreateAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => createAssignment(data),
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
        title: 'Assignment Created Successfully'
      });

      queryClient.invalidateQueries('assignmnets');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete assignment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createStandard'] });
      }
    }
  });
}
export function useDeleteAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      schoolId,
      assignmentId,
      forceDelete
    }: {
      schoolId: number;
      standardId: number;
      forceDelete: boolean;
    }) => deleteAssignment(schoolId, assignmentId, forceDelete),
    onMutate: () => {
      console.log('Deleting assignment...');
    },
    onError: (error) => {
      console.log('Error deleting assignment');
      toast({
        variant: 'destructive',
        title: 'Unable to delete assignment',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      console.log('Announcement deleted successfully');
      toast({
        variant: 'default',
        title: 'assignment Deleted Successfully'
      });
      queryClient.invalidateQueries('assignments');
    },
    onSettled: async (_, error) => {
      console.log('Delete operation settled');
      if (!error) {
        await queryClient.invalidateQueries({ queryKey: ['viewStandard'] });
      }
    }
  });
}
export function useUpdateAssignment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateAssignment(data),
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
        title: 'Assignment Updated Successfully'
      });

      queryClient.invalidateQueries('assignments');
    },

    onSettled: async (_, error) => {
      console.log('settled**');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to update Assignments',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['assignments'] });
      }
    }
  });
}

export function useCreateAssignmentMapping() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => createAssignmentMapping(data),
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
        title: 'Assignment Mapped Successfully'
      });
      queryClient.invalidateQueries('assignments');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Map Assignment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['assignments'] });
      }
    }
  });
}

export function useCreateStudentAssignmentMapping() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data) => createStudentAssignmentMapping(data),
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
        title: 'Assignment Mapped Successfully'
      });
      queryClient.invalidateQueries('assignments');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Map Assignment',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['assignments'] });
      }
    }
  });
}

export function useCreateSubmitAssignment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => createAssignmentSubmit(data),
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
        title: 'Assignment Submitted Successfully'
      });

      router.push('/student/assignments');

      queryClient.invalidateQueries('assignmnets');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Submit Assignments',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['creatassignmnetseStandard'] });
      }
    }
  });
}

export function useUpdateSubmitAssignment() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => updateAssignmentSubmit(data),
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
        title: 'Assignment Submit Updated Successfully'
      });
      router.push('/student/assignments');

      queryClient.invalidateQueries('assignmnets');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Submit Assignments',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['creatassignmnetseStandard'] });
      }
    }
  });
}

export function useUpdateReviewAssignment() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  return useMutation({
    mutationFn: (data) => reviewAssignment(data),
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
        title: 'Assignment Evaluated Successfully'
      });

      queryClient.invalidateQueries('assignmnets');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to Evaluate Assignments',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['creatassignmnetseStandard'] });
      }
    }
  });
}
