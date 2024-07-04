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
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cars retrieved successfully',
    data: result,
  });
});

export const getSingleCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await getCarById(id);

  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Car retrieved successfully',
    data: result,
  });
});

export const updateCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await updateCar(id, req.body);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

export const deleteCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await softDeleteCar(id);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car deleted successfully',
    data: result,
  });
});

export const returnCarController = catchAsync(async (req, res) => {
  const result = await returnCarService(req.body);
  if (!result) {
    return res.status(httpStatus.NOT_FOUND).json({
      success: false,
      statusCode: 404,
      message: 'No Data Found',
      data: [],
    });
  }
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.OK,
    message: 'Car returned successfully',
    data: result,
  });
});
