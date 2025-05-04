import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  getAllSubmission,
  getAllTheSubmissionsCountForProblem,
  getSubmissionsForProblem
} from '../controllers/submission.controller.js';

const submissionRoutes = express.Router();

submissionRoutes.get('/get-all-submissions', authMiddleware, getAllSubmission);

submissionRoutes.get('/get-submission/:problemId', authMiddleware, getSubmissionsForProblem);

submissionRoutes.get(
  '/get-submissions-count/:problemId',
  authMiddleware,
  getAllTheSubmissionsCountForProblem
);

export default submissionRoutes;
