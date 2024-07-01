import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { CarService } from './car.service';

const createCarController = catchAsync(async (req, res) => {
  const result = await CarService.createCar(req.body);
  sendResponse(res, {
    success: true,
    statusCode: httpStatus.CREATED,
    message: 'Car created successfully',
    data: result,
  });
});

const getAllCarsController = catchAsync(async (req, res) => {
  const result = await CarService.getAllCars();
  if(!result){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Cars retrieved successfully',
    data: result,
  });
});

const getSingleCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarService.getCarById(id);

  if(!result){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'A Car retrieved successfully',
    data: result,
  });
});

const updateCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarService.updateCar(id, req.body);
  if(!result){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Car updated successfully',
    data: result,
  });
});

const deleteCarController = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CarService.softDeleteCar(id);
  if(!result){
    return res.status(httpStatus.NOT_FOUND).json({
          success: false,
          statusCode: 404,
          message: "No Data Found",
          data: []
        })
  }
  sendResponse(res, {
      success: true,
      statusCode: httpStatus.OK,
    message: 'Car deleted successfully',
    data: result,
  });
});

export {
  createCarController,
  getAllCarsController,
  getSingleCarController,
  updateCarController,
  deleteCarController,
};
