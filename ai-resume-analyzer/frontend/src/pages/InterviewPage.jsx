import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { generateInterviewQuestions } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';
import clsx from 'clsx';

const DIFFICULTY_COLORS = { easy: 'green', medium: 'amber', hard: 'red' };

function QuestionCard({ question, index, type }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between gap-3 p-4 text-left hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-start gap-3">
          <span className="w-6 h-6 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
            {index + 1}
          </span>
          <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{question.question}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          {question.difficulty && <Chip label={question.difficulty} variant={DIFFICULTY_COLORS[question.difficulty] || 'default'} />}
          {open ? <ChevronUp size={14} className="text-slate-400" /> : <ChevronDown size={14} className="text-slate-400" />}
        </div>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40">
            <div className="p-4 space-y-2">
              {question.topic && <p className="text-xs text-slate-500"><span className="font-medium">Topic:</span> {question.topic}</p>}
              {question.competency && <p className="text-xs text-slate-500"><span className="font-medium">Competency:</span> {question.competency}</p>}
              {question.relatedProject && <p className="text-xs text-slate-500"><span className="font-medium">Related Project:</span> {question.relatedProject}</p>}
              {question.purpose && <p className="text-xs text-slate-500"><span className="font-medium">Purpose:</span> {question.purpose}</p>}
              {question.framework && <Chip label={`Use ${question.framework} framework`} variant="blue" />}
              {question.hint && (
                <div className="mt-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg p-3">
                  <p className="text-xs font-medium text-primary-700 dark:text-primary-400 mb-1">Answer Hint:</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{question.hint}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const TABS = [
  { key: 'technicalQuestions', label: 'Technical', icon: '💻' },
  { key: 'behavioralQuestions', label: 'Behavioral', icon: '🧠' },
  { key: 'projectQuestions', label: 'Projects', icon: '🚀' },
  { key: 'hrQuestions', label: 'HR / Culture', icon: '👥' },
];

export default function InterviewPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [activeTab, setActiveTab] = useState('technicalQuestions');
  const data = state.analyses.interview;

  if (!state.resumeId) return <NoResume />;

  const run = async () => {
    setLoading(true);
    try {
      const res = await generateInterviewQuestions(state.resumeId, jobRole || undefined);
      dispatch({ type: 'SET_ANALYSIS', key: 'interview', data: res.data });
      toast.success('Interview questions generated!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  const activeQuestions = data?.[activeTab] || [];

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={MessageSquare} title="AI Interview Prep"
        description="Get AI-generated interview questions tailored to your resume and target role"
      />

      {/* Options */}
      <div className="card p-5 mb-6">
        <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3">Target Role (Optional)</p>
        <div className="flex gap-3">
          <input className="input flex-1" placeholder="e.g. Senior React Developer..."
            value={jobRole} onChange={e => setJobRole(e.target.value)} />
          <button onClick={run} disabled={loading} className="btn-primary flex-shrink-0">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles size={14} />Generate</>}
          </button>
        </div>
        <p className="text-xs text-slate-400 mt-2">Leave blank to generate based on your resume skills only</p>
      </div>

      {loading && (
        <div className="space-y-4">
          <div className="card p-6 text-center">
            <MessageSquare size={28} className="text-primary-400 mx-auto mb-3 animate-pulse" />
            <p className="font-medium text-slate-700 dark:text-slate-300">Generating your interview questions...</p>
          </div>
          <CardSkeleton /><CardSkeleton />
        </div>
      )}

      {!loading && !data && (
        <div className="card p-12 text-center">
          <MessageSquare size={32} className="text-slate-400 mx-auto mb-4" />
          <p className="font-semibold text-slate-700 dark:text-slate-300 mb-2">AI Interview Prep</p>
          <p className="text-sm text-slate-500 mb-5 max-w-md mx-auto">Get technical, behavioral, project, and HR questions tailored specifically to your resume skills and experience.</p>
          <button onClick={run} className="btn-primary mx-auto"><Sparkles size={14} />Generate Questions</button>
        </div>
      )}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Stats */}
          <div className="card p-5 flex flex-wrap gap-5">
            {TABS.map(t => (
              <div key={t.key} className="text-center">
                <p className="text-xl font-bold text-slate-900 dark:text-white">{(data[t.key] || []).length}</p>
                <p className="text-xs text-slate-500">{t.label}</p>
              </div>
            ))}
            <div className="text-center">
              <p className="text-xl font-bold text-slate-900 dark:text-white">
                {TABS.reduce((acc, t) => acc + (data[t.key] || []).length, 0)}
              </p>
              <p className="text-xs text-slate-500">Total</p>
            </div>
          </div>

          {/* Tab selector */}
          <div className="flex gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {TABS.map(t => (
              <button key={t.key} onClick={() => setActiveTab(t.key)}
                className={clsx('flex-1 text-xs font-medium px-3 py-2 rounded-lg transition-all text-center',
                  activeTab === t.key
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                )}>
                <span className="hidden sm:inline">{t.icon} </span>{t.label}
              </button>
            ))}
          </div>

          {/* Questions */}
          <div className="space-y-3">
            {activeQuestions.length === 0 ? (
              <div className="card p-8 text-center text-slate-500 text-sm">No questions in this category</div>
            ) : (
              activeQuestions.map((q, i) => (
                <QuestionCard key={i} question={q} index={i} type={activeTab} />
              ))
            )}
          </div>

          {/* Prep tips */}
          {data.preparationTips?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">Preparation Tips</p>
              <ul className="space-y-2">
                {data.preparationTips.map(tip => (
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
