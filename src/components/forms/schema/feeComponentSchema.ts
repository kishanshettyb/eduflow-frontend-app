import { z } from 'zod';

export const feecomponentSchema = z.object({
  feeComponentName: z.string().min(1, {
    message: 'Please enter fee component'
  }),
  amount: z.string().min(1, {
    message: 'Enter amount.'
  }),
  description: z.string().min(1, {
    message: 'Please enter  description'
  }),
  partialPayment: z.string(),
  dueDate: z.date({
    required_error: 'Please select due date'
  })
});
