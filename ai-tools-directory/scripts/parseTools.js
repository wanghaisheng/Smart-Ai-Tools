import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { marked } from 'marked';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Categories mapping
const categoryMap = {
  'Text': 'text-generation',
  'Image': 'image-generation',
  'Video': 'video-generation',
  'Audio': 'audio-speech',
  'Code': 'code-generation',
  'Business': 'business',
  'Education': 'education',
  'Productivity': 'productivity',
  'Research': 'research',
  'Writing': 'writing',
  'Marketing': 'marketing',
  'Design': 'design',
  'Development': 'development',
  'Other': 'other'
};

function extractToolInfo(text) {
  const tools = [];
  let currentCategory = 'Other';
  
  // Split by sections
  const sections = text.split('\n###').slice(1);
  
  sections.forEach(section => {
    const lines = section.trim().split('\n');
    const sectionTitle = lines[0].trim();
    
    // Find the table rows
    const tableStart = lines.findIndex(line => line.includes('| Name | Title |'));
    if (tableStart === -1) return;
    
    // Skip header and separator rows
    const tableRows = lines.slice(tableStart + 2);
    
    tableRows.forEach(row => {
      if (!row.startsWith('|') || row.includes('---')) return;
      
      // Parse table row
      const columns = row.split('|').map(col => col.trim()).filter(Boolean);
      if (columns.length < 4) return;
      
      const [name, title, description, pricing] = columns;
      
      // Extract name and URL
      const nameMatch = name.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (!nameMatch) return;
      
      const [, toolName, url] = nameMatch;
      
      // Generate a unique ID based on the name
      const id = toolName.toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      tools.push({
        id,
        name: toolName.trim(),
        description: description.trim() || title.trim() || `Explore ${toolName} - a powerful AI tool.`,
        url: url.trim(),
        category: categoryMap[sectionTitle.split(' ')[0]] || 'other',
        pricing: pricing.includes(':white_check_mark:') ? 'free' : 
                pricing.includes(':x:') ? 'paid' : 'freemium',
        rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3.0 and 5.0
        reviews: Math.floor(Math.random() * 100) + 1, // Random number of reviews
        image: `https://picsum.photos/seed/${id}/400/225`, // Random image based on tool ID
        features: [],
        tags: [sectionTitle.toLowerCase()],
        lastUpdated: new Date().toISOString()
      });
    });
  });

  return tools;
}

async function main() {
  try {
    // Read the markdown file
    const mdContent = await fs.readFile(
      path.join(__dirname, '../data/ai-tools.md'),
      'utf8'
    );

    // Parse the tools
    const tools = extractToolInfo(mdContent);

    // Create the data directory if it doesn't exist
    await fs.mkdir(path.join(__dirname, '../src/data'), { recursive: true });

    // Write the parsed tools to a JSON file
    await fs.writeFile(
      path.join(__dirname, '../src/data/tools.json'),
      JSON.stringify(tools, null, 2)
    );

    console.log(`Successfully parsed ${tools.length} tools!`);
  } catch (error) {
    console.error('Error parsing tools:', error);
  }
}

main();
