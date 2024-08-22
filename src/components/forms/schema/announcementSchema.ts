import { z } from 'zod';

export const announcementSchema = z.object({
  announcementTitle: z.string().min(1, {
    message: 'Announcement title is required'
  }),
  description: z.string().min(1, {
    message: 'Description is required'
  }),
  targetType: z.string().min(1, {
    message: 'User type is required'
  }),
  standardIds: z.array(z.string()).optional(), // Make standardIds optional
  file: z.any().optional() // Adjust this as per your file handling requirements
});
