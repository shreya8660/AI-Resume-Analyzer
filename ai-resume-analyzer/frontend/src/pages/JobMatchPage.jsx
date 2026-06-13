import { useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeJobMatch } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { ScoreRing, SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';
import clsx from 'clsx';

const MATCH_LEVELS = {
  Excellent: 'text-emerald-600 dark:text-emerald-400',
  Good: 'text-blue-600 dark:text-blue-400',
  Fair: 'text-amber-600 dark:text-amber-400',
  Poor: 'text-red-600 dark:text-red-400',
};

export default function JobMatchPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const [jobDesc, setJobDesc] = useState('');
  const data = state.analyses.jobMatch;

  if (!state.resumeId) return <NoResume />;

  const run = async () => {
    if (!jobDesc.trim() || jobDesc.trim().length < 50) return toast.error('Paste a full job description (at least 50 characters)');
    setLoading(true);
    try {
      const res = await analyzeJobMatch(state.resumeId, jobDesc);
      dispatch({ type: 'SET_ANALYSIS', key: 'jobMatch', data: res.data });
      toast.success('Job match analysis complete!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={Briefcase} title="Job Match Analyzer"
        description="Paste a job description to see how well your resume matches"
      />

      {/* Input */}
      <div className="card p-5 mb-6">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Paste Job Description</p>
        <textarea
          className="input resize-none"
          rows={7}
          placeholder="Paste the full job description here — requirements, responsibilities, qualifications..."
          value={jobDesc}
          onChange={e => setJobDesc(e.target.value)}
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-slate-400">{jobDesc.length} characters</span>
          <button onClick={run} disabled={loading || jobDesc.length < 50} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <><Sparkles size={14} />Analyze Match</>}
          </button>
        </div>
      </div>

      {loading && <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Score hero */}
          <div className="card p-8 flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing score={data.matchPercentage} size={140} strokeWidth={12} label="Match Score" />
            <div className="flex-1">
              <p className={clsx('text-4xl font-extrabold', MATCH_LEVELS[data.matchLevel] || 'text-slate-700')}>
                {data.matchLevel} Match
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-3">
                Your resume matches <span className="font-semibold text-slate-800 dark:text-slate-200">{data.matchPercentage}%</span> of the job requirements.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{data.matchingKeywords?.length || 0}</p>
                  <p className="text-xs text-slate-500">Matching Keywords</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3">
                  <p className="text-lg font-bold text-red-500">{data.missingKeywords?.length || 0}</p>
                  <p className="text-xs text-slate-500">Missing Keywords</p>
                </div>
              </div>
            </div>
          </div>

          {/* Experience & education match */}
          {(data.experienceMatch || data.educationMatch) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {data.experienceMatch && (
                <div className="card p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Experience Match</p>
                    <span className="text-lg font-bold text-primary-600 dark:text-primary-400">{data.experienceMatch.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <motion.div className="h-full bg-primary-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${data.experienceMatch.score}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <p className="text-xs text-slate-500">{data.experienceMatch.notes}</p>
                </div>
              )}
              {data.educationMatch && (
                <div className="card p-5">
                  <div className="flex justify-between items-center mb-2">
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">Education Match</p>
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{data.educationMatch.score}%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                    <motion.div className="h-full bg-emerald-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${data.educationMatch.score}%` }} transition={{ duration: 0.8 }} />
                  </div>
                  <p className="text-xs text-slate-500">{data.educationMatch.notes}</p>
                </div>
              )}
            </div>
          )}

          {/* Keywords comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.matchingKeywords?.length > 0 && (
              <div className="card p-5">
                <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <CheckCircle size={14} className="text-emerald-500" /> Matching Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.matchingKeywords.map(k => <Chip key={k} label={k} variant="green" />)}
                </div>
              </div>
            )}
            {data.missingKeywords?.length > 0 && (
              <div className="card p-5">
                <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <XCircle size={14} className="text-red-500" /> Missing Keywords
                </p>
                <div className="flex flex-wrap gap-2">
                  {data.missingKeywords.map(k => <Chip key={k} label={k} variant="red" />)}
                </div>
              </div>
            )}
          </div>

          {/* Recommendations */}
          {data.recommendations?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">Recommendations to Improve Match</p>
              <ul className="space-y-2">
                {data.recommendations.map(r => (
                  <li key={r} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <Sparkles size={12} className="text-primary-500 mt-0.5 flex-shrink-0" />{r}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tailoring tips */}
          {data.tailoringTips?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">How to Tailor Your Resume</p>
              <ul className="space-y-2">
                {data.tailoringTips.map(t => (
                  <li key={t} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary-400 mt-1.5 flex-shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
