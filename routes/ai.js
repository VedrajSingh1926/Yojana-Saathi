import express from 'express';
import multer from 'multer';
import { stt, planner } from '../controllers/aiController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/stt', upload.single('audio'), stt);
router.post('/planner', planner);

export default router;
