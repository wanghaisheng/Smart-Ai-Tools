import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find user with username 'admin'
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }

    // Update role to admin
    adminUser.role = 'admin';
    await adminUser.save();

    console.log('Admin user updated successfully:', {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email,
      role: adminUser.role
    });

  } catch (error) {
    console.error('Error updating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminUser();
