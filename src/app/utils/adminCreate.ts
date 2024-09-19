import config from "../config";
import { User } from "../modules/user/user.model";
import bcrypt from 'bcrypt';

export const initializeAdminUser = async () => {
    try {
      // Ensure ADMIN_PASS is defined
      if (!config.ADMIN_PASS) {
        throw new Error('Admin password is not defined in environment variables');
      }
  
      // Check if admin user already exists
      const admin = await User.findOne({ email: config.ADMIN_EMAIL });
  
      if (!admin) {
        // Hash the admin password
        const hashedPassword = await bcrypt.hash(config.ADMIN_PASS, Number(config.BCRYPT_SALT_ROUNDS));
  
        // Create the admin user
        const newAdmin = await User.create({
          name: 'admin',
          email: config.ADMIN_EMAIL,
          password: hashedPassword,
          role: 'admin',
          phone: config.ADMIN_PHONE,
          image: 'https://static.vecteezy.com/system/resources/previews/019/194/935/non_2x/global-admin-icon-color-outline-vector.jpg',
        });
  
        console.log('Admin user created:', newAdmin.name);
      } else {
        console.log('Admin user already exists');
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  };
  