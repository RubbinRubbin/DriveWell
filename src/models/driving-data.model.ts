export interface DrivingDataInput {
  driverId: string;
  analysisWindow: {
    startDate: string; // ISO 8601
    endDate: string;
    totalDistanceKm: number;
    totalDrivingHours: number;
  };
  parameters: {
    // Safety parameters
    harshBrakingEventsPerHundredKm: number;
    harshAccelerationEventsPerHundredKm: number;
    speedingViolationsPerHundredKm: number;
    averageSpeedingMagnitudeKmh: number;

    // Efficiency parameters
    smoothAccelerationPercentage: number;
    idlingTimePercentage: number;
    optimalGearUsagePercentage: number;
    fuelEfficiencyScore: number; // 0-100 proprietary score

    // Behavior parameters
    nightDrivingPercentage: number;
    weekendDrivingPercentage: number;
    phoneUsageEventsPerHundredKm: number;
    fatigueIndicatorsPerHundredKm: number;

    // Experience parameters
    totalMileageDriven: number;
    yearsHoldingLicense: number;
    routeVarietyScore: number; // 0-100, variety of routes
  };
}
