import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';
import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import ATSPage from './pages/ATSPage';
import GrammarPage from './pages/GrammarPage';
import SkillsPage from './pages/SkillsPage';
import ImprovementsPage from './pages/ImprovementsPage';
import JobMatchPage from './pages/JobMatchPage';
import RewritePage from './pages/RewritePage';
import CoverLetterPage from './pages/CoverLetterPage';
import InterviewPage from './pages/InterviewPage';

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          className: 'dark:bg-slate-800 dark:text-white text-sm font-medium',
          duration: 4000,
          style: { borderRadius: '12px', padding: '12px 16px' }
        }}
      />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<Layout><UploadPage /></Layout>} />
        <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
        <Route path="/ats" element={<Layout><ATSPage /></Layout>} />
        <Route path="/grammar" element={<Layout><GrammarPage /></Layout>} />
        <Route path="/skills" element={<Layout><SkillsPage /></Layout>} />
        <Route path="/improvements" element={<Layout><ImprovementsPage /></Layout>} />
        <Route path="/job-match" element={<Layout><JobMatchPage /></Layout>} />
        <Route path="/rewrite" element={<Layout><RewritePage /></Layout>} />
        <Route path="/cover-letter" element={<Layout><CoverLetterPage /></Layout>} />
        <Route path="/interview" element={<Layout><InterviewPage /></Layout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
