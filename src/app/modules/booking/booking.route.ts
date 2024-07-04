// routes/booking.routes.ts
import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { createBookingValidationSchema } from './booking.validation';
import auth from '../../middlewares/auth';
import {
  createBookingController,
  getAllBookingsAdminController,
  getUserBookingsController,
} from './booking.controller';

const router = express.Router();

router.post(
  '/',
  auth('user'),
  validateRequest(createBookingValidationSchema),
  createBookingController,
);

router.get('/', auth('admin'), getAllBookingsAdminController);

router.get('/my-bookings', auth('user'), getUserBookingsController);

export const BookingRoutes = router;
