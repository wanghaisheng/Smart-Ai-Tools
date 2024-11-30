import express from 'express';
import { authenticate } from '../middleware/auth.js';
import ProviderApiKey from '../models/ProviderApiKey.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';
import Anthropic from '@anthropic-ai/sdk';

const router = express.Router();

// Helper function to get the API client for a provider
async function getApiClient(userId, provider) {
  const apiKey = await ProviderApiKey.findOne({
    user: userId,
    provider,
    isEnabled: true,
    isValid: true
  });

  if (!apiKey) {
    throw new Error(`No valid API key found for provider: ${provider}`);
  }

  const decryptedKey = apiKey.getDecryptedKey();

  switch (provider) {
    case 'openai':
      return new OpenAI({ apiKey: decryptedKey });
    case 'anthropic':
      return new Anthropic({ apiKey: decryptedKey });
    case 'gemini':
      return new GoogleGenerativeAI(decryptedKey);
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }
}

// Helper function to generate system prompt based on type and tone
function getSystemPrompt(type, tone) {
  const basePrompt = "You are a helpful AI assistant specializing in generating high-quality prompts.";
  
  const typePrompts = {
    creative: "Focus on creating imaginative and engaging prompts that inspire creativity and original thinking.",
    technical: "Focus on creating clear, precise prompts that encourage detailed technical explanations and solutions.",
    marketing: "Focus on creating persuasive prompts that help craft compelling marketing messages and content.",
    academic: "Focus on creating scholarly prompts that encourage rigorous academic analysis and research.",
    professional: "Focus on creating business-oriented prompts that address professional scenarios and challenges."
  };

  const tonePrompts = {
    formal: "Maintain a professional and academic tone.",
    casual: "Keep the tone conversational and approachable.",
    humorous: "Incorporate appropriate humor and levity.",
    serious: "Maintain a straightforward and earnest tone."
  };

  return `${basePrompt} ${typePrompts[type] || ''} ${tonePrompts[tone] || ''}`;
}

// Helper function to adjust length based on preference
function getLengthPrompt(length) {
  const lengths = {
    short: "Keep the response concise and brief, around 50-100 words.",
    moderate: "Provide a moderate-length response, around 150-250 words.",
    long: "Provide a detailed response, around 300-500 words."
  };
  return lengths[length] || lengths.moderate;
}

router.post('/', authenticate, async (req, res) => {
  const { topic, model, type, tone, length, temperature = 0.7 } = req.body;
  console.log('Generate prompt request:', { userId: req.userId, topic, model, type, tone, length });

  if (!topic || !model) {
    return res.status(400).json({ message: 'Topic and model are required' });
  }

  try {
    // Extract provider and model name from the model ID (e.g., "gemini/gemini-pro")
    const [provider, modelName] = model.split('/');
    console.log('Using provider and model:', { provider, modelName });
    
    // Get the appropriate API client
    const client = await getApiClient(req.userId, provider);
    console.log('Got API client for provider:', provider);

    // Construct the prompt
    const systemPrompt = getSystemPrompt(type, tone);
    const lengthPrompt = getLengthPrompt(length);
    const fullPrompt = `${systemPrompt}

Based on these guidelines, generate a detailed prompt about the following topic: "${topic}"

${lengthPrompt}

Generate a well-structured prompt that encourages thoughtful and relevant responses.`;

    // Generate the prompt using the appropriate API
    let generatedPrompts = [];
    
    switch (provider) {
      case 'openai': {
        const response = await client.chat.completions.create({
          model: modelName,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: fullPrompt }
          ],
          temperature: temperature,
          n: 3 // Generate 3 variations
        });
        generatedPrompts = response.choices.map(choice => choice.message.content);
        break;
      }

      case 'anthropic': {
        const response = await client.messages.create({
          model: modelName,
          max_tokens: 1024,
          temperature: temperature,
          messages: [{ role: 'user', content: fullPrompt }]
        });
        generatedPrompts = [response.content[0].text];
        break;
      }

      case 'gemini': {
        const genAI = client;
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Generate multiple prompts in parallel
        const promiseArray = Array(3).fill().map(() => 
          model.generateContent(fullPrompt)
            .then(result => result.response.text())
        );
        
        generatedPrompts = await Promise.all(promiseArray);
        break;
      }

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    res.json({ prompts: generatedPrompts });
  } catch (error) {
    console.error('Error generating prompt:', error);
    res.status(500).json({ 
      message: 'Failed to generate prompt', 
      error: error.message 
    });
  }
});

export default router;
