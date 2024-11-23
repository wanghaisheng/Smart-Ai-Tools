import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const fixAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Set new password
    const newPassword = 'admin123456';
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password directly in MongoDB
    const result = await mongoose.connection.collection('users').updateOne(
      { username: 'admin' },
      { 
        $set: { 
          password: hashedPassword,
          email: 'admin@example.com',
          role: 'admin'
        } 
      }
    );

    if (result.modifiedCount > 0) {
      console.log('Admin password updated successfully!');
      console.log('New login credentials:');
      console.log('Username: admin');
      console.log('Email: admin@example.com');
      console.log('Password:', newPassword);
    } else {
      console.log('Admin user not found or no changes made');
    }

  } catch (error) {
    console.error('Error updating admin password:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

fixAdminPassword();
