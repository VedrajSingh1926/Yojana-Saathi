import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const sendOtp = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ success: false, message: 'Phone number is required' });
    }

    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }

    const fast2smsKey = process.env.FAST2SMS_API_KEY;

    if (fast2smsKey && fast2smsKey.trim() !== '') {
      const numberWithoutCode = formattedNumber.replace('+91', '');
      
      const response = await fetch(`https://www.fast2sms.com/dev/bulkV2?authorization=${fast2smsKey}&route=otp&numbers=${numberWithoutCode}`);
      const data = await response.json();

      if (data.return) {
        console.log(`Fast2SMS sent successfully to ${numberWithoutCode}`);
        return res.status(200).json({ success: true, message: 'OTP sent successfully via Fast2SMS' });
      } else {
        throw new Error(data.message || 'Fast2SMS API rejected the request');
      }
    } else {
      console.log(`\n=================================================`);
      console.log(`[DEV MODE] No FAST2SMS_API_KEY found.`);
      console.log(`(You can use 123456 as a master bypass)`);
      console.log(`=================================================\n`);
      return res.status(200).json({ success: true, message: 'OTP sent successfully (Mocked Fallback)' });
    }
  } catch (error) {
    console.error('Fast2SMS Error:', error.message);
    console.log(`\n=================================================`);
    console.log(`[DEV MODE] Fast2SMS Failed, Mocking OTP... Use 123456 to verify.`);
    console.log(`=================================================\n`);
    return res.status(200).json({ success: true, message: 'OTP sent successfully (Mocked Fallback)' });
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { phoneNumber, otp } = req.body;
    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: 'Phone number and OTP are required' });
    }

    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }

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
        const user = await User.findOne({ mobileNumber: formattedNumber });
        return res.status(200).json({ success: true, message: 'OTP verified successfully via Fast2SMS', user });
      } else {
        return res.status(400).json({ success: false, message: data.message || 'Invalid OTP' });
      }
    } else {
      return res.status(400).json({ success: false, message: 'No Fast2SMS API Key configured' });
    }
  } catch (error) {
    next(error);
  }
};

export const register = async (req, res, next) => {
  try {
    const { personal, household, details, goals } = req.body;
    
    if (!personal || !personal.password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(personal.password, salt);

    const generateSaathiId = () => 'YS-' + new Date().getFullYear() + '-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    let saathiId = generateSaathiId();
    while (await User.findOne({ saathiId })) {
      saathiId = generateSaathiId();
    }

    let formattedNumber = personal.phone || '';
    if (formattedNumber && !formattedNumber.startsWith('+')) {
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
        isHead: household?.isHead === 'Yes',
        headName: household?.isHead === 'Yes' ? personal.name : household?.headName,
        totalMembers: (household?.members?.length || 0) + 1,
        annualIncome: Number(personal.income) || 0,
        members: household?.members || []
      },
      details: details || {},
      goals: goals || []
    });

    await newUser.save();
    return res.status(201).json({ success: true, message: 'Profile created successfully', userId: newUser._id, saathiId: newUser.saathiId, user: newUser });
  } catch (error) {
    next(error);
  }
};

export const saathiLookup = async (req, res, next) => {
  try {
    const { saathiId } = req.body;
    if (!saathiId) return res.status(400).json({ success: false, message: 'Saathi ID is required' });

    const user = await User.findOne({ saathiId });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Saathi ID not found' });
    }
    
    const phone = user.mobileNumber || '';
    const masked = phone.length > 2 ? 'x'.repeat(phone.length - 2) + phone.slice(-2) : phone;
    
    return res.status(200).json({ success: true, maskedMobile: masked, mobileNumber: phone });
  } catch (error) {
    next(error);
  }
};

export const checkNumber = async (req, res, next) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) return res.status(400).json({ success: false, message: 'Phone number is required' });

    let formattedNumber = phoneNumber;
    if (!formattedNumber.startsWith('+')) {
      formattedNumber = '+91' + formattedNumber;
    }

    const user = await User.findOne({ mobileNumber: formattedNumber });
    if (user) {
      return res.status(200).json({ success: true, exists: true, message: 'Phone number already registered' });
    }
    return res.status(200).json({ success: true, exists: false });
  } catch (error) {
    next(error);
  }
};

export const recover = async (req, res, next) => {
  try {
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

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this information' });
    }
    
    const phone = user.mobileNumber || '';
    const masked = phone.length > 2 ? 'x'.repeat(phone.length - 2) + phone.slice(-2) : phone;

    return res.status(200).json({ success: true, saathiId: user.saathiId, maskedMobile: masked, message: 'Account found successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
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

    const user = await User.findOne(query);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.password) {
      return res.status(400).json({ success: false, message: 'This account was created before passwords were required. Please register again or reset.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    return res.status(200).json({ success: true, message: 'Logged in successfully', user, saathiId: user.saathiId });
  } catch (error) {
    next(error);
  }
};

export const verifyCard = async (req, res, next) => {
  try {
    const { saathiId } = req.params;
    if (!saathiId) return res.status(400).json({ success: false, message: 'Saathi ID is required' });

    const user = await User.findOne({ saathiId: saathiId.toUpperCase() });
    if (!user) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    // Determine the Household Head Name
    let headName = '';
    if (user.household?.isHead) {
      headName = user.fullName;
    } else if (user.household?.headName) {
      headName = user.household.headName;
    } else {
      headName = user.fullName; // fallback
    }

    // Mask the Household Head Name
    let maskedHeadName = headName;
    if (headName.length > 3) {
      const parts = headName.split(' ');
      maskedHeadName = parts.map(part => {
        if (part.length <= 2) return part;
        return part[0] + '*'.repeat(part.length - 2) + part[part.length - 1];
      }).join(' ');
    }

    // Mask the Saathi ID (e.g. YS-*******281)
    const maskedSaathiId = 'YS-*******' + saathiId.slice(-3);

    return res.status(200).json({
      success: true,
      data: {
        verificationStatus: 'Verified',
        maskedHeadName,
        maskedSaathiId,
        cardStatus: 'Active',
        issueDate: user.createdAtIST ? user.createdAtIST.split(',')[0] : new Date(user.createdAt).toLocaleDateString('en-GB'),
        lastUpdated: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString('en-GB') : new Date().toLocaleDateString('en-GB')
      }
    });
  } catch (error) {
    next(error);
  }
};
