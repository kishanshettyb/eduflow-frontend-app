// /* eslint-disable no-unsafe-optional-chaining */
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { toast } from '@/components/ui/use-toast';
// import { Staff, Qualification, WorkExperience } from '@/types/admin/staffType';
// import { createQualification, createStaff, createWorkExperience } from '@/services/api/admin/staff/staffApi';

// export function useCreateStaff() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: Staff) => createStaff(data),
//     onMutate: () => {
//       console.log('mutate');
//     },

//     onError: (error) => {
//       console.error('Create Admin Error:', error);
//       toast({
//         variant: 'destructive',
//         title: 'Uh oh! Something went wrong.',
//         description: 'There was a problem with your request.'
//       });
//     },

//     onSuccess: async (response) => {
//       console.log('Create Admin Success Response:', response);
//       toast({
//         variant: 'default',
//         title: 'Admin Added Successfully'
//       });

//       // Invalidate queries here to update the cache only on success
//       await queryClient.invalidateQueries({ queryKey: ['createAdmin'] });
//     },

//     onSettled: (_, error) => {
//       console.log('settled');
//       if (error) {
//         console.log(error);
//       }
//     }
//   });
// }

// export function useCreateQualification() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: Qualification) => createQualification(data),
//     onMutate: () => {
//       console.log('mutate');
//     },

//     onError: () => {
//       toast({
//         variant: 'destructive',
//         title: 'Uh oh! Something went wrong.',
//         description: 'There was a problem with your request.'
//       });
//     },

//     onSuccess: () => {
//       toast({
//         variant: 'default',
//         title: 'Qualification Added Successfully'
//       });
//     },
//     onSettled: async (_, error) => {
//       console.log('settled');
//       if (error) {
//         console.log(error);
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ['createQualification'] });
//       }
//     }
//   });
// }

// export function useCreateWorkExperience() {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: (data: WorkExperience) => createWorkExperience(data),
//     onMutate: () => {
//       console.log('mutate');
//     },

//     onError: () => {
//       toast({
//         variant: 'destructive',
//         title: 'Uh oh! Something went wrong.',
//         description: 'There was a problem with your request.'
//       });
//     },
//     onSuccess: () => {
//       toast({
//         variant: 'default',
//         title: 'WorkExperience Added Successfully'
//       });
//     },
//     onSettled: async (_, error) => {
//       console.log('settled');
//       if (error) {
//         console.log(error);
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ['createWorkExperience'] });
//       }
//     }
//   });
// }
