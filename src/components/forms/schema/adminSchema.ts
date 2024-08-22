import { z } from 'zod';

export const adminSchema = z
  .object({
    firstName: z.string().min(1, {
      message: 'Please enter first name'
    }),
    lastName: z.string().min(1, {
      message: 'Enter last name.'
    }),
    email: z.string().email({
      message: 'Enter valid email'
    }),
    contactNumber: z.string().refine((value) => /^(9|7|8|6)\d{9}$/.test(value), {
      message: 'Mobile number must be exactly 10 digits long and start with 9 or 7 0r 8 or 6'
    }),
    dateOfBirth: z.date({
      required_error: 'Please Select date'
    }),
    gender: z.string().min(1, {
      message: 'Please Select gender'
    }),
    employmentStatus: z.string().min(1, {
      message: 'Please select employment status'
    }),
    departmentId: z.string().min(1, {
      message: 'Please select department'
    }),
    joiningDate: z.date({
      required_error: 'Please select joining date'
    }),
    fatherName: z.string().min(1, {
      message: 'Please enter father name'
    }),
    motherName: z.string().min(2, {
      message: 'Enter mother name.'
    }),
    emergencyContact: z.string().refine((value) => /^\d{10}$/.test(value), {
      message: 'Mobile number must be exactly 10 digits long'
    }),
    emergencyContactName: z.string().min(1, {
      message: 'Please enter name'
    }),
    currentAddress: z.object({
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
    permanentAddress: z.object({
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
    })
  })
  .refine((data) => data.joiningDate > data.dateOfBirth, {
    message: 'Joining date cannot be before date of birth',
    path: ['joiningDate']
  });
