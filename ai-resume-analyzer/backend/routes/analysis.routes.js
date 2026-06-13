import express from 'express';
import {
  analyzeATS,
  analyzeGrammar,
  analyzeSkillGap,
  getImprovements,
  analyzeJobMatch,
  rewriteResume,
  generateCoverLetter,
  generateInterviewQuestions
} from '../controllers/analysis.controller.js';

const router = express.Router();

router.post('/ats', analyzeATS);
router.post('/grammar', analyzeGrammar);
router.post('/skills', analyzeSkillGap);
router.post('/improvements', getImprovements);
router.post('/job-match', analyzeJobMatch);
router.post('/rewrite', rewriteResume);
router.post('/cover-letter', generateCoverLetter);
router.post('/interview-questions', generateInterviewQuestions);

export default router;
