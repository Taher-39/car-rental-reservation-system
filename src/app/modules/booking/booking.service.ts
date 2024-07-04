import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import Car from '../car/car.model';
import { TBooking } from './booking.interface';
import BookingModel from './booking.model';
import {
  carPopulateField,
  userPopulateField,
} from '../../utils/popupateFields';
import { isPastDateTime } from '../../middlewares/isPastDateTime';

export const createBookingService = async (
  payload: any,
  userId: string,
): Promise<TBooking> => {
  const { date, startTime, carId } = payload;

  // time and date validate for future
  // if (isPastDateTime(date, startTime)) {
  //   throw new AppError(
  //     httpStatus.BAD_REQUEST,
  //     'Cannot create booking for past date and time',
  //   );
  // }

  // handle valid carId and car status
  const car = await Car.findById(carId);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  if (car.status === 'unavailable') {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Car is not available for booking',
    );
  }

  const booking = new BookingModel({
    date,
    startTime,
    car: carId,
    user: userId,
    endTime: null,
    totalCost: 0,
  });
  const result = await booking.save();
  await Car.findByIdAndUpdate(carId, { status: 'unavailable' });

  const updatedCreateBooking = await (
    await result.populate('user', userPopulateField)
  ).populate('car', carPopulateField);

  return updatedCreateBooking;
};

export const getAllBookingsService = async (
  carId?: string,
  date?: string,
): Promise<TBooking[]> => {
  const query: any = {};
  if (carId) query.car = carId;
  if (date) query.date = date;
  const result = await BookingModel.find(query)
    .populate('user', userPopulateField)
    .populate('car', carPopulateField);
  return result;
};

export const getUserBookingsService = async (
  userId: string,
): Promise<TBooking[]> => {
  const result = await BookingModel.find({ user: userId })
    .populate('user', userPopulateField)
    .populate('car', carPopulateField);
  return result;
};
