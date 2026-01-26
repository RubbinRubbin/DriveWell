import { CompetencyArea, CompetencyAreaId } from '../models/competency-area.model';

export const COMPETENCY_AREAS: CompetencyArea[] = [
  {
    id: CompetencyAreaId.SAFETY,
    name: 'Safety',
    description: 'Measures safe driving practices and risk avoidance',
    weight: 0.40, // 40% of overall score
    parameterIds: [
      'harsh_braking',
      'harsh_acceleration',
      'speeding_violations',
      'speeding_magnitude'
    ]
  },
  {
    id: CompetencyAreaId.EFFICIENCY,
    name: 'Efficiency',
    description: 'Measures fuel efficiency and optimal vehicle usage',
    weight: 0.20, // 20% of overall score
    parameterIds: [
      'smooth_acceleration',
      'idling_time',
      'optimal_gear_usage',
      'fuel_efficiency'
    ]
  },
  {
    id: CompetencyAreaId.BEHAVIOR,
    name: 'Behavior',
    description: 'Measures driving habits and patterns',
    weight: 0.25, // 25% of overall score
    parameterIds: [
      'night_driving',
      'weekend_driving',
      'phone_usage',
      'fatigue_indicators'
    ]
  },
  {
    id: CompetencyAreaId.EXPERIENCE,
    name: 'Experience',
    description: 'Measures driving experience and exposure',
    weight: 0.15, // 15% of overall score
    parameterIds: [
      'total_mileage',
      'years_license',
      'route_variety'
    ]
  }
];
