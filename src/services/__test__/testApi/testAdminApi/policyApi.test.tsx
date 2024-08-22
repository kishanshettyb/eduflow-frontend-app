import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

import { PolicyRule } from '@/types/admin/policyType';
import {
  assignPolicy,
  deletePolicy,
  editPolicy,
  getPolicy,
  getPolicyByRoleName,
  multiplePolicyUpdate
} from '@/services/api/admin/policy/policyApi';

jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Policy API', () => {
  const mock = new MockAdapter(axios);
  const token = 'mock-token';
  const schoolId = 1;
  const roleName = 'Admin';
  const policyRuleId = 1;
  const data: PolicyRule = { id: 1, name: 'Test Policy', rules: [] };

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should handle error when getting policy by role name', async () => {
    mock.onGet(`policy-rules/schools/${schoolId}/roleName/${roleName}`).reply(500);
    await expect(getPolicyByRoleName(schoolId, roleName)).rejects.toThrow();
  });

  test('should handle error when getting policy', async () => {
    mock.onGet(`policy-rules/resources/schools/${schoolId}`).reply(500);
    await expect(getPolicy(schoolId)).rejects.toThrow();
  });

  test('should handle error when deleting policy', async () => {
    mock
      .onDelete(`policy-rules/deletePolicyRule/schools/${schoolId}/policy-rule/${policyRuleId}`)
      .reply(500);
    await expect(deletePolicy(schoolId, policyRuleId)).rejects.toThrow();
  });

  test('should handle error when editing policy', async () => {
    mock.onPut(`policy-rules/edit/${policyRuleId}`).reply(500);
    await expect(editPolicy(policyRuleId, data)).rejects.toThrow();
  });

  test('should handle error when updating multiple policies', async () => {
    mock.onPut('policy-rules/multiple').reply(500);
    await expect(multiplePolicyUpdate(data)).rejects.toThrow();
  });

  test('should handle error when assigning policy', async () => {
    mock.onPost(`policy-rules/roleName/${roleName}`).reply(500);
    await expect(assignPolicy(roleName, data)).rejects.toThrow();
  });
});
