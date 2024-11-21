import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import Tool from '../models/Tool.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '..', '.env') });

// MongoDB connection URL from .env
const MONGODB_URI = process.env.MONGODB_URI;

async function importTools() {
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

    // Transform and import each tool
    for (const tool of toolsData) {
      // Map pricing to allowed enum values
      let mappedPricing = tool.pricing || 'Unknown';
      if (!['Free', 'Freemium', 'Paid', 'Contact for Pricing', 'Unknown'].includes(mappedPricing)) {
        if (mappedPricing.toLowerCase().includes('free')) {
          mappedPricing = 'Free';
        } else if (mappedPricing.toLowerCase().includes('contact')) {
          mappedPricing = 'Contact for Pricing';
        } else {
          mappedPricing = 'Paid';
        }
      }

      const transformedTool = {
        name: tool.name,
        description: tool.description || 'No description available',
        website: tool.url,
        image: tool.image || 'https://via.placeholder.com/400x225?text=AI+Tool',
        category: Array.isArray(tool.categories) ? tool.categories[0] : 'Other',
        pricing: mappedPricing,
        features: [],
        tags: tool.categories || [],
        status: 'approved',
        rating: {
          average: tool.rating || 0,
          count: tool.reviewCount || 0,
        },
        // For demo purposes, we'll create a default admin user ID
        submittedBy: '000000000000000000000000'
      };

      // Check if tool already exists
      const existingTool = await Tool.findOne({ name: tool.name });
      if (existingTool) {
        console.log(`Tool "${tool.name}" already exists, skipping...`);
        continue;
      }

      // Create new tool
      const newTool = new Tool(transformedTool);
      await newTool.save();
      console.log(`Imported tool: ${tool.name}`);
    }

    console.log('Import completed successfully');
  } catch (error) {
    console.error('Error importing tools:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the import
importTools();
