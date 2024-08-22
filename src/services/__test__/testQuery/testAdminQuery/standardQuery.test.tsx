import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllStandard,
  useGetAllSection,
  useViewStandard
} from '../../../queries/admin/standard';

jest.mock('../../../api/admin/standard/standardApi', () => ({
  getAllStandard: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Standard 1' },
        { id: 2, name: 'Standard 2' }
      ] // Mocked response data
    })
  ),
  getAllStandards: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Standard 1' },
        { id: 2, name: 'Standard 2' }
      ] // Mocked response data
    })
  ),
  getStandardbyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, name: 'Standard 1' } // Mocked response data
    })
  ),
  getSectionByStandard: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, name: 'Section A' },
        { id: 2, name: 'Section B' }
      ] // Mocked response data
    })
  )
}));

describe('useGetAllStandard', () => {
  test('fetches all standards', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAllStandard(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Standard 1' },
      { id: 2, name: 'Standard 2' }
    ]);
  }, 10000);
});

describe('useGetAllSection', () => {
  test('fetches all sections for a standard', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const standard = 1;
    const { result, waitFor } = renderHook(
      () => useGetAllSection(schoolId, academicYearId, standard),
      { wrapper }
    );

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Section A', name: 'Standard 1' },
      { id: 2, name: 'Section B', name: 'Standard 2' }
    ]);
  }, 10000);
});

describe('useViewStandard', () => {
  test('fetches all standards for viewing', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useViewStandard(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, name: 'Standard 1' },
      { id: 2, name: 'Standard 2' }
    ]);
  }, 10000);
});
