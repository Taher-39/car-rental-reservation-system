import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TSingnin } from './auth.interface';
import config from '../../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../user/user.interface';

export const signUpService = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};


export const signInService = async (payload: TSingnin) => {
  // checking if the user is exist
  const user = await User.findOne({ email: payload?.email });

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'This user is not found !');
  }

  //checking if the password is correct
  const isPasswordMatch = bcrypt.compare(payload?.password, user?.password);
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //create token and sent to the  client

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });

  return {
    user,
    accessToken,
  };
};
