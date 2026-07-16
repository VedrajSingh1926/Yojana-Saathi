import express from 'express';
import User from '../models/User.js';
import twilio from 'twilio';

const router = express.Router();

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// In-memory store for OTPs (For production, use Redis or MongoDB)
const otpStore = new Map();

// Generate a 6 digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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

  const otp = generateOTP();

  try {
    if (twilioPhoneNumber && twilioPhoneNumber.trim() !== '') {
      // Send SMS via Twilio if phone number is configured
      await client.messages.create({
        body: `Your Yojana-Saathi verification code is: ${otp}`,
        from: twilioPhoneNumber,
        to: formattedNumber
      });
    } else {
      // Dev mode fallback: print OTP to the terminal
      console.log(`\n=================================================`);
      console.log(`[DEV MODE] SMS Skipped. No TWILIO_PHONE_NUMBER configured.`);
      console.log(`[DEV MODE] OTP for ${formattedNumber} is: ${otp}`);
      console.log(`=================================================\n`);
    }

    // Store OTP with an expiry time (e.g., 5 minutes)
    otpStore.set(formattedNumber, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    res.status(200).json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Twilio Error:', error);
    res.status(500).json({ success: false, message: 'Failed to send OTP', error: error.message });
  }
});

// Route to verify OTP
router.post('/verify-otp', (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
  }

  let formattedNumber = phoneNumber;
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+91' + formattedNumber;
  }

  const storedData = otpStore.get(formattedNumber);

  if (!storedData) {
    return res.status(400).json({ success: false, message: 'No OTP requested for this number' });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(formattedNumber);
    return res.status(400).json({ success: false, message: 'OTP expired' });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ success: false, message: 'Invalid OTP' });
  }

  // OTP is valid
  otpStore.delete(formattedNumber); // Clear OTP after successful verification

  res.status(200).json({ success: true, message: 'OTP verified successfully' });
});

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
