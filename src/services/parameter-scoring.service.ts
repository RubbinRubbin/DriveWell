import { ParameterDefinition, ScoringDirection } from '../models/parameter.model';

export class ParameterScoringService {
  /**
   * Core scoring algorithm for individual parameters
   * Converts raw parameter value to 0-100 score based on thresholds
   */
  scoreParameter(value: number, definition: ParameterDefinition): number {
    const { thresholds, scoringDirection, optimalRange } = definition;

    if (scoringDirection === ScoringDirection.OPTIMAL_RANGE && optimalRange) {
      return this.scoreOptimalRange(value, optimalRange, thresholds);
    } else if (scoringDirection === ScoringDirection.LOWER_IS_BETTER) {
      return this.scoreLowerIsBetter(value, thresholds);
    } else {
      return this.scoreHigherIsBetter(value, thresholds);
    }
  }

  private scoreLowerIsBetter(
    value: number,
    thresholds: { excellent: number; good: number; fair: number; poor: number }
  ): number {
    if (value <= thresholds.excellent) return 100;
    if (value <= thresholds.good)
      return this.linearInterpolate(value, thresholds.excellent, thresholds.good, 100, 80);
    if (value <= thresholds.fair)
      return this.linearInterpolate(value, thresholds.good, thresholds.fair, 80, 60);
    if (value <= thresholds.poor)
      return this.linearInterpolate(value, thresholds.fair, thresholds.poor, 60, 40);
    return Math.max(0, 40 - (value - thresholds.poor) * 2); // Decline rapidly after poor
  }

  private scoreHigherIsBetter(
    value: number,
    thresholds: { excellent: number; good: number; fair: number; poor: number }
  ): number {
    if (value >= thresholds.excellent) return 100;
    if (value >= thresholds.good)
      return this.linearInterpolate(value, thresholds.good, thresholds.excellent, 80, 100);
    if (value >= thresholds.fair)
      return this.linearInterpolate(value, thresholds.fair, thresholds.good, 60, 80);
    if (value >= thresholds.poor)
      return this.linearInterpolate(value, thresholds.poor, thresholds.fair, 40, 60);
    return Math.max(0, 40 - (thresholds.poor - value) * 2);
  }

  private scoreOptimalRange(
    value: number,
    optimal: { min: number; max: number },
    thresholds: { excellent: number; good: number; fair: number; poor: number }
  ): number {
    const midpoint = (optimal.min + optimal.max) / 2;
    const distanceFromOptimal = Math.abs(value - midpoint);
    const optimalWidth = (optimal.max - optimal.min) / 2;

    if (distanceFromOptimal <= optimalWidth) return 100;
    if (distanceFromOptimal <= optimalWidth * 2) return 80;
    if (distanceFromOptimal <= optimalWidth * 3) return 60;
    if (distanceFromOptimal <= optimalWidth * 4) return 40;
    return 20;
  }

  private linearInterpolate(value: number, x1: number, x2: number, y1: number, y2: number): number {
    return y1 + ((value - x1) * (y2 - y1)) / (x2 - x1);
  }
}
