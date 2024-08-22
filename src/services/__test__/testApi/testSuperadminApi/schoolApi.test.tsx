import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllSchools,
  getSingleSchool,
  createSchool,
  updateSchool,
  checkUniqueCodeApi
} from '@/services/api/superadmin/schools/schoolApi';
import { School } from '@/types/superadmin/schoolTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);

jest.mock('js-cookie', () => ({
  get: jest.fn(() => 'mock-token')
}));

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

describe('School API', () => {
  const schoolId = 1;
  const mockSchool: School = { id: schoolId, name: 'School 1' };
  const mockToken = 'mock-token';

  beforeAll(() => {
    mock.reset();
  });

  beforeEach(() => {
    (Cookies.get as jest.Mock).mockReturnValue(mockToken);
  });

  afterAll(() => {
    mock.restore();
  });

  // test('should get all schools successfully', async () => {
  //   const mockSchools: School[] = [
  //     { id: 1, name: 'School 1' },
  //     { id: 2, name: 'School 2' }
  //   ];
  //   mock.onGet(`${baseURL}/schools`).reply(200, mockSchools);

  //   const result = await getAllSchools();
  //   expect(result.data).toEqual(mockSchools);
  // });

  test('should handle error when getting all schools', async () => {
    mock.onGet(`${baseURL}/schools`).reply(500);

    await expect(getAllSchools()).rejects.toThrow();
  });

  // test('should get a single school successfully', async () => {
  //   mock.onGet(`${baseURL}/schools/${schoolId}`).reply(200, mockSchool);

  //   const result = await getSingleSchool(schoolId);
  //   expect(result.data).toEqual(mockSchool);
  // });

  test('should handle error when getting a single school', async () => {
    mock.onGet(`${baseURL}/schools/${schoolId}`).reply(500);

    await expect(getSingleSchool(schoolId)).rejects.toThrow();
  });

  // test('should create a new school successfully', async () => {
  //   mock.onPost(`${baseURL}/schools`).reply(201, mockSchool);

  //   const result = await createSchool(mockSchool);
  //   expect(result).toEqual(mockSchool);
  // });

  test('should handle error when creating a new school', async () => {
    mock.onPost(`${baseURL}/schools`).reply(500);

    await expect(createSchool(mockSchool)).rejects.toThrow();
  });

  // test('should update a school successfully', async () => {
  //   mock.onPut(`${baseURL}/schools`).reply(200, mockSchool);

  //   const result = await updateSchool(mockSchool);
  //   expect(result).toEqual(mockSchool);
  // });

  test('should handle error when updating a school', async () => {
    mock.onPut(`${baseURL}/schools`).reply(500);

    await expect(updateSchool(mockSchool)).rejects.toThrow();
  });

  // test('should check unique code successfully', async () => {
  //   const uniqueCode = 'ABC123';
  //   mock.onGet(`${baseURL}/schools/codes/${uniqueCode}`).reply(200, true);

  //   const result = await checkUniqueCodeApi(uniqueCode);
  //   expect(result.data).toEqual(true);
  // });

  test('should handle error when checking unique code', async () => {
    const uniqueCode = 'ABC123';
    mock.onGet(`${baseURL}/schools/codes/${uniqueCode}`).reply(500);

    await expect(checkUniqueCodeApi(uniqueCode)).rejects.toThrow();
  });
});
