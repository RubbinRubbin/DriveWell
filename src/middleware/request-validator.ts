import { Request, Response, NextFunction } from 'express';
import { DrivingDataInput } from '../models/driving-data.model';

export const validateDrivingData = (req: Request, res: Response, next: NextFunction) => {
  const data = req.body as DrivingDataInput;

  if (!data.driverId) {
    return res.status(400).json({
      success: false,
      error: { message: 'driverId is required' }
    });
  }

  if (!data.analysisWindow) {
    return res.status(400).json({
      success: false,
      error: { message: 'analysisWindow is required' }
    });
  }

  if (!data.parameters) {
    return res.status(400).json({
      success: false,
      error: { message: 'parameters are required' }
    });
  }

  // Validate all required parameters exist
  const requiredParams = [
    'harshBrakingEventsPerHundredKm',
    'harshAccelerationEventsPerHundredKm',
    'speedingViolationsPerHundredKm',
    'averageSpeedingMagnitudeKmh',
    'smoothAccelerationPercentage',
    'idlingTimePercentage',
    'optimalGearUsagePercentage',
    'fuelEfficiencyScore',
    'nightDrivingPercentage',
    'weekendDrivingPercentage',
    'phoneUsageEventsPerHundredKm',
    'fatigueIndicatorsPerHundredKm',
    'totalMileageDriven',
    'yearsHoldingLicense',
    'routeVarietyScore'
  ];

  for (const param of requiredParams) {
    if (data.parameters[param as keyof typeof data.parameters] === undefined) {
      return res.status(400).json({
        success: false,
        error: { message: `Parameter ${param} is required` }
      });
    }
  }

  next();
};
