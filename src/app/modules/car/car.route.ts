import { Router } from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  carUpdateValidationSchema,
  carCreateValidationSchema,
} from './car.validation';
import auth from '../../middlewares/auth';
import { returnCarValidationSchema } from '../booking/booking.validation';
import {
  createCarController,
  deleteCarController,
  getAllCarsController,
  getSingleCarController,
  returnCarController,
  updateCarController,
} from './car.controller';
import { USER_ROLE } from '../user/user.constant';

const router = Router();

//return car route
router.put(
  '/return',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN,),
  validateRequest(returnCarValidationSchema),
  returnCarController,
);

//car routes
router.post(
  '/',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN,),
  validateRequest(carCreateValidationSchema),
  createCarController,
);
router.get('/', getAllCarsController);
router.get('/:id', getSingleCarController);
router.put(
  '/:id',
  auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN,),
  validateRequest(carUpdateValidationSchema),
  updateCarController,
);
router.delete('/:id', auth(USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN,), deleteCarController);

export const CarRoutes = router;
