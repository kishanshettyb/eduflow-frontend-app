import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetPolicy, useGetPolicyByRoleName } from '@/services/queries/admin/policy';

// Mock the API functions
jest.mock('@/services/api/admin/policy/policyApi', () => ({
  getPolicy: jest.fn(() => Promise.resolve({ data: { id: 1, policy: 'General Policy' } })),
  getPolicyByRoleName: jest.fn(() =>
    Promise.resolve({ data: { roleName: 'Admin', policy: 'Admin Policy' } })
  )
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Policy Hooks', () => {
  it('should fetch policy by role name', async () => {
    const { result, waitFor } = renderHook(() => useGetPolicyByRoleName(1, 'Admin'), { wrapper });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ data: { roleName: 'Admin', policy: 'Admin Policy' } });
  });

  it('should fetch policy', async () => {
    const { result, waitFor } = renderHook(() => useGetPolicy(1), { wrapper });
    await waitFor(() => result.current.isSuccess);
    expect(result.current.data).toEqual({ data: { id: 1, policy: 'General Policy' } });
  });
});
