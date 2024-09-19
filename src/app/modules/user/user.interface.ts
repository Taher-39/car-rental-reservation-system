export interface IUser {
  name: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
  image?: string;
  resetPasswordToken?: string; 
  resetTokenExpires?: Date;  
}


const USER_ROLE = {
  user: 'user',
  admin: 'admin',
} as const;

export type TUserRole = keyof typeof USER_ROLE;
