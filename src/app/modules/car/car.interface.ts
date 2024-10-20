import { Document } from 'mongoose';
import { CAR_STATUS } from './car.constant';

export interface ICar extends Document {
  name: string;
  carModel: string;
  year: number;
  features: string[];
  description: string;
  color: string;
  isElectric: boolean;
  pricePerHour: number;
  image: string; // URL or path to the car image
  status: keyof typeof CAR_STATUS; // Status of the car
  isDeleted: boolean;
}
