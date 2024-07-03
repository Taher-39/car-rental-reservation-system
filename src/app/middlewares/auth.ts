import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import AppError from '../errors/AppError';
import { TUserRole } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Access denied. Invalid token' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ success: false, statusCode: 401, message: 'Access denied. No token provided.' })
    }

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.JWT_ACCESS_SECRET as string,
    ) as JwtPayload;

    const { role, email } = decoded;

    // checking if the user is exist
    const user = await User.findOne({email})

    if (!user) {
      throw new AppError(httpStatus.NOT_FOUND, 'This user is not found');
    }
  

    if (requiredRoles && !requiredRoles.includes(role)) {
      throw new AppError(
        httpStatus.UNAUTHORIZED,
        'You have no access to this route',
      );
    }

    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
