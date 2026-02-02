import { Response, NextFunction } from 'express';
import { CustomerRequest } from '../middleware/role.middleware';
import { DriverProfileRepository } from '../services/database/driver-profile.repository';
import { AICoachService } from '../services/ai/ai-coach.service';

export class CustomerController {
  private driverProfileRepository: DriverProfileRepository;
  private aiCoachService: AICoachService;

  constructor() {
    this.driverProfileRepository = new DriverProfileRepository();
    this.aiCoachService = new AICoachService();
  }

  // GET /api/v1/customer/profile
  getMyProfile = async (req: CustomerRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.customer) {
        return res.status(401).json({
          success: false,
          error: { message: 'Cliente non autenticato' }
        });
      }

      const dbProfile = await this.driverProfileRepository.getByCustomerId(req.customer.id);

      if (!dbProfile) {
        return res.status(200).json({
          success: true,
          data: {
            hasProfile: false,
            message: 'Profilo di guida non ancora disponibile. Contatta la tua azienda per l\'inserimento dei dati.'
          }
        });
      }

      const profile = this.driverProfileRepository.toDriverProfile(dbProfile);

      res.status(200).json({
        success: true,
        data: {
          hasProfile: true,
          profile
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/customer/info
  getMyInfo = async (req: CustomerRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.customer) {
        return res.status(401).json({
          success: false,
          error: { message: 'Cliente non autenticato' }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          id: req.customer.id,
          email: req.customer.email,
          fullName: req.customer.fullName,
          phone: req.customer.phone,
          driverLicenseNumber: req.customer.driverLicenseNumber,
          driverLicenseYears: req.customer.driverLicenseYears
        }
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/v1/customer/coach/chat
  chat = async (req: CustomerRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.customer) {
        return res.status(401).json({
          success: false,
          error: { message: 'Cliente non autenticato' }
        });
      }

      const { message, sessionId } = req.body;

      if (!message || typeof message !== 'string') {
        return res.status(400).json({
          success: false,
          error: { message: 'Messaggio richiesto' }
        });
      }

      // Get customer's driving profile for context
      const dbProfile = await this.driverProfileRepository.getByCustomerId(req.customer.id);
      const driverProfile = dbProfile
        ? this.driverProfileRepository.toDriverProfile(dbProfile)
        : undefined;

      // Process chat message
      const response = await this.aiCoachService.generateCoachingResponse(
        req.customer.id,
        message,
        sessionId,
        driverProfile
      );

      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/v1/customer/coach/sessions
  getCoachingSessions = async (req: CustomerRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.customer) {
        return res.status(401).json({
          success: false,
          error: { message: 'Cliente non autenticato' }
        });
      }

      // Get customer's driving profile for context
      const dbProfile = await this.driverProfileRepository.getByCustomerId(req.customer.id);
      const driverProfile = dbProfile
        ? this.driverProfileRepository.toDriverProfile(dbProfile)
        : undefined;

      // Get active session
      const sessionId = this.aiCoachService.getActiveSession(req.customer.id, driverProfile);
      const history = this.aiCoachService.getSessionHistory(sessionId);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          history
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
