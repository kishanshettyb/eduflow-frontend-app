import { z } from 'zod';

export const razorpaySchema = z.object({
  keyId: z.string().min(1, {
    message: 'Key ID is required'
  }),
  secretKey: z.string().min(1, {
    message: 'Secret Key is required'
  })
});
