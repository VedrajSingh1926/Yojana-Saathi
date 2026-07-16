import express from 'express';
import User from '../models/User.js';

const router = express.Router();

// Register new family profile from Onboarding
router.post('/register', async (req, res) => {
  try {
    const { personal, household, details, goals } = req.body;
    
    const newUser = new User({
      personal,
      household,
      details,
      goals
    });

    await newUser.save();
    
    res.status(201).json({ success: true, message: 'Profile created successfully', userId: newUser._id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

export default router;
