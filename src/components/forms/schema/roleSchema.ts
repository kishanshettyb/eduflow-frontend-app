import { z } from 'zod';

export const roleSchema = z.object({
  roleName: z
    .string()
    .regex(/^ROLE_[A-Z]+$/, {
      message: 'Role name must start with "ROLE_"'
    })
    .min(1, {
      message: 'Please enter role name'
    }),
  title: z.string().min(2, {
    message: 'Please Enter title.'
  })
});
