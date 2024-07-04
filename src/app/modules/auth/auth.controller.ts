import httpStatus from 'http-status';
import sendResponse from '../../utils/sendResponse';
import catchAsync from '../../utils/catchAsync';
import { signinService } from './auth.service';

export const signinController = catchAsync(async (req, res) => {
  const { user, accessToken } = await signinService(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'User is logged in succesfully!',
    data: user,
    token: accessToken,
  });
});
