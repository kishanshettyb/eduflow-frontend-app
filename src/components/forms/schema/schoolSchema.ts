import { z } from 'zod';

export const schoolSchema = z.object({
  schoolName: z.string().min(1, {
    message: 'Please enter first name'
  }),

  customerId: z.string().min(1, {
    message: 'Please select customer.'
  }),

  contactPerson: z.string().min(1, {
    message: 'Please enter first name'
  }),

  emailId: z.string().email({
    message: 'Enter valid email'
  }),

  description: z.string().min(1, {
    message: 'Please enter first name'
  }),

  contactNumber: z.string().refine((value) => /^(9|7|8|6)\d{9}$/.test(value), {
    message: 'Mobile number must be exactly 10 digits long and start with 9 or 7 or 8 or 6'
  }),
  address: z.object({
    streetName: z.string().min(1, {
      message: 'Please enter street name'
    }),

    city: z.string().min(1, {
      message: 'Please enter city'
    }),

    state: z.string().min(1, {
      message: 'Please enter state'
    }),

    pinCode: z.string().min(1, {
      message: 'Please enter pincode'
    }),

    country: z.string().min(1, {
      message: 'Please enter country'
    })
  }),

  uniqueCode: z.string().length(3, {
    message: 'Unique code must be exactly 3 characters long'
  })
});
