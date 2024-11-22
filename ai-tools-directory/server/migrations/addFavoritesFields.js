import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Tool from '../models/Tool.js';

dotenv.config();

async function migrateFavoritesFields() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Add favoriteCount and favoritedBy fields to all existing tools
    const result = await Tool.updateMany(
      { favoriteCount: { $exists: false } },
      { 
        $set: { 
          favoriteCount: 0,
          favoritedBy: []
        }
      }
    );

    console.log(`Updated ${result.modifiedCount} tools`);
    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration
migrateFavoritesFields();
