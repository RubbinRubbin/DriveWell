import { Router } from 'express';
import { CompanyController } from '../controllers/company.controller';

export const companyRouter = Router();
const controller = new CompanyController();

/**
 * GET /api/v1/company/statistics
 * Get dashboard statistics
 */
companyRouter.get('/statistics', controller.getStatistics);

/**
 * GET /api/v1/company/customers
 * Get all customers
 */
companyRouter.get('/customers', controller.getCustomers);

/**
 * GET /api/v1/company/customers/:id
 * Get a single customer by ID
 */
companyRouter.get('/customers/:id', controller.getCustomerById);

/**
 * PUT /api/v1/company/customers/:id
 * Update a customer
 */
companyRouter.put('/customers/:id', controller.updateCustomer);

/**
 * DELETE /api/v1/company/customers/:id
 * Delete (soft) a customer
 */
companyRouter.delete('/customers/:id', controller.deleteCustomer);

/**
 * GET /api/v1/company/customers/:id/profile
 * Get customer's driving profile
 */
companyRouter.get('/customers/:id/profile', controller.getCustomerProfile);

/**
 * GET /api/v1/company/customers/:id/driving-data
 * Get customer's driving data parameters
 */
companyRouter.get('/customers/:id/driving-data', controller.getDrivingData);

/**
 * POST /api/v1/company/customers/:id/driving-data
 * Submit driving data for a customer and calculate profile
 */
companyRouter.post('/customers/:id/driving-data', controller.submitDrivingData);
