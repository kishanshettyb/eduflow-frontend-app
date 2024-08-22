import { z } from 'zod';

export const subjectSchema = z.object({
  subjectName: z.string().min(1, {
    message: 'Please enter subjectName'
  }),
  description: z.string().min(2, {
    message: 'Enter last description.'
  })
});
