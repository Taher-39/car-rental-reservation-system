import { User } from '../modules/user/user.model';
import config from '../config';
import bcryptjs from 'bcryptjs'

export const initializeAdminUser = async () => {
  try {
    const SUPER_ADMIN_EMAIL = config.SUPER_ADMIN_EMAIL
    const SUPER_ADMIN_PASS = config.SUPER_ADMIN_PASS;

    if (!SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASS) {
      throw new Error('Admin email or password is missing in the environment variables.');
    }

    // Check if admin user already exists
    const admin = await User.findOne({ email: SUPER_ADMIN_EMAIL });

    if (!admin) {
      // Hash the admin password
      // const hashedPassword = await bcryptjs.hash(SUPER_ADMIN_PASS, Number(config.BCRYPT_SALT_ROUNDS));

      // Create the admin user
      const newAdmin = await User.create({
        name: 'SuperAdmin',
        email: SUPER_ADMIN_EMAIL,
        password: SUPER_ADMIN_PASS,
        role: 'SUPER_ADMIN',
        phone: config.SUPER_ADMIN_PHONE,
        image: 'https://static.vecteezy.com/system/resources/previews/019/194/935/non_2x/global-admin-icon-color-outline-vector.jpg',
      });

      console.log('SUPER Admin created:', newAdmin.name);
    } else {
      console.log('SUPER Admin already exists');
    }
  } catch (error) {
    console.error('Error initializing admin user:', error);
  }
};

