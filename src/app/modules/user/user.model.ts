import { Schema, model } from 'mongoose';
import { IUser } from './user.interface';
import bcryptjs from 'bcryptjs';
import config from '../../config';
import { USER_ROLE, USER_STATUS } from './user.constant';

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, 'Name is required'] },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    password: { type: String, required: [true, 'Password is required'], select: false },
    role: {
      type: String, required: [true, 'User Role is Required'],
      enum: Object.keys(USER_ROLE), default: USER_ROLE.USER
    },
    phone: { type: String },
    image: { type: String },
    resetPasswordToken: { type: String },
    resetTokenExpires: { type: Date },
    status: {
      type: String, required: [true, 'User Status is Required'],
      enum: Object.keys(USER_STATUS), default: USER_STATUS.ACTIVE
    },
    loginCount: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  },
);

// Pre-save hook to hash password before saving
userSchema.pre('save', async function (next) {
  const user = this as IUser;

  // Only hash the password if it has been modified or is new
  if (!user.isModified('password')) {
    return next();
  }

  // Hash the password
  user.password = await bcryptjs.hash(user.password, Number(config.BCRYPT_SALT_ROUNDS));
  next();
});

// Post-save hook to ensure password is not returned in responses
userSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});


// Static method to check if JWT was issued before the password was changed
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
  passwordChangedTimestamp: Date,
  jwtIssuedTimestamp: number,
) {
  const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
  return passwordChangedTime > jwtIssuedTimestamp;
};

// Method to increment login count
userSchema.methods.incrementLoginCount = function () {
  return this.updateOne({ $inc: { loginCount: 1 } }).exec();
};

// Method to format user object when returning as JSON (removes sensitive fields)
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

// Export the User model
export const User = model<IUser>('User', userSchema);
