import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

import {
  getAllAdmins,
  getAllStaffs,
  getSingleAdmin,
  getSingleStaff,
  createAdmin,
  updateAdmin,
  createQualification,
  getSingleQualification,
  updateQualification,
  createWorkExperience,
  getSingleWorkExperience,
  updateWorkExperience
} from '@/services/api/superadmin/admins/adminApi';
import { Admin, Qualification, WorkExperience } from '@/types/superadmin/adminTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Admin API', () => {
  const schoolId = 1;
  const adminId = 1;
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

  // test('should get all admins successfully', async () => {
  //   const mockAdmins: Admin[] = [
  //     { id: 1, name: 'Admin 1' },
  //     { id: 2, name: 'Admin 2' }
  //   ];
  //   mock.onGet(`staffs/schools/${schoolId}/admins`).reply(200, mockAdmins);

  //   const result = await getAllAdmins(schoolId);
  //   expect(result.data).toEqual(mockAdmins);
  // });

  test('should handle error when getting all admins', async () => {
    mock.onGet(`staffs/schools/${schoolId}/admins`).reply(500);

    await expect(getAllAdmins(schoolId)).rejects.toThrow();
  });

  // test('should get all staffs successfully', async () => {
  //   const mockStaffs: Staff[] = [
  //     { id: 1, name: 'Staff 1' },
  //     { id: 2, name: 'Staff 2' }
  //   ];
  //   mock.onGet(`staffs/schools/${schoolId}`).reply(200, mockStaffs);

  //   const result = await getAllStaffs(schoolId);
  //   expect(result.data).toEqual(mockStaffs);
  // });

  test('should handle error when getting all staffs', async () => {
    mock.onGet(`staffs/schools/${schoolId}`).reply(500);

    await expect(getAllStaffs(schoolId)).rejects.toThrow();
  });

  // test('should get a single admin successfully', async () => {
  //   const mockAdmin: Admin = { id: adminId, name: 'Admin 1' };
  //   mock.onGet(`staffs/schools/${schoolId}/staffs/${adminId}`).reply(200, [mockAdmin]);

  //   const result = await getSingleAdmin(schoolId, adminId);
  //   expect(result.data).toEqual([mockAdmin]);
  // });

  test('should handle error when getting a single admin', async () => {
    mock.onGet(`staffs/schools/${schoolId}/staffs/${adminId}`).reply(500);

    await expect(getSingleAdmin(schoolId, adminId)).rejects.toThrow();
  });

  // test('should get a single staff successfully', async () => {
  //   const mockStaff: Staff = { id: staffId, name: 'Staff 1' };
  //   mock.onGet(`staffs/schools/${schoolId}/staffs/${staffId}`).reply(200, [mockStaff]);

  //   const result = await getSingleStaff(schoolId, staffId);
  //   expect(result.data).toEqual([mockStaff]);
  // });

  test('should handle error when getting a single staff', async () => {
    mock.onGet(`staffs/schools/${schoolId}/staffs/${staffId}`).reply(500);

    await expect(getSingleStaff(schoolId, staffId)).rejects.toThrow();
  });

  // test('should create a new admin successfully', async () => {
  //   const mockAdmin: Admin = { id: adminId, name: 'Admin 1' };
  //   mock.onPost('staffs').reply(201, mockAdmin);

  //   const result = await createAdmin(mockAdmin);
  //   expect(result).toEqual(mockAdmin);
  // });

  test('should handle error when creating a new admin', async () => {
    const mockAdmin: Admin = { id: adminId, name: 'Admin 1' };
    mock.onPost('staffs').reply(500);

    await expect(createAdmin(mockAdmin)).rejects.toThrow();
  });

  // test('should update an admin successfully', async () => {
  //   const mockAdmin: Admin = { id: adminId, name: 'Admin Updated' };
  //   mock.onPut('staffs').reply(200, mockAdmin);

  //   const result = await updateAdmin(mockAdmin);
  //   expect(result).toEqual(mockAdmin);
  // });

  test('should handle error when updating an admin', async () => {
    const mockAdmin: Admin = { id: adminId, name: 'Admin Updated' };
    mock.onPut('staffs').reply(500);

    await expect(updateAdmin(mockAdmin)).rejects.toThrow();
  });

  // test('should create a new qualification successfully', async () => {
  //   const mockQualification: Qualification = { id: 1, name: 'Qualification 1' };
  //   mock.onPost('staffs/qualifications').reply(201, mockQualification);

  //   const result = await createQualification(mockQualification);
  //   expect(result).toEqual(mockQualification);
  // });

  test('should handle error when creating a new qualification', async () => {
    const mockQualification: Qualification = { id: 1, name: 'Qualification 1' };
    mock.onPost('staffs/qualifications').reply(500);

    await expect(createQualification(mockQualification)).rejects.toThrow();
  });

  // test('should get a single qualification successfully', async () => {
  //   const mockQualification: Qualification = { id: 1, name: 'Qualification 1' };
  //   mock
  //     .onGet(`staffs/qualifications/schools/${schoolId}/staffs/${adminId}`)
  //     .reply(200, [mockQualification]);

  //   const result = await getSingleQualification(schoolId, adminId);
  //   expect(result).toEqual([mockQualification]);
  // });

  test('should handle error when getting a single qualification', async () => {
    mock.onGet(`staffs/qualifications/schools/${schoolId}/staffs/${adminId}`).reply(500);

    await expect(getSingleQualification(schoolId, adminId)).rejects.toThrow();
  });

  // test('should update a qualification successfully', async () => {
  //   const mockQualification: Qualification = { id: 1, name: 'Qualification Updated' };
  //   mock.onPut('staffs/qualifications').reply(200, mockQualification);

  //   const result = await updateQualification(mockQualification);
  //   expect(result).toEqual(mockQualification);
  // });

  test('should handle error when updating a qualification', async () => {
    const mockQualification: Qualification = { id: 1, name: 'Qualification Updated' };
    mock.onPut('staffs/qualifications').reply(500);

    await expect(updateQualification(mockQualification)).rejects.toThrow();
  });

  // test('should create a new work experience successfully', async () => {
  //   const mockWorkExperience: WorkExperience = { id: 1, companyName: 'Company 1' };
  //   mock.onPost('staffs/workExperiences').reply(201, mockWorkExperience);

  //   const result = await createWorkExperience(mockWorkExperience);
  //   expect(result).toEqual(mockWorkExperience);
  // });

  test('should handle error when creating a new work experience', async () => {
    const mockWorkExperience: WorkExperience = { id: 1, companyName: 'Company 1' };
    mock.onPost('staffs/workExperiences').reply(500);

    await expect(createWorkExperience(mockWorkExperience)).rejects.toThrow();
  });

  // test('should get a single work experience successfully', async () => {
  //   const mockWorkExperience: WorkExperience = { id: 1, companyName: 'Company 1' };
  //   mock
  //     .onGet(`staffs/workExperiences/schools/${schoolId}/staffs/${adminId}`)
  //     .reply(200, [mockWorkExperience]);

  //   const result = await getSingleWorkExperience(schoolId, adminId);
  //   expect(result).toEqual([mockWorkExperience]);
  // });

  test('should handle error when getting a single work experience', async () => {
    mock.onGet(`staffs/workExperiences/schools/${schoolId}/staffs/${adminId}`).reply(500);

    await expect(getSingleWorkExperience(schoolId, adminId)).rejects.toThrow();
  });

  // test('should update a work experience successfully', async () => {
  //   const mockWorkExperience: WorkExperience = { id: 1, companyName: 'Company Updated' };
  //   mock.onPut('staffs/workExperiences').reply(200, mockWorkExperience);

  //   const result = await updateWorkExperience(mockWorkExperience);
  //   expect(result).toEqual(mockWorkExperience);
  // });

  test('should handle error when updating a work experience', async () => {
    const mockWorkExperience: WorkExperience = { id: 1, companyName: 'Company Updated' };
    mock.onPut('staffs/workExperiences').reply(500);

    await expect(updateWorkExperience(mockWorkExperience)).rejects.toThrow();
  });
});
