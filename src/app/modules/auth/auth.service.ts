import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TSingnin } from './auth.interface';
import config from '../../config';
import jwt from 'jsonwebtoken';
import { IUser } from '../user/user.interface';
import crypto from 'crypto';
import { transporter } from '../../utils/mailTransporter';
import { USER_ROLE, USER_STATUS } from '../user/user.constant';
import { isPasswordMatched } from './auth.util';

export const signUpService = async (payload: IUser): Promise<any> => {
  // Check if email is already registered
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already registered');
  }

  //set user role
  payload.role = USER_ROLE.USER;

  // Create new user
  const result = await User.create(payload);
  return result;
};

export const signInService = async (payload: TSingnin) => {
  const user = await User.findOne({ email: payload.email }).select("+password") as IUser;

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,"User not found");
  }

  if (user.status === USER_STATUS.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST,"User is blocked");
  }

  const passwordMatch = await isPasswordMatched(
    payload.password,
    user.password
  );

  if (!passwordMatch) {
    throw new AppError(httpStatus.FORBIDDEN,"Password not matched");
  }

    // Increment login count
    await user.incrementLoginCount();

  const jwtPayload = {
    email: user.email,
    role: user.role,
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });

  const refreshToken = jwt.sign(
    jwtPayload,
    config.JWT_REFRESH_SECRET as string,
    {
      expiresIn: config.JWT_REFRESH_EXPIRES_IN,
    }
  );

  return {
    user,
    accessToken,
    refreshToken,
  };
};


export const changePasswordService = async (
  email: string,
  oldPassword: string,
  newPassword: string,
) => {
  // Find the user by email
  const user = await User.findOne({ email }).select("+password") as IUser;
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  if (user.status === USER_STATUS.BLOCKED) {
    throw new AppError(httpStatus.BAD_REQUEST,"User is blocked");
  }

  // Check if the old password is correct
  const isOldPasswordValid = await isPasswordMatched(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
  }

  // Update user's password
  user.password = newPassword;
  await user.save();

  return { message: 'Password changed successfully!' };
};

// Generate Token
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(
      httpStatus.NOT_FOUND,
      'User with this email does not exist',
    );
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Save token and expiry time in the user model
  user.resetPasswordToken = tokenHash;
  user.resetTokenExpires = new Date(Date.now() + 10 * 60 * 1000); // Token expires in 10 minutes
  await user.save();

  // Send reset link via email
  const resetUrl = `http://localhost:5173/resetPassword/${resetToken}`; //need replace with hosted client
  const message = `Click this link to reset your password: ${resetUrl}`;

  await transporter.sendMail({
    to: user.email,
    from: config.GMAIL,
    subject: 'Password Reset',
    text: message,
  });

  return {
    message: 'Password reset email sent!',
  };
};

// Reset Password Service
export const resetPasswordService = async (
  token: string,
  newPassword: string,
) => {
  // Hash the token and find the user by token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() }, // Ensure the token is not expired
  });

  if (!user) {
    throw new AppError(
      httpStatus.BAD_REQUEST,
      'Token is invalid or has expired',
    );
  }

  // Update password
  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return {
    message: 'Password reset successfully!',
  };
};
