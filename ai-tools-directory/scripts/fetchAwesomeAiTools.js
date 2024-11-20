import fs from 'fs';
import path from 'path';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const REPO_URL = 'https://raw.githubusercontent.com/mahseema/awesome-ai-tools/main/README.md';
const OUTPUT_PATH = path.join(__dirname, '../data/source2.md');

function fetchMarkdown() {
  return new Promise((resolve, reject) => {
    https.get(REPO_URL, (response) => {
      let data = '';

      response.on('data', (chunk) => {
        data += chunk;
      });

      response.on('end', () => {
        resolve(data);
      });

      response.on('error', (error) => {
        reject(error);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

async function main() {
  try {
    console.log('Fetching awesome-ai-tools markdown...');
    const markdown = await fetchMarkdown();

    // Ensure data directory exists
    const dataDir = path.join(__dirname, '../data');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save markdown to file
    fs.writeFileSync(OUTPUT_PATH, markdown);
    console.log(`Successfully saved markdown to ${OUTPUT_PATH}`);
  } catch (error) {
    console.error('Error fetching markdown:', error);
    process.exit(1);
  }
}

main();
