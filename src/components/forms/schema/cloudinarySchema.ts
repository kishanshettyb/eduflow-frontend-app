import { z } from 'zod';

export const cloudinarySchema = z.object({
  cloudName: z.string().min(1, {
    message: 'Cloud Name is required'
  }),
  apiKey: z.string().min(2, {
    message: 'API Key is required'
  }),
  apiSecret: z.string().min(2, {
    message: 'API Secret is required'
  }),
  secret: z.string().min(1, {
    message: 'Please Select secret'
  })
});
