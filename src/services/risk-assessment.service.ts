import { DrivingDataInput } from '../models/driving-data.model';
import { DriverProfile } from '../models/driver-profile.model';
import { ParameterDefinition } from '../models/parameter.model';
import { CompetencyArea } from '../models/competency-area.model';
import { RecommendationRule } from '../models/recommendation.model';
import { ParameterScoringService } from './parameter-scoring.service';
import { AreaScoringService } from './area-scoring.service';
import { ProfileScoringService } from './profile-scoring.service';
import { RecommendationService } from './recommendation.service';
import { PARAMETER_DEFINITIONS } from '../config/parameters.config';
import { COMPETENCY_AREAS } from '../config/competency-areas.config';
import { RECOMMENDATION_RULES } from '../config/recommendations.config';

export class RiskAssessmentService {
  private parameterScoringService: ParameterScoringService;
  private areaScoringService: AreaScoringService;
  private profileScoringService: ProfileScoringService;
  private recommendationService: RecommendationService;
  private parameterDefinitions: Map<string, ParameterDefinition>;
  private competencyAreas: CompetencyArea[];
  private recommendationRules: RecommendationRule[];

  constructor() {
    this.parameterScoringService = new ParameterScoringService();
    this.areaScoringService = new AreaScoringService(this.parameterScoringService);
    this.profileScoringService = new ProfileScoringService(this.areaScoringService);
    this.recommendationService = new RecommendationService();

    // Load configurations
    this.parameterDefinitions = new Map(
      PARAMETER_DEFINITIONS.map((def) => [def.id, def])
    );
    this.competencyAreas = COMPETENCY_AREAS;
    this.recommendationRules = RECOMMENDATION_RULES;
  }

  /**
   * Main method to assess a driver based on driving data
   * Returns complete driver profile with score, grade, risk level, and recommendations
   */
  async assessDriver(drivingData: DrivingDataInput): Promise<DriverProfile> {
    // Calculate driver profile (score, grade, risk level)
    const profile = this.profileScoringService.calculateDriverProfile(
      drivingData,
      this.competencyAreas,
      this.parameterDefinitions
    );

    // Extract parameter values for recommendation generation
    const parameterValues = this.extractParameterValues(drivingData.parameters);

    // Generate recommendations
    const recommendations = this.recommendationService.generateRecommendations(
      parameterValues,
      profile.competencyScores,
      this.recommendationRules
    );

    // Add recommendations to profile
    profile.recommendations = recommendations;

    return profile;
  }

  private extractParameterValues(params: any): Map<string, number> {
    const map = new Map<string, number>();

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
}
