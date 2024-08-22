import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For the extended matchers like `toBeInTheDocument`
import { CreateStandardForm } from '../../forms/createStandardForm'; // Adjust the import path as needed

// Mock the hooks and context
jest.mock('@/services/mutation/admin/standard', () => ({
  useCreateStandard: () => ({ mutate: jest.fn() }),
  useUpdateStandard: () => ({ mutate: jest.fn() })
}));

jest.mock('@/services/queries/admin/standard', () => ({
  useGetStandardbyID: () => ({ data: { data: {} }, error: null })
}));

jest.mock('@/lib/provider/schoolContext', () => ({
  useSchoolContext: () => ({ schoolId: 1, academicYearId: 1 })
}));

describe('CreateStandardForm', () => {
  it('renders the input fields', () => {
    render(<CreateStandardForm standardId={null} onClose={jest.fn()} />);

    // Check if the Standard input field is present
    expect(screen.getByPlaceholderText('Standard')).toBeInTheDocument();

    // Check if the Section input field is present
    expect(screen.getByPlaceholderText('Section')).toBeInTheDocument();

    // Check if the Level input field is present
    expect(screen.getByPlaceholderText('Level')).toBeInTheDocument();

    // Check if the Max Strength input field is present
    expect(screen.getByPlaceholderText('Max Strength')).toBeInTheDocument();

    // Check if the Submit button is present
    expect(screen.getByText('Submit')).toBeInTheDocument();
  });
});
