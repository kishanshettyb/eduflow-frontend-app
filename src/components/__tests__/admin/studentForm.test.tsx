import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { CreateStudentForm } from '../../forms/createStudentForm';
import { useForm } from 'react-hook-form';

describe('CreateAcademicYearForm Component', () => {
  test('renders the form and input fields correctly', () => {
    render(<CreateStudentForm selectedFile={null} onSuccess={jest.fn()} />);

    expect(screen.getByText(/Basic Details:/i)).toBeInTheDocument();

    const firstNameInput = screen.getByPlaceholderText(/First Name/i);
    const lastNameInput = screen.getByPlaceholderText(/Last Name/i);
    const emailInput = screen.getByPlaceholderText(/Email/i);
    const contactNumberInput = screen.getByPlaceholderText(/Phone/i);

    const dateOfBirthButton = screen.getByText(/Pick a date/i);
    const admissionDateButton = screen.getByText(/Pick a date/i);

    expect(firstNameInput).toBeInTheDocument();
    expect(lastNameInput).toBeInTheDocument();
    expect(emailInput).toBeInTheDocument();
    expect(contactNumberInput).toBeInTheDocument();
    expect(dateOfBirthButton).toBeInTheDocument();
    expect(admissionDateButton).toBeInTheDocument();

    const fatherNameInput = screen.getByPlaceholderText(/Father Name/i);
    const motherNameInput = screen.getByPlaceholderText(/Mother Name/i);
    const parentContactNumberInput = screen.getByPlaceholderText(/Phone/i);

    expect(fatherNameInput).toBeInTheDocument();
    expect(motherNameInput).toBeInTheDocument();
    expect(parentContactNumberInput).toBeInTheDocument();

    const emergencyContactInput = screen.getByPlaceholderText(/Phone/i);
    const emergencyContactNameInput = screen.getByPlaceholderText(/Name/i);

    expect(emergencyContactInput).toBeInTheDocument();
    expect(emergencyContactNameInput).toBeInTheDocument();

    const streetNameInput = screen.getByPlaceholderText(/Building & Street Name/i);
    const cityInput = screen.getByPlaceholderText(/City/i);
    const pinCodeInput = screen.getByPlaceholderText(/Pincode/i);
    const stateInput = screen.getByPlaceholderText(/State/i);
    const countryInput = screen.getByPlaceholderText(/Country/i);

    expect(streetNameInput).toBeInTheDocument();
    expect(cityInput).toBeInTheDocument();
    expect(pinCodeInput).toBeInTheDocument();
    expect(stateInput).toBeInTheDocument();
    expect(countryInput).toBeInTheDocument();
  });

  test('form submission does not occur on invalid input', async () => {
    const handleSubmit = jest.fn();
    useForm.mockReturnValue({
      handleSubmit,
      control: {},
      formState: { errors: {} },
      register: jest.fn(),
      reset: jest.fn(),
      setValue: jest.fn()
    });

    render(<CreateStudentForm selectedFile={null} onSuccess={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });

    fireEvent.click(submitButton);

    expect(handleSubmit).toHaveBeenCalled();
    expect(handleSubmit).not.toHaveReturned();
  });
});
