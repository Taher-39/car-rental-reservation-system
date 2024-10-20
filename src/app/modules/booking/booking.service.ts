import { IBooking } from './booking.interface'; // Make sure to import IBooking
import { Car } from '../car/car.model'; // Adjust import based on your structure
import moment from 'moment';
import httpStatus from 'http-status';
import { CAR_STATUS } from '../car/car.constant';
import { BookingModel } from './booking.model';
import { carPopulateField, userPopulateField } from '../../utils/popupateFields';
import AppError from '../../errors/AppError';

export const createBookingService = async (
  payload: IBooking,
  userId: string,
): Promise<IBooking> => {
  const { pickupDate, startTime, car: carId } = payload;

  // Combine date and time for full validation
  const bookingDateTime = moment(`${moment(pickupDate).format('YYYY-MM-DD')} ${startTime}`, 'YYYY-MM-DD HH:mm');

  // Validate if the booking time is in the past
  if (bookingDateTime.isBefore(moment())) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot create booking for past date and time');
  }

  // Handle valid carId and car status
  const car = await Car.findById(carId);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  if (car.status === CAR_STATUS.BOOKED || car.status === CAR_STATUS.MAINTENANCE) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Car is not available for booking');
  }

  // Create the booking if the car is available
  const booking = new BookingModel({
    pickupDate,
    car: carId,
    user: userId,
    startTime,
    endTime: null, // Will be updated when car is returned
    totalAmount: 0, // This will be calculated later
  });

  const result = await booking.save();
  
  // Update car status to BOOKED after successful booking
  await Car.findByIdAndUpdate(carId, { status: CAR_STATUS.BOOKED });

  // Populate user and car data in the result
  const updatedCreateBooking = await (
    await result.populate('user', userPopulateField)
  ).populate('car', carPopulateField);

  return updatedCreateBooking;
};

export const getAllBookingsService = async (
  carId?: string,
  date?: string,
): Promise<IBooking[]> => {
  const query: any = {};
  if (carId) query.car = carId;
  if (date) query.pickupDate = { $gte: new Date(date) }; // Ensure date is a date range query
  const result = await BookingModel.find(query)
    .populate('user', userPopulateField)
    .populate('car', carPopulateField);
  return result;
};

export const getUserBookingsService = async (
  userId: string,
): Promise<IBooking[]> => {
  const result = await BookingModel.find({ user: userId })
    .populate('user', userPopulateField)
    .populate('car', carPopulateField);
  return result;
};
