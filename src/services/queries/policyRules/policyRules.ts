import {
  getAllFeatures,
  getFeatures,
  getPolicyRules
} from '@/services/api/policyrules/policyrules';
import { useQuery } from '@tanstack/react-query';

export function useGetPolicyRules(schoolId: number, loggedInRole: string) {
  return useQuery({
    queryKey: ['getPolicyRules', schoolId, loggedInRole],
    queryFn: async () => {
      const response = await getPolicyRules(schoolId, loggedInRole);
      return response.data;
    },
    enabled: !!loggedInRole
  });
}

export function useGetFeatures(schoolId: number, loggedInRole: string) {
  return useQuery({
    queryKey: ['getFeatures', schoolId, loggedInRole],
    queryFn: async () => {
      const response = await getFeatures(schoolId, loggedInRole);
      return response.data;
    },
    enabled: !!loggedInRole
  });
}

export function useGetAllFeatures(schoolId: number) {
  return useQuery({
    queryKey: ['getFeatures', schoolId],
    queryFn: async () => {
      const response = await getAllFeatures(schoolId);
      return response.data;
    },
    enabled: !!schoolId
  });
}
