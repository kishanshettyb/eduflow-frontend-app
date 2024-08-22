import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetSingleAssignment } from '@/services/queries/teacher/assignment/assignment';

jest.mock('@/services/api/teacher/assignment/assignmentApi', () => ({
  getAllAssignments: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, title: 'Assignment 1' },
        { id: 2, title: 'Assignment 2' }
      ]
    })
  ),
  getAllStudentAssignment: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, title: 'Student Assignment 1' },
        { id: 2, title: 'Student Assignment 2' }
      ]
    })
  ),
  getAllSubmitAssignment: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, title: 'Submit Assignment 1' },
        { id: 2, title: 'Submit Assignment 2' }
      ]
    })
  ),
  getAssignmentById: jest.fn(() =>
    Promise.resolve({
      data: { id: 1, title: 'Single Assignment' }
    })
  ),
  getMappedAssignment: jest.fn(() =>
    Promise.resolve({
      data: [
        { id: 1, title: 'Mapped Assignment 1' },
        { id: 2, title: 'Mapped Assignment 2' }
      ]
    })
  )
}));

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useGetSingleAssignment', () => {
  test('fetches single assignment', async () => {
    const schoolId = 1;
    const assignmentId = 1;

    const { result, waitFor } = renderHook(() => useGetSingleAssignment(schoolId, assignmentId), {
      wrapper
    });

    await waitFor(() => result.current.isSuccess, { timeout: 10000 });

    expect(result.current.data.data).toEqual({ id: 1, title: 'Single Assignment' });
  }, 10000);
});
