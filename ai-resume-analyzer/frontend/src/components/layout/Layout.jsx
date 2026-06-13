import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Upload, Target, FileText, Zap, Briefcase,
  Wand2, Mail, MessageSquare, Moon, Sun, Menu, X, ChevronRight,
  Sparkles, LogOut
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useResume } from '../../context/ResumeContext';
import clsx from 'clsx';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Resume' },
  { label: '— Analysis', header: true },
  { to: '/ats', icon: Target, label: 'ATS Score' },
  { to: '/grammar', icon: FileText, label: 'Grammar Check' },
  { to: '/skills', icon: Zap, label: 'Skill Gap' },
  { to: '/improvements', icon: Sparkles, label: 'Improvements' },
  { to: '/job-match', icon: Briefcase, label: 'Job Match' },
  { label: '— AI Tools', header: true },
  { to: '/rewrite', icon: Wand2, label: 'AI Rewriter' },
  { to: '/cover-letter', icon: Mail, label: 'Cover Letter' },
  { to: '/interview', icon: MessageSquare, label: 'Interview Prep' },
];

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { dark, toggle } = useTheme();
  const { state, dispatch } = useResume();
  const location = useLocation();
  const navigate = useNavigate();

  const handleNewResume = () => {
    dispatch({ type: 'CLEAR' });
    navigate('/upload');
    setSidebarOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside className={clsx(
        'fixed inset-y-0 left-0 z-30 w-64 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={16} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white text-lg tracking-tight">ResumeAI</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden btn-ghost p-1.5">
            <X size={18} />
          </button>
        </div>

        {/* Resume status pill */}
        {state.resumeId && (
          <div className="mx-4 mt-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-200 dark:border-primary-800">
            <p className="text-xs text-primary-600 dark:text-primary-400 font-medium truncate">{state.fileName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">{state.fileType?.toUpperCase()} · Active</p>
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5 scrollbar-thin">
          {NAV_ITEMS.map((item, i) => {
            if (item.header) return (
              <p key={i} className="text-[10px] font-semibold text-slate-400 dark:text-slate-600 uppercase tracking-widest px-3 pt-4 pb-1">{item.label.replace('— ', '')}</p>
            );
            const active = location.pathname === item.to;
            return (
              <Link key={item.to} to={item.to} onClick={() => setSidebarOpen(false)}
                className={clsx(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                  active
                    ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                )}>
                <item.icon size={16} className={active ? 'text-white' : ''} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* Bottom actions */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-2">
          <button onClick={handleNewResume} className="w-full btn-secondary text-sm justify-center">
            <Upload size={14} /> New Resume
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="btn-ghost lg:hidden p-2">
            <Menu size={18} />
          </button>
          <div className="hidden lg:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span>AI Resume Analyzer</span>
            <ChevronRight size={14} />
            <span className="text-slate-900 dark:text-white font-medium capitalize">
              {location.pathname.replace('/', '') || 'Home'}
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <button onClick={toggle} className="btn-ghost p-2 rounded-xl" title="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6 scrollbar-thin">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
