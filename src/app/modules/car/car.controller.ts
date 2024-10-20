import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import {
  createCar,
  getAllCars,
  getCarById,
  returnCarService,
  softDeleteCar,
  updateCar,
} from './car.service';

export const createCarController = catchAsync(async (req, res) => {
  const result = await createCar(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Car created successfully',
    data: result,
  });
});

export const getAllCarsController = catchAsync(async (req, res) => {
  const result = await getAllCars();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: result.length ? 'Cars retrieved successfully' : 'No cars found',
    data: result,
  });
});

export const getSingleCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getCarById(id);

  sendResponse(res, {
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!result,
    message: result ? 'Car retrieved successfully' : 'Car not found',
    data: result || null,
  });
});

export const updateCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateCar(id, req.body);
  
  sendResponse(res, {
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    success: !!result,
    message: result ? 'Car updated successfully' : 'Car not found or has been deleted',
    data: result || null,
  });
});

export const deleteCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await softDeleteCar(id);
  
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car deleted successfully',
    data: result,
  });
});

export const returnCarController = catchAsync(async (req, res) => {
  const result = await returnCarService(req.body);
  
  sendResponse(res, {
    success: true,
    statusCode: result ? httpStatus.OK : httpStatus.NOT_FOUND,
    message: result ? 'Car returned successfully' : 'Booking not found',
    data: result || null,
  });
});

