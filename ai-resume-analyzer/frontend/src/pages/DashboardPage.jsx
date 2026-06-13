import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Target, Zap, Sparkles, Briefcase, FileText, Wand2,
  Mail, MessageSquare, ArrowRight, Upload, Download,
  ClipboardList, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useResume } from '../context/ResumeContext';
import { ScoreRing, SectionHeader, StatCard } from '../components/ui/index.jsx';
import NoResume from '../components/ui/NoResume.jsx';
import { downloadReport } from '../utils/reportGenerator';

const TOOLS = [
  { to: '/ats',          icon: Target,        label: 'ATS Score',      desc: 'Check ATS compatibility',  color: 'bg-blue-500',    key: 'ats' },
  { to: '/grammar',      icon: FileText,       label: 'Grammar Check',  desc: 'Fix writing issues',       color: 'bg-purple-500',  key: 'grammar' },
  { to: '/skills',       icon: Zap,            label: 'Skill Gap',      desc: 'Find missing skills',      color: 'bg-amber-500',   key: 'skills' },
  { to: '/improvements', icon: Sparkles,       label: 'Improvements',   desc: 'AI suggestions',           color: 'bg-emerald-500', key: 'improvements' },
  { to: '/job-match',    icon: Briefcase,      label: 'Job Match',      desc: 'Match to a job post',      color: 'bg-rose-500',    key: 'jobMatch' },
  { to: '/rewrite',      icon: Wand2,          label: 'AI Rewriter',    desc: 'Rewrite bullet points',    color: 'bg-indigo-500',  key: 'rewrite' },
  { to: '/cover-letter', icon: Mail,           label: 'Cover Letter',   desc: 'Generate cover letter',    color: 'bg-cyan-500',    key: 'coverLetter' },
  { to: '/interview',    icon: MessageSquare,  label: 'Interview Prep', desc: 'Practice questions',       color: 'bg-orange-500',  key: 'interview' },
];

