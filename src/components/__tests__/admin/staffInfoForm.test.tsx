import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateStaffInfoForm } from '../../forms/createStaffInfoForm';

describe('CreateStaffInfoForm', () => {
  it('renders the input fields', () => {
    render(<CreateStaffInfoForm selectedFile={null} onSuccess={jest.fn()} />);

    expect(screen.getByPlaceholderText('First Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phone')).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
    expect(screen.getByText('Select Gender')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Father Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Mother Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Emergency Contact')).toBeInTheDocument();
    expect(screen.getByText('Select Staff Type')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Emergency Contact Name')).toBeInTheDocument();
    expect(screen.getByText('Select Status')).toBeInTheDocument();
    expect(screen.getByText('Select Department')).toBeInTheDocument();
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Building & Street Name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('City')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Pincode')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('State')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Country')).toBeInTheDocument();
  });
});
