import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

const categoryMapping = {
  // Old categories to new categories mapping
  'Technology': 'Technical',
  'Business and Entrepreneurship': 'Business',
  'Health and Wellness': 'Health & Wellness',
  'Food and Cooking': 'Food & Beverage',
  'Creative': 'Creative Writing',
  'Other': 'Other', // You can map this to a more specific category based on content
  'Technical': 'Technical', // Already matches
  'Business': 'Business', // Already matches
  'Education': 'Education', // Already matches
  'Content Creation': 'Content Creation', // Already matches
  'Marketing': 'Marketing', // Already matches
};

async function migrateCategories() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    // Get all prompts
    const prompts = await mongoose.connection.collection('smartprompts').find({}).toArray();
    console.log(`Found ${prompts.length} prompts to migrate`);

    // Update each prompt
    for (const prompt of prompts) {
      const oldCategory = prompt.category;
      const newCategory = categoryMapping[oldCategory] || oldCategory;

      console.log(`Processing prompt "${prompt.title}" with category "${oldCategory}"`);

      // Only update if the category needs to change
      if (oldCategory !== newCategory) {
        await mongoose.connection.collection('smartprompts').updateOne(
          { _id: prompt._id },
          { 
            $set: { 
              category: newCategory,
              // You can also set a default subcategory based on the content if needed
            }
          }
        );
        console.log(`Updated prompt "${prompt.title}" from category "${oldCategory}" to "${newCategory}"`);
      }
    }

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

migrateCategories();
