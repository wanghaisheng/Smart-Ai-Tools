import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const updateAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminUser = await User.findOne({ username: 'admin' });
    if (!adminUser) {
      console.log('Admin user not found');
      process.exit(1);
    }

    // Set new password
    const newPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    adminUser.password = hashedPassword;
    await adminUser.save();

    console.log('Admin password updated successfully!');
    console.log('New login credentials:');
    console.log('Username:', adminUser.username);
    console.log('Email:', adminUser.email);
    console.log('Password:', newPassword);

  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

updateAdminPassword();
