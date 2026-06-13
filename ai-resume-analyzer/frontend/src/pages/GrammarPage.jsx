import { useState } from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, AlertTriangle, ArrowRight, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeGrammar } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { ScoreRing, SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';
import clsx from 'clsx';

const TYPE_COLORS = {
  grammar: 'red', spelling: 'red', weak_verb: 'amber', passive_voice: 'purple'
};
const TYPE_LABELS = {
  grammar: 'Grammar', spelling: 'Spelling', weak_verb: 'Weak Verb', passive_voice: 'Passive Voice'
};

export default function GrammarPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const data = state.analyses.grammar;

  if (!state.resumeId) return <NoResume />;

  const run = async () => {
    setLoading(true);
    try {
      const res = await analyzeGrammar(state.resumeId);
      dispatch({ type: 'SET_ANALYSIS', key: 'grammar', data: res.data });
      toast.success('Grammar analysis complete!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const issues = data?.issues || [];
  const filtered = filter === 'all' ? issues : issues.filter(i => i.type === filter);
  const types = ['all', ...new Set(issues.map(i => i.type))];

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={FileText} title="Grammar & Writing Analysis"
        description="Detect grammar issues, weak verbs, and improve professional writing"
        action={
          <button onClick={run} disabled={loading} className="btn-primary">
            {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing...</> : <><Sparkles size={14} />Run Analysis</>}
          </button>
        }
      />

      {loading && <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}

      {!loading && !data && (
        <div className="card p-12 text-center">
          <FileText size={32} className="text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">Check Writing Quality</p>
          <p className="text-sm text-slate-500 mb-5">Find grammar errors, spelling mistakes, and weak action verbs in your resume.</p>
          <button onClick={run} className="btn-primary mx-auto"><Sparkles size={14} />Analyze Now</button>
        </div>
      )}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Score row */}
          <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={data.overallScore} size={120} label="Writing Score" />
            <div className="flex-1 w-full">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Total Issues', value: issues.length, color: 'text-red-500' },
                  { label: 'Writing Score', value: `${data.overallScore}/100`, color: 'text-primary-600 dark:text-primary-400' },
                  { label: 'Prof. Score', value: `${data.professionalismScore}/100`, color: 'text-emerald-500' },
                ].map(s => (
                  <div key={s.label} className="bg-slate-50 dark:bg-slate-800 rounded-xl p-3 text-center">
                    <p className={clsx('text-xl font-bold', s.color)}>{s.value}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Weak verbs & alternatives */}
          {data.weakActionVerbs?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <AlertTriangle size={14} className="text-amber-500" /> Weak Action Verbs Found
              </p>
              <div className="flex flex-wrap gap-2 mb-4">
                {data.weakActionVerbs.map(v => <Chip key={v} label={v} variant="amber" />)}
              </div>
              {data.strongerAlternatives && (
                <div className="space-y-2">
                  {Object.entries(data.strongerAlternatives).slice(0, 5).map(([weak, strong]) => (
                    <div key={weak} className="flex items-center gap-3 text-sm">
                      <span className="text-red-500 font-medium line-through">{weak}</span>
                      <ArrowRight size={12} className="text-slate-400 flex-shrink-0" />
                      <div className="flex flex-wrap gap-1.5">
                        {(strong || []).map(s => <Chip key={s} label={s} variant="green" />)}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Issues list */}
          {issues.length > 0 && (
            <div className="card p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="font-semibold text-slate-900 dark:text-white">Issues ({filtered.length})</p>
                <div className="flex gap-1.5">
                  {types.map(t => (
                    <button key={t}
                      onClick={() => setFilter(t)}
                      className={clsx('text-xs px-3 py-1 rounded-lg font-medium transition-colors capitalize',
                        filter === t ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                      )}>
                      {t === 'all' ? 'All' : TYPE_LABELS[t] || t}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {filtered.map((issue, i) => (
                  <div key={i} className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="text-sm text-slate-800 dark:text-slate-200 font-medium bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-lg line-through text-red-700 dark:text-red-400">
                        {issue.original}
                      </p>
                      <Chip label={TYPE_LABELS[issue.type] || issue.type} variant={TYPE_COLORS[issue.type] || 'default'} />
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle size={14} className="text-emerald-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{issue.suggestion}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">{issue.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Writing tips */}
          {data.writingTips?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">Writing Tips</p>
              <ul className="space-y-2">
                {data.writingTips.map(tip => (
                  <li key={tip} className="text-sm text-slate-600 dark:text-slate-400 flex items-start gap-2">
                    <CheckCircle size={13} className="text-primary-500 mt-0.5 flex-shrink-0" />{tip}
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