export default function DashboardPage() {
  const { state } = useResume();
  const [downloading, setDownloading] = useState(false);

  if (!state.resumeId) return <NoResume />;

  const atsScore    = state.analyses.ats?.overallScore ?? null;
  const matchScore  = state.analyses.jobMatch?.matchPercentage ?? null;
  const skillsFound = state.analyses.skills?.foundSkills?.length ?? null;
  const missingSkills = state.analyses.skills?.missingSkills?.length ?? null;
  const suggestions = state.analyses.improvements?.totalSuggestions ?? null;
  const grammarScore = state.analyses.grammar?.overallScore ?? null;

  // Count how many analyses have been completed
  const completedCount = Object.values(state.analyses).filter(Boolean).length;
  const hasAnyAnalysis = completedCount > 0;

  const handleDownloadReport = () => {
    if (!hasAnyAnalysis) {
      toast.error('Run at least one analysis before downloading the report.');
      return;
    }
    setDownloading(true);
    try {
      downloadReport(state);
      toast.success(`Report downloaded! (${completedCount} section${completedCount > 1 ? 's' : ''} included)`);
    } catch (err) {
      toast.error('Failed to generate report.');
      console.error(err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div>
      <SectionHeader
        icon={Upload}
        title="Dashboard"
        description={`Analyzing: ${state.fileName}`}
        action={
          <div className="flex items-center gap-2">
            {/* Download Report button */}
            <button
              onClick={handleDownloadReport}
              disabled={downloading || !hasAnyAnalysis}
              title={!hasAnyAnalysis ? 'Run at least one analysis first' : `Download full report (${completedCount} sections)`}
              className="btn-primary text-sm"
            >
              {downloading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Generating...</>
                : <><Download size={14} />Download Report</>
              }
            </button>
            <Link to="/upload" className="btn-secondary text-sm">
              <Upload size={14} /> New Resume
            </Link>
          </div>
        }
      />

      {/* Download report banner — shown when analyses are done */}
      {hasAnyAnalysis && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/10"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
            <ClipboardList size={18} className="text-primary-600 dark:text-primary-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-primary-700 dark:text-primary-300">
              AI Analysis Report Ready
            </p>
            <p className="text-xs text-primary-600/70 dark:text-primary-400/70 mt-0.5">
              {completedCount} of 8 analyses completed · Download a full report with all results, scores, and recommendations.
            </p>
            {/* Progress pills */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {TOOLS.map(t => {
                const done = !!state.analyses[t.key];
                return (
                  <span key={t.key}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${
                      done
                        ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                    }`}>
                    {done && <CheckCircle size={9} />}
                    {t.label}
                  </span>
                );
              })}
            </div>
          </div>
          <button
            onClick={handleDownloadReport}
            disabled={downloading}
            className="flex-shrink-0 inline-flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-60"
          >
            <Download size={14} />
            Download .txt
          </button>
        </motion.div>
      )}

      {/* Score highlights */}
      {(atsScore !== null || matchScore !== null) && (
        <div className="card p-6 mb-6">
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-6">Score Overview</p>
          <div className="flex flex-wrap gap-8 justify-center sm:justify-start">
            {atsScore    !== null && <ScoreRing score={atsScore}    label="ATS Score" />}
            {matchScore  !== null && <ScoreRing score={matchScore}  label="Job Match" />}
            {grammarScore !== null && <ScoreRing score={grammarScore} label="Writing Score" />}
          </div>
        </div>
      )}

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard label="ATS Score"    value={atsScore     !== null ? `${atsScore}/100` : '—'} icon={Target}   color="primary" subtitle="Run ATS analysis" />
        <StatCard label="Job Match"    value={matchScore   !== null ? `${matchScore}%`  : '—'} icon={Briefcase} color="green"   subtitle="Run job match" />
        <StatCard label="Skills Found" value={skillsFound  !== null ? skillsFound        : '—'} icon={Zap}      color="amber"   subtitle="Run skill gap" />
        <StatCard label="Suggestions"  value={suggestions  !== null ? suggestions        : '—'} icon={Sparkles} color="purple"  subtitle="Run improvements" />
      </div>

      {/* Tool cards */}
      <div>
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-4">Available Tools</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((tool, i) => {
            const hasResult = !!state.analyses[tool.key];
            return (
              <motion.div key={tool.to}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}>
                <Link to={tool.to} className="card-hover p-5 flex flex-col gap-3 group block">
                  <div className="flex items-start justify-between">
                    <div className={`w-9 h-9 rounded-xl ${tool.color} flex items-center justify-center`}>
                      <tool.icon size={16} className="text-white" />
                    </div>
                    {hasResult && (
                      <span className="badge badge-green text-[10px]">Done</span>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white text-sm">{tool.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tool.desc}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-medium text-primary-600 dark:text-primary-400 group-hover:gap-2 transition-all">
                    {hasResult ? 'View results' : 'Run analysis'} <ArrowRight size={12} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Missing skills warning */}
      {missingSkills !== null && missingSkills > 0 && (
        <div className="mt-6 card p-5 border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10">
          <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 mb-1">
            ⚠️ {missingSkills} skills missing for your target role
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-500">
            <Link to="/skills" className="underline">View skill gap analysis</Link> to see what to learn next.
          </p>
        </div>
      )}

      {/* Bottom download CTA — shown only after all 8 are done */}
      {completedCount === 8 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 card p-8 text-center bg-gradient-to-br from-primary-600 to-purple-600 border-0"
        >
          <Download size={32} className="text-white mx-auto mb-3" />
          <p className="text-xl font-bold text-white mb-1">All 8 Analyses Complete!</p>
          <p className="text-primary-100 text-sm mb-5">
            Your full AI analysis report is ready — download it as a comprehensive text document.
          </p>
          <button
            onClick={handleDownloadReport}
            className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-6 py-3 rounded-xl hover:bg-primary-50 transition-colors"
          >
            <Download size={16} /> Download Full Report
          </button>
        </motion.div>
      )}
    </div>
  );
}
