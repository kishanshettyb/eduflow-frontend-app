import { z } from 'zod';

export const newPasswordSchema = z
  .object({
    newPassword: z.string().min(8, {
      message: 'New password must be at least 8 characters.'
    }),
    confirmPassword: z.string().min(8, {
      message: 'Confirm password must be at least 8 characters.'
    })
  })
  .superRefine(({ newPassword, confirmPassword }, ctx) => {
    if (newPassword !== confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword']
      });
    }
  });
