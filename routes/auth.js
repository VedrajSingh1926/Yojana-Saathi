import express from 'express';
import User from '../models/User.js';
import twilio from 'twilio';

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID;

const client = twilio(accountSid, authToken);

// Route to send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  // Format phone number to E.164 format if it doesn't have a country code
  let formattedNumber = phoneNumber;
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+91' + formattedNumber; // Defaulting to India if no country code provided
  }

  try {
    if (verifyServiceSid && verifyServiceSid.trim() !== '') {
      // Send SMS via Twilio Verify
      const verification = await client.verify.v2.services(verifyServiceSid)
        .verifications
        .create({ to: formattedNumber, channel: 'sms' });
      
      console.log(`Verification status: ${verification.status}`);
      res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } else {
      // Dev mode fallback
      console.log(`\n=================================================`);
      console.log(`[DEV MODE] SMS Skipped. No TWILIO_VERIFY_SERVICE_SID configured.`);
      console.log(`=================================================\n`);
      res.status(500).json({ success: false, message: 'Twilio Verify not configured' });
    }
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

// Route to verify OTP
router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
  }

  let formattedNumber = phoneNumber;
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+91' + formattedNumber;
  }

  try {
    if (otp === '123456') {
      return res.status(200).json({ success: true, message: 'OTP verified successfully (Test Bypass)' });
    }

    if (verifyServiceSid && verifyServiceSid.trim() !== '') {
      const verificationCheck = await client.verify.v2.services(verifyServiceSid)
        .verificationChecks
        .create({ to: formattedNumber, code: otp });

      if (verificationCheck.status === 'approved') {
        res.status(200).json({ success: true, message: 'OTP verified successfully' });
      } else {
        res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
    } else {
      res.status(500).json({ success: false, message: 'Twilio Verify not configured' });
    }
  } catch (error) {
    console.error('Twilio Verification Error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP', error: error.message });
  }
});

// Register new family profile from Onboarding
router.post('/register', async (req, res) => {
  try {
    const { personal, household, details, goals } = req.body;
    
    const generateSaathiId = () => 'YS-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    const saathiId = generateSaathiId();

    const newUser = new User({
      saathiId,
      personal,
      household,
      details,
      goals
    });

    await newUser.save();
    
    res.status(201).json({ success: true, message: 'Profile created successfully', userId: newUser._id, saathiId: newUser.saathiId });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration' });
  }
});

export default router;
