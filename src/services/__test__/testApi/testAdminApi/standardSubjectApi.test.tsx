import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllStandardSubject,
  createStandardSubject,
  updateStandardSubject,
  deleteStandardSubject,
  getGroupSubjectTypes,
  getStandardSubjects
} from '@/services/api/admin/standardSubject/standardSubjectApi';
import { StandardSubject } from '@/types/admin/standardSubjectType';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('StandardSubject API', () => {
  const schoolId = 1;
  const academicYearId = 2024;
  const standardSubjectId = 1;
  const standards = 'A';
  const sections = '1';
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

  //   test('should fetch all standard subjects for a specific academic year', async () => {
  //     const mockStandardSubjects: StandardSubject[] = [
  //       { id: 1, name: 'Subject A' },
  //       { id: 2, name: 'Subject B' }
  //     ];
  //     mock
  //       .onGet(`standard-subjects/schools/${schoolId}/years/${academicYearId}/getAll`)
  //       .reply(200, mockStandardSubjects);

  //     const result = await getAllStandardSubject(schoolId, academicYearId);
  //     expect(result.data).toEqual(mockStandardSubjects);
  //   });

  test('should handle error when fetching all standard subjects for a specific academic year', async () => {
    mock.onGet(`standard-subjects/schools/${schoolId}/years/${academicYearId}/getAll`).reply(500);

    await expect(getAllStandardSubject(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should create a standard subject successfully', async () => {
  //     const newStandardSubject: StandardSubject = { id: 1, name: 'New Subject' };
  //     mock.onPost('standard-subjects').reply(201, newStandardSubject);

  //     const result = await createStandardSubject(newStandardSubject);
  //     expect(result).toEqual(newStandardSubject);
  //   });

  test('should handle error when creating a standard subject', async () => {
    const newStandardSubject: StandardSubject = { id: 1, name: 'New Subject' };
    mock.onPost('standard-subjects').reply(500);

    await expect(createStandardSubject(newStandardSubject)).rejects.toThrow();
  });

  //   test('should update a standard subject successfully', async () => {
  //     const updatedStandardSubject: StandardSubject = {
  //       id: standardSubjectId,
  //       name: 'Updated Subject'
  //     };
  //     mock.onPut('standard-subjects').reply(200, updatedStandardSubject);

  //     const result = await updateStandardSubject(updatedStandardSubject);
  //     expect(result).toEqual(updatedStandardSubject);
  //   });

  test('should handle error when updating a standard subject', async () => {
    const updatedStandardSubject: StandardSubject = {
      id: standardSubjectId,
      name: 'Updated Subject'
    };
    mock.onPut('standard-subjects').reply(500);

    await expect(updateStandardSubject(updatedStandardSubject)).rejects.toThrow();
  });

  //   test('should delete a standard subject successfully', async () => {
  //     mock
  //       .onDelete(`standard-subjects/schools/${schoolId}/standardSubjects/${standardSubjectId}`)
  //       .reply(200);

  //     await deleteStandardSubject(schoolId, standardSubjectId);
  //   });

  test('should handle error when deleting a standard subject', async () => {
    mock
      .onDelete(`standard-subjects/schools/${schoolId}/standardSubjects/${standardSubjectId}`)
      .reply(500);

    await expect(deleteStandardSubject(schoolId, standardSubjectId)).rejects.toThrow();
  });

  //   test('should fetch group subject types for a specific standard, section, and academic year', async () => {
  //     const mockGroupSubjectTypes: StandardSubject[] = [
  //       { id: 1, name: 'Group Subject A' },
  //       { id: 2, name: 'Group Subject B' }
  //     ];
  //     mock
  //       .onGet(
  //         `standard-subjects/groups/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
  //       )
  //       .reply(200, mockGroupSubjectTypes);

  //     const result = await getGroupSubjectTypes(schoolId, academicYearId, standards, sections);
  //     expect(result.data).toEqual(mockGroupSubjectTypes);
  //   });

  test('should handle error when fetching group subject types for a specific standard, section, and academic year', async () => {
    mock
      .onGet(
        `standard-subjects/groups/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
      )
      .reply(500);

    await expect(
      getGroupSubjectTypes(schoolId, academicYearId, standards, sections)
    ).rejects.toThrow();
  });

  //   test('should fetch standard subjects for a specific standard, section, and academic year', async () => {
  //     const mockStandardSubjects: StandardSubject[] = [
  //       { id: 1, name: 'Subject A' },
  //       { id: 2, name: 'Subject B' }
  //     ];
  //     mock
  //       .onGet(
  //         `standard-subjects/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
  //       )
  //       .reply(200, mockStandardSubjects);

  //     const result = await getStandardSubjects(schoolId, academicYearId, standards, sections);
  //     expect(result.data).toEqual(mockStandardSubjects);
  //   });

  test('should handle error when fetching standard subjects for a specific standard, section, and academic year', async () => {
    mock
      .onGet(
        `standard-subjects/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}`
      )
      .reply(500);

    await expect(
      getStandardSubjects(schoolId, academicYearId, standards, sections)
    ).rejects.toThrow();
  });

  //   test('should fetch subject subject types for a specific standard, section, academic year, and subject', async () => {
  //     const mockSubjectSubjectTypes: StandardSubject[] = [
  //       { id: 1, name: 'Subject Type A' },
  //       { id: 2, name: 'Subject Type B' }
  //     ];
  //     mock
  //       .onGet(
  //         `standard-subjects/subjectTypes/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}/subjects/${subjectId}`
  //       )
  //       .reply(200, mockSubjectSubjectTypes);

  //     const result = await getSubjectSubjectTypes(
  //       schoolId,
  //       academicYearId,
  //       standards,
  //       sections,
  //       subjectId
  //     );
  //     expect(result.data).toEqual(mockSubjectSubjectTypes);
  //   });

  // test('should handle error when fetching subject subject types for a specific standard, section, academic year, and subject', async () => {
  //   mock
  //     .onGet(
  //       `standard-subjects/subjectTypes/schools/${schoolId}/years/${academicYearId}/standards/${standards}/sections/${sections}/subjects/${subjectId}`
  //     )
  //     .reply(500);

  //   await expect(
  //     getSubjectSubjectTypes(schoolId, academicYearId, standards, sections, subjectId)
  //   ).rejects.toThrow();
  // });
});
