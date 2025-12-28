import { Router } from 'express';
import { uploadSingle } from '../middleware/upload';
import { validate } from '../middleware/validate';
import * as analysisController from '../controllers/analysis.controller';
import { getAnalysesSchema, analysisIdSchema } from '../validators/analysis.validator';

const router = Router();

// Upload and analyze code
router.post('/upload', uploadSingle, analysisController.uploadAndAnalyze);

// Get all analyses
router.get('/', validate(getAnalysesSchema), analysisController.getAllAnalyses);

// Get analysis by ID
router.get('/:id', validate(analysisIdSchema), analysisController.getAnalysisById);

// Delete analysis
router.delete('/:id', validate(analysisIdSchema), analysisController.deleteAnalysis);

export default router;

