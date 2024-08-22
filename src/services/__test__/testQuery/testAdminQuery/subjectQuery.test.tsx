// import { renderHook } from '@testing-library/react-hooks';
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useGetAllSubject } from '@/services/queries/admin/subject';

// Mock getAllCustomers function
// jest.mock('../../../api/admin/subject/subjectApi', () => ({
//   getAllSubject: jest.fn(() =>
//     Promise.resolve({
//       data: {}
//     })
//   )
// }));

// describe('useGetAllSubject', () => {
// test('fetches subject data', async () => {
//   const queryClient = new QueryClient();
//   const wrapper = ({ children }) => (
//     <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
//   );
//   const { result, waitFor } = renderHook(() => useGetAllSubject(), { wrapper });
//   // Wait for the hook to succeed
//   await waitFor(() => result.current.isSuccess, { timeout: 1000 });
//   // Expect data to be equal to the mocked response data
//   expect(result.current.data.data).toEqual({});
// }, 1000);
// });
