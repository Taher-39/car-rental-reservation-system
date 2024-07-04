import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userValidationSchema } from '../user/user.validation';
import { signInController, signUpController } from './auth.controller';
import { signinValidationSchema } from './auth.validation';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post(
  '/signup',
  validateRequest(userValidationSchema),
  signUpController,
);

router.post(
  '/signin',
  validateRequest(signinValidationSchema),
  signInController,
);

export const AuthRoute = router;
