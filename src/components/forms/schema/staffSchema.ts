import moment from 'moment';
import { z } from 'zod';

export const staffschema = z.object({
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
    message: 'Mobile number must be exactly 10 digits long and start with 6 or 7 or 8 or 9'
  }),
  dateOfBirth: z
    .date({
      required_error: 'Please Select date'
    })
    .refine((date) => moment().diff(moment(date), 'years') >= 18, {
      message: 'Please select a date that is at least 18 years ago'
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
  staffType: z.string().min(1, {
    message: 'Please select staff type'
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
});

export const qualificationSchema = z.object({
  nameOfInstitute: z.string().min(1, {
    message: 'Please enter name Of Institute'
  }),
  university: z.string().min(2, {
    message: 'Enter university.'
  }),
  yearOfPassing: z.string().min(2, {
    message: 'Enter valid year Of Passing'
  }),
  degree: z.string().min(2, {
    message: 'Enter valid degree'
  }),
  files: z.any().optional()
});

export const workExperienceSchema = z.object({
  companyName: z.string().min(2, {
    message: 'Please enter name Of companyName'
  }),
  positions: z.string().min(2, {
    message: 'Enter positions.'
  }),
  workingYears: z.string().min(1, {
    message: 'Enter valid workingYears'
  }),
  responsibilities: z.string().min(2, {
    message: 'Enter valid responsibilities'
  }),
  joiningDate: z.date({
    message: 'Enter valid joiningDate'
  }),
  leavingDate: z.date({
    message: 'Enter valid leavingDate'
  }),
  files: z.any().optional()
});
