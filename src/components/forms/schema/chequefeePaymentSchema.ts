import { z } from 'zod';

export const chequePaymentSchema = z.object({
  chequeAmount: z.string().refine((value) => /^\d{9,18}$/.test(value), {
    message: 'Cheque amount must be greater than 0'
  }),

  chequeDate: z
    .date({
      required_error: 'Please enter cheque date'
    })
    .refine((date) => date <= new Date(), {
      message: 'Cheque date cannot be in the future'
    }),

  chequeStatus: z.enum(['issued', 'cleared', 'returned', 'stopped'], {
    required_error: 'Please select cheque status',
    invalid_type_error: 'Invalid cheque status'
  }),

  bankName: z
    .string()
    .min(1, {
      message: 'Please enter bank name'
    })
    .max(100, {
      message: 'Bank name must be less than 100 characters'
    }),

  bankIFSCCode: z
    .string()
    .refine((value) => /^[A-Z]{4}[0][A-Z0-9]{6}$/.test(value) && value.length === 11, {
      message: 'Enter a valid 11-digit IFSC code'
    }),

  accountHolderName: z
    .string()
    .min(1, {
      message: 'Please enter account holder name'
    })
    .max(100, {
      message: 'Account holder name must be less than 100 characters'
    }),

  accountNumber: z.string().regex(/^\d{11,16}$/, {
    message: 'Account number must be between 11 and 16 digits'
  }),

  chequeNumber: z.string().refine((value) => /^\d{6}$/.test(value), {
    message: 'Cheque number must be a 6-digit number'
  }),

  micrCode: z.string().regex(/^\d{9}$/, {
    message: 'MICR number must be a 9-digit number'
  }),
  attachment: z
    .instanceof(File, {
      message: 'Please upload a file'
    })
    .refine((file) => file.size > 0, {
      message: 'File cannot be empty'
    })
});

// update cheque no validation schema

export const chequePaymentSchemaa = z.object({
  chequeAmount: z.string().optional(),
  chequeNumber: z.string().optional(),
  chequeDate: z.date().optional(),
  chequeStatus: z.string().min(1, {
    message: 'Please Select chequeStatus'
  }),
  bankName: z.string().optional(),
  bankIFSCCode: z.string().optional(),
  accountHolderName: z.string().optional(),
  accountNumber: z.string().optional(),
  chequeDetailsId: z.string().optional(),
  micrCode: z.string().optional(),
  attachment: z.instanceof(File).nullable().optional()
});
