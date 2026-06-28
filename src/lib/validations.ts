import { z } from "zod";

export const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8).max(128) });
export const contactSchema = z.object({
  name: z.string().min(2).max(80), email: z.string().email(), subject: z.string().min(3).max(120), message: z.string().min(10).max(3000)
});
export const orderSchema = z.object({
  studentName: z.string().min(2).max(80), phone: z.string().regex(/^[+0-9 -]{10,18}$/),
  email: z.string().email().optional().or(z.literal("")), program: z.string().min(2).max(40),
  courseCode: z.string().min(2).max(20), serviceType: z.string().min(3).max(80),
  deadline: z.string().min(1), message: z.string().min(10).max(3000),
  uploadedFileUrl: z.string().max(500).optional(), paymentScreenshotUrl: z.string().max(500).optional()
});
