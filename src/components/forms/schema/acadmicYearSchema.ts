import { z } from 'zod';

export const academicYearSchema = z
  .object({
    startDate: z.date({
      required_error: 'Please select a start date'
    }),
    endDate: z.date({
      required_error: 'Please select an end date'
    }),
    title: z.string().min(1, {
      message: 'Title cannot be empty'
    }),
    isDefault: z.boolean().optional()
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'End date must be after start date',
    path: ['endDate']
  })
  .refine(
    (data) => {
      const startDate = new Date(data.startDate);
      const endDate = new Date(data.endDate);
      const diffInMonths =
        (endDate.getFullYear() - startDate.getFullYear()) * 12 +
        (endDate.getMonth() - startDate.getMonth());
      return diffInMonths <= 12;
    },
    {
      message: 'The difference between start date and end date should not be more than 12 months',
      path: ['endDate']
    }
  );
