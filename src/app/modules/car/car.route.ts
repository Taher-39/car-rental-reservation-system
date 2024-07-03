import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { carUpdateValidationSchema, carValidationSchema } from './car.validation';
import auth from '../../middlewares/auth';
import { returnCarValidationSchema } from '../booking/booking.validation';
import { createCarController, deleteCarController, getAllCarsController, getSingleCarController, returnCarController, updateCarController } from './car.controller';

const router = Router();

//return car route
router.put('/return',
  auth('admin'),
  validateRequest(returnCarValidationSchema),
  returnCarController
);

//car routes
router.post('/', auth('admin'), validateRequest(carValidationSchema), createCarController);
router.get('/', getAllCarsController);
router.get('/:id', getSingleCarController);
router.put('/:id', auth('admin'), validateRequest(carUpdateValidationSchema), updateCarController);
router.delete('/:id', auth('admin'), deleteCarController);

export const CarRoutes = router;
