import { Response, NextFunction } from 'express';
import { CompanyUserRequest } from '../middleware/role.middleware';
import { CustomerRepository, UpdateCustomerDTO } from '../services/database/customer.repository';
import { DriverProfileRepository } from '../services/database/driver-profile.repository';
import { RiskAssessmentService } from '../services/risk-assessment.service';
import { DrivingDataInput } from '../models/driving-data.model';

export class CompanyController {
  private customerRepository: CustomerRepository;
  private driverProfileRepository: DriverProfileRepository;
  private riskAssessmentService: RiskAssessmentService;

  constructor() {
    this.customerRepository = new CustomerRepository();
    this.driverProfileRepository = new DriverProfileRepository();
    this.riskAssessmentService = new RiskAssessmentService();
  }

  // GET /api/v1/company/customers
  getCustomers = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const customers = await this.customerRepository.getAllCustomers();

      res.status(200).json({
        success: true,
        data: customers
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/company/customers/:id
  getCustomerById = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const customer = await this.customerRepository.getCustomerById(id);

      if (!customer) {
        return res.status(404).json({
          success: false,
          error: { message: 'Cliente non trovato' }
        });
      }

      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/v1/company/customers/:id
  updateCustomer = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const dto: UpdateCustomerDTO = req.body;

      const customer = await this.customerRepository.updateCustomer(id, dto);

      res.status(200).json({
        success: true,
        data: customer
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/v1/company/customers/:id
  deleteCustomer = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      await this.customerRepository.deleteCustomer(id);

      res.status(200).json({
        success: true,
        data: { message: 'Cliente eliminato con successo' }
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/company/statistics
  getStatistics = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const stats = await this.customerRepository.getStatistics();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/company/customers/:id/profile
  getCustomerProfile = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;

      const dbProfile = await this.driverProfileRepository.getByCustomerId(id);

      if (!dbProfile) {
        return res.status(404).json({
          success: false,
          error: { message: 'Profilo di guida non disponibile per questo cliente' }
        });
      }

      const profile = this.driverProfileRepository.toDriverProfile(dbProfile);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/company/customers/:id/driving-data
  submitDrivingData = async (req: CompanyUserRequest, res: Response, next: NextFunction) => {
    try {
      const { id: customerId } = req.params;
      const drivingData: DrivingDataInput = {
        ...req.body,
        driverId: customerId
      };

      // Validate customer exists
      const customer = await this.customerRepository.getCustomerById(customerId);
      if (!customer) {
        return res.status(404).json({
          success: false,
          error: { message: 'Cliente non trovato' }
        });
      }

      // Calculate profile
      const profile = await this.riskAssessmentService.assessDriver(drivingData);

      // Save to database
      await this.driverProfileRepository.upsertProfile(customerId, profile, drivingData);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };
}
