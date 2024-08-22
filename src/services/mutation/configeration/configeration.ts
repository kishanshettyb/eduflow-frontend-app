import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createConfigeration,
  createSchoolSetting,
  updateConfigeration,
  updateSchoolSetting
} from '@/services/api/configeration/configerationApi';

export function useCreateConfigeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createConfigeration(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      queryClient.invalidateQueries('configeration');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['configeration'] });
      }
    }
  });
}

export function useUpdateConfigeration() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateConfigeration(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      queryClient.invalidateQueries('configeration');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['configeration'] });
      }
    }
  });
}

export function useCreateSchoolSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => createSchoolSetting(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');

      queryClient.invalidateQueries('school-settings');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['school-settings'] });
      }
    }
  });
}

export function useUpdateSchoolSetting() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => updateSchoolSetting(data),
    onMutate: () => {
      console.log('mutate!!!');
    },

    onError: () => {
      console.log('error!!!');
    },

    onSuccess: () => {
      console.log('success!!!');
      queryClient.invalidateQueries('school-settings');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
      } else {
        await queryClient.invalidateQueries({ queryKey: ['school-settings'] });
      }
    }
  });
}
