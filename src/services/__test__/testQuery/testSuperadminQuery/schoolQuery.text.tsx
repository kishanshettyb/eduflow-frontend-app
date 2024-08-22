import { renderHook } from '@testing-library/react-hooks';
import {
  useGetAllSchools,
  useGetSingleSchool,
  useCheckUniqueCode
} from '../../../queries/superadmin/schools'; // Replace with your actual file path
import { getAllSchools } from '../../../api/superadmin/schools/schoolApi';
import { useQuery } from '@tanstack/react-query';

jest.mock('@tanstack/react-query', () => ({
  useQuery: jest.fn()
}));

describe('useGetAllSchools', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all schools successfully', async () => {
    const mockSchools = [
      { id: 1, name: 'School 1' },
      { id: 2, name: 'School 2' }
    ];
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: mockSchools,
      isLoading: false,
      error: null
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetAllSchools());

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['schools'],
      queryFn: getAllSchools
    });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockSchools);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  test('should handle error when fetching all schools', async () => {
    const errorMessage = 'Failed to fetch schools';
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error(errorMessage)
    });

    renderHook(() => useGetAllSchools());

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['schools'],
      queryFn: getAllSchools
    });
  });
});

describe('useGetSingleSchool', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch single school successfully', async () => {
    const schoolId = 1;
    const mockSchool = { id: schoolId, name: 'School 1' };
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: mockSchool,
      isLoading: false,
      error: null
    });

    const { result, waitForNextUpdate } = renderHook(() => useGetSingleSchool(schoolId));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['singleSchool', schoolId],
      queryFn: expect.any(Function),
      enabled: true
    });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockSchool);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  test('should handle error when fetching single school', async () => {
    const schoolId = 1;
    const errorMessage = 'Failed to fetch school';
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error(errorMessage)
    });

    renderHook(() => useGetSingleSchool(schoolId));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['singleSchool', schoolId],
      queryFn: expect.any(Function),
      enabled: true
    });
  });

  test('should not fetch school if id is null', () => {
    const { result } = renderHook(() => useGetSingleSchool(null));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(useQuery).not.toHaveBeenCalled();
  });
});

describe('useCheckUniqueCode', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should check unique code successfully', async () => {
    const uniqueCode = 'ABC';
    const mockResult = true;
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: mockResult,
      isLoading: false,
      error: null
    });

    const { result, waitForNextUpdate } = renderHook(() => useCheckUniqueCode(uniqueCode));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['uniqueCode', uniqueCode],
      queryFn: expect.any(Function),
      enabled: true,
      retry: false
    });

    await waitForNextUpdate();

    expect(result.current.data).toEqual(mockResult);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });

  test('should handle error when checking unique code', async () => {
    const uniqueCode = 'ABC';
    const errorMessage = 'Failed to check unique code';
    (useQuery as jest.Mock).mockReturnValueOnce({
      data: null,
      isLoading: false,
      error: new Error(errorMessage)
    });

    renderHook(() => useCheckUniqueCode(uniqueCode));

    expect(useQuery).toHaveBeenCalledWith({
      queryKey: ['uniqueCode', uniqueCode],
      queryFn: expect.any(Function),
      enabled: true,
      retry: false
    });
  });

  test('should not check unique code if uniqueCode is falsy or length is not 3', () => {
    const invalidUniqueCode = '';
    const { result } = renderHook(() => useCheckUniqueCode(invalidUniqueCode));

    expect(result.current.data).toBeUndefined();
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
    expect(useQuery).not.toHaveBeenCalled();
  });
});
