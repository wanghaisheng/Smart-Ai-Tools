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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
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

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
