import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllExamType,
  getExamTypebyID,
  createExamType,
  updateExamType,
  viewExamType,
  deleteExamType
} from '@/services/api/admin/examtype/examtypeApi';
import { ExamType } from '@/types/admin/examtypeTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Exam Type API', () => {
  const schoolId = 1;
  const academicYearId = 1;
  const examTypeId = 1;
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

  // test('should fetch all exam types successfully', async () => {
  //   const mockExamTypes: ExamType[] = [
  //     { id: 1, name: 'Exam Type 1' },
  //     { id: 2, name: 'Exam Type 2' }
  //   ];
  //   mock.onGet(`/exam-types/schools/${schoolId}/years/${academicYearId}`).reply(200, mockExamTypes);

  //   const result = await getAllExamType(schoolId, academicYearId);
  //   expect(result.data).toEqual(mockExamTypes);
  // });

  test('should handle error when fetching all exam types', async () => {
    mock.onGet(`/exam-types/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(getAllExamType(schoolId, academicYearId)).rejects.toThrow();
  });

  // test('should fetch a specific exam type by ID successfully', async () => {
  //   const mockExamType: ExamType = { id: examTypeId, name: 'Exam Type 1' };
  //   mock.onGet(`exam-types/schools/${schoolId}/examTypes/${examTypeId}`).reply(200, mockExamType);

  //   const result = await getExamTypebyID(schoolId, examTypeId);
  //   expect(result.data).toEqual(mockExamType);
  // });

  test('should handle error when fetching a specific exam type by ID', async () => {
    mock.onGet(`exam-types/schools/${schoolId}/examTypes/${examTypeId}`).reply(500);

    await expect(getExamTypebyID(schoolId, examTypeId)).rejects.toThrow();
  });

  // test('should create a new exam type successfully', async () => {
  //   const newExamType: ExamType = { id: 1, name: 'New Exam Type' };
  //   mock.onPost('exam-types').reply(201, newExamType);

  //   const result = await createExamType(newExamType);
  //   expect(result).toEqual(newExamType);
  // });

  test('should handle error when creating a new exam type', async () => {
    const newExamType: ExamType = { id: 1, name: 'New Exam Type' };
    mock.onPost('exam-types').reply(500);

    await expect(createExamType(newExamType)).rejects.toThrow();
  });

  // test('should update an exam type successfully', async () => {
  //   const updatedExamType: ExamType = { id: examTypeId, name: 'Updated Exam Type' };
  //   mock.onPut('exam-types').reply(200, updatedExamType);

  //   const result = await updateExamType(updatedExamType);
  //   expect(result).toEqual(updatedExamType);
  // });

  test('should handle error when updating an exam type', async () => {
    const updatedExamType: ExamType = { id: examTypeId, name: 'Updated Exam Type' };
    mock.onPut('exam-types').reply(500);

    await expect(updateExamType(updatedExamType)).rejects.toThrow();
  });

  // test('should view exam types successfully', async () => {
  //   const mockExamTypes: ExamType[] = [
  //     { id: 1, name: 'Exam Type 1' },
  //     { id: 2, name: 'Exam Type 2' }
  //   ];
  //   mock.onGet(`exam-types/schools/${schoolId}/years/${academicYearId}`).reply(200, mockExamTypes);

  //   const result = await viewExamType(schoolId, academicYearId);
  //   expect(result.data).toEqual(mockExamTypes);
  // });

  test('should handle error when viewing exam types', async () => {
    mock.onGet(`exam-types/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(viewExamType(schoolId, academicYearId)).rejects.toThrow();
  });

  // test('should delete an exam type successfully', async () => {
  //   mock.onDelete(`exam-types/schools/${schoolId}/examTypes/${examTypeId}`).reply(200);

  //   const result = await deleteExamType(schoolId, examTypeId);
  //   expect(result.status).toEqual(200);
  // });

  test('should handle error when deleting an exam type', async () => {
    mock.onDelete(`exam-types/schools/${schoolId}/examTypes/${examTypeId}`).reply(500);

    await expect(deleteExamType(schoolId, examTypeId)).rejects.toThrow();
  });
});
