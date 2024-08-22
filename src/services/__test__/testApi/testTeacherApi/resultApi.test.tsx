import {
  getAllResultPagination,
  getAllResultStudent,
  getAllResultTable,
  publishResult,
  updateResult,
  verifyResult
} from '@/services/api/teacher/result/resultApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Result API', () => {
  const schoolId = 1;
  const examTypeId = 1;
  const standard = '10';
  const section = 'A';
  const subjectId = 1;
  const academicYearId = 1;
  const subjectTypeId = 1;
  const studentId = 1;
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

  test('should handle error when fetching all result tables', async () => {
    mock
      .onGet(
        `results/schools/${schoolId}/examTypes/${examTypeId}/standards/${standard}/sections/${section}/subjects/${subjectId}/years/${academicYearId}/subjectTypes/${subjectTypeId}`
      )
      .reply(500);

    await expect(
      getAllResultTable(
        schoolId,
        examTypeId,
        standard,
        section,
        subjectId,
        academicYearId,
        subjectTypeId
      )
    ).rejects.toThrow();
  });

  test('should handle error when updating a result', async () => {
    const data = { results: [] };
    mock.onPut(`results/schools/${schoolId}`).reply(500);

    await expect(updateResult(schoolId, data)).rejects.toThrow();
  });

  test('should handle error when verifying a result', async () => {
    const data = { verified: true };
    mock
      .onPut(
        `results/schools/${schoolId}/examTypes/${examTypeId}/standards/${standard}/sections/${section}/subjects/${subjectId}/subjectTypes/${subjectTypeId}`,
        data
      )
      .reply(500);

    await expect(
      verifyResult(schoolId, examTypeId, standard, section, subjectId, subjectTypeId, data)
    ).rejects.toThrow();
  });

  test('should handle error when publishing a result', async () => {
    mock
      .onPut(
        `results/publish/schools/${schoolId}/examTypes/${examTypeId}/standards/${standard}/sections/${section}`
      )
      .reply(500);

    await expect(publishResult(schoolId, examTypeId, standard, section)).rejects.toThrow();
  });

  test('should handle error when fetching all results for a student', async () => {
    mock
      .onGet(
        `results/schools/${schoolId}/years/${academicYearId}/examTypes/${examTypeId}/students/${studentId}`
      )
      .reply(500);

    await expect(
      getAllResultStudent(schoolId, academicYearId, examTypeId, studentId)
    ).rejects.toThrow();
  });

  test('should handle error when fetching all result pagination', async () => {
    const payload = { page: 1, pageSize: 10 };
    mock.onPost(`results/pagination-filter/schools/${schoolId}`).reply(500);

    await expect(getAllResultPagination(schoolId, payload)).rejects.toThrow();
  });
});
