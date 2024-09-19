import { z } from 'zod';
import { User } from './user.model';

export const userValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Invalid email address')
      .refine(
        async (email) => !(await User.findOne({ email })),
        'Email is already registered',
      ),
    password: z.string().min(6, 'Password must be at least 6 characters long'),
    role: z.string().optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters long')
      .optional(),
    image: z.string().optional(),
  }),
});

export const userUpdateValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters long')
      .optional(),
    image: z.string().optional(),
    role: z.string().optional(),
  }),
});

export const userChangePasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    oldPassword: z.string().min(6, 'Old password must be at least 6 characters long'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters long'),
  }),
});

