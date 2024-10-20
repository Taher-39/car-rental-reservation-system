import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import {
  createAdminIntoDBService,
  updateOwnProfileService,
  updateUserRoleAndStatusService
} from "./user.service";
import sendResponse from "../../utils/sendResponse";

export const createAdminCntrl = catchAsync(async (req, res) => {
  const result = await createAdminIntoDBService(req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Admin is created successfully!',
    data: result
  });
});

export const updateOwnProfileCntrl = catchAsync(async (req, res) => {
  const userId = req.user._id; // Logged in user's ID
  const result = await updateOwnProfileService(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "Profile updated successfully!",
    data: result,
  });
});


export const updateUserRoleAndStatusCntrl = catchAsync(async (req, res) => {
  const { userId } = req.params; // User ID to update
  const requestingUserRole = req.user.role; // Role of the requesting user
  const requestingUserId = req.user._id; // ID of the requesting user (logged-in user)

  const result = await updateUserRoleAndStatusService(userId, req.body, requestingUserRole, requestingUserId);

  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: "User role or status updated successfully!",
    data: result,
  });
});
