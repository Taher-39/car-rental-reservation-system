import { z } from 'zod';

// Define the Zod validation schema
export const userValidationSchema = z.object({
    body: z.object({
        name: z.string().min(1, "Name is required"),
        email: z.string().email("Invalid email address"),
        role: z.enum(['user', 'admin']),
        password: z.string().min(6, "Password must be at least 6 characters long"),
        phone: z.string().min(10, "Phone number must be at least 10 characters long"),
        address: z.string().min(1, "Address is required")
      })
});

