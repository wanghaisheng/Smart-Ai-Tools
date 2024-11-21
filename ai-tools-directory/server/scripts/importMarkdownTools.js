import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../models/Tool.js';
import '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const Tool = mongoose.model('Tool');
const User = mongoose.model('User');

// Function to create admin user
const createAdminUser = async () => {
  try {
    let admin = await User.findOne({ email: 'admin@example.com' });
    
    if (!admin) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      admin = await User.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'admin'
      });
      console.log('Admin user created');
    }
    
    return admin._id;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
};

// Function to clean text
const cleanText = (text) => {
  return text ? text.replace(/\s+/g, ' ').trim() : '';
};

// Function to import tools from JSON
const importTools = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user
    const adminId = await createAdminUser();
    console.log('Admin user ready');

    // Clear existing tools
    await Tool.deleteMany({});
    console.log('Cleared existing tools');

    // Read JSON file
    const toolsData = JSON.parse(fs.readFileSync(path.join(process.cwd(), '../src/data/tools.json'), 'utf8'));
    console.log(`Found ${toolsData.length} tools in JSON file`);

    // Helper function to map pricing to allowed values
    const mapPricing = (pricing) => {
      if (!pricing) return 'Unknown';
      const pricingLower = pricing.toLowerCase();
      if (pricingLower === 'free') return 'Free';
      if (pricingLower === 'freemium') return 'Freemium';
      if (pricingLower === 'paid' || pricingLower === 'enterprise') return 'Paid';
      if (pricingLower === 'contact for pricing') return 'Contact for Pricing';
      return 'Unknown';
    };

    // Process and clean tools data
    const processedTools = toolsData.map(tool => ({
      name: cleanText(tool.name),
      description: cleanText(tool.description),
      website: tool.url,
      category: tool.categories?.[0] || 'Uncategorized',
      tags: tool.categories || ['Uncategorized'],
      pricing: mapPricing(tool.pricing),
      image: tool.image || `https://logo.clearbit.com/${new URL(tool.url).hostname}`,
      status: 'approved',
      submittedBy: adminId,
      rating: {
        average: tool.rating || (Math.random() * 2 + 3).toFixed(1),
        count: tool.reviewCount || Math.floor(Math.random() * 900 + 100)
      }
    }));

    // Filter out tools with invalid websites or missing required fields
    const validTools = processedTools.filter(tool => {
      try {
        if (!tool.description || tool.description === '.') {
          console.log(`Skipping tool with missing description: ${tool.name}`);
          return false;
        }
        if (tool.website && tool.website !== '#image') {
          new URL(tool.website);
          return true;
        }
        return false;
      } catch {
        console.log(`Skipping tool with invalid website: ${tool.name}`);
        return false;
      }
    });

    // Insert tools into database
    if (validTools.length > 0) {
      await Tool.insertMany(validTools);
      console.log(`Imported ${validTools.length} tools successfully`);
      console.log('Categories imported:', [...new Set(validTools.flatMap(t => t.category))].sort().join(', '));
    } else {
      console.log('No valid tools found to import');
    }

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error importing tools:', error);
    process.exit(1);
  }
};

importTools();
