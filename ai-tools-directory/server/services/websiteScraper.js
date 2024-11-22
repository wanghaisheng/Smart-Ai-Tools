import puppeteer from 'puppeteer';
import * as cheerio from 'cheerio';

export async function scrapeWebsiteData(url) {
  try {
    const browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Set a reasonable timeout
    await page.setDefaultNavigationTimeout(30000);
    
    // Navigate to the URL
    await page.goto(url, { waitUntil: 'networkidle0' });
    
    // Get the page content
    const content = await page.content();
    const $ = cheerio.load(content);
    
    // Extract relevant information
    const scrapedData = {
      features: [],
      extendedDescription: '',
      metadata: {
        title: $('title').text().trim(),
        metaDescription: $('meta[name="description"]').attr('content') || '',
      }
    };
    
    // Extract features from common feature section patterns
    const featureSelectors = [
      '.features', '#features',
      '[class*="feature"]',
      '[id*="feature"]',
      '.benefits', '#benefits',
      'ul li', // Common list items
      '.grid', // Common grid layouts
    ];
    
    featureSelectors.forEach(selector => {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 10 && !scrapedData.features.includes(text)) {
          scrapedData.features.push(text);
        }
      });
    });
    
    // Extract extended description from common content areas
    const descriptionSelectors = [
      'main p',
      'article p',
      '.content p',
      '#content p',
      '.description',
      '#description',
      '[class*="about"]',
      '[id*="about"]'
    ];
    
    descriptionSelectors.forEach(selector => {
      $(selector).each((_, element) => {
        const text = $(element).text().trim();
        if (text && text.length > 50) {
          scrapedData.extendedDescription += text + '\n\n';
        }
      });
    });
    
    // Clean up features
    scrapedData.features = scrapedData.features
      .filter(feature => 
        feature.length > 10 && 
        feature.length < 200 &&
        !feature.includes('cookie') &&
        !feature.includes('privacy') &&
        !feature.toLowerCase().includes('login') &&
        !feature.toLowerCase().includes('sign up')
      )
      .slice(0, 10); // Limit to top 10 features
    
    // Clean up description
    scrapedData.extendedDescription = scrapedData.extendedDescription
      .split('\n')
      .filter(para => para.length > 50)
      .slice(0, 3) // Limit to first 3 paragraphs
      .join('\n\n');
    
    await browser.close();
    return scrapedData;
    
  } catch (error) {
    console.error('Error scraping website:', error);
    throw error;
  }
}
