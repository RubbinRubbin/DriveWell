import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';

export const authRouter = Router();
const controller = new AuthController();

/**
 * POST /api/v1/auth/login
 * Login for company users and customers
 */
authRouter.post('/login', controller.login);

/**
 * POST /api/v1/auth/register/customer
 * Self-registration for customers
 */
authRouter.post('/register/customer', controller.registerCustomer);

/**
 * POST /api/v1/auth/logout
 * Logout current user
 */
authRouter.post('/logout', controller.logout);

/**
 * POST /api/v1/auth/refresh
 * Refresh access token
 */
authRouter.post('/refresh', controller.refreshToken);

/**
 * GET /api/v1/auth/me
 * Get current user info
 */
authRouter.get('/me', controller.getCurrentUser);
