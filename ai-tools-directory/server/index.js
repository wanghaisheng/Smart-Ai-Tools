import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import models
import './models/User.js';
import './models/UserProfile.js';
import './models/Tool.js';
import './models/Review.js';
import './models/Category.js';
import './models/Notification.js';
import './models/ApiKey.js';
import './models/Collection.js';
import './models/SmartPrompt.js';
import './models/SocialProfile.js';
import './models/Comment.js';
import './models/ProviderApiKey.js';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import profileRoutes from './routes/profiles.js';
import toolRoutes from './routes/tools.js';
import reviewRoutes from './routes/reviews.js';
import categoryRoutes from './routes/categories.js';
import favoriteRoutes from './routes/favorites.js';
import { router as notificationRoutes } from './routes/notifications.js';
import apiKeyRoutes from './routes/api-keys.js';
import collectionRoutes from './routes/collections.js';
import smartPromptRoutes from './routes/smartPromptRoutes.js';
import socialRoutes from './routes/social.js';
import providerApiKeyRoutes from './routes/provider-api-keys.js';
import settingsRoutes from './routes/settings.js';
import generatePromptRoutes from './routes/generate-prompt.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.CLIENT_URL 
    : ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/tools', toolRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/api-keys', apiKeyRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/smart-prompts', smartPromptRoutes);
app.use('/api/social', socialRoutes);
app.use('/api/provider-api-keys', providerApiKeyRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/generate-prompt', generatePromptRoutes);

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    body: req.body,
    query: req.query
  });
  
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
