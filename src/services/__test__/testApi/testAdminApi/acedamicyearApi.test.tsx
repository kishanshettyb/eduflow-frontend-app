import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  viewAcademicYear,
  getAcademicYearbyID,
  isDefaultCheckAcademicYear,
  createAcademicYear,
  updateAcademicYear
} from '@/services/api/admin/acedamicyear/acedamicyearApi';
import { AcademicYear } from '@/types/admin/academicYearTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Academic Year API', () => {
  const schoolId = 1;
  const academicYearId = 1;
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

  //   test('should fetch academic years successfully', async () => {
  //     const mockAcademicYears: AcademicYear[] = [
  //       { id: 1, name: 'Academic Year 1' },
  //       { id: 2, name: 'Academic Year 2' }
  //     ];
  //     mock.onGet(`academic-years/schools/${schoolId}`).reply(200, mockAcademicYears);

  //     const result = await viewAcademicYear(schoolId);
  //     expect(result.data).toEqual(mockAcademicYears);
  //   });

  test('should handle error when fetching academic years', async () => {
    mock.onGet(`academic-years/schools/${schoolId}`).reply(500);

    await expect(viewAcademicYear(schoolId)).rejects.toThrow();
  });

  //   test('should fetch a specific academic year successfully', async () => {
  //     const mockAcademicYear: AcademicYear = { id: academicYearId, name: 'Academic Year 1' };
  //     mock
  //       .onGet(`academic-years/schools/${schoolId}/years/${academicYearId}`)
  //       .reply(200, mockAcademicYear);

  //     const result = await getAcademicYearbyID(schoolId, academicYearId);
  //     expect(result.data).toEqual(mockAcademicYear);
  //   });

  test('should handle error when fetching a specific academic year', async () => {
    mock.onGet(`academic-years/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(getAcademicYearbyID(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should check if academic year is default successfully', async () => {
  //     const mockAcademicYear: AcademicYear = { id: 1, name: 'Academic Year 1', isDefault: true };
  //     mock.onGet(`academic-years/checkIsDefault/schools/${schoolId}`).reply(200, mockAcademicYear);

  //     const result = await isDefaultCheckAcademicYear(schoolId);
  //     expect(result.data).toEqual(mockAcademicYear);
  //   });

  test('should handle error when checking if academic year is default', async () => {
    mock.onGet(`academic-years/checkIsDefault/schools/${schoolId}`).reply(500);

    await expect(isDefaultCheckAcademicYear(schoolId)).rejects.toThrow();
  });

  //   test('should create a new academic year successfully', async () => {
  //     const newAcademicYear: AcademicYear = { id: 1, name: 'New Academic Year' };
  //     mock.onPost('academic-years').reply(201, newAcademicYear);

  //     const result = await createAcademicYear(newAcademicYear);
  //     expect(result).toEqual(newAcademicYear);
  //   });

  test('should handle error when creating a new academic year', async () => {
    const newAcademicYear: AcademicYear = { id: 1, name: 'New Academic Year' };
    mock.onPost('academic-years').reply(500);

    await expect(createAcademicYear(newAcademicYear)).rejects.toThrow();
  });

  //   test('should update an academic year successfully', async () => {
  //     const updatedAcademicYear: AcademicYear = { id: academicYearId, name: 'Updated Academic Year' };
  //     mock.onPut('academic-years').reply(200, updatedAcademicYear);

  //     const result = await updateAcademicYear(updatedAcademicYear);
  //     expect(result).toEqual(updatedAcademicYear);
  //   });

  test('should handle error when updating an academic year', async () => {
    const updatedAcademicYear: AcademicYear = { id: academicYearId, name: 'Updated Academic Year' };
    mock.onPut('academic-years').reply(500);

    await expect(updateAcademicYear(updatedAcademicYear)).rejects.toThrow();
  });
});
