import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { decrypt } from "../../../utils/encryption";

// In-memory store from api-keys.js
// This is just for reference, in a real app you'd use a proper database
const apiKeys = new Map();

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;
  const userKeys = apiKeys.get(userId) || {};

  // Get available models based on configured API keys
  const availableModels = [];

  // OpenAI Models
  if (userKeys.openai) {
    availableModels.push(
      { id: 'gpt-4', name: 'GPT-4 (Most Capable)', provider: 'openai' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo (Fast & Efficient)', provider: 'openai' },
      { id: 'davinci-003', name: 'Davinci (Legacy)', provider: 'openai' }
    );
  }

  // Anthropic Models
  if (userKeys.anthropic) {
    availableModels.push(
      { id: 'claude-2', name: 'Claude 2 (Advanced)', provider: 'anthropic' },
      { id: 'claude-instant', name: 'Claude Instant (Fast)', provider: 'anthropic' }
    );
  }

  // Cohere Models
  if (userKeys.cohere) {
    availableModels.push(
      { id: 'command', name: 'Command (Comprehensive)', provider: 'cohere' },
      { id: 'command-light', name: 'Command Light (Efficient)', provider: 'cohere' }
    );
  }

  // Stability AI Models
  if (userKeys.stability) {
    availableModels.push(
      { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL', provider: 'stability' }
    );
  }

  return res.status(200).json({ models: availableModels });
}
