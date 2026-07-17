import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth.js';
import aiRoutes from './routes/ai.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
let mongoServer;
const connectDB = async () => {
  let dbUri = process.env.MONGODB_URI;
  if (!dbUri || dbUri === 'memory') {
    console.log('No MONGODB_URI provided. Starting MongoMemoryServer fallback...');
    try {
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      mongoServer = await MongoMemoryServer.create();
      dbUri = mongoServer.getUri();
      console.log('MongoMemoryServer started at:', dbUri);
    } catch (err) {
      console.error('Failed to start MongoMemoryServer:', err);
      process.exit(1);
    }
  }

  try {
    await mongoose.connect(dbUri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connection established successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    if (!mongoServer && process.env.NODE_ENV !== 'production') {
      console.log('Falling back to MongoMemoryServer...');
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        mongoServer = await MongoMemoryServer.create();
        const fallbackUri = mongoServer.getUri();
        await mongoose.connect(fallbackUri);
        console.log('Connected to fallback MongoMemoryServer successfully');
      } catch (fallbackErr) {
        console.error('Failed to connect to fallback MongoMemoryServer:', fallbackErr);
      }
    }
  }
};
connectDB();

// Basic Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running successfully!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/ai', aiRoutes);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled API Error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: process.env.NODE_ENV === 'production' ? 'Server error occurred' : err.message
  });
});

// Process crash prevention
process.on('uncaughtException', (err) => {
  console.error('CRITICAL: Uncaught Exception:', err);
  // Optional: Add logging to monitoring service here
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
  // Optional: Add logging to monitoring service here
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app;
