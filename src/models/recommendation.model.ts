import { CompetencyAreaId } from './competency-area.model';

export enum RecommendationPriority {
  CRITICAL = 'critical',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low'
}

export interface Recommendation {
  id: string;
  priority: RecommendationPriority;
  competencyArea: CompetencyAreaId;
  parameterId: string;
  issue: string;
  actionableAdvice: string;
  potentialImpact: {
    scoreImprovement: number; // Estimated score points
    premiumReduction: number; // Estimated % reduction
  };
}

export interface RecommendationRule {
  id: string;
  parameterId: string;
  condition: {
    operator: '<' | '>' | 'between' | 'outside';
    threshold: number | [number, number];
  };
  priority: RecommendationPriority;
  template: {
    issue: string;
    advice: string;
  };
  impact: {
    scoreImprovement: number;
    premiumReduction: number;
  };
}
