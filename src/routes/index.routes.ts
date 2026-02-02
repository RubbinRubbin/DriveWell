import { Router } from 'express';
import { assessmentRouter } from './assessment.routes';
import { coachingRouter } from './coaching.routes';
import { authRouter } from './auth.routes';
import { companyRouter } from './company.routes';
import { customerRouter } from './customer.routes';
import { authMiddleware } from '../middleware/auth.middleware';
import { companyOnly, customerOnly } from '../middleware/role.middleware';

export const apiRouter = Router();

// Public routes
apiRouter.use('/auth', authRouter);

// Protected routes - Company users
apiRouter.use('/company', authMiddleware, companyOnly, companyRouter);

// Protected routes - Customers
apiRouter.use('/customer', authMiddleware, customerOnly, customerRouter);

// Legacy routes (kept for backwards compatibility)
apiRouter.use('/assessments', assessmentRouter);
apiRouter.use('/coach', coachingRouter);

// Health check endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'DriveWell API is running',
    timestamp: new Date().toISOString()
  });
});
