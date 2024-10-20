import { CAR_STATUS } from './car.constant';
import { Schema, model } from 'mongoose';
import { ICar } from './car.interface';

const carSchema = new Schema<ICar>(
  {
    name: {
      type: String,
      required: true,
    },
    carModel: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    features: {
      type: [String], // Array of features like GPS, child seat, etc.
      required: true,
    },
    description: {
      type: String, // Description of the car
      required: true,
    },
    color: {
      type: String, // Car color
      required: true,
    },
    isElectric: {
      type: Boolean, // Whether the car is electric or not
      required: true,
    },
    pricePerHour: {
      type: Number,
      required: true,
    },
    image: {
      type: String,
      required: true, // URL or path to the image
    },
    status: {
      type: String,
      enum: Object.keys(CAR_STATUS), // Car status
      default: CAR_STATUS.AVAILABLE,
    },
    isDeleted: {
      type: Boolean,
      default: false, // Soft delete field
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Remove the __v field when returning a car document
carSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.__v;
  return obj;
};

export const Car = model<ICar>('Car', carSchema);
export default Car;
