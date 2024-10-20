import moment from 'moment'; 
import httpStatus from 'http-status';
import { ICar } from './car.interface';
import Car from './car.model';
import { IBooking } from '../booking/booking.interface';
import AppError from '../../errors/AppError';
import {
  carPopulateField,
  userPopulateField,
} from '../../utils/popupateFields';
import { CAR_STATUS } from './car.constant';
import { isValidObjectId } from 'mongoose';
import { BookingModel } from '../booking/booking.model';

// Create a car
export const createCar = async (payload: ICar): Promise<ICar> => {
  // Validate the payload (additional validation can be done here)
  if (!payload.name || !payload.carModel || !payload.year || !payload.pricePerHour) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Required car details are missing');
  }

  const result = await Car.create(payload);
  return result;
};

// Get all cars that are not deleted
export const getAllCars = async (): Promise<ICar[]> => {
  const result = await Car.find({ isDeleted: false });
  return result;
};

// Get a single car by ID
export const getCarById = async (id: string): Promise<ICar | null> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid car ID format');
  }

  const result = await Car.findById(id).where('isDeleted').equals(false);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found');
  }

  return result;
};

// Update a car by ID
export const updateCar = async (
  id: string,
  payload: Partial<ICar>,
): Promise<ICar | null> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid car ID format');
  }

  // Check if the car exists and is not deleted
  const car = await Car.findById(id).where('isDeleted').equals(false);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found or has been deleted');
  }

  // Apply update
  const result = await Car.findOneAndUpdate({ _id: id }, payload, {
    new: true,
    runValidators: true,
  })
    .where('isDeleted')
    .equals(false);
  
  return result;
};

// Soft delete a car
export const softDeleteCar = async (id: string): Promise<ICar | null> => {
  if (!isValidObjectId(id)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Invalid car ID format');
  }

  const car = await Car.findById(id).where('isDeleted').equals(false);
  if (!car) {
    throw new AppError(httpStatus.NOT_FOUND, 'Car not found or has already been deleted');
  }

  // Soft delete the car
  const result = await Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  
  return result;
};


export const returnCarService = async (
  payload: any,
): Promise<IBooking | null> => {
  const booking = await BookingModel.findById(payload.bookingId);

  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  // Validate end date and time
  const { dropOffDate, endTime } = payload;
  
  // Check if the dropOffDate is in the past
  const isPastDateTime = (date: Date, time: string) => {
    const dateTime = moment(`${moment(date).format('YYYY-MM-DD')} ${time}`, 'YYYY-MM-DD HH:mm');
    return dateTime.isBefore(moment());
  };

  if (isPastDateTime(dropOffDate, endTime)) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Cannot update booking for past date and time');
  }

  // Ensure that the end time is after the start time on the same day
  const startDateTime = moment(`${moment(booking.pickupDate).format('YYYY-MM-DD')} ${booking.startTime}`, 'YYYY-MM-DD HH:mm');
  const dropOffDateTime = moment(`${moment(dropOffDate).format('YYYY-MM-DD')} ${endTime}`, 'YYYY-MM-DD HH:mm');

  const duration = moment.duration(dropOffDateTime.diff(startDateTime)).asHours();
  
  if (duration <= 0) {
    throw new AppError(httpStatus.BAD_REQUEST, 'End time must be greater than start time');
  }

  // Calculate the total cost
  const car = await Car.findById(booking.car);

  if (car) {
    booking.totalAmount = duration * car.pricePerHour; // Calculate total based on duration and price
    await Car.findByIdAndUpdate(booking.car, { status: CAR_STATUS.AVAILABLE });
  }

  // Set the end date and time, and save the booking
  booking.endTime = endTime;
  booking.dropOffDate = dropOffDate;
  booking.isReturned = true;

  await booking.save();

  const updatedBooking = await (
    await booking.populate('user', userPopulateField)
  ).populate('car', carPopulateField);

  return updatedBooking;
};



