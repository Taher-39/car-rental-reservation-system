import httpStatus from 'http-status';
import AppError from '../../errors/AppError';
import { User } from '../user/user.model';
import { TSingnin } from './auth.interface';
import config from '../../config';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { IUser } from '../user/user.interface';
import crypto from 'crypto';
import { transporter } from '../../utils/mailTransporter';

export const signUpService = async (payload: IUser) => {
  // Check if email is already registered
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already registered');
  }

  // Create new user
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
  const isPasswordMatch = await bcrypt.compare(payload?.password, user?.password);
  console.log(isPasswordMatch)
  if (!isPasswordMatch) {
    throw new AppError(httpStatus.FORBIDDEN, 'Password do not matched');
  }

  //create token and sent to the  client

  const jwtPayload = {
    _id: user._id,
    email: user.email,
    role: user.role
  };

  const accessToken = jwt.sign(jwtPayload, config.JWT_ACCESS_SECRET as string, {
    expiresIn: config.JWT_ACCESS_EXPIRES_IN,
  });

  return {
    user,
    accessToken,
  };
};

// Update User Service
export const updateUserService = async (payload: Partial<IUser>, userRole: string) => {
  const user = await User.findOne({ email: payload?.email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Restrict role updates to admin users only
  if (payload.role && userRole !== 'admin') {
    throw new AppError(httpStatus.FORBIDDEN, 'Only admin can update roles');
  }

  // Update user details
  if (payload.name) user.name = payload.name;
  if (payload.phone) user.phone = payload.phone;
  if (payload.image) user.image = payload.image;
  if (payload.role) user.role = payload.role;

  await user.save();

  return user;
};

export const changePasswordService = async (email: string, oldPassword: string, newPassword: string) => {
  // Find the user by email
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Check if the old password is correct
  const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isOldPasswordValid) {
    throw new AppError(httpStatus.FORBIDDEN, 'Old password is incorrect');
  }

  // Hash the new password
  const hashedNewPassword = await bcrypt.hash(newPassword, Number(config.BCRYPT_SALT_ROUNDS));
  
  // Update user's password
  user.password = hashedNewPassword;
  await user.save();

  return { message: 'Password changed successfully!' };
};

// Generate Token
export const forgotPasswordService = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User with this email does not exist');
  }

  // Generate a password reset token
  const resetToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
  
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
export const resetPasswordService = async (token: string, newPassword: string) => {
  // Hash the token and find the user by token
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetTokenExpires: { $gt: Date.now() }, // Ensure the token is not expired
  });

  if (!user) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Token is invalid or has expired');
  }

  // Update password
  user.password = await bcrypt.hash(newPassword, Number(config.BCRYPT_SALT_ROUNDS));
  user.resetPasswordToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();

  return {
    message: 'Password reset successfully!',
  };
};