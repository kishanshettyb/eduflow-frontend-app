import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllPeriod,
  getPeriodbyID,
  createPeriod,
  updatePeriod,
  viewPeriod,
  deletePeriod
} from '@/services/api/admin/period/periodApi';
import { Period } from '@/types/admin/periodTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Period API', () => {
  const schoolId = 1;
  const academicYearId = 1;
  const periodId = 1;
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

  const originalError = console.error;

  beforeEach(() => {
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalError;
  });

  //   test('should fetch all periods successfully', async () => {
  //     const mockPeriods: Period[] = [
  //       { id: 1, name: 'Period 1' },
  //       { id: 2, name: 'Period 2' }
  //     ];
  //     mock.onGet(`/periods/schools/${schoolId}/years/${academicYearId}`).reply(200, mockPeriods);

  //     const result = await getAllPeriod(schoolId, academicYearId);
  //     expect(result.data).toEqual(mockPeriods);
  //   });

  test('should handle error when fetching all periods', async () => {
    mock.onGet(`/periods/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(getAllPeriod(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should fetch a period by ID successfully', async () => {
  //     const mockPeriod: Period = { id: periodId, name: 'Period 1' };
  //     mock.onGet(`periods/schools/${schoolId}/periods/${periodId}`).reply(200, mockPeriod);

  //     const result = await getPeriodbyID(schoolId, periodId);
  //     expect(result.data).toEqual(mockPeriod);
  //   });

  test('should handle error when fetching a period by ID', async () => {
    mock.onGet(`periods/schools/${schoolId}/periods/${periodId}`).reply(500);

    await expect(getPeriodbyID(schoolId, periodId)).rejects.toThrow();
  });

  //   test('should create a period successfully', async () => {
  //     const newPeriod: Period = { id: 1, name: 'New Period' };
  //     mock.onPost('periods').reply(201, newPeriod);

  //     const result = await createPeriod(newPeriod);
  //     expect(result.data).toEqual(newPeriod);
  //   });

  test('should handle error when creating a period', async () => {
    const newPeriod: Period = { id: 1, name: 'New Period' };
    mock.onPost('periods').reply(500);

    await expect(createPeriod(newPeriod)).rejects.toThrow();
  });

  //   test('should update a period successfully', async () => {
  //     const updatedPeriod: Period = { id: periodId, name: 'Updated Period' };
  //     mock.onPut('periods').reply(200, updatedPeriod);

  //     const result = await updatePeriod(updatedPeriod);
  //     expect(result.data).toEqual(updatedPeriod);
  //   });

  test('should handle error when updating a period', async () => {
    const updatedPeriod: Period = { id: periodId, name: 'Updated Period' };
    mock.onPut('periods').reply(500);

    await expect(updatePeriod(updatedPeriod)).rejects.toThrow();
  });

  //   test('should view periods successfully', async () => {
  //     const mockPeriods: Period[] = [
  //       { id: 1, name: 'Period 1' },
  //       { id: 2, name: 'Period 2' }
  //     ];
  //     mock.onGet(`periods/schools/${schoolId}/years/${academicYearId}`).reply(200, mockPeriods);

  //     const result = await viewPeriod(schoolId, academicYearId);
  //     expect(result.data).toEqual(mockPeriods);
  //   });

  test('should handle error when viewing periods', async () => {
    mock.onGet(`periods/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(viewPeriod(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should delete a period successfully', async () => {
  //     mock.onDelete(`periods/schools/${schoolId}/periods/${periodId}`).reply(200);

  //     const result = await deletePeriod(schoolId, periodId);
  //     expect(result.status).toEqual(200);
  //   });

  test('should handle error when deleting a period', async () => {
    mock.onDelete(`periods/schools/${schoolId}/periods/${periodId}`).reply(500);

    await expect(deletePeriod(schoolId, periodId)).rejects.toThrow();
  });
});
