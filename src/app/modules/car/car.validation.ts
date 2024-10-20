import { z } from 'zod';

export const carCreateValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Car name is required' }),
    description: z.string({ required_error: 'Car description is required' }),
    color: z.string({ required_error: 'Car color is required' }),
    isElectric: z.boolean({
      required_error: 'Car electric status is required',
    }),
    features: z.array(
      z.string({ required_error: 'Each feature must be a string' }),
      { required_error: 'Car features are required' },
    ),
    pricePerHour: z
      .number({ required_error: 'Car price per hour is required' })
      .nonnegative(),
  }),
});

export const carUpdateValidationSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    description: z.string().optional(),
    color: z.string().optional(),
    isElectric: z.boolean().optional(),
    features: z.array(z.string()).optional(),
    pricePerHour: z.number().nonnegative().optional(),
  }),
});
