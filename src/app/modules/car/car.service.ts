import { TCar } from "./car.interface";
import Car from "./car.model";

const createCar = async (payload: TCar): Promise<TCar> => {
  const result = await Car.create(payload);
  return result;
};

const getAllCars = async (): Promise<TCar[]> => {
  const result = await Car.find({ isDeleted: false });
  return result;
};

const getCarById = async (id: string): Promise<TCar | null> => {
  const result = await Car.findById(id).where('isDeleted').equals(false);
  return result;
};

const updateCar = async (
  id: string,
  payload: Partial<TCar>
): Promise<TCar | null> => {
  const result = await Car.findOneAndUpdate({ _id: id }, payload, {
    new: true, runValidators: true
  }).where('isDeleted').equals(false);
  return result;
};

const softDeleteCar = async (id: string): Promise<TCar | null> => {
  const result = await Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
  return result;
};

export const CarService = {
  createCar,
  getAllCars,
  getCarById,
  updateCar,
  softDeleteCar,
};
