// src/schemas/attendanceFormSchema.ts
import { z } from 'zod';

export const attendanceFormSchema = z.object({
  attendanceDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Please select an attendance date.'
    }),
  attendanceData: z.array(
    z.object({
      staffId: z.number(),
      present: z.boolean(),
      comment: z.string().optional(),
      loginTime: z.string(),
      logoutTime: z.string(),
      staffDto: z.object({
        firstName: z.string(),
        lastName: z.string()
      })
    })
  )
});

export type FormValues = z.infer<typeof attendanceFormSchema>;

export const studentAttendanceFormSchema = z.object({
  attendanceDate: z
    .date()
    .nullable()
    .refine((date) => date !== null, {
      message: 'Please select an attendance date.'
    }),
  attendanceData: z.array(
    z.object({
      enrolmentId: z.number(),
      present: z.boolean(),
      comment: z.string().optional(),
      studentDto: z.object({
        firstName: z.string(),
        lastName: z.string()
      })
    })
  )
});

export type FormValue = z.infer<typeof studentAttendanceFormSchema>;
