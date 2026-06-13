import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ArrowRight, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImprovements } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';
import clsx from 'clsx';

const PRIORITY_STYLES = {
  high: { chip: 'red', dot: 'bg-red-500', label: 'High Priority' },
  medium: { chip: 'amber', dot: 'bg-amber-500', label: 'Medium' },
  low: { chip: 'blue', dot: 'bg-blue-500', label: 'Low' },
};

export default function ImprovementsPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const data = state.analyses.improvements;

  if (!state.resumeId) return <NoResume />;

  const run = async () => {
    setLoading(true);
    try {
      const res = await getImprovements(state.resumeId);
      dispatch({ type: 'SET_ANALYSIS', key: 'improvements', data: res.data });
      toast.success('Improvement analysis complete!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const suggestions = data?.prioritySuggestions || [];
  const filtered = filter === 'all' ? suggestions : suggestions.filter(s => s.priority === filter);

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={Sparkles} title="Resume Improvement Suggestions"
        description="AI-powered recommendations to make your resume stand out"
        action={
          <button onClick={run} disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <><Sparkles size={14} />Run Analysis</>}
          </button>
        }
      />

      {loading && <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}

      {!loading && !data && (
        <div className="card p-12 text-center">
          <Sparkles size={32} className="text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Get AI Suggestions</p>
          <p className="text-sm text-slate-500 mb-5">Get prioritized recommendations to improve every section of your resume.</p>
          <button onClick={run} className="btn-primary mx-auto"><Sparkles size={14} />Analyze Now</button>
        </div>
      )}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Summary bar */}
          <div className="card p-5 flex flex-wrap gap-5">
            <div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{data.totalSuggestions}</p>
              <p className="text-xs text-slate-500">Total Suggestions</p>
            </div>
            {['high', 'medium', 'low'].map(p => {
              const count = suggestions.filter(s => s.priority === p).length;
              return (
                <div key={p}>
                  <p className={clsx('text-3xl font-bold', p === 'high' ? 'text-red-500' : p === 'medium' ? 'text-amber-500' : 'text-blue-500')}>{count}</p>
                  <p className="text-xs text-slate-500 capitalize">{p} Priority</p>
                </div>
              );
            })}
          </div>

          {/* Missing sections */}
          {data.missingSections?.length > 0 && (
            <div className="card p-5 border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-900/10">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> Missing Sections
              </p>
              <div className="flex flex-wrap gap-2">
                {data.missingSections.map(s => <Chip key={s} label={s} variant="red" />)}
              </div>
            </div>
          )}

          {/* ATS keywords to add */}
          {data.atsKeywordsToAdd?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">Recommended ATS Keywords to Add</p>
              <div className="flex flex-wrap gap-2">
                {data.atsKeywordsToAdd.map(k => <Chip key={k} label={k} variant="blue" />)}
              </div>
            </div>
          )}

          {/* Priority filter */}
          <div className="card p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="font-semibold text-slate-900 dark:text-white">Suggestions ({filtered.length})</p>
              <div className="flex gap-1.5">
                {['all', 'high', 'medium', 'low'].map(p => (
                  <button key={p} onClick={() => setFilter(p)}
                    className={clsx('text-xs px-3 py-1 rounded-lg font-medium transition-colors capitalize',
                      filter === p ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    )}>
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {filtered.map((s, i) => {
                const style = PRIORITY_STYLES[s.priority] || PRIORITY_STYLES.low;
                return (
                  <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={clsx('w-2 h-2 rounded-full flex-shrink-0 mt-0.5', style.dot)} />
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{s.section}</span>
                      </div>
                      <Chip label={style.label} variant={style.chip} />
                    </div>
                    <p className="text-sm font-medium text-red-600 dark:text-red-400 mb-2">{s.issue}</p>
                    <div className="flex items-start gap-2 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg p-3">
                      <ArrowRight size={13} className="text-emerald-600 dark:text-emerald-400 mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-emerald-700 dark:text-emerald-400">{s.suggestion}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Before/after bullet points */}
          {data.bulletPointImprovements?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-4">Bullet Point Rewrites</p>
              <div className="space-y-4">
                {data.bulletPointImprovements.map((b, i) => (
                  <div key={i} className="space-y-2">
                    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900 rounded-lg p-3">
                      <p className="text-xs font-semibold text-red-500 mb-1">Before</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{b.original}</p>
                    </div>
                    <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-900 rounded-lg p-3">
                      <p className="text-xs font-semibold text-emerald-500 mb-1">After</p>
                      <p className="text-sm text-slate-700 dark:text-slate-300">{b.improved}</p>
                    </div>
                    {b.reason && <p className="text-xs text-slate-500 pl-1">{b.reason}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* General tips */}
          {data.overallTips?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">General Tips</p>
              <ul className="space-y-2">
                {data.overallTips.map(tip => (
                  <li key={tip} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <Sparkles size={12} className="text-primary-500 mt-0.5 flex-shrink-0" />{tip}
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
