import { Router } from 'express';
import { AuthRoute } from '../modules/auth/auth.route';
import { CarRoutes } from '../modules/car/car.route';

const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoute,
  },
  {
    path: '/cars',
    route: CarRoutes,
  },

];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
