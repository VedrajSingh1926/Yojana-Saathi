import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';

import authRoutes from './routes/auth.js';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('MongoDB connection established successfully'))
.catch(err => console.error('MongoDB connection error:', err));

// Basic Test Route
app.get('/api/test', (req, res) => {
  res.json({ message: 'Backend is running successfully!' });
});

// Routes
app.use('/api/auth', authRoutes);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
