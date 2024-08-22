import React from 'react';
import { render, screen } from '@testing-library/react';
import { CreateStandardSubjectForm } from '../../forms/createStandardSubjectForm';

describe('CreateStandardSubjectForm', () => {
  it('renders the Select input field', () => {
    render(
      <CreateStandardSubjectForm
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    );
    const standardSelect = screen.getByLabelText(/Select Standard/i);
    expect(standardSelect).toBeInTheDocument();
    const subjectTypeSelect = screen.getByLabelText(/Select Subject Type/i);
    expect(subjectTypeSelect).toBeInTheDocument();
    const subjectsSelect = screen.getByLabelText(/Select Subjects/i);
    expect(subjectsSelect).toBeInTheDocument();
    const submitButton = screen.getByText(/Submit/i);
    expect(submitButton).toBeInTheDocument();
  });
});
