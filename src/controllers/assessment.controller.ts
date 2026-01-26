import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { DrivingDataInput } from '../models/driving-data.model';
import { RiskAssessmentService } from '../services/risk-assessment.service';
import { AssessmentRepositoryService } from '../services/database/assessment-repository.service';

export class AssessmentController {
  private riskAssessmentService: RiskAssessmentService;
  private assessmentRepository: AssessmentRepositoryService;

  constructor(prisma: PrismaClient) {
    this.riskAssessmentService = new RiskAssessmentService();
    this.assessmentRepository = new AssessmentRepositoryService(prisma);
  }

  createAssessment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const drivingData: DrivingDataInput = req.body;

      // Generate profile
      const profile = await this.riskAssessmentService.assessDriver(drivingData);

      // Save to database (disabled for now - database not configured)
      // await this.assessmentRepository.saveAssessment(profile);

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
      const { driverId } = req.params;

      const assessment = await this.assessmentRepository.getLatestAssessment(driverId);

      if (!assessment) {
        return res.status(404).json({
          success: false,
          error: { message: `No assessments found for driver ${driverId}` }
        });
      }

      // Convert to DriverProfile format
      const profile = this.assessmentRepository.convertToDriverProfile(assessment);

      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      next(error);
    }
  };

  getAssessmentHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId } = req.params;
      const limit = parseInt(req.query.limit as string) || 10;
      const offset = parseInt(req.query.offset as string) || 0;

      const assessments = await this.assessmentRepository.getDriverHistory(
        driverId,
        limit,
        offset
      );

      const total = await this.assessmentRepository.getAssessmentCount(driverId);

      // Convert assessments to DriverProfile format
      const profiles = assessments.map(assessment =>
        this.assessmentRepository.convertToDriverProfile(assessment)
      );

      res.status(200).json({
        success: true,
        data: {
          assessments: profiles,
          pagination: {
            total,
            limit,
            offset,
            hasMore: offset + limit < total
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  getTrends = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId } = req.params;
      const limit = parseInt(req.query.limit as string) || 20;

      const assessments = await this.assessmentRepository.getDriverHistory(driverId, limit);

      if (assessments.length === 0) {
        return res.status(404).json({
          success: false,
          error: { message: `No assessments found for driver ${driverId}` }
        });
      }

      // Extract trend data
      const scoreOverTime = assessments.reverse().map(a => ({
        date: a.timestamp.toISOString(),
        score: Number(a.overallScore),
        grade: a.overallGrade
      }));

      // Extract parameter trends from JSONB
      const parameterTrends: any = {};

      // For now, just return the score trend
      // Pattern analysis service will provide more detailed trends

      res.status(200).json({
        success: true,
        data: {
          scoreOverTime,
          parameterTrends
        }
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
