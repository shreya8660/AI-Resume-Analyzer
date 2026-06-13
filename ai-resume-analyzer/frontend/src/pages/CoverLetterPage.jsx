import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Sparkles, Copy, Download, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateCoverLetter } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';

export default function CoverLetterPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ jobDescription: '', companyName: '', jobTitle: '' });
  const data = state.analyses.coverLetter;

  if (!state.resumeId) return <NoResume />;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const run = async () => {
    if (!form.jobDescription.trim() || form.jobDescription.length < 30)
      return toast.error('Please add a job description (min 30 chars)');
    setLoading(true);
    try {
      const res = await generateCoverLetter(state.resumeId, form);
      dispatch({ type: 'SET_ANALYSIS', key: 'coverLetter', data: res.data });
      toast.success('Cover letter generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const handleCopy = async () => {
    if (!data?.coverLetter) return;
    await navigator.clipboard.writeText(data.coverLetter);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    if (!data?.coverLetter) return;
    const blob = new Blob([data.coverLetter], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cover_letter.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={Mail} title="AI Cover Letter Generator"
        description="Generate a professional cover letter tailored to any job posting"
      />

      {/* Form */}
      <div className="card p-5 mb-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Company Name</label>
            <input className="input" placeholder="e.g. Google, Stripe..." value={form.companyName} onChange={e => set('companyName', e.target.value)} />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Job Title</label>
            <input className="input" placeholder="e.g. Senior Frontend Engineer..." value={form.jobTitle} onChange={e => set('jobTitle', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300 block mb-1.5">Job Description <span className="text-red-400">*</span></label>
          <textarea className="input resize-none" rows={6}
            placeholder="Paste the full job description here..."
            value={form.jobDescription}
            onChange={e => set('jobDescription', e.target.value)}
          />
        </div>
        <button onClick={run} disabled={loading || form.jobDescription.length < 30} className="btn-primary w-full justify-center py-3">
          {loading
            ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
            : <><Sparkles size={14} />Generate Cover Letter</>
          }
        </button>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="card p-6 text-center">
            <Mail size={28} className="text-primary-400 mx-auto mb-3 animate-bounce" />
            <p className="font-medium text-slate-700 dark:text-slate-300">Crafting your cover letter...</p>
            <p className="text-sm text-slate-500 mt-1">This may take 15–20 seconds</p>
          </div>
          <CardSkeleton />
        </div>
      )}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Actions */}
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {data.keyPointsHighlighted?.map(k => <Chip key={k} label={k} variant="blue" />)}
            </div>
            <div className="flex gap-2">
              <button onClick={handleCopy} className="btn-secondary text-sm">
                {copied ? <><CheckCircle size={14} className="text-emerald-500" />Copied!</> : <><Copy size={14} />Copy</>}
              </button>
              <button onClick={handleDownload} className="btn-secondary text-sm">
                <Download size={14} />Download
              </button>
            </div>
          </div>

          {/* Cover letter text */}
          <div className="card p-6 sm:p-8">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {(data.coverLetter || '').split('\n').map((line, i) => (
                <p key={i} className={`text-slate-700 dark:text-slate-300 leading-relaxed ${!line.trim() ? 'mb-3' : 'mb-1'}`}>
                  {line || <br />}
                </p>
              ))}
            </div>
          </div>

          <div className="flex gap-2 justify-end">
            <button onClick={handleCopy} className="btn-primary">
              {copied ? <><CheckCircle size={14} />Copied!</> : <><Copy size={14} />Copy Letter</>}
            </button>
            <button onClick={handleDownload} className="btn-secondary">
              <Download size={14} />Download .txt
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
