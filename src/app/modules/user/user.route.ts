import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { userCreateValidationSchema, userUpdateValidationSchema } from './user.validation';
import { createAdminCntrl, updateOwnProfileCntrl, updateUserRoleAndStatusCntrl } from './user.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
const router = express.Router();

router.post('/create-admin', auth(USER_ROLE.SUPER_ADMIN), validateRequest(userCreateValidationSchema), createAdminCntrl);

router.put(
    '/me', // Update own profile (name, phone, image)
    auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN, USER_ROLE.USER), // All roles can access
    validateRequest(userUpdateValidationSchema),
    updateOwnProfileCntrl
);

router.put(
    '/:userId', // Update role or status of another user
    auth(USER_ROLE.SUPER_ADMIN, USER_ROLE.ADMIN), // Only Super Admin and Admin
    validateRequest(userUpdateValidationSchema),
    updateUserRoleAndStatusCntrl
);



export const UserRoute = router;
