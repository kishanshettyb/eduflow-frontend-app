import {
  createAssignment,
  createAssignmentMapping,
  createAssignmentSubmit,
  createStudentAssignmentMapping,
  deleteAssignment,
  getAllAssignments,
  getAllStudentAssignment,
  getAllSubmitAssignment,
  getAssignmentById,
  getMappedAssignment,
  reviewAssignment
} from '@/services/api/teacher/assignment/assignmentApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Assignment API', () => {
  const mock = new MockAdapter(axios);
  const token = 'mock-token';
  const schoolId = 1;
  const academicYearId = 1;
  const assignmentId = 1;
  const enrollmentId = 1;
  const forceDelete = true;
  const data = { title: 'Test Assignment' };

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  //   test('should fetch all assignments successfully', async () => {
  //     mock.onGet(`assignments/schools/${schoolId}/years/${academicYearId}`).reply(200, []);
  //     const response = await getAllAssignments(schoolId, academicYearId);
  //     expect(response.data).toEqual([]);
  //   });

  test('should handle error when fetching all assignments', async () => {
    mock.onGet(`assignments/schools/${schoolId}/years/${academicYearId}`).reply(500);
    await expect(getAllAssignments(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should fetch assignment by ID successfully', async () => {
  //     mock.onGet(`assignments/schools/${schoolId}/assignments/${assignmentId}`).reply(200, data);
  //     const response = await getAssignmentById(schoolId, assignmentId);
  //     expect(response.data).toEqual(data);
  //   });

  test('should handle error when fetching assignment by ID', async () => {
    mock.onGet(`assignments/schools/${schoolId}/assignments/${assignmentId}`).reply(500);
    await expect(getAssignmentById(schoolId, assignmentId)).rejects.toThrow();
  });

  test('should handle error when creating assignment', async () => {
    mock.onPost('assignments').reply(500);
    await expect(createAssignment(data)).rejects.toThrow();
  });

  //   test('should create assignment mapping successfully', async () => {
  //     mock.onPost('assignments/assign-classes').reply(201);
  //     await expect(createAssignmentMapping(data)).resolves.toBeUndefined();
  //   });

  test('should handle error when creating assignment mapping', async () => {
    mock.onPost('assignments/assign-classes').reply(500);
    await expect(createAssignmentMapping(data)).rejects.toThrow();
  });

  //   test('should create assignment submit successfully', async () => {
  //     mock.onPost('submissions').reply(201);
  //     await expect(createAssignmentSubmit(data)).resolves.toBeUndefined();
  //   });

  test('should handle error when creating assignment submit', async () => {
    mock.onPost('submissions').reply(500);
    await expect(createAssignmentSubmit(data)).rejects.toThrow();
  });

  //   test('should create student assignment mapping successfully', async () => {
  //     mock.onPost('assignments/assign-enrollments').reply(201);
  //     await expect(createStudentAssignmentMapping(data)).resolves.toBeUndefined();
  //   });

  test('should handle error when creating student assignment mapping', async () => {
    mock.onPost('assignments/assign-enrollments').reply(500);
    await expect(createStudentAssignmentMapping(data)).rejects.toThrow();
  });

  //   test('should update assignment successfully', async () => {
  //     mock.onPut('assignments').reply(200);
  //     await expect(updateAssignment(data)).resolves.toBeUndefined();
  //   });

  //   test('should review assignment successfully', async () => {
  //     mock.onPut('submissions/teachers').reply(200);
  //     await expect(reviewAssignment(data)).resolves.toBeUndefined();
  //   });

  test('should handle error when reviewing assignment', async () => {
    mock.onPut('submissions/teachers').reply(500);
    await expect(reviewAssignment(data)).rejects.toThrow();
  });

  //   test('should delete assignment successfully', async () => {
  //     mock
  //       .onDelete(
  //         `assignments/schools/${schoolId}/assignments/${assignmentId}/forceDelete/${forceDelete}`
  //       )
  //       .reply(200, {});
  //     const response = await deleteAssignment(schoolId, assignmentId, forceDelete);
  //     expect(response).toEqual({});
  //   });

  test('should handle error when deleting assignment', async () => {
    mock
      .onDelete(
        `assignments/schools/${schoolId}/assignments/${assignmentId}/forceDelete/${forceDelete}`
      )
      .reply(500);
    await expect(deleteAssignment(schoolId, assignmentId, forceDelete)).rejects.toThrow();
  });

  //   test('should fetch mapped assignment successfully', async () => {
  //     mock
  //       .onGet(`assignments/schools/${schoolId}/assignments/${assignmentId}/mappings`)
  //       .reply(200, data);
  //     const response = await getMappedAssignment(schoolId, assignmentId);
  //     expect(response.data).toEqual(data);
  //   });

  test('should handle error when fetching mapped assignment', async () => {
    mock.onGet(`assignments/schools/${schoolId}/assignments/${assignmentId}/mappings`).reply(500);
    await expect(getMappedAssignment(schoolId, assignmentId)).rejects.toThrow();
  });

  //   test('should fetch all student assignments successfully', async () => {
  //     mock.onGet(`assignments/schools/${schoolId}/enrollments/${enrollmentId}`).reply(200, []);
  //     const response = await getAllStudentAssignment(schoolId, enrollmentId);
  //     expect(response.data).toEqual([]);
  //   });

  test('should handle error when fetching all student assignments', async () => {
    mock.onGet(`assignments/schools/${schoolId}/enrollments/${enrollmentId}`).reply(500);
    await expect(getAllStudentAssignment(schoolId, enrollmentId)).rejects.toThrow();
  });

  //   test('should fetch all submitted assignments successfully', async () => {
  //     mock.onGet(`submissions/schools/${schoolId}/years/${academicYearId}`).reply(200, []);
  //     const response = await getAllSubmitAssignment(schoolId, academicYearId);
  //     expect(response.data).toEqual([]);
  //   });

  test('should handle error when fetching all submitted assignments', async () => {
    mock.onGet(`submissions/schools/${schoolId}/years/${academicYearId}`).reply(500);
    await expect(getAllSubmitAssignment(schoolId, academicYearId)).rejects.toThrow();
  });
});
