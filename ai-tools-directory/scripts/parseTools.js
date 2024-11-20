import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { marked } from 'marked';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Function to generate a random rating between 3.5 and 5.0
function generateRandomRating() {
  return (Math.random() * 1.5 + 3.5).toFixed(1);
}

// Function to generate a random review count between 10 and 1000
function generateRandomReviewCount() {
  return Math.floor(Math.random() * 990 + 10);
}

// Function to generate a random price tier
function generateRandomPricing() {
  const tiers = ['Free', 'Freemium', 'Paid', 'Enterprise', 'Contact for Pricing'];
  return tiers[Math.floor(Math.random() * tiers.length)];
}

// Function to generate a deterministic ID based on the tool name
function generateToolId(name) {
  return crypto.createHash('md5').update(name.toLowerCase()).digest('hex').substring(0, 8);
}

// Function to parse GitHub-style markdown tables
function parseGitHubTable(text) {
  const tools = [];
  const lines = text.split('\n');
  let currentCategory = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Check for category headers (## or ### lines)
    if (line.match(/^#+\s+.*$/)) {
      currentCategory = line.replace(/^#+\s+/, '').replace(/\s*$/, '');
      continue;
    }
    
    // Skip empty lines, table headers, and separators
    if (!line || line.startsWith('|---') || line.match(/^\|.*\|.*\|.*\|.*\|$/) && line.includes('Title')) {
      continue;
    }
    
    // Parse table rows - support both formats:
    // 1. |[name](url)|title|description|:emoji:|
    // 2. |[name](url)|description|extra|:emoji:|
    const tableMatch = line.match(/\|\s*\[([^\]]+)\]\(([^)]+)\)\s*\|(.*?)\|(.*?)\|\s*:([^:|]+):\s*\|/);
    if (tableMatch) {
      const [_, name, url, field1, field2, freeStatus] = tableMatch;
      
      // Determine description: if field2 is mostly empty, use field1, otherwise use field2
      const description = field2.trim() || field1.trim();
      
      const isFree = freeStatus.includes('white_check_mark') ? 'Free' :
                     freeStatus.includes('grey_question') ? 'Contact for Pricing' : 'Paid';
      
      tools.push({
        id: generateToolId(name),
        name: name.trim(),
        description: description.trim(),
        url: url.trim(),
        categories: currentCategory ? [currentCategory] : [],
        rating: parseFloat(generateRandomRating()),
        reviewCount: parseInt(generateRandomReviewCount()),
        pricing: isFree,
        image: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/300`
      });
    }
  }
  
  return tools;
}

// Function to extract tools from markdown content
function extractToolsFromMarkdown(markdownContent) {
  // First try GitHub table format
  const githubTools = parseGitHubTable(markdownContent);
  if (githubTools.length > 0) {
    return githubTools;
  }
  
  // Fallback to original list format
  const tools = [];
  const tokens = marked.lexer(markdownContent);
  
  let currentCategory = '';
  let currentSubcategory = '';

  tokens.forEach(token => {
    if (token.type === 'heading') {
      if (token.depth === 2) {
        currentCategory = token.text.replace(/[📝🎨🔍💻🎯🎮🔊🤖🌐📊💡]/g, '').trim();
        currentSubcategory = '';
      } else if (token.depth === 3) {
        currentSubcategory = token.text.trim();
      }
    } else if (token.type === 'list') {
      token.items.forEach(item => {
        const linkMatch = item.text.match(/\[([^\]]+)\]\(([^)]+)\)/);
        if (linkMatch) {
          const name = linkMatch[1].trim();
          const url = linkMatch[2];
          const descriptionMatch = item.text.match(/\]\([^)]+\)\s*[-–]\s*(.+)$/);
          const description = descriptionMatch ? descriptionMatch[1].trim() : '';

          const categories = [currentCategory];
          if (currentSubcategory) {
            categories.push(currentSubcategory);
          }

          tools.push({
            id: generateToolId(name),
            name,
            description,
            url,
            categories,
            rating: parseFloat(generateRandomRating()),
            reviewCount: parseInt(generateRandomReviewCount()),
            pricing: generateRandomPricing(),
            image: `https://picsum.photos/seed/${encodeURIComponent(name)}/400/300`
          });
        }
      });
    }
  });

  return tools;
}

// Main function to parse both markdown files and combine tools
async function parseAndCombineTools() {
  try {
    // Parse first source
    const source1Path = path.join(__dirname, '../data/source1.md');
    const source1Content = await fs.readFile(source1Path, 'utf8');
    const tools1 = parseGitHubTable(source1Content);
    console.log(`Parsed ${tools1.length} tools from source1.md`);

    // Parse second source (awesome-ai-tools)
    const source2Path = path.join(__dirname, '../data/source2.md');
    const source2Content = await fs.readFile(source2Path, 'utf8');
    const tools2 = extractToolsFromMarkdown(source2Content);
    console.log(`Parsed ${tools2.length} tools from source2.md`);

    // Combine tools and remove duplicates based on name
    const toolMap = new Map();
    [...tools1, ...tools2].forEach(tool => {
      const existingTool = toolMap.get(tool.name.toLowerCase());
      if (existingTool) {
        // Merge categories if tool exists
        const uniqueCategories = new Set([
          ...(existingTool.categories || []),
          ...(tool.categories || [])
        ]);
        existingTool.categories = Array.from(uniqueCategories);
      } else {
        toolMap.set(tool.name.toLowerCase(), tool);
      }
    });

    // Convert map back to array
    const combinedTools = Array.from(toolMap.values());

    // Save combined tools to JSON file
    const outputPath = path.join(__dirname, '../src/data/tools.json');
    await fs.writeFile(outputPath, JSON.stringify(combinedTools, null, 2));

    console.log(`Successfully parsed and combined ${combinedTools.length} tools!`);
  } catch (error) {
    console.error('Error parsing tools:', error);
    process.exit(1);
  }
}

// Run the parser
parseAndCombineTools();
