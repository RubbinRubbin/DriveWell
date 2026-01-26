/**
 * Pattern Insight Models
 */

export type PatternType =
  | 'recurring_harsh_braking'
  | 'recurring_harsh_acceleration'
  | 'recurring_speeding'
  | 'recurring_phone_usage'
  | 'time_based_harsh_braking'
  | 'time_based_speeding'
  | 'location_based'
  | 'improvement_trend'
  | 'decline_trend'
  | 'anomaly';

export type PatternSeverity = 'critical' | 'high' | 'medium' | 'low';

export interface Pattern {
  id: string;
  driverId: string;
  patternType: PatternType;
  description: string;
  severity: PatternSeverity;
  frequency: number;
  context: Record<string, any>; // e.g., { location: "Via Roma", timeOfDay: "evening" }
  firstDetected: Date;
  lastDetected: Date;
  isActive: boolean;
  suggestion?: string; // Optional actionable suggestion
}

export interface PatternDetectionResult {
  patterns: Pattern[];
  analysisDate: Date;
  assessmentsAnalyzed: number;
}

export interface TemporalPattern {
  timeOfDay?: {
    morning?: number; // 06:00-12:00
    afternoon?: number; // 12:00-18:00
    evening?: number; // 18:00-22:00
    night?: number; // 22:00-06:00
  };
  dayOfWeek?: {
    weekday?: number;
    weekend?: number;
  };
  variance?: number; // How much the parameter varies
}

export interface TrendAnalysis {
  parameter: string;
  trend: 'improving' | 'declining' | 'stable';
  changeRate: number; // Percentage change per assessment
  confidence: number; // 0-1, how confident we are in the trend
  projected: number; // Projected value in next assessment
}
