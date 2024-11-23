import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { decrypt } from "../../utils/encryption";

// In-memory store from api-keys.js
const apiKeys = new Map();

const SYSTEM_PROMPTS = {
  creative: `You are a creative writing assistant. Your goal is to generate engaging, imaginative, and well-structured prompts that inspire creativity and storytelling.
  Consider elements like character development, plot structure, world-building, and emotional depth.`,
  
  technical: `You are a technical writing assistant. Your goal is to generate clear, precise, and well-structured prompts for technical documentation, guides, and explanations.
  Focus on clarity, accuracy, step-by-step instructions, and technical accuracy.`,
  
  marketing: `You are a marketing content strategist. Your goal is to generate compelling, persuasive, and engaging prompts for marketing materials.
  Consider the target audience, value proposition, brand voice, and call-to-action elements.`,
  
  academic: `You are an academic writing assistant. Your goal is to generate scholarly, research-focused prompts that follow academic standards.
  Consider research methodology, theoretical frameworks, literature review elements, and academic rigor.`
};

const TONE_MODIFIERS = {
  Professional: "Maintain a formal and business-appropriate tone.",
  Casual: "Use a relaxed and conversational tone.",
  Friendly: "Adopt a warm and approachable tone.",
  Formal: "Employ strict formality and academic language.",
  Authoritative: "Project expertise and command of the subject matter.",
  Humorous: "Incorporate appropriate wit and levity.",
  Inspirational: "Use motivational and uplifting language."
};

const LENGTH_TOKENS = {
  concise: 50,
  moderate: 150,
  detailed: 300,
  comprehensive: 500
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { topic, model, type, tone, length, temperature, generateVariations } = req.body;

  if (!topic || !model || !type || !tone || !length) {
    return res.status(400).json({ error: "Missing required parameters" });
  }

  const userId = session.user.id;
  const userKeys = apiKeys.get(userId) || {};

  try {
    const modelInfo = model.split('/');
    const provider = modelInfo[0];
    const modelName = modelInfo[1];

    const apiKey = decrypt(userKeys[provider]);
    if (!apiKey) {
      return res.status(400).json({ error: "API key not configured for this provider" });
    }

    // Build the prompt
    const systemPrompt = SYSTEM_PROMPTS[type];
    const toneModifier = TONE_MODIFIERS[tone];
    const maxTokens = LENGTH_TOKENS[length];

    const messages = [
      { role: "system", content: `${systemPrompt}\n${toneModifier}` },
      { role: "user", content: `Generate a prompt about: ${topic}. The prompt should be approximately ${maxTokens} tokens in length.` }
    ];

    let prompts = [];

    // Generate variations if requested
    const numVariations = generateVariations ? 3 : 1;

    switch (provider) {
      case 'openai':
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            messages,
            temperature,
            n: numVariations,
            max_tokens: maxTokens,
          }),
        });

        if (!openaiResponse.ok) {
          throw new Error('OpenAI API request failed');
        }

        const openaiData = await openaiResponse.json();
        prompts = openaiData.choices.map(choice => choice.message.content);
        break;

      case 'anthropic':
        // Generate variations sequentially for Anthropic
        for (let i = 0; i < numVariations; i++) {
          const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
              'x-api-key': apiKey,
              'anthropic-version': '2023-06-01',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              model: modelName,
              messages,
              max_tokens: maxTokens,
            }),
          });

          if (!anthropicResponse.ok) {
            throw new Error('Anthropic API request failed');
          }

          const anthropicData = await anthropicResponse.json();
          prompts.push(anthropicData.content);
        }
        break;

      case 'cohere':
        const cohereResponse = await fetch('https://api.cohere.ai/v1/generate', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: modelName,
            prompt: messages.map(m => m.content).join('\n'),
            num_generations: numVariations,
            max_tokens: maxTokens,
            temperature,
          }),
        });

        if (!cohereResponse.ok) {
          throw new Error('Cohere API request failed');
        }

        const cohereData = await cohereResponse.json();
        prompts = cohereData.generations.map(gen => gen.text);
        break;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    return res.status(200).json({ prompts });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return res.status(500).json({ error: error.message });
  }
}
