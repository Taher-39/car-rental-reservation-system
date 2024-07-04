import { object, z } from 'zod';

export const createBookingValidationSchema = z.object({
  body: z.object({
    carId: z.string(),
    date: z.string(),
    startTime: z.string(),
  }),
});

export const returnCarValidationSchema = z.object({
  body: z.object({
    bookingId: z.string(),
    endTime: z.string(),
  }),
});
