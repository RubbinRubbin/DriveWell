import { supabaseAdmin } from '../../config/supabase.config';
import { DriverProfile } from '../../models/driver-profile.model';
import { DrivingDataInput } from '../../models/driving-data.model';

export interface DriverProfileDB {
  id: string;
  customerId: string;
  analysisStartDate: string | null;
  analysisEndDate: string | null;
  totalDistanceKm: number | null;
  totalDrivingHours: number | null;
  overallScore: number | null;
  overallGrade: string | null;
  riskLevel: string | null;
  premiumModifier: number | null;
  harshBrakingPer100km: number | null;
  harshAccelerationPer100km: number | null;
  speedingViolationsPer100km: number | null;
  speedingMagnitudeKmh: number | null;
  smoothAccelerationPercentage: number | null;
  idlingTimePercentage: number | null;
  optimalGearUsagePercentage: number | null;
  fuelEfficiencyScore: number | null;
  nightDrivingPercentage: number | null;
  weekendDrivingPercentage: number | null;
  phoneUsagePer100km: number | null;
  fatigueIndicatorsPer100km: number | null;
  totalMileageDriven: number | null;
  yearsHoldingLicense: number | null;
  routeVarietyScore: number | null;
  competencyScores: any[];
  recommendations: any[];
  createdAt: string;
  updatedAt: string;
}

