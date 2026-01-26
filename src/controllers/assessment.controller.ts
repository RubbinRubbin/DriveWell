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

  // Placeholder for future implementation
  getLatestAssessment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId } = req.params;

      // TODO: Implement database retrieval
      res.status(200).json({
        success: true,
        message: 'Not implemented yet - database layer needed',
        driverId
      });
    } catch (error) {
      next(error);
    }
  };

  // Placeholder for future implementation
  getAssessmentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      // TODO: Implement database retrieval
      res.status(200).json({
        success: true,
        message: 'Not implemented yet - database layer needed',
        driverId,
        limit,
        offset
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
            gradeChange: `${currentProfile.overallGrade} → ${simulatedProfile.overallGrade}`,
            riskChange: `${currentProfile.riskLevel} → ${simulatedProfile.riskLevel}`
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
