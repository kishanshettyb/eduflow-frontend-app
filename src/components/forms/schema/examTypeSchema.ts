import { z } from 'zod';

export const examTypeSchema = z.object({
  examNameTitle: z.string().min(1, {
    message: 'Please enter Exam type'
  }),
  description: z.string().min(2, {
    message: 'Please Enter description.'
  })
});
