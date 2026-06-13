import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, File, CheckCircle, AlertCircle, X, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadResume } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { SectionHeader } from '../components/ui/index.jsx';
import clsx from 'clsx';

export default function UploadPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const { dispatch } = useResume();
  const navigate = useNavigate();

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length) {
      toast.error('Only PDF and DOCX files under 10MB are accepted.');
      return;
    }
    if (accepted.length) setFile(accepted[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  });

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const data = await uploadResume(formData);
      dispatch({
        type: 'SET_RESUME',
        payload: {
          resumeId: data.resumeId,
          fileName: data.fileName,
          fileType: data.fileType,
          textPreview: data.preview,
        },
      });
      toast.success('Resume uploaded successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <SectionHeader
        icon={Upload}
        title="Upload Your Resume"
        description="Upload a PDF or DOCX file to begin AI-powered analysis"
      />

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 scale-[1.01]'
            : 'border-slate-300 dark:border-slate-700 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-slate-50 dark:hover:bg-slate-900/50 bg-white dark:bg-slate-900'
        )}
      >
        <input {...getInputProps()} />
        <AnimatePresence mode="wait">
          {isDragActive ? (
            <motion.div key="drag" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center mx-auto mb-4">
                <Upload size={32} className="text-primary-600 dark:text-primary-400" />
              </div>
              <p className="text-lg font-semibold text-primary-600 dark:text-primary-400">Drop it here!</p>
            </motion.div>
          ) : (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-5">
                <FileText size={28} className="text-slate-400" />
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Drag & drop your resume here
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">or click to browse files</p>
              <div className="flex items-center justify-center gap-3">
                <span className="badge badge-blue">PDF</span>
                <span className="badge badge-purple">DOCX</span>
                <span className="text-xs text-slate-400">· Max 10 MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* File preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mt-4 card p-4 flex items-center gap-4"
          >
            <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
              <File size={20} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-slate-900 dark:text-white text-sm truncate">{file.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {formatSize(file.size)} · {file.type.includes('pdf') ? 'PDF' : 'DOCX'}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); }}
              className="btn-ghost p-1.5 text-slate-400 hover:text-red-500"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Upload button */}
      <div className="mt-6 flex flex-col gap-3">
        <button
          onClick={handleUpload}
          disabled={!file || uploading}
          className="btn-primary w-full justify-center py-3 text-base"
        >
          {uploading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Extracting & Uploading...
            </>
          ) : (
            <>
              <Sparkles size={16} /> Analyze Resume
            </>
          )}
        </button>
        {!file && (
          <p className="text-center text-xs text-slate-400">Select a file to continue</p>
        )}
      </div>

      {/* Tips */}
      <div className="mt-8 card p-5">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
          <CheckCircle size={14} className="text-emerald-500" /> Tips for best results
        </p>
        <ul className="space-y-2">
          {[
            'Use a text-based PDF (not a scanned image)',
            'Ensure your resume is in English',
            'Include sections like Experience, Education, and Skills',
            'Remove password protection before uploading',
          ].map((tip) => (
            <li key={tip} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-2">
              <span className="w-1 h-1 rounded-full bg-slate-400 mt-1.5 flex-shrink-0" />
              {tip}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
