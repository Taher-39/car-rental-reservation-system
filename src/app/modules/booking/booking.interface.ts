import { Document } from 'mongoose';
import { ICar } from '../car/car.interface';
import { IUser } from '../user/user.interface';
import { BOOKING_STATUS, PAYMENT_STATUS } from './booking.constant';

export interface IBooking extends Document {
  car: ICar['_id']; // Reference to the Car model
  user: IUser['_id']; // Reference to the User model
  pickupDivision: string;
  pickupPoint: string;
  pickupDate: Date; // The date when the car is picked up
  dropOffDate: Date; // The date when the car is dropped off
  startTime: string; // The time of pickup (e.g., "10:30")
  endTime: string; // The time of drop-off (e.g., "15:45")
  totalAmount: number; // Calculated amount for the booking
  status: keyof typeof BOOKING_STATUS; // Booking status
  additionalFeatures: string[]; // e.g., GPS, insurance, etc.
  paymentStatus: keyof typeof PAYMENT_STATUS;
  isReturned: boolean; // Whether the car has been returned or not
}

