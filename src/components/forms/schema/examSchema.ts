import { z } from 'zod';

export const examSchema = z.object({
  examType: z.string().min(1, {
    message: 'Please enter examNameTitle'
  }),
  standards: z.string().min(1, {
    message: 'Please enter standard'
  }),
  sections: z.string().min(1, {
    message: 'Enter section'
  }),
  subject: z.string().min(1, {
    message: 'Select subject '
  }),

  examDate: z.date({
    required_error: 'Please Select date'
  }),
  subjectType: z.string().min(1, {
    message: 'Select subject Types'
  }),
  minMarks: z.string().min(1, {
    message: 'Enter  minMarks'
  }),
  maxMarks: z.string().min(1, {
    message: 'Enter   maxMarks'
  }),
  duration: z.string().min(1, {
    message: 'Please select Duration'
  })
});
