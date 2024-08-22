import { z } from 'zod';

const gstNumberRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;

export const customerSchema = z.object({
  firstName: z.string().min(1, {
    message: 'Please enter first name'
  }),
  lastName: z.string().min(1, {
    message: 'Enter last name.'
  }),
  email: z.string().email({
    message: 'Enter valid email'
  }),
  mobileNumber: z.string().refine((value) => /^(9|7|8|6)\d{9}$/.test(value), {
    message: 'Mobile number must be exactly 10 digits long and start with 9 or 7 or 8 or 6'
  }),

  gstNumber: z
    .string()
    .optional()
    .refine(
      (value) => {
        if (!value) return true;
        return gstNumberRegex.test(value);
      },
      {
        message: 'Invalid GST number'
      }
    ),

  dateOfBirth: z
    .date({
      required_error: 'Please select a date'
    })
    .refine(
      (value) => {
        const currentDate = new Date();
        return value < currentDate;
      },
      {
        message: 'Date of birth cannot be in the future',
        path: ['dateOfBirth']
      }
    ),
  permanentAddress: z.object({
    streetName: z.string().min(2, {
      message: 'Please enter street name'
    }),
    city: z.string().min(2, {
      message: 'Please enter city'
    }),
    state: z.string().min(2, {
      message: 'Please enter state'
    }),
    pinCode: z.string().min(2, {
      message: 'Please enter pinCode'
    }),
    country: z.string().min(2, {
      message: 'Please enter country'
    })
  }),
  currentAddress: z.object({
    streetName: z.string().min(2, {
      message: 'Please enter street name'
    }),
    city: z.string().min(2, {
      message: 'Please enter city'
    }),
    state: z.string().min(2, {
      message: 'Please enter state'
    }),
    pinCode: z.string().min(2, {
      message: 'Please enter pinCode'
    }),
    country: z.string().min(2, {
      message: 'Please enter country'
    })
  })
});
