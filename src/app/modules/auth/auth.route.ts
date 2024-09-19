import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  userChangePasswordValidationSchema,
  userUpdateValidationSchema,
  userValidationSchema,
} from '../user/user.validation';
import {
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
  signInController,
  signUpController,
  updateUserController,
} from './auth.controller';
import { signinValidationSchema } from './auth.validation';
import auth from '../../middlewares/auth';
const router = express.Router();

router.post('/signup', validateRequest(userValidationSchema), signUpController);

router.post(
  '/signin',
  validateRequest(signinValidationSchema),
  signInController,
);

router.patch(
  '/update',
  auth('user', 'admin'),
  validateRequest(userUpdateValidationSchema),
  updateUserController,
);

router.patch(
  '/change-password',
  auth('user', 'admin'),
  validateRequest(userChangePasswordValidationSchema),
  changePasswordController,
);

// Forgot password - generate token and send email
router.post('/forgotPassword', auth('user', 'admin'), forgotPasswordController);

// Reset password with token
router.post(
  '/resetPassword/:token',
  auth('user', 'admin'),
  resetPasswordController,
);

export const AuthRoute = router;