export class DriverProfileRepository {
  // Get profile by customer ID
  async getByCustomerId(customerId: string): Promise<DriverProfileDB | null> {
    const { data, error } = await supabaseAdmin
      .from('driver_profiles')
      .select('*')
      .eq('customer_id', customerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Errore nel recupero del profilo: ${error.message}`);
    }

    return this.mapProfile(data);
  }

  // Create or update profile
  async upsertProfile(customerId: string, profile: DriverProfile, drivingData: DrivingDataInput): Promise<DriverProfileDB> {
    const profileData = {
      customer_id: customerId,
      analysis_start_date: drivingData.analysisWindow.startDate,
      analysis_end_date: drivingData.analysisWindow.endDate,
      total_distance_km: drivingData.analysisWindow.totalDistanceKm,
      total_driving_hours: drivingData.analysisWindow.totalDrivingHours,
      overall_score: profile.overallScore,
      overall_grade: profile.overallGrade,
      risk_level: profile.riskLevel,
      premium_modifier: profile.premiumModifier,
      harsh_braking_per_100km: drivingData.parameters.harshBrakingEventsPerHundredKm,
      harsh_acceleration_per_100km: drivingData.parameters.harshAccelerationEventsPerHundredKm,
      speeding_violations_per_100km: drivingData.parameters.speedingViolationsPerHundredKm,
      speeding_magnitude_kmh: drivingData.parameters.averageSpeedingMagnitudeKmh,
      smooth_acceleration_percentage: drivingData.parameters.smoothAccelerationPercentage,
      idling_time_percentage: drivingData.parameters.idlingTimePercentage,
      optimal_gear_usage_percentage: drivingData.parameters.optimalGearUsagePercentage,
      fuel_efficiency_score: drivingData.parameters.fuelEfficiencyScore,
      night_driving_percentage: drivingData.parameters.nightDrivingPercentage,
      weekend_driving_percentage: drivingData.parameters.weekendDrivingPercentage,
      phone_usage_per_100km: drivingData.parameters.phoneUsageEventsPerHundredKm,
      fatigue_indicators_per_100km: drivingData.parameters.fatigueIndicatorsPerHundredKm,
      total_mileage_driven: drivingData.parameters.totalMileageDriven,
      years_holding_license: drivingData.parameters.yearsHoldingLicense,
      route_variety_score: drivingData.parameters.routeVarietyScore,
      competency_scores: profile.competencyScores,
      recommendations: profile.recommendations
    };

    const { data, error } = await supabaseAdmin
      .from('driver_profiles')
      .upsert(profileData, { onConflict: 'customer_id' })
      .select()
      .single();

    if (error) {
      throw new Error(`Errore nel salvataggio del profilo: ${error.message}`);
    }

    return this.mapProfile(data);
  }

  // Convert DB profile to DriverProfile model
  toDriverProfile(dbProfile: DriverProfileDB): DriverProfile {
    return {
      driverId: dbProfile.customerId,
      timestamp: dbProfile.updatedAt,
      analysisWindow: {
        startDate: dbProfile.analysisStartDate || new Date().toISOString(),
        endDate: dbProfile.analysisEndDate || new Date().toISOString(),
        totalDistanceKm: dbProfile.totalDistanceKm || 0,
        totalDrivingHours: dbProfile.totalDrivingHours || 0
      },
      overallScore: dbProfile.overallScore || 0,
      overallGrade: (dbProfile.overallGrade as 'A' | 'B' | 'C' | 'D' | 'F') || 'F',
      riskLevel: (dbProfile.riskLevel as any) || 'high',
      competencyScores: dbProfile.competencyScores || [],
      recommendations: dbProfile.recommendations || [],
      premiumModifier: dbProfile.premiumModifier || 1.0
    };
  }

  // Convert DB profile to DrivingDataInput
  toDrivingDataInput(dbProfile: DriverProfileDB): DrivingDataInput {
    return {
      driverId: dbProfile.customerId,
      analysisWindow: {
        startDate: dbProfile.analysisStartDate || new Date().toISOString(),
        endDate: dbProfile.analysisEndDate || new Date().toISOString(),
        totalDistanceKm: dbProfile.totalDistanceKm || 0,
        totalDrivingHours: dbProfile.totalDrivingHours || 0
      },
      parameters: {
        harshBrakingEventsPerHundredKm: dbProfile.harshBrakingPer100km || 0,
        harshAccelerationEventsPerHundredKm: dbProfile.harshAccelerationPer100km || 0,
        speedingViolationsPerHundredKm: dbProfile.speedingViolationsPer100km || 0,
        averageSpeedingMagnitudeKmh: dbProfile.speedingMagnitudeKmh || 0,
        smoothAccelerationPercentage: dbProfile.smoothAccelerationPercentage || 0,
        idlingTimePercentage: dbProfile.idlingTimePercentage || 0,
        optimalGearUsagePercentage: dbProfile.optimalGearUsagePercentage || 0,
        fuelEfficiencyScore: dbProfile.fuelEfficiencyScore || 0,
        nightDrivingPercentage: dbProfile.nightDrivingPercentage || 0,
        weekendDrivingPercentage: dbProfile.weekendDrivingPercentage || 0,
        phoneUsageEventsPerHundredKm: dbProfile.phoneUsagePer100km || 0,
        fatigueIndicatorsPerHundredKm: dbProfile.fatigueIndicatorsPer100km || 0,
        totalMileageDriven: dbProfile.totalMileageDriven || 0,
        yearsHoldingLicense: dbProfile.yearsHoldingLicense || 0,
        routeVarietyScore: dbProfile.routeVarietyScore || 0
      }
    };
  }

  private mapProfile(row: any): DriverProfileDB {
    return {
      id: row.id,
      customerId: row.customer_id,
      analysisStartDate: row.analysis_start_date,
      analysisEndDate: row.analysis_end_date,
      totalDistanceKm: row.total_distance_km,
      totalDrivingHours: row.total_driving_hours,
      overallScore: row.overall_score,
      overallGrade: row.overall_grade,
      riskLevel: row.risk_level,
      premiumModifier: row.premium_modifier,
      harshBrakingPer100km: row.harsh_braking_per_100km,
      harshAccelerationPer100km: row.harsh_acceleration_per_100km,
      speedingViolationsPer100km: row.speeding_violations_per_100km,
      speedingMagnitudeKmh: row.speeding_magnitude_kmh,
      smoothAccelerationPercentage: row.smooth_acceleration_percentage,
      idlingTimePercentage: row.idling_time_percentage,
      optimalGearUsagePercentage: row.optimal_gear_usage_percentage,
      fuelEfficiencyScore: row.fuel_efficiency_score,
      nightDrivingPercentage: row.night_driving_percentage,
      weekendDrivingPercentage: row.weekend_driving_percentage,
      phoneUsagePer100km: row.phone_usage_per_100km,
      fatigueIndicatorsPer100km: row.fatigue_indicators_per_100km,
      totalMileageDriven: row.total_mileage_driven,
      yearsHoldingLicense: row.years_holding_license,
      routeVarietyScore: row.route_variety_score,
      competencyScores: row.competency_scores || [],
      recommendations: row.recommendations || [],
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}
