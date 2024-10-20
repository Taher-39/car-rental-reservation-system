import { Schema, model, Document } from 'mongoose';
import { IBooking } from './booking.interface';
import { BOOKING_STATUS, PAYMENT_STATUS } from './booking.constant';

const bookingSchema = new Schema<IBooking>({
  car: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  pickupDivision: {
    type: String,
    required: true,
  },
  pickupPoint: {
    type: String,
    required: true,
  },
  pickupDate: {
    type: Date,
    required: true,
  },
  dropOffDate: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: Object.keys(BOOKING_STATUS),
    default: BOOKING_STATUS.PENDING,
  },
  additionalFeatures: {
    type: [String],
  },
  paymentStatus: {
    type: String,
    enum: Object.keys(PAYMENT_STATUS),
    default: PAYMENT_STATUS.UNPAID,
  },
  isReturned: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
});

// Remove __v
bookingSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const BookingModel = model<IBooking>('Booking', bookingSchema);
