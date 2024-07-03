import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { createBookingService, 
         getAllBookingsService, 
         getUserBookingsService
} from './booking.service';
import Car from '../car/car.model';

export const createBookingController = catchAsync(async (req, res) => {
  const result = await createBookingService(req.body, req.user._id);
  if(!result){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car booked successfully',
    data: result,
  });
});

export const getAllBookingsAdminController = catchAsync(async (req, res) => {
  const { carId, date } = req.query;
  const result = await getAllBookingsService(carId as string, date as string);
  if(result.length === 0){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Bookings retrieved successfully',
    data: result,
  });
});

export const getUserBookingsController = catchAsync(async (req, res) => {
  const result = await getUserBookingsService(req?.user?._id);
  if(result.length === 0){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'My Bookings retrieved successfully',
    data: result,
  });
});




