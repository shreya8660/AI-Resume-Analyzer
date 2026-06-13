import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Sparkles, CheckCircle, XCircle, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import { analyzeSkillGap } from '../utils/api';
import { useResume } from '../context/ResumeContext';
import { ScoreRing, SectionHeader, CardSkeleton, Chip } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';

const JOB_ROLES = [
  'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'Data Scientist', 'Machine Learning Engineer', 'DevOps Engineer',
  'UI/UX Designer', 'Product Manager', 'Mobile Developer', 'Cloud Engineer',
];

export default function SkillsPage() {
  const { state, dispatch } = useResume();
  const [loading, setLoading] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const data = state.analyses.skills;

  if (!state.resumeId) return <NoResume />;

  const run = async () => {
    if (!jobRole.trim()) return toast.error('Please enter or select a job role');
    setLoading(true);
    try {
      const res = await analyzeSkillGap(state.resumeId, jobRole);
      dispatch({ type: 'SET_ANALYSIS', key: 'skills', data: res.data });
      toast.success('Skill gap analysis complete!');
    } catch (err) { toast.error(err.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <SectionHeader icon={Zap} title="Skill Gap Analysis"
        description="Compare your skills with industry requirements for your target role"
      />

      {/* Job role input */}
      <div className="card p-5 mb-6">
        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">Target Job Role</p>
        <div className="flex gap-3">
          <input
            className="input flex-1"
            placeholder="e.g. Frontend Developer, Data Scientist..."
            value={jobRole}
            onChange={e => setJobRole(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && run()}
          />
          <button onClick={run} disabled={loading || !jobRole.trim()} className="btn-primary flex-shrink-0">
            {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Sparkles size={14} />Analyze</>}
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          {JOB_ROLES.map(r => (
            <button key={r} onClick={() => setJobRole(r)}
              className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${jobRole === r ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'}`}>
              {r}
            </button>
          ))}
        </div>
      </div>

      {loading && <div className="space-y-4"><CardSkeleton /><CardSkeleton /></div>}

      {!loading && data && (
        <motion.div className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Match score */}
          <div className="card p-6 flex flex-col sm:flex-row items-center gap-6">
            <ScoreRing score={data.matchPercentage} size={120} label="Skill Match" />
            <div className="flex-1">
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{data.jobRole}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                You have <span className="font-semibold text-emerald-600 dark:text-emerald-400">{data.foundSkills?.length || 0}</span> of the required skills.
                <span className="text-red-500 dark:text-red-400 font-semibold"> {data.missingSkills?.length || 0}</span> skills are missing.
              </p>
            </div>
          </div>

          {/* Skills grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle size={14} className="text-emerald-500" /> Skills You Have ({data.foundSkills?.length || 0})
              </p>
              <div className="flex flex-wrap gap-2">
                {(data.foundSkills || []).map(s => <Chip key={s} label={s} variant="green" />)}
              </div>
            </div>
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <XCircle size={14} className="text-red-500" /> Skills to Learn ({data.missingSkills?.length || 0})
              </p>
              <div className="flex flex-wrap gap-2">
                {(data.missingSkills || []).map(s => <Chip key={s} label={s} variant="red" />)}
              </div>
            </div>
          </div>

          {/* By category */}
          {data.skillsByCategory && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-4">Skills by Category</p>
              <div className="space-y-4">
                {Object.entries(data.skillsByCategory).map(([cat, skills]) => (
                  <div key={cat}>
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 capitalize">{cat}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {(skills.found || []).map(s => <Chip key={s} label={s} variant="green" />)}
                      {(skills.missing || []).map(s => <Chip key={s} label={s} variant="red" />)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Course suggestions */}
          {data.courseSuggestions?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen size={14} className="text-primary-500" /> Recommended Courses
              </p>
              <div className="space-y-3">
                {data.courseSuggestions.map((c, i) => (
                  <div key={i} className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                    <div className="w-8 h-8 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center flex-shrink-0">
                      <BookOpen size={14} className="text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{c.course}</p>
                      <p className="text-xs text-slate-500">{c.platform} · Learn: <span className="font-medium">{c.skill}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Nice to have */}
          {data.niceToHaveSkills?.length > 0 && (
            <div className="card p-5">
              <p className="font-semibold text-slate-900 dark:text-white mb-3">Nice-to-Have Skills</p>
              <div className="flex flex-wrap gap-2">
                {data.niceToHaveSkills.map(s => <Chip key={s} label={s} variant="blue" />)}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}
