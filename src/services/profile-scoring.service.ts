import { CompetencyArea, CompetencyAreaScore } from '../models/competency-area.model';
import { DrivingDataInput } from '../models/driving-data.model';
import { DriverProfile } from '../models/driver-profile.model';
import { ParameterDefinition } from '../models/parameter.model';
import { AreaScoringService } from './area-scoring.service';

export class ProfileScoringService {
  constructor(private areaScoringService: AreaScoringService) {}

  /**
   * Calculates overall driver profile from competency area scores
   */
  calculateDriverProfile(
    drivingData: DrivingDataInput,
    competencyAreas: CompetencyArea[],
    parameterDefinitions: Map<string, ParameterDefinition>
  ): DriverProfile {
    // Convert parameters to map
    const parameterValues = this.extractParameterValues(drivingData.parameters);

    // Score each competency area
    const competencyScores: CompetencyAreaScore[] = [];
    let totalWeight = 0;
    let weightedSum = 0;

    for (const area of competencyAreas) {
      const areaScore = this.areaScoringService.scoreCompetencyArea(
        area,
        parameterValues,
        parameterDefinitions
      );

      competencyScores.push(areaScore);
      totalWeight += area.weight;
      weightedSum += areaScore.score * area.weight;
    }

    // Calculate overall score as weighted average
    const overallScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return {
      driverId: drivingData.driverId,
      timestamp: new Date().toISOString(),
      analysisWindow: drivingData.analysisWindow,
      overallScore: Math.round(overallScore * 100) / 100,
      overallGrade: this.scoreToGrade(overallScore),
      riskLevel: this.scoreToRiskLevel(overallScore),
      competencyScores,
      recommendations: [], // Filled by recommendation service
      premiumModifier: this.scoreToPremiumModifier(overallScore)
    };
  }

  private extractParameterValues(params: any): Map<string, number> {
    const map = new Map<string, number>();

    // Map from camelCase to snake_case parameter IDs
    map.set('harsh_braking', params.harshBrakingEventsPerHundredKm);
    map.set('harsh_acceleration', params.harshAccelerationEventsPerHundredKm);
    map.set('speeding_violations', params.speedingViolationsPerHundredKm);
    map.set('speeding_magnitude', params.averageSpeedingMagnitudeKmh);

    map.set('smooth_acceleration', params.smoothAccelerationPercentage);
    map.set('idling_time', params.idlingTimePercentage);
    map.set('optimal_gear_usage', params.optimalGearUsagePercentage);
    map.set('fuel_efficiency', params.fuelEfficiencyScore);

    map.set('night_driving', params.nightDrivingPercentage);
    map.set('weekend_driving', params.weekendDrivingPercentage);
    map.set('phone_usage', params.phoneUsageEventsPerHundredKm);
    map.set('fatigue_indicators', params.fatigueIndicatorsPerHundredKm);

    map.set('total_mileage', params.totalMileageDriven);
    map.set('years_license', params.yearsHoldingLicense);
    map.set('route_variety', params.routeVarietyScore);

    return map;
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private scoreToRiskLevel(score: number): 'very-low' | 'low' | 'moderate' | 'high' | 'very-high' {
    if (score >= 85) return 'very-low';
    if (score >= 75) return 'low';
    if (score >= 60) return 'moderate';
    if (score >= 45) return 'high';
    return 'very-high';
  }

  private scoreToPremiumModifier(score: number): number {
    // Very-low risk: 20% discount (0.80)
    // Low risk: 10% discount (0.90)
    // Moderate risk: No change (1.00)
    // High risk: 25% increase (1.25)
    // Very-high risk: 50% increase (1.50)

    if (score >= 85) return 0.80;
    if (score >= 75) return 0.90;
    if (score >= 60) return 1.00;
    if (score >= 45) return 1.25;
    return 1.50;
  }
}
