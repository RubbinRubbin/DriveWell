import { CompetencyArea, CompetencyAreaScore, ParameterScore } from '../models/competency-area.model';
import { ParameterDefinition } from '../models/parameter.model';
import { ParameterScoringService } from './parameter-scoring.service';

export class AreaScoringService {
  constructor(private parameterScoringService: ParameterScoringService) {}

  /**
   * Calculates competency area score as weighted average of parameter scores
   */
  scoreCompetencyArea(
    area: CompetencyArea,
    parameterValues: Map<string, number>,
    parameterDefinitions: Map<string, ParameterDefinition>
  ): CompetencyAreaScore {
    const parameterScores: ParameterScore[] = [];
    let totalWeight = 0;
    let weightedSum = 0;

    for (const paramId of area.parameterIds) {
      const definition = parameterDefinitions.get(paramId);
      const value = parameterValues.get(paramId);

      if (!definition || value === undefined) {
        throw new Error(`Missing parameter: ${paramId}`);
      }

      const normalizedScore = this.parameterScoringService.scoreParameter(value, definition);
      const weight = definition.weight;
      const weightedContribution = normalizedScore * weight;

      parameterScores.push({
        parameterId: paramId,
        value,
        normalizedScore,
        weightedContribution
      });

      totalWeight += weight;
      weightedSum += weightedContribution;
    }

    // Normalize if weights don't sum to 1
    const areaScore = totalWeight > 0 ? weightedSum / totalWeight : 0;

    return {
      areaId: area.id,
      score: Math.round(areaScore * 100) / 100,
      grade: this.scoreToGrade(areaScore),
      parameterScores
    };
  }

  private scoreToGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }
}
