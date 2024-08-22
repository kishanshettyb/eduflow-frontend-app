import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateFeeComponentForm } from '../../forms/createFeeComponentForm';

describe('CreateFeeComponentForm', () => {
  it('renders the input fields', () => {
    render(<CreateFeeComponentForm feeComponentId={null} onClose={jest.fn()} />);

    expect(screen.getByPlaceholderText('Fee Component Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Amount')).toBeInTheDocument();
    expect(screen.getByText('Select Status')).toBeInTheDocument(); // For Partial Payment
    expect(screen.getByText('Pick a date')).toBeInTheDocument(); // For Due Date
  });
});
