import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CreateExamForm } from '../../forms/createExamForm';
import { useCreateExam, useUpdateExam } from '@/services/mutation/exam';

describe('CreateExamForm', () => {
  it('should render the form and display all fields and buttons', () => {
    render(<CreateExamForm onClose={jest.fn()} examId={null} />);
    expect(screen.getByText('Select ExamType')).toBeInTheDocument();
    expect(screen.getByText('Standard')).toBeInTheDocument();
    expect(screen.getByText('Section')).toBeInTheDocument();
    expect(screen.getByText('Subject Type')).toBeInTheDocument();
    expect(screen.getByText('Subject')).toBeInTheDocument();
    expect(screen.getByText('Min marks')).toBeInTheDocument();
    expect(screen.getByText('Max Marks')).toBeInTheDocument();
    expect(screen.getByText('Exam Date')).toBeInTheDocument();
    expect(screen.getByText('Start Time')).toBeInTheDocument();
    expect(screen.getByText('Duration (mins)')).toBeInTheDocument();
    expect(screen.getByText('End Time')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('should call createExam mutation on form submit when examId is not provided', async () => {
    const createExamMutation = vi.fn();
    vi.mocked(useCreateExam).mockReturnValue({ mutate: createExamMutation });

    render(<CreateExamForm examId={null} onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Min Marks'), { target: { value: '15' } });
    fireEvent.change(screen.getByPlaceholderText('Max Marks'), { target: { value: '150' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(createExamMutation).toHaveBeenCalled();
    });
  });

  it('should call updateExam mutation on form submit when examId is provided', async () => {
    const updateExamMutation = vi.fn();
    vi.mocked(useUpdateExam).mockReturnValue({ mutate: updateExamMutation });

    render(<CreateExamForm examId={1} onClose={vi.fn()} />);

    fireEvent.change(screen.getByPlaceholderText('Min Marks'), { target: { value: '15' } });
    fireEvent.change(screen.getByPlaceholderText('Max Marks'), { target: { value: '150' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(updateExamMutation).toHaveBeenCalled();
    });
  });

  it('should show validation errors when required fields are empty', async () => {
    render(<CreateExamForm examId={null} onClose={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Start Time is required')).toBeInTheDocument();
    expect(await screen.findByText('Exam Date is required')).toBeInTheDocument();
    // Add checks for other validation errors as needed
  });

  it('should calculate endTime based on startTime and duration', () => {
    render(<CreateExamForm examId={null} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Start Time'), { target: { value: '08:00' } });
    fireEvent.change(screen.getByLabelText('Duration (mins)'), { target: { value: '90' } });

    expect(screen.getByDisplayValue('09:30')).toBeInTheDocument(); // Assuming endTime should be 09:30
  });

  it('should handle dropdown selections properly', () => {
    render(<CreateExamForm examId={null} onClose={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Standard'), { target: { value: 'Standard 2' } });
    fireEvent.change(screen.getByLabelText('Section'), { target: { value: 'Section B' } });
    fireEvent.change(screen.getByLabelText('Subject Type'), { target: { value: '2' } });
    fireEvent.change(screen.getByLabelText('Subject'), { target: { value: '2' } });

    expect(screen.getByDisplayValue('Standard 2')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Section B')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2')).toBeInTheDocument(); // Assuming subjectTypeId is 2
  });
});
