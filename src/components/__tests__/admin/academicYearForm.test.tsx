import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateAcademicYearForm } from '../../forms/createAcademicYearForm';

jest.mock('react-hook-form', () => ({
  useForm: jest.fn().mockReturnValue({
    control: {},
    handleSubmit: jest.fn(),
    formState: { errors: {} },
    reset: jest.fn(),
    setValue: jest.fn(),
    watch: jest.fn().mockReturnValue({})
  }),
  Controller: jest.fn(({ render }) => render({ field: {} }))
}));

describe('CreateAcademicYearForm Component', () => {
  it('renders all the input fields correctly', () => {
    // Render the CreateAcademicYearForm component
    render(<CreateAcademicYearForm onClose={jest.fn()} />);

    // Check for the Start Date input field
    const startDateInput = screen.getByLabelText(/start date/i);
    expect(startDateInput).toBeInTheDocument();

    // Check for the End Date input field
    const endDateInput = screen.getByLabelText(/end date/i);
    expect(endDateInput).toBeInTheDocument();

    // Check for the Set as Default Year checkbox
    const setDefaultCheckbox = screen.getByLabelText(/set as default year/i);
    expect(setDefaultCheckbox).toBeInTheDocument();

    // Check for the Create/Update button
    const submitButton = screen.getByRole('button', { name: /create academic year/i });
    expect(submitButton).toBeInTheDocument();
  });
});
