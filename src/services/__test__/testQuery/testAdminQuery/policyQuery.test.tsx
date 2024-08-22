import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { useGetPolicy, useGetPolicyByRoleName } from '@/services/queries/admin/policy';

// Mock the API functions
jest.mock('@/services/api/admin/policy/policyApi', () => ({
  getPolicy: jest.fn(),
  getPolicyByRoleName: jest.fn()
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('Policy Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not fetch policy by role name if role name is empty', async () => {
    const { result } = renderHook(() => useGetPolicyByRoleName(1, ''), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });

  it('should not fetch policy if schoolId is not provided', async () => {
    const { result } = renderHook(() => useGetPolicy(0), { wrapper });

    expect(result.current.isFetching).toBe(false);
    expect(result.current.data).toBeUndefined();
  });
});
