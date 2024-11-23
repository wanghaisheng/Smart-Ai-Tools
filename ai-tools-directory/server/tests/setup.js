import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { jest } from '@jest/globals';

// Load environment variables
dotenv.config();

// Set test environment
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-secret';
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://localhost:27017/smart-ai-tools-test';

// Connect to test database
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to test database');
  } catch (error) {
    console.error('Error connecting to test database:', error);
    process.exit(1);
  }
});

// Clean up database after tests
afterAll(async () => {
  try {
    await mongoose.connection.db.dropDatabase();
    await mongoose.connection.close();
    console.log('Test database cleaned up');
  } catch (error) {
    console.error('Error cleaning up test database:', error);
  }
});
