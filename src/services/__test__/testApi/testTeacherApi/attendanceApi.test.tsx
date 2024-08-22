import {
  createStaffAttendance,
  createStudentAttendance,
  getStaffAttendance,
  getStaffsAttendanceByDate,
  getStaffsAttendanceByMonth,
  getStaffsAttendanceByRange,
  getStudentAttendance,
  getStudentsAttendanceByDate,
  getSudentsAttendanceByRange,
  updateStaffAttendance,
  updateStudentAttendance
} from '@/services/api/admin/attendances/attendancesApi';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';

jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Attendance API', () => {
  const mock = new MockAdapter(axios);
  const token = 'mock-token';
  const schoolId = 1;
  const localDate = new Date();
  const year = '2023';
  const monthName = 'July';
  const standard = '10';
  const section = 'A';
  const staffId = 1;
  const studentId = 1;
  const data = { title: 'Test Attendance' };
  const attendanceDate = new Date();

  beforeAll(() => {
    (Cookies.get as jest.Mock).mockReturnValue(token);
  });

  afterEach(() => {
    mock.reset();
  });

  afterAll(() => {
    mock.restore();
  });

  test('should handle error when fetching staff attendance by date', async () => {
    mock.onGet(`staff-attendances/schools/${schoolId}/dates/${localDate}`).reply(500);
    await expect(getStaffsAttendanceByDate(schoolId, localDate)).rejects.toThrow();
  });

  test('should handle error when creating staff attendance', async () => {
    mock.onPost(`staff-attendances/schools/${schoolId}/dates/${attendanceDate}`).reply(500);
    await expect(createStaffAttendance(schoolId, attendanceDate, data)).rejects.toThrow();
  });

  test('should handle error when updating staff attendance', async () => {
    mock.onPut(`staff-attendances/schools/${schoolId}`).reply(500);
    await expect(updateStaffAttendance(schoolId, data)).rejects.toThrow();
  });

  test('should handle error when fetching staff attendance by month', async () => {
    mock
      .onGet(`staff-attendances/schools/${schoolId}/years/${year}/months/${monthName}`)
      .reply(500);
    await expect(getStaffsAttendanceByMonth(schoolId, year, monthName)).rejects.toThrow();
  });

  test('should handle error when fetching student attendance by date', async () => {
    mock
      .onGet(
        `student-day-attendances/schools/${schoolId}/standards/${standard}/sections/${section}/dates/${localDate}`
      )
      .reply(500);
    await expect(
      getStudentsAttendanceByDate(schoolId, standard, section, localDate)
    ).rejects.toThrow();
  });

  test('should handle error when creating student attendance', async () => {
    mock.onPost(`student-day-attendances/schools/${schoolId}/dates/${attendanceDate}`).reply(500);
    await expect(createStudentAttendance(schoolId, attendanceDate, data)).rejects.toThrow();
  });

  test('should handle error when updating student attendance', async () => {
    mock.onPut(`student-day-attendances/schools/${schoolId}`).reply(500);
    await expect(updateStudentAttendance(schoolId, data)).rejects.toThrow();
  });

  test('should handle error when fetching staff attendance', async () => {
    mock.onGet(`staff-attendances/schools/${schoolId}/staffs/${staffId}`).reply(500);
    await expect(getStaffAttendance(schoolId, staffId)).rejects.toThrow();
  });

  test('should handle error when fetching student attendance', async () => {
    mock.onGet(`student-day-attendances/schools/${schoolId}/students/${studentId}`).reply(500);
    await expect(getStudentAttendance(schoolId, studentId)).rejects.toThrow();
  });

  test('should handle error when fetching staffs attendance by range', async () => {
    mock.onPost(`staff-attendances/schools/${schoolId}/by-date-range`).reply(500);
    await expect(getStaffsAttendanceByRange(schoolId, data)).rejects.toThrow();
  });

  test('should handle error when fetching students attendance by range', async () => {
    mock.onPost(`student-day-attendances/schools/${schoolId}/by-date-range`).reply(500);
    await expect(getSudentsAttendanceByRange(schoolId, data)).rejects.toThrow();
  });
});
