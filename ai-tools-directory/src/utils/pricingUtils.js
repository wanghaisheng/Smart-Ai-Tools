import pricingRules from '../data/pricing.json';

/**
 * Determines the pricing tier of a tool based on its description and URL
 * @param {Object} tool - The tool object containing description and URL
 * @returns {string} - The pricing tier (free, freemium, paid, or contact-for-price)
 */
export const determinePricingTier = (tool) => {
  // If tool has explicit pricing, use that
  if (tool.pricing) {
    const pricing = tool.pricing.toLowerCase();
    if (pricing.includes('free') && !pricing.includes('freemium')) return 'free';
    if (pricing.includes('freemium')) return 'freemium';
    if (pricing.includes('paid') || pricing.includes('premium')) return 'paid';
    if (pricing.includes('enterprise') || pricing.includes('contact')) return 'contact-for-price';
  }

  const { description = '', url = '' } = tool;
  const descriptionLower = description.toLowerCase();
  const urlLower = url.toLowerCase();

  // Check for free indicators
  if (urlLower.includes('github.com') || 
      urlLower.includes('gitlab.com') ||
      descriptionLower.includes('open-source') ||
      descriptionLower.includes('opensource')) {
    return 'free';
  }

  // Check for enterprise/contact pricing
  if (descriptionLower.includes('enterprise') ||
      descriptionLower.includes('contact for pricing') ||
      descriptionLower.includes('custom pricing')) {
    return 'contact-for-price';
  }

  // Check for paid indicators
  if (descriptionLower.includes('premium') ||
      descriptionLower.includes('subscription') ||
      descriptionLower.includes('pro plan')) {
    return 'paid';
  }

  // Default to freemium if no clear indicators
  return 'freemium';
};

/**
 * Returns the color class for a pricing badge based on the pricing tier
 * @param {string} pricingTier - The pricing tier
 * @returns {string} - Tailwind CSS color classes for the badge
 */
export const getPricingBadgeColor = (pricingTier) => {
  const colors = {
    'free': 'bg-green-100 text-green-800',
    'freemium': 'bg-blue-100 text-blue-800',
    'paid': 'bg-purple-100 text-purple-800',
    'contact-for-price': 'bg-gray-100 text-gray-800'
  };

  return colors[pricingTier] || colors['freemium'];
};

/**
 * Returns a formatted display name for the pricing tier
 * @param {string} pricingTier - The pricing tier
 * @returns {string} - Formatted display name
 */
export const formatPricingTier = (pricingTier) => {
  const display = {
    'free': 'Free',
    'freemium': 'Freemium',
    'paid': 'Paid',
    'contact-for-price': 'Contact for Price'
  };

  return display[pricingTier] || display['freemium'];
};
