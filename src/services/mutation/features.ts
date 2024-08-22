import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast, useToast } from '@/components/ui/use-toast';
import { createFeatures, updateFeatures } from '../api/policyrules/policyrules';
import { Features } from '@/types/admin/features';

export function useCreateFeatures() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  //   const router = useRouter();

  return useMutation({
    mutationFn: (data: Features) => createFeatures(data),
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
        title: 'Features Created Successfully'
      });
      //   router.push('/admin/academic-years');
      queryClient.invalidateQueries('features');
    },

    onSettled: async (_, error) => {
      console.log('settled');
      if (error) {
        console.log('Show Error: ' + error);
        toast({
          variant: 'destructive',
          title: 'Unable to crete Features',
          description: error.response.data.message
        });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['createFeatures'] });
      }
    }
  });
}

// export function useUpdateFeatureStatus() {
//   const queryClient = useQueryClient();
//   const { toast } = useToast();
//   //   const router = useRouter();

//   return useMutation({
//     mutationFn: (data: { schoolId: number; data }) => updateFeatures(data.schoolId, data.data),
//     onMutate: () => {
//       console.log('mutate!!!');
//     },

//     onError: () => {
//       console.log('error!!!');
//     },

//     onSuccess: () => {
//       console.log('success!!!');
//       toast({
//         variant: 'default',
//         title: 'Features Update Successfully'
//       });
//       //   router.push('/admin/academic-years');
//       queryClient.invalidateQueries('featuresupdate');
//     },

//     onSettled: async (_, error) => {
//       console.log('settled');
//       if (error) {
//         console.log('Show Error: ' + error);
//         toast({
//           variant: 'destructive',
//           title: 'Unable to Update Features',
//           description: error.response.data.message
//         });
//       } else {
//         await queryClient.invalidateQueries({ queryKey: ['updateFeatures'] });
//       }
//     }
//   });
// }

export function useUpdateFeatureStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: { schoolId: number; data }) => updateFeatures(data.schoolId, data.data),
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Unable to update Features',
        description: error.response?.data?.message || 'An error occurred'
      });
    },
    onSuccess: () => {
      toast({
        variant: 'default',
        title: 'Features updated successfully'
      });

      queryClient.invalidateQueries('Features');
    }
  });
}
