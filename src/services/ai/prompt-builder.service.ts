import { DriverProfile } from '../../models/driver-profile.model';

/**
 * Prompt Builder Service
 * Constructs system prompts and user context for AI coaching
 */
export class PromptBuilderService {
  /**
   * Build the system prompt that defines the AI coach personality and capabilities
   */
  buildSystemPrompt(): string {
    return `You are an expert AI Driving Coach for DriveWell, an insurance risk assessment platform. Your role is to help drivers understand their driving behavior and improve their insurance premiums through actionable coaching.

## Your Personality
- Professional but friendly and encouraging
- Patient and non-judgmental
- Data-driven and specific
- Focused on actionable advice
- Insurance and safety expert

## Your Capabilities
1. Analyze driving patterns across 15 parameters in 4 categories (Safety, Efficiency, Behavior, Experience)
2. Identify recurring issues and temporal patterns
3. Provide personalized, actionable recommendations
4. Explain complex scoring algorithms in simple terms
5. Simulate the impact of behavioral changes on insurance premiums
6. Suggest specific routes, times, and techniques to improve driving

## DriveWell Scoring System
- Overall Score: 0-100 (weighted average of 4 competency areas)
- Grades: A (90-100), B (80-89), C (70-79), D (60-69), F (<60)
- Risk Levels: very-low, low, moderate, high, very-high
- Premium Modifiers: 0.80 (20% discount) to 1.50 (50% increase)

## Competency Areas & Weights
1. **Safety (40%)**: harsh braking, harsh acceleration, speeding violations, speeding magnitude
2. **Efficiency (20%)**: smooth acceleration, idling time, optimal gear usage, fuel efficiency
3. **Behavior (25%)**: night driving, weekend driving, phone usage, fatigue indicators
4. **Experience (15%)**: total mileage, years with license, route variety

## Guidelines
- Always reference specific data points when providing insights
- Quantify improvements: "Reducing harsh braking from 6.2 to 2.0 events per 100km would improve your Safety score by 15 points"
- Provide context: Explain WHY certain behaviors affect insurance risk
- Be encouraging: Celebrate improvements, frame issues as opportunities
- Prioritize safety: Always emphasize safety benefits alongside cost savings
- Give realistic timeframes: "This change typically takes 2-3 weeks to show consistent improvement"

## Response Format
- Keep responses concise (2-4 paragraphs max for general questions)
- Use bullet points for action plans
- Bold key numbers and metrics for emphasis (use **text** for bold)
- End with a specific next step or question to keep engagement

When the driver asks a question, analyze their specific data and provide personalized insights.`;
  }

  /**
   * Build user context from driver profile
   */
  buildUserContext(driverProfile: DriverProfile): string {
    const safetyArea = driverProfile.competencyScores.find(a => a.areaId === 'safety');
    const efficiencyArea = driverProfile.competencyScores.find(a => a.areaId === 'efficiency');
    const behaviorArea = driverProfile.competencyScores.find(a => a.areaId === 'behavior');
    const experienceArea = driverProfile.competencyScores.find(a => a.areaId === 'experience');

    // Find top 3 problematic parameters
    const allParameters: Array<{ name: string; score: number }> = [];
    driverProfile.competencyScores.forEach(area => {
      area.parameterScores.forEach(param => {
        allParameters.push({ name: param.parameterId, score: param.normalizedScore });
      });
    });
    const topIssues = allParameters
      .sort((a, b) => a.score - b.score)
      .slice(0, 3)
      .map(p => `${p.name}: ${p.score.toFixed(1)}`);

    return `## Current Driver Profile
- Driver ID: ${driverProfile.driverId}
- Overall Score: **${driverProfile.overallScore.toFixed(1)}** (Grade **${driverProfile.overallGrade}**)
- Risk Level: **${driverProfile.riskLevel}**
- Premium Modifier: **${driverProfile.premiumModifier}x** (${this.getPremiumDescription(driverProfile.premiumModifier)})

## Competency Scores
- Safety: **${safetyArea?.score.toFixed(1) || 'N/A'}** (Grade ${safetyArea?.grade || 'N/A'})
- Efficiency: **${efficiencyArea?.score.toFixed(1) || 'N/A'}** (Grade ${efficiencyArea?.grade || 'N/A'})
- Behavior: **${behaviorArea?.score.toFixed(1) || 'N/A'}** (Grade ${behaviorArea?.grade || 'N/A'})
- Experience: **${experienceArea?.score.toFixed(1) || 'N/A'}** (Grade ${experienceArea?.grade || 'N/A'})

## Top Problematic Parameters
${topIssues.map(issue => `- ${issue}`).join('\n')}

## Current Recommendations (${driverProfile.recommendations.length} total)
${driverProfile.recommendations.slice(0, 3).map(rec => `- [${rec.priority}] ${rec.issue}`).join('\n')}
${driverProfile.recommendations.length > 3 ? `... and ${driverProfile.recommendations.length - 3} more` : ''}`;
  }

  /**
   * Get premium description
   */
  private getPremiumDescription(modifier: number): string {
    if (modifier < 0.9) {
      const discount = Math.round((1 - modifier) * 100);
      return `${discount}% discount`;
    } else if (modifier > 1.1) {
      const increase = Math.round((modifier - 1) * 100);
      return `${increase}% increase`;
    } else {
      return 'standard rate';
    }
  }

  /**
   * Format conversation history for AI context
   */
  formatConversationHistory(
    messages: Array<{ role: 'user' | 'assistant'; content: string }>
  ): Array<{ role: 'user' | 'assistant'; content: string }> {
    // Limit to last 10 messages to stay within token limits
    const recentMessages = messages.slice(-10);
    return recentMessages;
  }
}
