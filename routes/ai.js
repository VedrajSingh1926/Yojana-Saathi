import express from 'express';
import multer from 'multer';
import { body, validationResult } from 'express-validator';
import { stt, planner } from '../controllers/aiController.js';
import { logger } from '../utils/logger.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to check validation results
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn('Validation failed', { errors: errors.array(), path: req.originalUrl });
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};

router.post('/stt', upload.single('audio'), stt);

router.post('/planner', [
  body('prompt').notEmpty().withMessage('Prompt is required').isString(),
  body('user').optional({ nullable: true }).isObject(),
  validateRequest
], planner);

export default router;
