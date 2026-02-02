import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';

export const customerRouter = Router();
const controller = new CustomerController();

/**
 * GET /api/v1/customer/info
 * Get current customer info
 */
customerRouter.get('/info', controller.getMyInfo);

/**
 * GET /api/v1/customer/profile
 * Get current customer's driving profile
 */
customerRouter.get('/profile', controller.getMyProfile);

/**
 * POST /api/v1/customer/coach/chat
 * Send a message to AI Coach
 */
customerRouter.post('/coach/chat', controller.chat);

/**
 * GET /api/v1/customer/coach/sessions
 * Get coaching sessions
 */
customerRouter.get('/coach/sessions', controller.getCoachingSessions);
