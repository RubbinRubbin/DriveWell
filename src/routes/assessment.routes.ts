import { Router } from 'express';
import { AssessmentController } from '../controllers/assessment.controller';
import { validateDrivingData } from '../middleware/request-validator';

export const assessmentRouter = Router();
const controller = new AssessmentController();

/**
 * POST /api/v1/assessments
 * Create a new risk assessment from driving data
 */
assessmentRouter.post('/', validateDrivingData, controller.createAssessment);

/**
 * GET /api/v1/assessments/:driverId/latest
 * Get latest assessment for a driver
 */
assessmentRouter.get('/:driverId/latest', controller.getLatestAssessment);

/**
 * GET /api/v1/assessments/:driverId/history
 * Get assessment history for a driver
 */
assessmentRouter.get('/:driverId/history', controller.getAssessmentHistory);

/**
 * POST /api/v1/assessments/simulate
 * Simulate how parameter changes would affect score
 */
assessmentRouter.post('/simulate', controller.simulateChanges);
