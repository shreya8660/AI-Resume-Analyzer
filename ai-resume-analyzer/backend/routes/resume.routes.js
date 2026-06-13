import express from 'express';
import { upload } from '../middleware/upload.middleware.js';
import { uploadResume, getResume, getResumes } from '../controllers/resume.controller.js';

const router = express.Router();

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/', getResumes);
router.get('/:id', getResume);

export default router;
