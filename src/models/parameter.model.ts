export enum ParameterType {
  NUMERIC = 'numeric',           // Raw numeric value
  PERCENTAGE = 'percentage',      // 0-100%
  FREQUENCY = 'frequency',        // Events per unit (e.g., per 100km)
  RATIO = 'ratio'                // Decimal ratio
}

export enum ScoringDirection {
  LOWER_IS_BETTER = 'lower_is_better',  // e.g., harsh braking events
  HIGHER_IS_BETTER = 'higher_is_better', // e.g., smooth acceleration %
  OPTIMAL_RANGE = 'optimal_range'        // e.g., speed consistency
}

export interface ParameterDefinition {
  id: string;
  name: string;
  description: string;
  type: ParameterType;
  unit: string;
  scoringDirection: ScoringDirection;
  optimalRange?: {
    min: number;
    max: number;
  };
  thresholds: {
    excellent: number;
    good: number;
    fair: number;
    poor: number;
  };
  weight: number; // Weight within its competency area (0-1)
}

export interface ParameterValue {
  parameterId: string;
  value: number;
  rawScore?: number; // 0-100 score for this parameter
}
