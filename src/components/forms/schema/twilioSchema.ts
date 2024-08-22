import { z } from 'zod';

export const twilioSchema = z.object({
  accountSid: z.string().min(1, {
    message: 'Account SID is required'
  }),
  authToken: z.string().min(2, {
    message: 'Auth Token is required'
  }),
  phoneNumber: z.string()
});
