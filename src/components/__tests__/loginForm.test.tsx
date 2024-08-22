import React from 'react';
import { render, screen } from '@testing-library/react';
import { LoginForm } from '../forms/loginForm';

describe('LoginForm', () => {
  it('renders the input fields', () => {
    render(<LoginForm />);

    // Check if the username input field is present
    expect(screen.getByPlaceholderText('Username')).toBeInTheDocument();

    // Check if the password input field is present
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();

    // Check if the show password toggle button is present
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Check if the Forgot Password link is present
    expect(screen.getByText('Forgot Password?')).toBeInTheDocument();
  });
});
