import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import {
  userChangePasswordValidationSchema,
  userCreateValidationSchema,
} from '../user/user.validation';
import {
  changePasswordController,
  forgotPasswordController,
  resetPasswordController,
  signInController,
  signUpController,
} from './auth.controller';
import { signinValidationSchema } from './auth.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post('/register', validateRequest(userCreateValidationSchema), signUpController)

router.post(
  '/login',
  validateRequest(signinValidationSchema),
  signInController,
);

router.patch(
  '/change-password',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  validateRequest(userChangePasswordValidationSchema),
  changePasswordController,
);

// Forgot password - generate token and send email
router.post('/forgotPassword', auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN), forgotPasswordController);

// Reset password with token
router.post(
  '/resetPassword/:token',
  auth(USER_ROLE.USER, USER_ROLE.ADMIN, USER_ROLE.SUPER_ADMIN),
  resetPasswordController,
);

export const AuthRoute = router;
