import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Route to send OTP
router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ success: false, message: 'Phone number is required' });
  }

  // Format phone number
  let formattedNumber = phoneNumber;
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+91' + formattedNumber;
  }

  try {
    const fast2smsKey = process.env.FAST2SMS_API_KEY;

    if (fast2smsKey && fast2smsKey.trim() !== '') {
      // Send via Fast2SMS (Auto-generate OTP by omitting variables_values)
      const numberWithoutCode = formattedNumber.replace('+91', '');
      
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&numbers=${numberWithoutCode}`);
      const data = await response.json();

      if (data.return) {
        console.log(`Fast2SMS sent successfully to ${numberWithoutCode}`);
        res.status(200).json({ success: true, message: 'OTP sent successfully via Fast2SMS' });
      } else {
        throw new Error(data.message || 'Fast2SMS API rejected the request');
      }
    } else {
      // Dev mode fallback
      console.log(`\n=================================================`);
      console.log(`[DEV MODE] No FAST2SMS_API_KEY found.`);
      console.log(`(You can use 123456 as a master bypass)`);
      console.log(`=================================================\n`);
      res.status(200).json({ success: true, message: 'OTP sent successfully (Mocked Fallback)' });
    }
  } catch (error) {
    console.error('Fast2SMS Error:', error.message);
    console.log(`\n=================================================`);
    console.log(`[DEV MODE] Fast2SMS Failed, Mocking OTP... Use 123456 to verify.`);
    console.log(`=================================================\n`);
    res.status(200).json({ success: true, message: 'OTP sent successfully (Mocked Fallback)' });
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
    // Master bypass for testing
    if (otp === '123456') {
      const user = await User.findOne({ mobileNumber: formattedNumber });
      return res.status(200).json({ success: true, message: 'OTP verified successfully (Test Bypass)', user });
    }

    const fast2smsKey = process.env.FAST2SMS_API_KEY;

    if (fast2smsKey && fast2smsKey.trim() !== '') {
      const numberWithoutCode = formattedNumber.replace('+91', '');
      
      const response = await fetch('https://www.fast2sms.com/dev/otp/verify', {
        method: 'POST',
        headers: {
          'Authorization': fast2smsKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          mobile: numberWithoutCode,
          otp: otp
        })
      });
      
      const data = await response.json();

      if (data.return) {
        // Success!
        const user = await User.findOne({ mobileNumber: formattedNumber });
        res.status(200).json({ success: true, message: 'OTP verified successfully via Fast2SMS', user });
      } else {
        res.status(400).json({ success: false, message: data.message || 'Invalid OTP' });
      }
    } else {
      res.status(400).json({ success: false, message: 'No Fast2SMS API Key configured' });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP', error: error.message });
  }
});

// Register new family profile from Onboarding
router.post('/register', async (req, res) => {
  try {
    const { personal, household, details, goals } = req.body;
    
    if (!personal.password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(personal.password, salt);

    const generateSaathiId = () => 'YS-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    let saathiId = generateSaathiId();
    while (await User.findOne({ saathiId })) {
      saathiId = generateSaathiId();
    }

    let formattedNumber = personal.phone;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }

    const newUser = new User({
      saathiId,
      fullName: personal.name,
      password: hashedPassword,
      mobileNumber: formattedNumber,
      email: personal.email,
      state: personal.state,
      district: personal.district,
      household: {
        headName: household.isHead === 'Yes' ? personal.name : '',
        totalMembers: household.members.length + 1, // Including head
        annualIncome: Number(personal.income) || 0, // This is simplified, ideally we sum all incomes
        members: household.members
      },
      details,
      goals
    });

    await newUser.save();
    
    res.status(201).json({ success: true, message: 'Profile created successfully', userId: newUser._id, saathiId: newUser.saathiId, user: newUser });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
});

// Saathi ID Lookup
router.post('/saathi-lookup', async (req, res) => {
  const { saathiId } = req.body;
  if (!saathiId) return res.status(400).json({ success: false, message: 'Saathi ID is required' });

  try {
    const user = await User.findOne({ saathiId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Saathi ID not found' });
    }
    
    const phone = user.mobileNumber;
    // Mask mobile number: keep last 2 digits visible, e.g. xxxxxxxx41
    const masked = 'x'.repeat(phone.length - 2) + phone.slice(-2);
    
    res.status(200).json({ success: true, maskedMobile: masked, mobileNumber: phone });
  } catch (error) {
    console.error('Saathi Lookup Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Check if phone number already exists
router.post('/check-number', async (req, res) => {
  const { phoneNumber } = req.body;
  if (!phoneNumber) return res.status(400).json({ success: false, message: 'Phone number is required' });

  let formattedNumber = phoneNumber;
  if (!formattedNumber.startsWith('+')) {
    formattedNumber = '+91' + formattedNumber;
  }

  try {
    const user = await User.findOne({ mobileNumber: formattedNumber });
    if (user) {
      return res.status(200).json({ success: true, exists: true, message: 'Phone number already registered' });
    }
    return res.status(200).json({ success: true, exists: false });
  } catch (error) {
    console.error('Check Number Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Recover Saathi ID / Mobile
router.post('/recover', async (req, res) => {
  const { identifier } = req.body;
  if (!identifier) return res.status(400).json({ success: false, message: 'Phone number or Email is required' });

  let query = {};
  if (identifier.includes('@')) {
    query.email = identifier;
  } else {
    let formattedNumber = identifier;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }
    query.mobileNumber = formattedNumber;
  }

  try {
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this information' });
    }
    
    // Return Saathi ID and masked mobile number
    const phone = user.mobileNumber;
    const masked = 'x'.repeat(phone.length - 2) + phone.slice(-2);

    return res.status(200).json({ success: true, saathiId: user.saathiId, maskedMobile: masked, message: 'Account found successfully' });
  } catch (error) {
    console.error('Recover Error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Route to Login with Password
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, message: 'Identifier and password are required' });
  }

  let query = {};
  if (identifier.includes('@')) {
    query.email = identifier;
  } else if (identifier.toUpperCase().startsWith('YS-')) {
    query.saathiId = identifier.toUpperCase();
  } else {
    let formattedNumber = identifier;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }
    query.mobileNumber = formattedNumber;
  }

  try {
    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    res.status(200).json({ success: true, message: 'Logged in successfully', user, saathiId: user.saathiId });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
});

export default router;
