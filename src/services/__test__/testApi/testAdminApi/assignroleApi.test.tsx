import { assignRole, deleteAssignRole } from '@/services/api/admin/assignrole/assignroleApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Roles API', () => {
  const mock = new MockAdapter(axios);
  const token = 'mock-token';
  const schoolId = 1;
  const staffId = 1;
  const roleId = 1;
  const data = { role: 'Teacher' };

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should handle error when assigning role', async () => {
    mock.onPost(`users/assign-role/schools/${schoolId}/staffs/${staffId}`).reply(500);
    await expect(assignRole(schoolId, staffId, data)).rejects.toThrow();
  });

  test('should handle error when deleting assigned role', async () => {
    mock.onDelete(`users/schools/${schoolId}/staffs/${staffId}/roles/${roleId}`).reply(500);
    await expect(deleteAssignRole(schoolId, staffId, roleId)).rejects.toThrow();
  });
});
