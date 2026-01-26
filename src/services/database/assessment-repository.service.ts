import { PrismaClient, Assessment } from '@prisma/client';
import { DriverProfile } from '../../models/driver-profile.model';

/**
 * Assessment Repository Service
 * Handles all database operations for driver assessments
 */
export class AssessmentRepositoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Save a new assessment to the database
   */
  async saveAssessment(driverProfile: DriverProfile): Promise<Assessment> {
    // Ensure driver exists
    await this.prisma.driver.upsert({
      where: { id: driverProfile.driverId },
      update: { updatedAt: new Date() },
      create: { id: driverProfile.driverId }
    });

    // Create assessment record
    const assessment = await this.prisma.assessment.create({
      data: {
        driverId: driverProfile.driverId,
        timestamp: new Date(),
        startDate: new Date(driverProfile.analysisWindow.startDate),
        endDate: new Date(driverProfile.analysisWindow.endDate),
        totalDistanceKm: driverProfile.analysisWindow.totalDistanceKm,
        totalDrivingHours: driverProfile.analysisWindow.totalDrivingHours,
        overallScore: driverProfile.overallScore,
        overallGrade: driverProfile.overallGrade,
        riskLevel: driverProfile.riskLevel,
        premiumModifier: driverProfile.premiumModifier,
        parameters: {}, // Empty for now - would store raw parameters in production
        competencyScores: driverProfile.competencyScores as any, // Store competency scores as JSON
        recommendations: driverProfile.recommendations as any // Store recommendations as JSON
      }
    });

    return assessment;
  }

  /**
   * Get the latest assessment for a driver
   */
  async getLatestAssessment(driverId: string): Promise<Assessment | null> {
    const assessment = await this.prisma.assessment.findFirst({
      where: { driverId },
      orderBy: { timestamp: 'desc' }
    });

    return assessment;
  }

  /**
   * Get assessment history for a driver with pagination
   */
  async getDriverHistory(
    driverId: string,
    limit: number = 10,
    offset: number = 0
  ): Promise<Assessment[]> {
    const assessments = await this.prisma.assessment.findMany({
      where: { driverId },
      orderBy: { timestamp: 'desc' },
      take: limit,
      skip: offset
    });

    return assessments;
  }

  /**
   * Get assessments within a date range
   */
  async getAssessmentsByDateRange(
    driverId: string,
    startDate: Date,
    endDate: Date
  ): Promise<Assessment[]> {
    const assessments = await this.prisma.assessment.findMany({
      where: {
        driverId,
        startDate: { gte: startDate },
        endDate: { lte: endDate }
      },
      orderBy: { timestamp: 'desc' }
    });

    return assessments;
  }

  /**
   * Get total count of assessments for a driver
   */
  async getAssessmentCount(driverId: string): Promise<number> {
    const count = await this.prisma.assessment.count({
      where: { driverId }
    });

    return count;
  }

  /**
   * Get assessment by ID
   */
  async getAssessmentById(id: string): Promise<Assessment | null> {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id }
    });

    return assessment;
  }

  /**
   * Convert Assessment (database model) to DriverProfile (application model)
   */
  convertToDriverProfile(assessment: Assessment): DriverProfile {
    return {
      driverId: assessment.driverId,
      timestamp: assessment.timestamp.toISOString(),
      analysisWindow: {
        startDate: assessment.startDate.toISOString(),
        endDate: assessment.endDate.toISOString(),
        totalDistanceKm: Number(assessment.totalDistanceKm),
        totalDrivingHours: Number(assessment.totalDrivingHours)
      },
      overallScore: Number(assessment.overallScore),
      overallGrade: assessment.overallGrade as 'A' | 'B' | 'C' | 'D' | 'F',
      riskLevel: assessment.riskLevel as 'very-low' | 'low' | 'moderate' | 'high' | 'very-high',
      premiumModifier: Number(assessment.premiumModifier),
      competencyScores: assessment.competencyScores as any,
      recommendations: assessment.recommendations as any
    };
  }
}
