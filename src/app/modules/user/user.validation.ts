import { z } from 'zod';
import { User } from './user.model';

export const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .refine(async (email) => !(await User.findOne({ email })), 'Email is already registered'), 
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    confirmPassword: z
      .string()
      .min(6, 'Confirm Password must be at least 6 characters long'),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters long')
      .optional(),
    image: z
      .string()
      .optional(),
  }).refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  }),
});
