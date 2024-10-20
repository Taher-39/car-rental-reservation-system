import { Document, Types } from 'mongoose';
import { USER_ROLE, USER_STATUS } from './user.constant';

export interface IUser extends Document {
  _id?: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  role: keyof typeof USER_ROLE;
  status: keyof typeof USER_STATUS;
  phone?: string;
  image?: string;
  loginCount?: number; 
  resetPasswordToken?: string;
  resetTokenExpires?: Date;

  incrementLoginCount(): Promise<void>;
}



