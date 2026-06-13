import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, CheckCircle, XCircle, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeATS } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { ScoreRing, ProgressBar, SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';
import clsx from 'clsx';

export default function ATSPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const data = state.analyses.ats;

  if (!state.resumeId) return <NoResume />;

  const run = async () => {
    setLoading(true);
    try {
      const res = await analyzeATS(state.resumeId);
      dispatch({ type: 'SET_ANALYSIS', key: 'ats', data: res.data });
      toast.success('ATS analysis complete!');
    } catch (err) {
      toast.error(err.message);
    } finally { setLoading(false); }
  };

  const scoreColor = (s) => s >= 75 ? 'text-emerald-600 dark:text-emerald-400' : s >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400';

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={Target} title="ATS Score Analyzer"
        description="See how well your resume performs with applicant tracking systems"
        action={
          <button onClick={run} disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <><Sparkles size={14} />Run Analysis</>}
          </button>
        }
      />

      {loading && <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}

      {!loading && !data && (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto mb-4">
            <Target size={28} className="text-slate-400" />
          </div>
          <p className="font-semibold text-slate-700 dark:text-slate-300">Run ATS Analysis</p>
          <p className="text-sm text-slate-500 mt-1 mb-5">Discover how well your resume passes ATS filters used by companies like Google, Amazon, and Meta.</p>
          <button onClick={run} className="btn-primary mx-auto"><Sparkles size={14} />Analyze Now</button>
        </div>
      )}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Score hero */}
          <div className="card p-8 flex flex-col sm:flex-row items-center gap-8">
            <ScoreRing score={data.overallScore} size={140} strokeWidth={12} label="ATS Score" />
            <div className="flex-1">
              <p className={clsx('text-4xl font-extrabold', scoreColor(data.overallScore))}>
                {data.overallScore >= 75 ? 'Excellent' : data.overallScore >= 50 ? 'Needs Work' : 'Poor'} 
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 mb-4">
                Your resume scored <span className="font-semibold text-slate-700 dark:text-slate-200">{data.overallScore}/100</span> on ATS compatibility.
              </p>
              <div className="flex flex-wrap gap-2">
                {(data.strengths || []).slice(0, 3).map(s => <Chip key={s} label={s} variant="green" />)}
              </div>
            </div>
          </div>

          {/* Section scores */}
          <div className="card p-6">
            <p className="font-semibold text-slate-900 dark:text-white mb-5">Section Breakdown</p>
            <div className="space-y-5">
              {Object.entries(data.sections || {}).map(([key, sec]) => (
                <div key={key}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {sec.found
                        ? <CheckCircle size={14} className="text-emerald-500" />
                        : <XCircle size={14} className="text-red-500" />}
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                      {sec.score}/{sec.maxScore}
                    </span>
                  </div>
                  <ProgressBar value={sec.score} max={sec.maxScore} showLabel={false} size="sm" />
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1.5">{sec.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Issues & keywords */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {data.weaknesses?.length > 0 && (
              <div className="card p-5">
                <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                  <XCircle size={14} className="text-red-500" /> Issues Found
                </p>
                <ul className="space-y-2">
                  {data.weaknesses.map(w => (
                    <li key={w} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />{w}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.missingElements?.length > 0 && (
              <div className="card p-5">
                <p className="font-semibold text-slate-900 dark:text-white mb-3">Missing Elements</p>
                <ul className="space-y-2">
                  {data.missingElements.map(m => (
                    <li key={m} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />{m}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {data.atsKeywords?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">ATS Keywords Detected</p>
              <div className="flex flex-wrap gap-2">
                {data.atsKeywords.map(kw => <Chip key={kw} label={kw} variant="blue" />)}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
