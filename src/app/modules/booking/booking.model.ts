import { Schema, model } from 'mongoose';
import { TBooking } from './booking.interface';

const bookingSchema = new Schema<TBooking>({
  date: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  car: { type: Schema.Types.ObjectId, ref: 'Car' },
  startTime: { type: String, required: true },
  endTime: { type: String, default: null },
  totalCost: { type: Number, default: 0 },
}, {
  timestamps: true,
});

// remove __v
bookingSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
}

const BookingModel = model<TBooking>('Booking', bookingSchema);

export default BookingModel;
