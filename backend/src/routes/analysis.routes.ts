import { Router } from 'express';
import { analyzeCodeHandler } from '../controllers/analysis.controller';

const router = Router();

// Analyze code from request body
router.post('/', analyzeCodeHandler);

export default router;
