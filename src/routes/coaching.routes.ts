import { Router } from 'express';
import { CoachingController } from '../controllers/coaching.controller';

export const coachingRouter = Router();
const controller = new CoachingController();

/**
 * POST /api/v1/coach/chat
 * Send a message to the AI coach
 */
coachingRouter.post('/chat', controller.chat);

/**
 * GET /api/v1/coach/sessions/:driverId/active
 * Get or create active coaching session for a driver
 */
coachingRouter.get('/sessions/:driverId/active', controller.getActiveSession);

/**
 * GET /api/v1/coach/sessions/:sessionId/history
 * Get conversation history for a session
 */
coachingRouter.get('/sessions/:sessionId/history', controller.getSessionHistory);

/**
 * GET /api/v1/coach/test
 * Test OpenAI connection
 */
coachingRouter.get('/test', controller.testConnection);
