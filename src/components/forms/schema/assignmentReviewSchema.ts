import { z } from 'zod';

export const assignmentReviewSchema = z.object({
  feedback: z.string().nonempty('Feedback is required'),
  grade: z.string().nonempty('Grade is required')
});
