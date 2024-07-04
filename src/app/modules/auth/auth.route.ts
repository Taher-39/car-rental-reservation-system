import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationSchema } from '../user/user.validation';
import { userCreateController } from '../user/user.controller';
import { signinController } from './auth.controller';
import { signinValidationSchema } from './auth.validation';
const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidationSchema),
  userCreateController,
);

router.post(
  '/signin',
  validateRequest(signinValidationSchema),
  signinController,
);

export const AuthRoute = router;
