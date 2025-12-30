import { Router } from 'express';
import analysisRoutes from './analysis.routes';

const router = Router();

// Health check
router.get('/health', (_, res) => {
  res.json({ 
    status: 'ok', 
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/analysis', analysisRoutes);

export default router;

