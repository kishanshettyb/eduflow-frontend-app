import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { CreateAddFeePayment } from '../../forms/createAddFeePayment';
import { useRouter } from 'next/navigation';

// Mock the useRouter hook from next/router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn()
}));

describe('CreateAddFeePayment', () => {
  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      // Provide any necessary mock implementation for useRouter
      push: jest.fn(),
      query: {},
      pathname: '',
      asPath: '',
      route: ''
    });
  });

  it('renders the input fields and buttons correctly', () => {
    render(<CreateAddFeePayment onClose={jest.fn()} enrollmentId={1} />);

    expect(screen.getByText('Fee Component Name')).toBeInTheDocument();
    expect(screen.getByText('Total Amount')).toBeInTheDocument();
    expect(screen.getByText('Paid Amount')).toBeInTheDocument();
    expect(screen.getByText('Due Amount')).toBeInTheDocument();
    expect(screen.getByText('Paying Amount')).toBeInTheDocument();
    expect(screen.getByText('Payment Method')).toBeInTheDocument();

    // Placeholder text for cheque fields
    expect(screen.queryByPlaceholderText('Cheque Amount')).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText('Cheque Number')).not.toBeInTheDocument();

    // Render the payment method select
    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'CHEQUE' } });

    expect(screen.getByPlaceholderText('Cheque Amount')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Cheque Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bank Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Bank IFSC Code')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Account Holder Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Account Number')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('MICR Code')).toBeInTheDocument();

    // Check that the submit button is rendered
    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
  });

  it('disables the paying amount input when checkbox is unchecked', () => {
    render(<CreateAddFeePayment onClose={jest.fn()} enrollmentId={1} />);

    // Simulate checkbox toggle
    const checkbox = screen.getAllByRole('checkbox')[0];
    const payingAmountInput = screen.getAllByRole('textbox')[0];

    // Initially checkbox should be unchecked
    expect(checkbox).not.toBeChecked();
    expect(payingAmountInput).toBeDisabled();

    // Check the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(payingAmountInput).toBeEnabled();

    // Uncheck the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
    expect(payingAmountInput).toBeDisabled();
  });

  it('displays error message for invalid paying amount', () => {
    render(<CreateAddFeePayment onClose={jest.fn()} enrollmentId={1} />);

    // Simulate checkbox toggle and input value change
    const checkbox = screen.getAllByRole('checkbox')[0];
    const payingAmountInput = screen.getAllByRole('textbox')[0];

    fireEvent.click(checkbox);
    fireEvent.change(payingAmountInput, { target: { value: '1000' } });

    // Assuming max due amount is 500 for the first fee component
    expect(screen.getByText('Cannot enter amount more than due amount')).toBeInTheDocument();
  });
});
