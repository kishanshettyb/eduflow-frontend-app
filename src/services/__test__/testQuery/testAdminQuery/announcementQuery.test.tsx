import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  useGetAllAnnouncement,
  useViewAnnouncement,
  useGetAnnouncementbyID,
  useGetDeletebyID
} from '../../../queries/admin/announcement';

jest.mock('../../../api/announcement/announcementApi', () => ({
  getAllAnnouncement: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, title: 'Announcement 1' },
        { id: 2, title: 'Announcement 2' }
      ] // Mocked response data
    })
  ),
  viewAnnouncement: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, title: 'Announcement 1' },
        { id: 2, title: 'Announcement 2' }
      ] // Mocked response data
    })
  ),
  getAnnouncementbyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, title: 'Announcement 1' } // Mocked response data
    })
  ),
  getDeletebyID: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, title: 'Announcement 1' } // Mocked response data
    })
  )
}));

describe('useGetAllAnnouncement', () => {
  test('fetches all announcements', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useGetAllAnnouncement(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, title: 'Announcement 1' },
      { id: 2, title: 'Announcement 2' }
    ]);
  }, 10000);
});

describe('useViewAnnouncement', () => {
  test('fetches announcements for viewing', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const academicYearId = 1;
    const { result, waitFor } = renderHook(() => useViewAnnouncement(schoolId, academicYearId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual([
      { id: 1, title: 'Announcement 1' },
      { id: 2, title: 'Announcement 2' }
    ]);
  }, 10000);
});

describe('useGetAnnouncementbyID', () => {
  test('fetches announcement by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const announcementId = 1;
    const { result, waitFor } = renderHook(() => useGetAnnouncementbyID(schoolId, announcementId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, title: 'Announcement 1' });
  }, 10000);
});

describe('useGetDeletebyID', () => {
  test('fetches announcement for delete by ID', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const schoolId = 1;
    const announcementId = 1;
    const { result, waitFor } = renderHook(() => useGetDeletebyID(schoolId, announcementId), {
      wrapper
    });

    // Wait for the hook to succeed
    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    // Expect data to be equal to the mocked response data
    expect(result.current.data.data).toEqual({ id: 1, title: 'Announcement 1' });
  }, 10000);
});
