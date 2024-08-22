import { useQuery } from '@tanstack/react-query';
import { getAllCustomers, getSingleCustomer } from '../../api/superadmin/customers/customerApi';

export function useGetAllCustomers() {
  return useQuery({
    queryKey: ['customers'],
    queryFn: getAllCustomers
  });
}

export function useGetSingleCustomer(id: number | null) {
  return useQuery({
    queryKey: ['singleCustomer', id],
    queryFn: () => getSingleCustomer(id),
    enabled: !!id
  });
}
