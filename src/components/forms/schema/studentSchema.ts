import { z } from 'zod';

export const studentSchema = z.object({
  firstName: z.string().min(1, {
    message: 'Please enter first name'
  }),
  lastName: z.string().min(2, {
    message: 'Enter last name.'
  }),
  email: z.string().email({
    message: 'Enter valid email'
  }),
  bloodGroup: z
    .string()
    .regex(
      /^(A|B|AB|O)[+-]$/,
      'Invalid blood group. Must be one of A+, A-, B+, B-, AB+, AB-, O+, O-'
    ),

  contactNumber: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: 'Mobile number must be exactly 10 digits long'
  }),
  dateOfBirth: z.date({
    required_error: 'Please Select date'
  }),
  gender: z.string().min(1, {
    message: 'Please Select gender'
  }),
  isActive: z.string().min(1, {
    message: 'Please select employment status'
  }),

  fatherName: z.string().min(1, {
    message: 'Please enter father name'
  }),
  motherName: z.string().min(2, {
    message: 'Enter mother name.'
  }),

  parentContactNumber: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: 'Mobile number must be exactly 10 digits long'
  }),
  emergencyContact: z.string().refine((value) => /^\d{10}$/.test(value), {
    message: 'Mobile number must be exactly 10 digits long'
  }),
  emergencyContactName: z.string().min(1, {
    message: 'Please enter name'
  }),
  admissionDate: z.date({
    required_error: 'Please Select date'
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
});
