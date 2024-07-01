import { Router } from 'express';
import {
  createCarController,
  deleteCarController,
  getAllCarsController,
  getSingleCarController,
  updateCarController
} from './car.controller';
import validateRequest from '../../middlewares/validateRequest';
import { carUpdateValidationSchema, carValidationSchema } from './car.validation';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/', auth('admin'), validateRequest(carValidationSchema), createCarController);
router.get('/', getAllCarsController);
router.get('/:id', getSingleCarController);
router.put('/:id', auth('admin'), validateRequest(carUpdateValidationSchema), updateCarController);
router.delete('/:id', auth('admin'), deleteCarController);

export const CarRoutes = router;
