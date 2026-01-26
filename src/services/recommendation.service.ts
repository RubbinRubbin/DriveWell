import { CompetencyAreaScore } from '../models/competency-area.model';
import { Recommendation, RecommendationRule } from '../models/recommendation.model';
import { CompetencyAreaId } from '../models/competency-area.model';

export class RecommendationService {
  /**
   * Generates actionable recommendations based on parameter values
   */
  generateRecommendations(
    parameterValues: Map<string, number>,
    competencyScores: CompetencyAreaScore[],
    rules: RecommendationRule[]
  ): Recommendation[] {
    const recommendations: Recommendation[] = [];

    for (const rule of rules) {
      const value = parameterValues.get(rule.parameterId);

      if (value !== undefined && this.meetsCondition(value, rule.condition)) {
        const competencyArea = this.findCompetencyArea(rule.parameterId, competencyScores);

        recommendations.push({
          id: rule.id,
          priority: rule.priority,
          competencyArea: competencyArea || CompetencyAreaId.SAFETY,
          parameterId: rule.parameterId,
          issue: this.interpolateTemplate(rule.template.issue, value),
          actionableAdvice: this.interpolateTemplate(rule.template.advice, value),
          potentialImpact: rule.impact
        });
      }
    }

    // Sort by priority (critical first)
    return recommendations.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  }

  private meetsCondition(
    value: number,
    condition: { operator: '<' | '>' | 'between' | 'outside'; threshold: number | [number, number] }
  ): boolean {
    switch (condition.operator) {
      case '<':
        return value < (condition.threshold as number);
      case '>':
        return value > (condition.threshold as number);
      case 'between':
        const [min, max] = condition.threshold as [number, number];
        return value >= min && value <= max;
      case 'outside':
        const [lower, upper] = condition.threshold as [number, number];
        return value < lower || value > upper;
      default:
        return false;
    }
  }

  private interpolateTemplate(template: string, value: number): string {
    return template.replace('${value}', value.toFixed(2));
  }

  private findCompetencyArea(
    parameterId: string,
    scores: CompetencyAreaScore[]
  ): CompetencyAreaId | null {
    for (const score of scores) {
      if (score.parameterScores.some((ps) => ps.parameterId === parameterId)) {
        return score.areaId;
      }
    }
    return null;
  }
}
