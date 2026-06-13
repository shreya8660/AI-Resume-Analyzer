import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Target, Zap, FileText, Briefcase, MessageSquare, ArrowRight, CheckCircle, Moon, Sun } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FEATURES = [
  { icon: Target, title: 'ATS Score', desc: 'See how well your resume passes applicant tracking systems' },
  { icon: FileText, title: 'Grammar Check', desc: 'Fix writing issues and strengthen your action verbs' },
  { icon: Zap, title: 'Skill Gap Analysis', desc: 'Discover what skills you need for your target role' },
  { icon: Briefcase, title: 'Job Match', desc: 'Paste any job description and get a match percentage' },
  { icon: Sparkles, title: 'AI Rewriter', desc: 'Transform weak bullet points into compelling achievements' },
  { icon: MessageSquare, title: 'Interview Prep', desc: 'Get AI-generated questions tailored to your resume' },
];

const PERKS = ['Free to use', 'No signup required', 'Instant AI analysis', 'PDF & DOCX support'];

const fadeUp = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function LandingPage() {
  const { dark, toggle } = useTheme();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 overflow-x-hidden">
      {/* Navbar */}
      <nav className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center">
            <Sparkles size={16} className="text-white" />
          </div>
          <span className="font-bold text-slate-900 dark:text-white text-lg">ResumeAI</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <Link to="/upload" className="btn-primary text-sm">Get Started <ArrowRight size={14} /></Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pt-16 pb-24 text-center">
        <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.12 } } }}>
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300 text-sm font-medium mb-8">
            <Sparkles size={14} />
            Powered by Google Gemini AI
          </motion.div>
          <motion.h1 variants={fadeUp} className="text-5xl sm:text-6xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
            Land your dream job<br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-purple-500">with a stronger resume</span>
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Upload your resume and get an instant AI-powered breakdown — ATS score, skill gaps, grammar fixes, job match analysis, and a personalized rewrite.
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mt-10">
            <Link to="/upload" className="btn-primary text-base px-7 py-3.5">
              Analyze My Resume <ArrowRight size={16} />
            </Link>
          </motion.div>
          <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-x-6 gap-y-2 mt-8">
            {PERKS.map(p => (
              <span key={p} className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
                <CheckCircle size={14} className="text-emerald-500" /> {p}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Everything your resume needs</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-3">10 AI-powered tools, one upload</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              className="card p-6 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-800 transition-all duration-200 group"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}>
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon size={20} />
              </div>
              <h3 className="font-semibold text-slate-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="card p-12 text-center bg-gradient-to-br from-primary-600 to-purple-600 border-0">
          <h2 className="text-3xl font-bold text-white mb-3">Ready to get hired?</h2>
          <p className="text-primary-100 mb-8 max-w-lg mx-auto">Your improved resume is a few clicks away. No account needed.</p>
          <Link to="/upload" className="inline-flex items-center gap-2 bg-white text-primary-700 font-semibold px-7 py-3.5 rounded-xl hover:bg-primary-50 transition-colors text-base">
            Upload Resume Now <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-sm text-slate-400">
        © 2024 ResumeAI · Built with Google Gemini
      </footer>
    </div>
  );
}
