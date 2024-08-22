import { z } from 'zod';

export const periodSchema = z
  .object({
    startTime: z.string().min(1, {
      message: 'Please enter start time'
    }),
    endTime: z.string().min(1, {
      message: 'Please enter end time'
    }),
    breakTime: z.boolean(), // Assuming breakTime is a string; change as needed
    title: z.string().min(1, {
      message: 'Please enter title'
    })
  })
  .refine(
    (data) => {
      const startTime = new Date(`1970-01-01T${data.startTime}`);
      const endTime = new Date(`1970-01-01T${data.endTime}`);
      return endTime.getTime() > startTime.getTime() + 4 * 60 * 1000; // 5 minutes in milliseconds
    },
    {
      message: 'End time must be at least 5 minutes greater than start time',
      path: ['endTime']
    }
  );
