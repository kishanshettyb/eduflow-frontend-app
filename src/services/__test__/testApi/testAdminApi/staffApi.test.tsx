import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllStaffs,
  createStaff,
  updateStaff,
  getQualification,
  createQualification,
  getWorkExperience,
  createWorkExperience
} from '@/services/api/admin/staff/staffApi';
import { Qualification, Staff, WorkExperience } from '@/types/admin/staffType';
import {
  updateQualification,
  updateWorkExperience
} from '@/services/api/superadmin/admins/adminApi';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Staff API', () => {
  const schoolId = 1;
  const staffId = 1;
  const token = 'mock-token';

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should handle error when fetching all staffs', async () => {
    mock.onGet(`staffs/schools/${schoolId}`).reply(500);

    await expect(getAllStaffs(schoolId)).rejects.toThrow();
  });

  test('should handle error when creating a staff', async () => {
    const newStaff: Staff = { id: 1, name: 'New Staff' };
    mock.onPost('staffs').reply(500);

    await expect(createStaff(newStaff)).rejects.toThrow();
  });

  test('should handle error when updating a staff', async () => {
    const updatedStaff: Staff = { id: staffId, name: 'Updated Staff' };
    mock.onPut('staffs').reply(500);

    await expect(updateStaff(updatedStaff)).rejects.toThrow();
  });

  test('should handle error when fetching qualifications of a staff', async () => {
    mock.onGet(`staffs/qualifications/schools/${schoolId}/staffs/${staffId}`).reply(500);

    await expect(getQualification(schoolId, staffId)).rejects.toThrow();
  });

  test('should handle error when creating a qualification', async () => {
    const newQualification: Staff = { id: 1, name: 'New Qualification' };
    mock.onPost('staffs/qualifications').reply(500);

    await expect(createQualification(newQualification)).rejects.toThrow();
  });

  test('should handle error when fetching work experiences of staffs', async () => {
    mock.onGet(`staffs/schools/${schoolId}`).reply(500);

    await expect(getWorkExperience(schoolId)).rejects.toThrow();
  });

  test('should handle error when creating a work experience', async () => {
    const newWorkExperience: Staff = { id: 1, name: 'New Work Experience' };
    mock.onPost('staffs/workExperiences').reply(500);

    await expect(createWorkExperience(newWorkExperience)).rejects.toThrow();
  });

  test('should handle error when updating a qualification', async () => {
    const updatedQualification: Qualification = { id: 1, name: 'Updated Qualification' };
    mock.onPut('staffs/qualifications').reply(500);

    await expect(updateQualification(updatedQualification)).rejects.toThrow();
  });

  test('should successfully update a qualification', async () => {
    const updatedQualification: Qualification = { id: 1, name: 'Updated Qualification' };
    mock.onPut('staffs/qualifications').reply(200, updatedQualification);

    const response = await updateQualification(updatedQualification);
    expect(response).toEqual(updatedQualification);
  });

  // Test cases for updateWorkExperience API
  test('should handle error when updating a work experience', async () => {
    const updatedWorkExperience: WorkExperience = { id: 1, name: 'Updated Work Experience' };
    mock.onPut('staffs/workExperiences').reply(500);

    await expect(updateWorkExperience(updatedWorkExperience)).rejects.toThrow();
  });

  test('should successfully update a work experience', async () => {
    const updatedWorkExperience: WorkExperience = { id: 1, name: 'Updated Work Experience' };
    mock.onPut('staffs/workExperiences').reply(200, updatedWorkExperience);

    const response = await updateWorkExperience(updatedWorkExperience);
    expect(response).toEqual(updatedWorkExperience);
  });
});
