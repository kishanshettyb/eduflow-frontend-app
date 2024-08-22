import {
  enrollmentUpload,
  examUpload,
  qualificationUpload,
  staffAttendanceUpload,
  staffUpload,
  standardSubjectUpload,
  standardUpload,
  studentUpload,
  subjectUpload,
  workExperienceUpload
} from '@/services/api/admin/uploadSummary/uploadSummeryApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Upload API', () => {
  const mock = new MockAdapter(axios);
  const token = 'mock-token';
  const schoolId = 1;
  const formData = new FormData();

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should handle error when uploading student data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/student`).reply(500);
    await expect(studentUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading enrollment data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/enrollment`).reply(500);
    await expect(enrollmentUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading exam data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/exam`).reply(500);
    await expect(examUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading staff data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/staff`).reply(500);
    await expect(staffUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading subject data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/subject`).reply(500);
    await expect(subjectUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading qualification data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/qualification`).reply(500);
    await expect(qualificationUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading work experience data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/workExperience`).reply(500);
    await expect(workExperienceUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading staff attendance data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/staffAttendance`).reply(500);
    await expect(staffAttendanceUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading standard subject data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/standardSubject`).reply(500);
    await expect(standardSubjectUpload(schoolId, formData)).rejects.toThrow();
  });

  test('should handle error when uploading standard data', async () => {
    mock.onPost(`uploads/schools/${schoolId}/uploadTypes/standard`).reply(500);
    await expect(standardUpload(schoolId, formData)).rejects.toThrow();
  });
});
