import { z } from 'zod';

export const feestructureSchema = z.object({
  feeStructureName: z.string().min(1, {
    message: 'Please enter fee structure'
  }),

  feeComponentId: z.array(z.string()).min(1, {
    message: 'Please select fee component'
  }),
  dueDate: z.date({
    required_error: 'Please Select dueDate'
  })
});
