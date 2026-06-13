import Resume from '../models/resume.model.js';
import { generateWithGroq as generateWithGemini, parseJsonResponse } from '../utils/groq.js';

// Helper to get resume text
async function getResumeText(resumeId) {
  const resume = await Resume.findById(resumeId);
  if (!resume) throw Object.assign(new Error('Resume not found'), { status: 404 });
  return resume.rawText;
}

// Save analysis to resume document
async function saveAnalysis(resumeId, type, result) {
  await Resume.findByIdAndUpdate(resumeId, {
    $push: { analyses: { type, result } }
  });
}

/**
 * ATS Score Analysis
 */
export async function analyzeATS(req, res, next) {
  try {
    const { resumeId } = req.body;
    const text = await getResumeText(resumeId);

    const prompt = `Analyze the following resume for ATS (Applicant Tracking System) compatibility. Return ONLY a JSON object with this exact structure:
{
  "overallScore": <number 0-100>,
  "sections": {
    "contactInfo": { "score": <0-20>, "maxScore": 20, "found": <boolean>, "details": "<string>" },
    "education": { "score": <0-20>, "maxScore": 20, "found": <boolean>, "details": "<string>" },
    "experience": { "score": <0-25>, "maxScore": 25, "found": <boolean>, "details": "<string>" },
    "skills": { "score": <0-20>, "maxScore": 20, "found": <boolean>, "details": "<string>" },
    "projects": { "score": <0-15>, "maxScore": 15, "found": <boolean>, "details": "<string>" }
  },
  "strengths": ["<string>", "<string>"],
  "weaknesses": ["<string>", "<string>"],
  "atsKeywords": ["<keyword>"],
  "missingElements": ["<string>"]
}

Resume text:
${text.slice(0, 4000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'ats', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * Grammar and Writing Analysis
 */
export async function analyzeGrammar(req, res, next) {
  try {
    const { resumeId } = req.body;
    const text = await getResumeText(resumeId);

    const prompt = `Analyze the following resume for grammar, spelling, and professional writing quality. Return ONLY a JSON object:
{
  "overallScore": <number 0-100>,
  "issues": [
    { "type": "grammar|spelling|weak_verb|passive_voice", "original": "<text>", "suggestion": "<better text>", "explanation": "<why>" }
  ],
  "weakActionVerbs": ["<verb>"],
  "strongerAlternatives": { "<weak_verb>": ["<strong1>", "<strong2>"] },
  "writingTips": ["<tip>"],
  "professionalismScore": <0-100>
}

Resume text:
${text.slice(0, 4000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'grammar', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * Skill Gap Analysis
 */
export async function analyzeSkillGap(req, res, next) {
  try {
    const { resumeId, jobRole } = req.body;
    if (!jobRole) return res.status(400).json({ error: 'jobRole is required' });
    const text = await getResumeText(resumeId);

    const prompt = `Compare the resume skills against typical requirements for a "${jobRole}" role. Return ONLY a JSON object:
{
  "jobRole": "${jobRole}",
  "matchPercentage": <0-100>,
  "foundSkills": ["<skill>"],
  "missingSkills": ["<skill>"],
  "niceToHaveSkills": ["<skill>"],
  "courseSuggestions": [
    { "skill": "<skill>", "platform": "<Coursera|Udemy|etc>", "course": "<course name>" }
  ],
  "skillsByCategory": {
    "technical": { "found": ["<skill>"], "missing": ["<skill>"] },
    "soft": { "found": ["<skill>"], "missing": ["<skill>"] },
    "tools": { "found": ["<skill>"], "missing": ["<skill>"] }
  }
}

Resume text:
${text.slice(0, 4000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'skills', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * Resume Improvement Suggestions
 */
export async function getImprovements(req, res, next) {
  try {
    const { resumeId } = req.body;
    const text = await getResumeText(resumeId);

    const prompt = `Provide detailed improvement suggestions for this resume. Return ONLY a JSON object:
{
  "totalSuggestions": <number>,
  "prioritySuggestions": [
    { "priority": "high|medium|low", "section": "<section>", "issue": "<issue>", "suggestion": "<suggestion>" }
  ],
  "missingSections": ["<section>"],
  "atsKeywordsToAdd": ["<keyword>"],
  "bulletPointImprovements": [
    { "original": "<text>", "improved": "<text>", "reason": "<reason>" }
  ],
  "formattingTips": ["<tip>"],
  "overallTips": ["<tip>"]
}

Resume text:
${text.slice(0, 4000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'improvement', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * Job Match Analysis
 */
export async function analyzeJobMatch(req, res, next) {
  try {
    const { resumeId, jobDescription } = req.body;
    if (!jobDescription) return res.status(400).json({ error: 'jobDescription is required' });
    const text = await getResumeText(resumeId);

    const prompt = `Compare this resume against the job description and calculate match. Return ONLY a JSON object:
{
  "matchPercentage": <0-100>,
  "matchLevel": "Excellent|Good|Fair|Poor",
  "matchingKeywords": ["<keyword>"],
  "missingKeywords": ["<keyword>"],
  "matchingSkills": ["<skill>"],
  "missingSkills": ["<skill>"],
  "experienceMatch": { "score": <0-100>, "notes": "<string>" },
  "educationMatch": { "score": <0-100>, "notes": "<string>" },
  "recommendations": ["<recommendation>"],
  "tailoringTips": ["<tip>"]
}

Resume:
${text.slice(0, 3000)}

Job Description:
${jobDescription.slice(0, 2000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'job_match', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * AI Resume Rewriter
 */
export async function rewriteResume(req, res, next) {
  try {
    const { resumeId } = req.body;
    const text = await getResumeText(resumeId);

    const prompt = `Rewrite and improve this resume professionally. Return ONLY a JSON object:
{
  "improvedSummary": "<rewritten professional summary>",
  "improvedBulletPoints": [
    { "original": "<original>", "improved": "<stronger version with metrics and action verbs>" }
  ],
  "improvedProjectDescriptions": [
    { "original": "<original>", "improved": "<improved version>" }
  ],
  "keyImprovements": ["<improvement made>"],
  "beforeAfterScore": { "before": <0-100>, "after": <0-100> }
}

Resume text:
${text.slice(0, 4000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'rewrite', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * Cover Letter Generator
 */
export async function generateCoverLetter(req, res, next) {
  try {
    const { resumeId, jobDescription, companyName, jobTitle } = req.body;
    if (!jobDescription) return res.status(400).json({ error: 'jobDescription is required' });
    const text = await getResumeText(resumeId);

    const prompt = `Generate a professional cover letter. Return ONLY a JSON object:
{
  "coverLetter": "<full cover letter text with proper paragraphs>",
  "keyPointsHighlighted": ["<point>"],
  "tone": "professional|friendly|formal",
  "wordCount": <number>
}

Resume:
${text.slice(0, 3000)}

Job Description:
${jobDescription.slice(0, 1500)}

Company: ${companyName || 'the company'}
Job Title: ${jobTitle || 'the position'}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'cover_letter', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}

/**
 * Interview Question Generator
 */
export async function generateInterviewQuestions(req, res, next) {
  try {
    const { resumeId, jobRole } = req.body;
    const text = await getResumeText(resumeId);

    const prompt = `Generate comprehensive interview questions based on this resume${jobRole ? ` for a ${jobRole} role` : ''}. Return ONLY a JSON object:
{
  "technicalQuestions": [
    { "question": "<question>", "difficulty": "easy|medium|hard", "topic": "<topic>", "hint": "<answer hint>" }
  ],
  "behavioralQuestions": [
    { "question": "<question>", "competency": "<competency>", "framework": "STAR" }
  ],
  "projectQuestions": [
    { "question": "<question>", "relatedProject": "<project name>" }
  ],
  "hrQuestions": [
    { "question": "<question>", "purpose": "<why asked>" }
  ],
  "preparationTips": ["<tip>"]
}

Resume text:
${text.slice(0, 4000)}`;

    const raw = await generateWithGemini(prompt);
    const result = parseJsonResponse(raw);
    await saveAnalysis(resumeId, 'interview', result);
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
}
