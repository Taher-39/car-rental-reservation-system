import httpStatus from "http-status";
import sendResponse from "../../utils/sendResponse";
import { TCar } from "./car.interface";
import Car from "./car.model";
import BookingModel from "../booking/booking.model";
import { TBooking } from "../booking/booking.interface";
import AppError from "../../errors/AppError";
import { carPopulateField, userPopulateField } from "../../utils/popupateFields";

export const createCar = async (payload: TCar): Promise<TCar> => {
  const result = await Car.create(payload);
  return result;
};

export const getAllCars = async (): Promise<TCar[]> => {
  const result = await Car.find({ isDeleted: false });
  return result;
};

export const getCarById = async (id: string): Promise<TCar | null> => {
  const result = await Car.findById(id).where('isDeleted').equals(false);
  return result;
};

export const updateCar = async (
  id: string,
  payload: Partial<TCar>
): Promise<TCar | null> => {
  const result = await Car.findOneAndUpdate({ _id: id }, payload, {
    new: true, runValidators: true
  }).where('isDeleted').equals(false);
  return result;
};

export const softDeleteCar = async (id: string): Promise<TCar | null> => {
  const result = await Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const returnCarService = async (payload: any): Promise<TBooking | null> => {
  const booking = await BookingModel.findById(payload.bookingId)
  
  
  if (!booking) {
    throw new AppError(httpStatus.NOT_FOUND, 'Booking not found');
  }

  booking.endTime = payload.endTime;
  const startTime = parseFloat(booking.startTime.replace(':', '.'));
  const endTime = parseFloat(payload.endTime.replace(':', '.'));
  const duration = endTime - startTime;
  const car = await Car.findById(booking.car);
  
  if (car) {
    booking.totalCost = duration * car.pricePerHour;
    await Car.findByIdAndUpdate(booking.car, { status: 'available' });
  }
  
  await booking.save();
  
  const updatedBooking = await (await booking.populate('user', userPopulateField))
  .populate('car', carPopulateField);

  return updatedBooking
};


