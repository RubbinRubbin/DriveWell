export enum CompetencyAreaId {
  SAFETY = 'safety',
  EFFICIENCY = 'efficiency',
  BEHAVIOR = 'behavior',
  EXPERIENCE = 'experience'
}

export interface CompetencyArea {
  id: CompetencyAreaId;
  name: string;
  description: string;
  weight: number; // Weight in overall profile (0-1, sum = 1)
  parameterIds: string[];
}

export interface ParameterScore {
  parameterId: string;
  value: number;
  normalizedScore: number; // 0-100
  weightedContribution: number; // Contribution to area score
}

export interface CompetencyAreaScore {
  areaId: CompetencyAreaId;
  score: number; // 0-100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  parameterScores: ParameterScore[];
}
