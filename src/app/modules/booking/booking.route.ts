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
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post(
  '/',
  auth(USER_ROLE.USER),
  validateRequest(createBookingValidationSchema),
  createBookingController,
);

router.get('/', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), getAllBookingsAdminController);

router.get('/my-bookings', auth(USER_ROLE.USER), getUserBookingsController);

export const BookingRoutes = router;
