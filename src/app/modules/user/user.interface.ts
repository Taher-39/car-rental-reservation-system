import { Model } from "mongoose";

export interface IUser {
    name: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
    phone: string;
    address: string;
}

const USER_ROLE = {
  user: 'user',
  admin: 'admin',
} as const;


export type TUserRole = keyof typeof USER_ROLE;