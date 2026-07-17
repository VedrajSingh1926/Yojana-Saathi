import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';

import { logger } from './utils/logger.js';
import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(compression());
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`Incoming Request`, { method: req.method, url: req.originalUrl, ip: req.ip });
  next();
});

// Verify essential environment variables (Warning only, so Render deploy doesn't fail)
const requiredEnv = ['GEMINI_API_KEY', 'GNANI_API_KEY', 'MEM0_API_KEY', 'ALCHEMYST_API_KEY', 'MONGODB_URI'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  logger.warn(`WARNING: Missing essential environment variables: ${missingEnv.join(', ')}. APIs may not function correctly.`);
} else {
  logger.info('Environment variables successfully verified.');
}

// MongoDB connection
let mongoServer;
const connectDB = async () => {
  let dbUri = process.env.MONGODB_URI;
  if (!dbUri || dbUri === 'memory') {
    logger.info('No MONGODB_URI provided. Starting MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
      logger.info(`MongoMemoryServer started at: ${dbUri}`);
    } catch (err) {
      logger.error('Failed to start MongoMemoryServer (likely missing in production). APIs requiring DB will fail.', err);
      dbUri = null;
    }
  }

  if (dbUri) {
    try {
      await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 3000 });
      logger.info('MongoDB connection established successfully');
    } catch (err) {
      logger.error('MongoDB connection error', err);
    }
  } else {
    logger.warn('Running without MongoDB connection.');
  }
};
connectDB();

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'dist')));
  app.get('*', (req, res) => {
    // Exclude /api routes from being caught by the static server routing
    if (req.originalUrl.startsWith('/api')) {
      return res.status(404).json({ success: false, message: 'API Route Not Found' });
    }
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
  });
}

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled API Error', err, { method: req.method, url: req.originalUrl });
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Server error occurred' : err.message
  });
});

// Process crash prevention
process.on('uncaughtException', (err) => {
  logger.error('CRITICAL: Uncaught Exception', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('CRITICAL: Unhandled Rejection', reason instanceof Error ? reason : new Error(String(reason)), { promise });
  process.exit(1);
});

app.listen(port, () => {
  logger.info(`Server is running on port: ${port}`);
});

export default app;

