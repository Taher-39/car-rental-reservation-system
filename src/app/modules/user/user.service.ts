import { IUser } from "./user.interface";
import { User } from "./user.model";


export const userCreateService = async (payload: IUser) => {
  const result = await User.create(payload);
  return result;
};

export const getAllUserService = async () => {
  const result = await User.find();
  return result;
};

export const getSingleUserService = async (id: string) => {
  const result =
    await User.findById(id)
  return result;
};

export const updateUserService = async (
  id: string,
  payload: Partial<IUser>,
) => {
  const result = await User.findOneAndUpdate(
    { _id: id },
    payload,
    {
      new: true,
    },
  );
  return result;
};


