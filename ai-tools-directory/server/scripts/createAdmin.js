import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        id: existingAdmin._id,
        username: existingAdmin.username,
        email: existingAdmin.email
      });
      process.exit(0);
    }

    // Create admin user
    const password = 'admin123456'; // You should change this
    const hashedPassword = await bcrypt.hash(password, 10);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@smartaitools.com',
      password: hashedPassword,
      role: 'admin'
    });

    await adminUser.save();

    console.log('Admin user created successfully:', {
      id: adminUser._id,
      username: adminUser.username,
      email: adminUser.email
    });
    console.log('Please change the password after first login!');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdminUser();
