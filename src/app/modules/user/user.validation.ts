import { z } from 'zod';
import { USER_ROLE, USER_STATUS } from './user.constant';

export const userCreateValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z
      .string()
      .email('Invalid email address'),
    password: z.string().min(4, 'Password must be at least 4 characters long'),
    role: z.nativeEnum(USER_ROLE).default(USER_ROLE.USER),
    phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters long')
    .optional(),
    image: z.string().optional(),
    status: z.nativeEnum(USER_STATUS).default(USER_STATUS.ACTIVE),
  }),
});

export const userUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    phone: z
      .string()
      .min(10, 'Phone number must be at least 10 characters long')
      .optional(),
    image: z.string().optional(),
    
    role: z.nativeEnum(USER_ROLE).optional(),
    status: z.nativeEnum(USER_STATUS).optional(),
  }),
});

export const userChangePasswordValidationSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    oldPassword: z.string().min(4, 'Old password must be at least 4 characters long'),
    newPassword: z.string().min(4, 'New password must be at least 4 characters long'),
  }),
});

