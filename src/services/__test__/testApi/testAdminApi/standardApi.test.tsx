import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Cookies from 'js-cookie';
import {
  getAllStandard,
  getAllStandards,
  getAllSection,
  getStandardbyID,
  getSectionByStandard,
  createStandard,
  updateStandard,
  deleteStandard
} from '@/services/api/admin/standard/standardApi'; // Adjust import path based on your project structure
import { Standard } from '@/types/admin/standardTypes';

// Mocking Axios and Cookies
const mock = new MockAdapter(axios);
jest.mock('js-cookie', () => ({
  get: jest.fn()
}));

describe('Standard API', () => {
  const schoolId = 1;
  const academicYearId = 2024;
  const standardId = 1;
  const standard = 1;
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

  //   test('should fetch all standards for a specific academic year', async () => {
  //     const mockStandards: Standard[] = [
  //       { id: 1, name: 'Standard A' },
  //       { id: 2, name: 'Standard B' }
  //     ];
  //     mock.onGet(`standards/schools/${schoolId}/years/${academicYearId}`).reply(200, mockStandards);

  //     const result = await getAllStandards(schoolId, academicYearId);
  //     expect(result.data).toEqual(mockStandards);
  //   });

  test('should handle error when fetching all standards for a specific academic year', async () => {
    mock.onGet(`standards/schools/${schoolId}/years/${academicYearId}`).reply(500);

    await expect(getAllStandards(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should fetch all standards for all academic years', async () => {
  //     const mockStandards: Standard[] = [
  //       { id: 1, name: 'Standard A' },
  //       { id: 2, name: 'Standard B' }
  //     ];
  //     mock
  //       .onGet(`standards/schools/${schoolId}/years/${academicYearId}/allStandards`)
  //       .reply(200, mockStandards);

  //     const result = await getAllStandard(schoolId, academicYearId);
  //     expect(result.data).toEqual(mockStandards);
  //   });

  test('should handle error when fetching all standards for all academic years', async () => {
    mock.onGet(`standards/schools/${schoolId}/years/${academicYearId}/allStandards`).reply(500);

    await expect(getAllStandard(schoolId, academicYearId)).rejects.toThrow();
  });

  //   test('should fetch all sections for a specific standard and academic year', async () => {
  //     const mockSections: Standard[] = [
  //       { id: 1, name: 'Section A' },
  //       { id: 2, name: 'Section B' }
  //     ];
  //     mock
  //       .onGet(`standards/schools/${schoolId}/years/${academicYearId}/standards/${standard}`)
  //       .reply(200, mockSections);

  //     const result = await getAllSection(schoolId, academicYearId, standard);
  //     expect(result.data).toEqual(mockSections);
  //   });

  test('should handle error when fetching all sections for a specific standard and academic year', async () => {
    mock
      .onGet(`standards/schools/${schoolId}/years/${academicYearId}/standards/${standard}`)
      .reply(500);

    await expect(getAllSection(schoolId, academicYearId, standard)).rejects.toThrow();
  });

  //   test('should fetch a standard by ID', async () => {
  //     const mockStandard: Standard = { id: standardId, name: 'Standard A' };
  //     mock.onGet(`standards/schools/${schoolId}/standards/${standardId}`).reply(200, mockStandard);

  //     const result = await getStandardbyID(schoolId, standardId);
  //     expect(result.data).toEqual(mockStandard);
  //   });

  test('should handle error when fetching a standard by ID', async () => {
    mock.onGet(`standards/schools/${schoolId}/standards/${standardId}`).reply(500);

    await expect(getStandardbyID(schoolId, standardId)).rejects.toThrow();
  });

  //   test('should fetch sections by standard for a specific academic year', async () => {
  //     const mockSections: Standard[] = [
  //       { id: 1, name: 'Section A' },
  //       { id: 2, name: 'Section B' }
  //     ];
  //     mock
  //       .onGet(`standards/schools/${schoolId}/years/${academicYearId}/standards/${standard}`)
  //       .reply(200, mockSections);

  //     const result = await getSectionByStandard(schoolId, academicYearId, standard);
  //     expect(result.data).toEqual(mockSections);
  //   });

  test('should handle error when fetching sections by standard for a specific academic year', async () => {
    mock
      .onGet(`standards/schools/${schoolId}/years/${academicYearId}/standards/${standard}`)
      .reply(500);

    await expect(getSectionByStandard(schoolId, academicYearId, standard)).rejects.toThrow();
  });

  //   test('should create a standard successfully', async () => {
  //     const newStandard: Standard = { id: 1, name: 'New Standard' };
  //     mock.onPost('standards').reply(201, newStandard);

  //     const result = await createStandard(newStandard);
  //     expect(result).toEqual(newStandard);
  //   });

  test('should handle error when creating a standard', async () => {
    const newStandard: Standard = { id: 1, name: 'New Standard' };
    mock.onPost('standards').reply(500);

    await expect(createStandard(newStandard)).rejects.toThrow();
  });

  //   test('should update a standard successfully', async () => {
  //     const updatedStandard: Standard = { id: standardId, name: 'Updated Standard' };
  //     mock.onPut('standards').reply(200, updatedStandard);

  //     const result = await updateStandard(updatedStandard);
  //     expect(result).toEqual(updatedStandard);
  //   });

  test('should handle error when updating a standard', async () => {
    const updatedStandard: Standard = { id: standardId, name: 'Updated Standard' };
    mock.onPut('standards').reply(500);

    await expect(updateStandard(updatedStandard)).rejects.toThrow();
  });

  //   test('should delete a standard successfully', async () => {
  //     mock.onDelete(`standards/delete/${schoolId}/${standardId}`).reply(200);

  //     await deleteStandard(schoolId, standardId);
  //   });

  test('should handle error when deleting a standard', async () => {
    mock.onDelete(`standards/delete/${schoolId}/${standardId}`).reply(500);

    await expect(deleteStandard(schoolId, standardId)).rejects.toThrow();
  });
});
