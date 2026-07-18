import express from 'express';
import { 
  sendOtp, 
  verifyOtp, 
  register, 
  saathiLookup, 
  checkNumber, 
  recover, 
  login,
  verifyCard
} from '../controllers/authController.js';

const router = express.Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.post('/register', register);
router.post('/saathi-lookup', saathiLookup);
router.post('/check-number', checkNumber);
router.post('/recover', recover);
router.post('/login', login);
router.get('/verify/:saathiId', verifyCard);

export default router;
