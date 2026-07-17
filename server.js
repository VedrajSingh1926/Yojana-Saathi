import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import compression from 'compression';
import 'dotenv/config';

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

// Verify essential environment variables (Strict Check)
const requiredEnv = ['GEMINI_API_KEY', 'GNANI_API_KEY', 'MEM0_API_KEY', 'ALCHEMYST_API_KEY', 'MONGODB_URI'];
const missingEnv = requiredEnv.filter(key => !process.env[key]);
if (missingEnv.length > 0) {
  logger.error(`CRITICAL: Missing essential environment variables: ${missingEnv.join(', ')}`);
  process.exit(1);
}
logger.info('Environment variables successfully verified.');

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => logger.info('MongoDB connection established successfully'))
  .catch(err => {
    logger.error('MongoDB connection error', err);
    process.exit(1);
  });

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

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

