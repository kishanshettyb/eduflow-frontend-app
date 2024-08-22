import { z } from 'zod';

export const standardSchema = z.object({
  standard: z.string().min(1, {
    message: 'Please enter standard'
  }),
  section: z.string().regex(/^[A-Z]+$/, {
    message: 'Enter section with capital letters only'
  }),
  level: z
    .string()
    .max(2, { message: 'Level must be 1 or 2 digits only' })
    .regex(/^\d{1,2}$/, {
      message: 'Enter level with 1 or 2 digit numbers only'
    }),
  maxStrength: z
    .string()
    .regex(/^\d+$/, {
      message: 'Enter maxStrength with numbers only'
    })
    .refine((val) => parseInt(val, 10) <= 100, {
      message: 'MaxStrength must be less than or equal to 100'
    })
});
