import { Request, Response, NextFunction } from 'express';
import { DrivingDataInput } from '../models/driving-data.model';
import { RiskAssessmentService } from '../services/risk-assessment.service';

export class AssessmentController {
  private riskAssessmentService: RiskAssessmentService;

  constructor() {
    this.riskAssessmentService = new RiskAssessmentService();
  }

  createAssessment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drivingData: DrivingDataInput = req.body;

      // Generate profile
      const profile = await this.riskAssessmentService.assessDriver(drivingData);

      res.status(201).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };

  getLatestAssessment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Legacy endpoint - functionality moved to /api/v1/customer/profile
      return res.status(501).json({
        success: false,
        error: { message: 'Questo endpoint e stato deprecato. Usa /api/v1/customer/profile per i clienti autenticati.' }
      });
    } catch (error) {
      next(error);
    }
  };

  getAssessmentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Legacy endpoint - functionality moved to authenticated endpoints
      return res.status(501).json({
        success: false,
        error: { message: 'Questo endpoint e stato deprecato. Usa le API autenticate.' }
      });
    } catch (error) {
      next(error);
    }
  };

  getTrends = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Legacy endpoint - functionality moved to authenticated endpoints
      return res.status(501).json({
        success: false,
        error: { message: 'Questo endpoint e stato deprecato. Usa le API autenticate.' }
      });
    } catch (error) {
      next(error);
    }
  };

  simulateChanges = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { baseDriverData, modifications } = req.body;

      if (!baseDriverData || !modifications) {
        return res.status(400).json({
          success: false,
          error: { message: 'baseDriverData and modifications are required' }
        });
      }

      // Assess current state
      const currentProfile = await this.riskAssessmentService.assessDriver(baseDriverData);

      // Create modified data
      const modifiedData: DrivingDataInput = {
        ...baseDriverData,
        parameters: {
          ...baseDriverData.parameters,
          ...modifications
        }
      };

      // Assess modified state
      const simulatedProfile = await this.riskAssessmentService.assessDriver(modifiedData);

      res.status(200).json({
        success: true,
        data: {
          current: currentProfile,
          simulated: simulatedProfile,
          diff: {
            scoreChange: simulatedProfile.overallScore - currentProfile.overallScore,
            premiumChange: simulatedProfile.premiumModifier - currentProfile.premiumModifier,
            gradeChange: `${currentProfile.overallGrade} -> ${simulatedProfile.overallGrade}`,
            riskChange: `${currentProfile.riskLevel} -> ${simulatedProfile.riskLevel}`
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
