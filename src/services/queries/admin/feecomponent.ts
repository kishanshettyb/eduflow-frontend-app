import { useQuery } from '@tanstack/react-query';
import {
  getAllFeeComponent,
  getFeeComponentbyID,
  viewFeeComponent
} from '../../api/admin/fees/fee';

export function useGetAllFeeComponent(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['feecomponent', schoolId, acedamicyearId],
    queryFn: () => getAllFeeComponent(schoolId, acedamicyearId),
    enabled: !!schoolId
  });
}

export function useViewFeeComponent(schoolId: number, acedamicyearId: number) {
  return useQuery({
    queryKey: ['viewFeeComponent', schoolId, acedamicyearId],
    queryFn: () => viewFeeComponent(schoolId, acedamicyearId)
  });
}
export function useGetSingleFeeComponent(schoolId: number, id: number) {
  return useQuery({
    queryKey: ['singleFeeComponent', schoolId, id],
    queryFn: () => getAllFeeComponent(schoolId, id!),
    enabled: !!id
  });
}

export function useGetFeeComponentbyID(schoolId: number, feeComponentId: number) {
  return useQuery({
    queryKey: ['getFeeComponentById', schoolId, feeComponentId],
    queryFn: () => getFeeComponentbyID(schoolId, feeComponentId!)
  });
}

export function useGetDeletebyID(schoolId: number, feeComponentId: number) {
  return useQuery({
    queryKey: ['getFeeComponentById', schoolId, feeComponentId],
    queryFn: () => getFeeComponentbyID(schoolId, feeComponentId!)
  });
}
