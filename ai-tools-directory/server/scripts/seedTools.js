import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../models/Tool.js';
import '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const Tool = mongoose.model('Tool');
const User = mongoose.model('User');

const createAdminUser = async () => {
  try {
    // Check if admin already exists
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

const createSampleTools = (adminId) => ([
  {
    name: 'ChatGPT',
    description: 'Advanced language model for natural conversations and content generation',
    website: 'https://chat.openai.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg',
    category: 'Language Models',
    pricing: 'Freemium',
    features: ['Natural language processing', 'Content generation', 'Code assistance'],
    tags: ['AI', 'NLP', 'Chatbot'],
    status: 'approved',
    rating: { average: 4.8, count: 1000 },
    submittedBy: adminId
  },
  {
    name: 'Midjourney',
    description: 'AI-powered image generation tool for creating stunning artwork',
    website: 'https://www.midjourney.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/e/e6/Midjourney_Emblem.png',
    category: 'Image Generation',
    pricing: 'Paid',
    features: ['Image generation', 'Art creation', 'Style customization'],
    tags: ['AI', 'Art', 'Image Generation'],
    status: 'approved',
    rating: { average: 4.7, count: 800 },
    submittedBy: adminId
  },
  {
    name: 'Claude',
    description: 'Advanced AI assistant for writing, analysis, and coding',
    website: 'https://claude.ai',
    image: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Claude_AI_Logo.png',
    category: 'Language Models',
    pricing: 'Freemium',
    features: ['Writing assistance', 'Code generation', 'Data analysis'],
    tags: ['AI', 'NLP', 'Assistant'],
    status: 'approved',
    rating: { average: 4.6, count: 600 },
    submittedBy: adminId
  },
  {
    name: 'DALL-E',
    description: 'AI system that creates realistic images and art from natural language descriptions',
    website: 'https://labs.openai.com',
    image: 'https://upload.wikimedia.org/wikipedia/commons/0/04/DALL-E_Logo.png',
    category: 'Image Generation',
    pricing: 'Paid',
    features: ['Text-to-image', 'Image editing', 'Style transfer'],
    tags: ['AI', 'Art', 'Image Generation'],
    status: 'approved',
    rating: { average: 4.7, count: 900 },
    submittedBy: adminId
  }
]);

const seedTools = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create admin user and get ID
    const adminId = await createAdminUser();
    console.log('Admin user ready');

    // Clear existing tools
    await Tool.deleteMany({});
    console.log('Cleared existing tools');

    // Insert sample tools
    const sampleTools = createSampleTools(adminId);
    await Tool.insertMany(sampleTools);
    console.log('Sample tools inserted successfully');

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding tools:', error);
    process.exit(1);
  }
};

seedTools();
