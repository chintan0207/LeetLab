import express from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { excuteCode } from '../controllers/executeCode.controller.js';

const excecutionRoutes = express.Router();

excecutionRoutes.post('/', authMiddleware, excuteCode);

export default excecutionRoutes;
