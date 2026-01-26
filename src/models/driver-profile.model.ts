import { CompetencyAreaScore } from './competency-area.model';
import { Recommendation } from './recommendation.model';

export interface DriverProfile {
  driverId: string;
  timestamp: string;
  analysisWindow: {
    startDate: string;
    endDate: string;
    totalDistanceKm: number;
    totalDrivingHours: number;
  };
  overallScore: number; // 0-100
  overallGrade: 'A' | 'B' | 'C' | 'D' | 'F';
  riskLevel: 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';
  competencyScores: CompetencyAreaScore[];
  recommendations: Recommendation[];
  premiumModifier: number; // Suggested multiplier (e.g., 0.8 = 20% discount, 1.3 = 30% increase)
}
