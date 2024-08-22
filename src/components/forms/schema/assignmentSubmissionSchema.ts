import { z } from 'zod';

export const assignmentSubmissionSchema = z.object({
  comments: z.string().min(1, { message: 'Comments are required' }),
  submissionDate: z.date(),
  files: z.array(z.instanceof(File))
});
