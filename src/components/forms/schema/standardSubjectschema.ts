import { z } from 'zod';

export const standardSubjectSchema = z.object({
  standard: z.string().min(1, {
    message: 'Please select department'
  }),
  subjects: z.string().min(1, {
    message: 'Please select department'
  })
});
