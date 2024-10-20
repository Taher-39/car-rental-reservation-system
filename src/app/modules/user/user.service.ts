import httpStatus from "http-status";
import { IUser } from "./user.interface";
import { User } from "./user.model";
import AppError from "../../errors/AppError";
import { USER_ROLE } from "./user.constant";

export const createAdminIntoDBService = async (payload: IUser) => {
  // Check if email is already registered
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, 'Email is already registered');
  }

  //set user role
  payload.role = USER_ROLE.ADMIN;

  const admin = await User.create(payload);
  return admin;
};

export const updateOwnProfileService = async (_id: string, payload: Partial<IUser>) => {
  const user = await User.findById(_id);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Update only name, phone, and image
  const updateData = {
    ...(payload.name && { name: payload.name }),
    ...(payload.phone && { phone: payload.phone }),
    ...(payload.image && { image: payload.image }),
  };

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
  return updatedUser;
};


export const updateUserRoleAndStatusService = async (
  _id: string,
  payload: Partial<IUser>,
  requestingUserRole: string,
  requestingUserId: string // ID of the requesting user (Super Admin or Admin)
) => {
  const user = await User.findById(_id); // Target user (the one being modified)
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found');
  }

  // Admin cannot modify Super Admin
  if (requestingUserRole === USER_ROLE.ADMIN && user.role === USER_ROLE.SUPER_ADMIN) {
    throw new AppError(httpStatus.FORBIDDEN, "Admin cannot modify Super Admin");
  }

  // Prevent Super Admin from modifying their own role or status
  if (requestingUserRole === USER_ROLE.SUPER_ADMIN && requestingUserId === user._id.toString()) {
    if (payload.role || payload.status) {
      throw new AppError(httpStatus.FORBIDDEN, "Super Admin cannot change their own role or status");
    }
  }

  // Only allow updating role and status fields for other users
  const updateData = {
    ...(payload.role && { role: payload.role }),
    ...(payload.status && { status: payload.status }),
  };

  const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
  return updatedUser;
};

