import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  fileType: { type: String, enum: ['pdf', 'docx'], required: true },
  rawText: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now },
  analyses: [{
    type: { type: String, enum: ['ats', 'grammar', 'skills', 'improvement', 'job_match', 'rewrite', 'cover_letter', 'interview'] },
    result: { type: mongoose.Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('Resume', resumeSchema);
