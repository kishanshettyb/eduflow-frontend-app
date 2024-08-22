import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateAdminForm } from '../../forms/createAdminForm';

// Mock dependencies that CreateAdminForm relies on
jest.mock('@/services/queries/superadmin/admins', () => ({
  useGetSingleAdmin: jest.fn().mockReturnValue({ data: null, error: null })
}));

jest.mock('@/services/queries/superadmin/departments', () => ({
  useGetAllDepartments: jest.fn().mockReturnValue({
    data: { data: [] }
  })
}));

jest.mock('@/services/mutation/superadmin/admin', () => ({
  useCreateAdmin: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false
  }),
  useUpdateAdmin: jest.fn().mockReturnValue({
    mutate: jest.fn(),
    isPending: false
  })
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn().mockReturnValue(null)
  })
}));

// Mock the react-hook-form functions
jest.mock('react-hook-form', () => ({
  useForm: jest.fn().mockReturnValue({
    control: {},
    handleSubmit: jest.fn((fn) => (e) => e.preventDefault() || fn({})),
    setValue: jest.fn(),
    watch: jest.fn(),
    reset: jest.fn()
  }),
  useWatch: jest.fn()
}));

// Test case for rendering all input fields
describe('CreateAdminForm', () => {
  it('renders all input fields correctly', () => {
    render(<CreateAdminForm selectedFile={null} />);

    // Check if Basic Details fields are rendered
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of birth/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Gender/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Father Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Mother Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergency Contact/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Emergency Contact Name/i)).toBeInTheDocument();

    // Check if Employment Details fields are rendered
    expect(screen.getByLabelText(/Employment Status/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Department/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Joining Date/i)).toBeInTheDocument();

    // Check if Current Address fields are rendered
    expect(screen.getByLabelText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();

    // Check if Permanent Address fields are rendered and hidden initially
    expect(screen.getByLabelText(/Current Address same as Permanent Address/i)).toBeInTheDocument();
    const checkbox = screen.getByLabelText(/Current Address same as Permanent Address/i);
    fireEvent.click(checkbox);

    expect(screen.getByLabelText(/Permanent Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();

    // Check if submit button is rendered
    expect(screen.getByText(/Create Admin/i)).toBeInTheDocument();
  });
});
