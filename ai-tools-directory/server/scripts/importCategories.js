import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import Category from '../models/Category.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

// MongoDB connection URL from .env
const MONGODB_URI = process.env.MONGODB_URI;

async function importCategories() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Read the tools.json file
    const toolsData = JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), '..', '..', 'src', 'data', 'tools.json'),
        'utf-8'
      )
    );

    // Extract unique categories
    const uniqueCategories = new Set();
    toolsData.forEach(tool => {
      if (Array.isArray(tool.categories)) {
        tool.categories.forEach(category => uniqueCategories.add(category));
      } else if (tool.category) {
        uniqueCategories.add(tool.category);
      }
    });

    // Convert categories to proper format and import
    for (const categoryName of uniqueCategories) {
      if (!categoryName) continue; // Skip empty categories

      try {
        // Create slug from category name
        const slug = categoryName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '');

        // Use findOneAndUpdate with upsert to handle duplicates
        const category = await Category.findOneAndUpdate(
          { name: categoryName },
          {
            name: categoryName,
            description: `Collection of ${categoryName} AI tools and resources`,
            slug,
            icon: '🔧', // Default icon
            toolCount: toolsData.filter(tool => 
              (Array.isArray(tool.categories) && tool.categories.includes(categoryName)) ||
              tool.category === categoryName
            ).length,
            $setOnInsert: { createdAt: new Date() },
            updatedAt: new Date()
          },
          {
            upsert: true,
            new: true,
            setDefaultsOnInsert: true
          }
        );

        console.log(`Category "${categoryName}" processed successfully`);
      } catch (error) {
        console.error(`Error processing category "${categoryName}":`, error.message);
      }
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing categories:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
importCategories();
