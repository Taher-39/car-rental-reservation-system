import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { forgotPasswordService, resetPasswordService, signInService, updateUserService } from './auth.service';
import { signUpService } from './auth.service';

export const signUpController = catchAsync(async (req, res) => {
  const result = await signUpService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'User registered successfully',
    data: result,
  });
});

export const signInController = catchAsync(async (req, res) => {
  const { user, accessToken } = await signInService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is logged in succesfully!',
    data: user,
    token: accessToken,
  });
});

export const updateUserController = catchAsync(async (req, res) => {
  const payload = req.body;

  const updatedUser = await updateUserService(payload);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User updated successfully',
    data: updatedUser,
  });
});


// Forgot Password Controller
export const forgotPasswordController = catchAsync(async (req, res) => {
  const { email } = req.body;
  const result = await forgotPasswordService(email);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: ''
  });
});

// Reset Password Controller
export const resetPasswordController = catchAsync(async (req, res) => {
  const { token, newPassword } = req.body;
  const result = await resetPasswordService(token, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: ''
  });
});