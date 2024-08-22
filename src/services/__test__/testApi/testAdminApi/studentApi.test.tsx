import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllStudent,
  getSingleStudent,
  createStudent,
  updateStudent,
  getFilteredStudents,
  getStudentDocument,
  getStudentWithNoEnrollment,
  submitStudentDocuments,
  updateStudentDocuments,
  getAllDocumentType,
  deleteStudentFile
} from '@/services/api/admin/student/studentApi';
import { Student } from '@/types/admin/studentTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Student API', () => {
  const schoolId = 1;
  const academicYearId = 2024;
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

  test('should handle error when fetching all students', async () => {
    mock.onGet(`students/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(getAllStudent(schoolId, academicYearId)).rejects.toThrow();
  });

  test('should handle error when fetching a single student', async () => {
    mock.onGet(`students/schools/${schoolId}/students/${studentId}`).reply(500);

    await expect(getSingleStudent(schoolId, studentId)).rejects.toThrow();
  });

  test('should handle error when creating a student', async () => {
    const newStudent: Student = { id: studentId, name: 'New Student', standard: '5', section: 'A' };
    mock.onPost('students').reply(500);

    await expect(createStudent(newStudent)).rejects.toThrow();
  });

  test('should handle error when updating a student', async () => {
    const updatedStudent: Student = {
      id: studentId,
      name: 'Updated Student',
      standard: '6',
      section: 'B'
    };
    mock.onPut('students').reply(500);

    await expect(updateStudent(updatedStudent)).rejects.toThrow();
  });

  test('should handle error when fetching filtered students', async () => {
    mock
      .onGet(
        `students/schools/${schoolId}/years/${academicYearId}?isActive=true&standard=5&section=A`
      )
      .reply(500);

    await expect(
      getFilteredStudents(schoolId, academicYearId, 'active', '5', 'A')
    ).rejects.toThrow();
  });

  test('should handle error when fetching student documents', async () => {
    mock.onGet(`student-documents/schools/${schoolId}/students/${studentId}`).reply(500);

    await expect(getStudentDocument(schoolId, studentId)).rejects.toThrow();
  });

  test('should handle error when fetching students with no enrollment', async () => {
    mock.onGet(`students/withNoEnrollments/schools/${schoolId}`).reply(500);

    await expect(getStudentWithNoEnrollment(schoolId)).rejects.toThrow();
  });

  test('should handle error when submitting student documents', async () => {
    const formData = new FormData();
    mock.onPost('student-documents').reply(500);

    await expect(submitStudentDocuments(formData)).rejects.toThrow();
  });

  test('should handle error when updating student documents', async () => {
    const formData = new FormData();
    mock.onPut('student-documents').reply(500);

    await expect(updateStudentDocuments(formData)).rejects.toThrow();
  });

  test('should handle error when fetching all document types', async () => {
    mock.onGet('documents/getAll').reply(500);

    await expect(getAllDocumentType()).rejects.toThrow();
  });

  test('should handle error when deleting a student file', async () => {
    const studentDocumentId = 1;
    mock.onDelete(`student-documents/studentDocuments/${studentDocumentId}`).reply(500);

    await expect(deleteStudentFile(studentDocumentId)).rejects.toThrow();
  });

  test('should successfully fetch all students', async () => {
    const students: Student[] = [
      { id: studentId, name: 'Student One', standard: '5', section: 'A' }
    ];
    mock.onGet(`students/schools/${schoolId}/years/${academicYearId}`).reply(200, students);

    const response = await getAllStudent(schoolId, academicYearId);
    expect(response).toEqual(students);
  });

  test('should successfully fetch a single student', async () => {
    const student: Student = { id: studentId, name: 'Student One', standard: '5', section: 'A' };
    mock.onGet(`students/schools/${schoolId}/students/${studentId}`).reply(200, student);

    const response = await getSingleStudent(schoolId, studentId);
    expect(response).toEqual(student);
  });

  test('should successfully create a student', async () => {
    const newStudent: Student = { id: studentId, name: 'New Student', standard: '5', section: 'A' };
    mock.onPost('students').reply(200, newStudent);

    const response = await createStudent(newStudent);
    expect(response).toEqual(newStudent);
  });

  test('should successfully update a student', async () => {
    const updatedStudent: Student = {
      id: studentId,
      name: 'Updated Student',
      standard: '6',
      section: 'B'
    };
    mock.onPut('students').reply(200, updatedStudent);

    const response = await updateStudent(updatedStudent);
    expect(response).toEqual(updatedStudent);
  });

  test('should successfully fetch filtered students', async () => {
    const students: Student[] = [
      { id: studentId, name: 'Student One', standard: '5', section: 'A' }
    ];
    mock
      .onGet(
        `students/schools/${schoolId}/years/${academicYearId}?isActive=true&standard=5&section=A`
      )
      .reply(200, students);

    const response = await getFilteredStudents(schoolId, academicYearId, 'active', '5', 'A');
    expect(response).toEqual(students);
  });

  test('should successfully fetch student documents', async () => {
    const documents = [{ id: 1, documentName: 'Document One' }];
    mock.onGet(`student-documents/schools/${schoolId}/students/${studentId}`).reply(200, documents);

    const response = await getStudentDocument(schoolId, studentId);
    expect(response).toEqual(documents);
  });

  test('should successfully fetch students with no enrollment', async () => {
    const students: Student[] = [
      { id: studentId, name: 'Student One', standard: '5', section: 'A' }
    ];
    mock.onGet(`students/withNoEnrollments/schools/${schoolId}`).reply(200, students);

    const response = await getStudentWithNoEnrollment(schoolId);
    expect(response).toEqual(students);
  });

  test('should successfully submit student documents', async () => {
    const formData = new FormData();
    mock.onPost('student-documents').reply(200);

    await expect(submitStudentDocuments(formData)).resolves.toBeUndefined();
  });

  test('should successfully update student documents', async () => {
    const formData = new FormData();
    mock.onPut('student-documents').reply(200);

    await expect(updateStudentDocuments(formData)).resolves.toBeUndefined();
  });

  test('should successfully fetch all document types', async () => {
    const documentTypes = [{ id: 1, typeName: 'Document Type One' }];
    mock.onGet('documents/getAll').reply(200, documentTypes);

    const response = await getAllDocumentType();
    expect(response).toEqual(documentTypes);
  });

  test('should successfully delete a student file', async () => {
    const studentDocumentId = 1;
    mock.onDelete(`student-documents/studentDocuments/${studentDocumentId}`).reply(200);

    await expect(deleteStudentFile(studentDocumentId)).resolves.toBeUndefined();
  });
});
