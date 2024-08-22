import { z } from 'zod';

export const assignmentSchema = z.object({
  title: z.string().nonempty('Title is required'),
  subjectId: z.string().nonempty('Subject is required'),
  description: z.string().nonempty('Description is required'),
  startDate: z.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'Start date cannot be in the past'
  }),
  lastDate: z.date().refine((date) => date >= new Date(new Date().setHours(0, 0, 0, 0)), {
    message: 'End date cannot be in the past'
  }),

  file: z.any().optional()
});
