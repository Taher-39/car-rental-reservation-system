import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  createBookingService,
  getAllBookingsService,
  getUserBookingsService,
} from './booking.service';

export const createBookingController = catchAsync(async (req, res) => {
  const result = await createBookingService(req.body, req.user._id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Car booked successfully',
    data: result,
  });
});

export const getAllBookingsAdminController = catchAsync(async (req, res) => {
  const { carId, date } = req.query;
  const result = await getAllBookingsService(carId as string, date as string);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.length > 0 ? 'Bookings retrieved successfully' : 'No Data Found',
    data: result,
  });
});

export const getUserBookingsController = catchAsync(async (req, res) => {
  const result = await getUserBookingsService(req.user._id);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.length > 0 ? 'My Bookings retrieved successfully' : 'No Data Found',
    data: result,
  });
});

