import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateCustomerForm } from '../../forms/createCustomerForm';

// Mock dependencies that CreateAdminForm relies on
jest.mock('../../../services/queries/superadmin/cutomer', () => ({
  useGetSingleCustomer: jest.fn().mockReturnValue({ data: null, error: null })
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

//   test('renders all input fields correctly', () => {
//     render(<CreateCustomerForm selectedFile={null} />, { wrapper: Wrapper });
describe('CreateAdminForm', () => {
  it('renders all input fields correctly', () => {
    render(<CreateCustomerForm selectedFile={null} />);
    // Basic Details
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/GST/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Date of Incorpuration/i)).toBeInTheDocument();

    // Current Address
    expect(screen.getByLabelText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();

    // Checkbox for Address Copying
    expect(screen.getByLabelText(/Current Address same as Permanent Address/i)).toBeInTheDocument();

    // Permanent Address (Should be hidden by default, but we will check for elements anyway)
    expect(screen.getByLabelText(/Street Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/City/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Pincode/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/State/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Country/i)).toBeInTheDocument();
  });
});
