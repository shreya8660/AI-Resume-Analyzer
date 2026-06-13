import pdfParse from 'pdf-parse/lib/pdf-parse.js';
import mammoth from 'mammoth';
import Resume from '../models/resume.model.js';

/**
 * Upload and parse resume file
 */
export async function uploadResume(req, res, next) {
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    const { originalname, mimetype, buffer } = req.file;
    const fileType = mimetype === 'application/pdf' ? 'pdf' : 'docx';
    let rawText = '';

    if (fileType === 'pdf') {
      const data = await pdfParse(buffer);
      rawText = data.text;
    } else {
      const result = await mammoth.extractRawText({ buffer });
      rawText = result.value;
    }

    if (!rawText || rawText.trim().length < 50) {
      return res.status(400).json({ error: 'Could not extract meaningful text from the file. Ensure it is not scanned/image-only.' });
    }

    const resume = new Resume({ fileName: originalname, fileType, rawText });
    await resume.save();

    res.json({
      success: true,
      resumeId: resume._id,
      fileName: originalname,
      fileType,
      textLength: rawText.length,
      preview: rawText.slice(0, 300) + '...'
    });
  } catch (err) {
    next(err);
  }
}

/**
 * Get resume by ID
 */
export async function getResume(req, res, next) {
  try {
    const resume = await Resume.findById(req.params.id);
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json({ success: true, resume });
  } catch (err) {
    next(err);
  }
}

/**
 * Get all resumes (recent 10)
 */
export async function getResumes(req, res, next) {
  try {
    const resumes = await Resume.find({}, 'fileName fileType uploadedAt').sort({ uploadedAt: -1 }).limit(10);
    res.json({ success: true, resumes });
  } catch (err) {
    next(err);
  }
}
