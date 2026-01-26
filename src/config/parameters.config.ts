import { ParameterDefinition, ParameterType, ScoringDirection } from '../models/parameter.model';

export const PARAMETER_DEFINITIONS: ParameterDefinition[] = [
  // SAFETY PARAMETERS
  {
    id: 'harsh_braking',
    name: 'Harsh Braking Events',
    description: 'Number of sudden braking events per 100km',
    type: ParameterType.FREQUENCY,
    unit: 'events/100km',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 0.5,  // <= 0.5 events/100km = excellent
      good: 1.5,
      fair: 3.0,
      poor: 5.0        // > 5.0 = poor
    },
    weight: 0.30 // 30% of safety score
  },
  {
    id: 'harsh_acceleration',
    name: 'Harsh Acceleration Events',
    description: 'Number of aggressive acceleration events per 100km',
    type: ParameterType.FREQUENCY,
    unit: 'events/100km',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 1.0,
      good: 2.5,
      fair: 4.0,
      poor: 6.0
    },
    weight: 0.25
  },
  {
    id: 'speeding_violations',
    name: 'Speeding Violations',
    description: 'Speed limit violations per 100km',
    type: ParameterType.FREQUENCY,
    unit: 'events/100km',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 0.2,
      good: 1.0,
      fair: 2.5,
      poor: 5.0
    },
    weight: 0.35
  },
  {
    id: 'speeding_magnitude',
    name: 'Average Speeding Magnitude',
    description: 'Average km/h over limit when speeding',
    type: ParameterType.NUMERIC,
    unit: 'km/h',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 3,
      good: 8,
      fair: 15,
      poor: 25
    },
    weight: 0.10
  },

  // EFFICIENCY PARAMETERS
  {
    id: 'smooth_acceleration',
    name: 'Smooth Acceleration',
    description: 'Percentage of smooth acceleration events',
    type: ParameterType.PERCENTAGE,
    unit: '%',
    scoringDirection: ScoringDirection.HIGHER_IS_BETTER,
    thresholds: {
      excellent: 90,  // >= 90% = excellent
      good: 80,
      fair: 70,
      poor: 60        // < 60% = poor
    },
    weight: 0.30
  },
  {
    id: 'idling_time',
    name: 'Idling Time',
    description: 'Percentage of time spent idling',
    type: ParameterType.PERCENTAGE,
    unit: '%',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 3,
      good: 7,
      fair: 12,
      poor: 20
    },
    weight: 0.20
  },
  {
    id: 'optimal_gear_usage',
    name: 'Optimal Gear Usage',
    description: 'Percentage of time in optimal gear',
    type: ParameterType.PERCENTAGE,
    unit: '%',
    scoringDirection: ScoringDirection.HIGHER_IS_BETTER,
    thresholds: {
      excellent: 85,
      good: 75,
      fair: 65,
      poor: 55
    },
    weight: 0.25
  },
  {
    id: 'fuel_efficiency',
    name: 'Fuel Efficiency',
    description: 'Overall fuel efficiency score',
    type: ParameterType.NUMERIC,
    unit: 'score',
    scoringDirection: ScoringDirection.HIGHER_IS_BETTER,
    thresholds: {
      excellent: 85,
      good: 70,
      fair: 55,
      poor: 40
    },
    weight: 0.25
  },

  // BEHAVIOR PARAMETERS
  {
    id: 'night_driving',
    name: 'Night Driving',
    description: 'Percentage of driving at night (10pm-5am)',
    type: ParameterType.PERCENTAGE,
    unit: '%',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 5,
      good: 15,
      fair: 25,
      poor: 40
    },
    weight: 0.25
  },
  {
    id: 'weekend_driving',
    name: 'Weekend Driving',
    description: 'Percentage of driving on weekends',
    type: ParameterType.PERCENTAGE,
    unit: '%',
    scoringDirection: ScoringDirection.OPTIMAL_RANGE,
    optimalRange: {
      min: 20,
      max: 40
    },
    thresholds: {
      excellent: 30, // 20-40% range
      good: 50,      // 10-50% or 40-60%
      fair: 70,      // 0-70% or 70-100%
      poor: 100
    },
    weight: 0.15
  },
  {
    id: 'phone_usage',
    name: 'Phone Usage While Driving',
    description: 'Detected phone usage events per 100km',
    type: ParameterType.FREQUENCY,
    unit: 'events/100km',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 0.1,
      good: 0.5,
      fair: 1.5,
      poor: 3.0
    },
    weight: 0.35
  },
  {
    id: 'fatigue_indicators',
    name: 'Fatigue Indicators',
    description: 'Signs of fatigue per 100km',
    type: ParameterType.FREQUENCY,
    unit: 'events/100km',
    scoringDirection: ScoringDirection.LOWER_IS_BETTER,
    thresholds: {
      excellent: 0.2,
      good: 0.8,
      fair: 1.5,
      poor: 3.0
    },
    weight: 0.25
  },

  // EXPERIENCE PARAMETERS
  {
    id: 'total_mileage',
    name: 'Total Mileage Driven',
    description: 'Lifetime mileage driven',
    type: ParameterType.NUMERIC,
    unit: 'km',
    scoringDirection: ScoringDirection.HIGHER_IS_BETTER,
    thresholds: {
      excellent: 100000,
      good: 50000,
      fair: 20000,
      poor: 5000
    },
    weight: 0.40
  },
  {
    id: 'years_license',
    name: 'Years Holding License',
    description: 'Years since obtaining driving license',
    type: ParameterType.NUMERIC,
    unit: 'years',
    scoringDirection: ScoringDirection.HIGHER_IS_BETTER,
    thresholds: {
      excellent: 10,
      good: 5,
      fair: 3,
      poor: 1
    },
    weight: 0.35
  },
  {
    id: 'route_variety',
    name: 'Route Variety',
    description: 'Variety of routes driven (higher = more varied)',
    type: ParameterType.NUMERIC,
    unit: 'score',
    scoringDirection: ScoringDirection.HIGHER_IS_BETTER,
    thresholds: {
      excellent: 80,
      good: 60,
      fair: 40,
      poor: 20
    },
    weight: 0.25
  }
];
