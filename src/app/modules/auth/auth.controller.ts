import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { changePasswordService, forgotPasswordService, resetPasswordService, signInService } from './auth.service';
import { signUpService } from './auth.service';
import config from '../../config';

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
  const { user, accessToken, refreshToken } = await signInService(req.body);

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: config.NODE_ENV === "production",
  });

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'User is logged in succesfully!',
    data: {
      user,
      accessToken,
    },
  });
});

export const changePasswordController = catchAsync(async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;

  const result = await changePasswordService(email, oldPassword, newPassword);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: result.message,
    data: ''
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