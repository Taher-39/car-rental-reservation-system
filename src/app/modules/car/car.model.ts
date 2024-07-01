import { Schema, model, Document } from 'mongoose';
import { TCar } from './car.interface';


const carSchema = new Schema<TCar>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  color: { type: String, required: true },
  isElectric: { type: Boolean, required: true },
  status: { type: String, default: 'available' },
  features: { type: [String], required: true },
  pricePerHour: { type: Number, required: true },
  isDeleted: { type: Boolean, default: false },
}, {
  timestamps: true
});

// remove __v
carSchema.methods.toJSON = function() {
    const obj = this.toObject();
    delete obj.__v;
    return obj;
  }

const Car = model<TCar>('Car', carSchema);
export default Car;
