import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { decrypt } from "../../../utils/encryption";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { provider, apiKey } = req.body;
  if (!provider || !apiKey) {
    return res.status(400).json({ error: "Missing provider or API key" });
  }

  try {
    // Test the API key based on the provider
    switch (provider) {
      case 'openai':
        const openaiResponse = await fetch('https://api.openai.com/v1/models', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!openaiResponse.ok) throw new Error('Invalid OpenAI API key');
        break;

      case 'anthropic':
        const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            messages: [{ role: 'user', content: 'Test' }],
            model: 'claude-2',
            max_tokens: 1,
          }),
        });
        if (!anthropicResponse.ok) throw new Error('Invalid Anthropic API key');
        break;

      case 'cohere':
        const cohereResponse = await fetch('https://api.cohere.ai/v1/tokenize', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: 'Test',
          }),
        });
        if (!cohereResponse.ok) throw new Error('Invalid Cohere API key');
        break;

      case 'stability':
        const stabilityResponse = await fetch('https://api.stability.ai/v1/engines/list', {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        });
        if (!stabilityResponse.ok) throw new Error('Invalid Stability AI API key');
        break;

      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error testing API key:', error);
    return res.status(400).json({ error: error.message });
  }
}
