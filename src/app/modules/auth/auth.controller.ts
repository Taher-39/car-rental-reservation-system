import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { signInService } from './auth.service';
import { signUpService } from './auth.service';

export const signUpController = catchAsync(async (req, res) => {
  const result = await signUpService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: 'User registered successfully',
    data: result,
  });
});

export const signInController = catchAsync(async (req, res) => {
  const { user, accessToken } = await signInService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: user,
    token: accessToken,
  });
});
