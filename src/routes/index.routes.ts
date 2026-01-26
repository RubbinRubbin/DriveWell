import { Router } from 'express';
import { assessmentRouter } from './assessment.routes';
import { coachingRouter } from './coaching.routes';

export const apiRouter = Router();

// Mount assessment routes
apiRouter.use('/assessments', assessmentRouter);

// Mount coaching routes
apiRouter.use('/coach', coachingRouter);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DriveWell API is running',
    timestamp: new Date().toISOString()
  });
});
