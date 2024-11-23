import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { encrypt, decrypt } from "../../../utils/encryption";

// In-memory store for demo purposes
// TODO: Replace with your database implementation
let apiKeys = new Map();

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const userId = session.user.id;

  switch (req.method) {
    case 'GET':
      // Return all API keys for the user (encrypted)
      const userKeys = apiKeys.get(userId) || {};
      return res.status(200).json(userKeys);

    case 'POST':
      // Save new API key
      const { provider, apiKey } = req.body;
      if (!provider || !apiKey) {
        return res.status(400).json({ error: "Missing provider or API key" });
      }

      // Encrypt API key before storing
      const encryptedKey = encrypt(apiKey);
      
      const userApiKeys = apiKeys.get(userId) || {};
      userApiKeys[provider] = encryptedKey;
      apiKeys.set(userId, userApiKeys);

      return res.status(200).json({ success: true });

    case 'DELETE':
      // Delete API key
      const { provider: providerToDelete } = req.body;
      if (!providerToDelete) {
        return res.status(400).json({ error: "Missing provider" });
      }

      const existingKeys = apiKeys.get(userId) || {};
      delete existingKeys[providerToDelete];
      apiKeys.set(userId, existingKeys);

      return res.status(200).json({ success: true });

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}
