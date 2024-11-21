import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../models/Tool.js';
import '../models/Category.js';
import slugify from 'slugify';

dotenv.config();

const Tool = mongoose.model('Tool');
const Category = mongoose.model('Category');

// Category descriptions and icons
const categoryMetadata = {
  'Animation & 3D Modeling': {
    description: 'Tools for creating and manipulating 3D models, animations, and visual effects.',
    icon: '🎨'
  },
  'Art & Image Generator': {
    description: 'AI-powered tools for generating and creating artistic images and designs.',
    icon: '🖼️'
  },
  'Audio': {
    description: 'Tools for audio processing, enhancement, and generation.',
    icon: '🎵'
  },
  'Avatars': {
    description: 'Create and customize AI-generated avatars and profile pictures.',
    icon: '👤'
  },
  'Chat Bot': {
    description: 'AI chatbots and conversational agents for various purposes.',
    icon: '💬'
  },
  'Code': {
    description: 'Tools for code generation, analysis, and development assistance.',
    icon: '👨‍💻'
  },
  'Code & Database Assistant': {
    description: 'AI assistants for coding, database management, and development tasks.',
    icon: '💻'
  },
  'Content Generation & SEO': {
    description: 'Tools for generating content and optimizing for search engines.',
    icon: '📝'
  },
  'Creators Toolkit': {
    description: 'Essential tools and resources for content creators and artists.',
    icon: '🛠️'
  },
  'Customer Support': {
    description: 'AI-powered tools for customer service and support automation.',
    icon: '🤝'
  },
  'Education & Learning': {
    description: 'Tools for educational content creation and learning assistance.',
    icon: '📚'
  },
  'Email Assistant': {
    description: 'AI tools for email composition, management, and automation.',
    icon: '📧'
  },
  'Fashion': {
    description: 'AI tools for fashion design, styling, and trend analysis.',
    icon: '👗'
  },
  'Gaming': {
    description: 'AI-powered tools and resources for game development and gaming.',
    icon: '🎮'
  },
  'Gift Ideas': {
    description: 'AI assistants for finding and suggesting perfect gifts.',
    icon: '🎁'
  },
  'Healthcare': {
    description: 'AI tools for healthcare, medical analysis, and wellness.',
    icon: '⚕️'
  },
  'Human Resources & Resume': {
    description: 'Tools for HR management, recruitment, and resume creation.',
    icon: '👥'
  },
  'Legal': {
    description: 'AI tools for legal document analysis and assistance.',
    icon: '⚖️'
  },
  'Logo Generator': {
    description: 'Create unique and professional logos using AI.',
    icon: '🎯'
  },
  'Music & Audio Generation': {
    description: 'Tools for generating music and audio content using AI.',
    icon: '🎼'
  },
  'Organization & Automation': {
    description: 'Tools for workflow automation and organizational tasks.',
    icon: '⚙️'
  },
  'Photo & Image Editing': {
    description: 'AI-powered tools for photo manipulation and image editing.',
    icon: '📸'
  },
  'Plugins & Extensions': {
    description: 'AI-powered plugins and extensions for various platforms.',
    icon: '🔌'
  },
  'Sales & Marketing': {
    description: 'AI tools for sales automation and marketing optimization.',
    icon: '📈'
  },
  'Search Engines': {
    description: 'AI-powered search engines and discovery tools.',
    icon: '🔍'
  },
  'Social Networks & Dating': {
    description: 'AI tools for social networking and relationship building.',
    icon: '💘'
  },
  'Speech': {
    description: 'Tools for speech recognition and processing.',
    icon: '🗣️'
  },
  'Text': {
    description: 'AI tools for text analysis and manipulation.',
    icon: '📄'
  },
  'Text To Speech': {
    description: 'Convert text to natural-sounding speech using AI.',
    icon: '🔊'
  },
  'Translation & Transcript': {
    description: 'AI-powered translation and transcription tools.',
    icon: '🌐'
  },
  'Video': {
    description: 'Tools for video creation, editing, and enhancement.',
    icon: '🎥'
  },
  'Writing Assistant': {
    description: 'AI-powered writing aids and content generation tools.',
    icon: '✍️'
  },
  'Other': {
    description: 'Other innovative AI tools and applications.',
    icon: '🔧'
  }
};

const populateCategories = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing categories
    await Category.deleteMany({});
    console.log('Cleared existing categories');

    // Get all unique categories from tools
    const tools = await Tool.find({}, 'category');
    const uniqueCategories = [...new Set(tools.map(tool => tool.category))];
    console.log(`Found ${uniqueCategories.length} unique categories`);

    // Create categories with metadata
    const categories = await Promise.all(uniqueCategories.map(async categoryName => {
      const metadata = categoryMetadata[categoryName] || {
        description: `Collection of AI tools for ${categoryName.toLowerCase()}.`,
        icon: '🔧'
      };

      const toolCount = await Tool.countDocuments({ category: categoryName });
      const featuredTools = await Tool.find({ category: categoryName })
        .sort({ 'rating.average': -1 })
        .limit(3)
        .select('_id');

      return new Category({
        name: categoryName,
        description: metadata.description,
        slug: slugify(categoryName, { lower: true }),
        icon: metadata.icon,
        toolCount,
        featuredTools: featuredTools.map(tool => tool._id)
      });
    }));

    // Save all categories
    await Category.insertMany(categories);
    console.log(`Successfully created ${categories.length} categories`);

    // Log all categories and their tool counts
    const allCategories = await Category.find().sort({ name: 1 });
    console.log('\nCategories and tool counts:');
    allCategories.forEach(cat => {
      console.log(`${cat.icon} ${cat.name}: ${cat.toolCount} tools`);
    });

    await mongoose.connection.close();
  } catch (error) {
    console.error('Error populating categories:', error);
    process.exit(1);
  }
};

populateCategories();
