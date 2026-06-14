import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 120000,
});

api.interceptors.response.use(
  res => res.data,
  err => {
    const message = err.response?.data?.error || err.message || 'Something went wrong';
    return Promise.reject(new Error(message));
  }
);

// Resume
export const uploadResume = (formData) =>
  api.post('/resume/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const getResumes = () => api.get('/resume');

// Analysis
export const analyzeATS = (resumeId) => api.post('/analysis/ats', { resumeId });
export const analyzeGrammar = (resumeId) => api.post('/analysis/grammar', { resumeId });
export const analyzeSkillGap = (resumeId, jobRole) => api.post('/analysis/skills', { resumeId, jobRole });
export const getImprovements = (resumeId) => api.post('/analysis/improvements', { resumeId });
export const analyzeJobMatch = (resumeId, jobDescription) => api.post('/analysis/job-match', { resumeId, jobDescription });
export const rewriteResume = (resumeId) => api.post('/analysis/rewrite', { resumeId });
export const generateCoverLetter = (resumeId, data) => api.post('/analysis/cover-letter', { resumeId, ...data });
export const generateInterviewQuestions = (resumeId, jobRole) => api.post('/analysis/interview-questions', { resumeId, jobRole });

export default api;
