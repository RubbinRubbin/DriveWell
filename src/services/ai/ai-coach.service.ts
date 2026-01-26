import { OpenAIClientService } from './openai-client.service';
import { PromptBuilderService } from './prompt-builder.service';
import { DriverProfile } from '../../models/driver-profile.model';
import { ChatResponse } from '../../models/coaching.model';

/**
 * AI Coach Service
 * Main orchestrator for AI-powered driving coaching
 */
export class AICoachService {
  private openaiClient: OpenAIClientService;
  private promptBuilder: PromptBuilderService;

  // In-memory storage for sessions (temporary, until database is configured)
  private sessions: Map<string, {
    driverId: string;
    messages: Array<{ role: 'user' | 'assistant'; content: string }>;
    lastProfile?: DriverProfile;
  }> = new Map();

  constructor() {
    this.openaiClient = new OpenAIClientService();
    this.promptBuilder = new PromptBuilderService();
  }

  /**
   * Generate AI coaching response to user message
   */
  async generateCoachingResponse(
    driverId: string,
    userMessage: string,
    sessionId?: string,
    currentProfile?: DriverProfile
  ): Promise<ChatResponse> {
    try {
      // Get or create session
      const actualSessionId = sessionId || this.createSessionId(driverId);
      let session = this.sessions.get(actualSessionId);

      if (!session) {
        session = {
          driverId,
          messages: [],
          lastProfile: currentProfile
        };
        this.sessions.set(actualSessionId, session);
      }

      // Update profile if provided
      if (currentProfile) {
        session.lastProfile = currentProfile;
      }

      // Build system prompt
      const systemPrompt = this.promptBuilder.buildSystemPrompt();

      // Build user context from current profile
      let userContext = '';
      if (session.lastProfile) {
        userContext = this.promptBuilder.buildUserContext(session.lastProfile);
      }

      // Prepare messages for AI
      const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
        { role: 'system', content: systemPrompt }
      ];

      // Add user context as first user message if available
      if (userContext) {
        messages.push({
          role: 'user',
          content: `Here is my current driving profile:\n\n${userContext}\n\nNow I'll ask you questions about my driving.`
        });
        messages.push({
          role: 'assistant',
          content: 'I understand your driving profile. I\'m here to help you improve your driving and reduce your insurance premium. What would you like to know?'
        });
      }

      // Add conversation history (last 10 messages)
      const recentHistory = session.messages.slice(-10);
      messages.push(...recentHistory.map(msg => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      })));

      // Add current user message
      messages.push({
        role: 'user',
        content: userMessage
      });

      // Get AI response
      const aiResponse = await this.openaiClient.chat(messages);

      // Save messages to session
      session.messages.push({ role: 'user', content: userMessage });
      session.messages.push({ role: 'assistant', content: aiResponse });

      return {
        sessionId: actualSessionId,
        response: aiResponse,
        context: {
          referencedAssessments: session.lastProfile ? [driverId] : [],
          detectedPatterns: []
        }
      };
    } catch (error: any) {
      console.error('AI Coach Error:', error);
      throw new Error(`Failed to generate coaching response: ${error.message}`);
    }
  }

  /**
   * Get session conversation history
   */
  getSessionHistory(sessionId: string): Array<{ role: 'user' | 'assistant'; content: string; timestamp: Date }> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      return [];
    }

    return session.messages.map((msg, index) => ({
      ...msg,
      timestamp: new Date() // Temporary - in real DB this would be actual timestamp
    }));
  }

  /**
   * Get or create active session for driver
   */
  getActiveSession(driverId: string, currentProfile?: DriverProfile): string {
    // Find existing session for driver
    for (const [sessionId, session] of this.sessions.entries()) {
      if (session.driverId === driverId) {
        if (currentProfile) {
          session.lastProfile = currentProfile;
        }
        return sessionId;
      }
    }

    // Create new session
    const newSessionId = this.createSessionId(driverId);
    this.sessions.set(newSessionId, {
      driverId,
      messages: [],
      lastProfile: currentProfile
    });

    return newSessionId;
  }

  /**
   * Create session ID
   */
  private createSessionId(driverId: string): string {
    return `session-${driverId}-${Date.now()}`;
  }

  /**
   * Clear old sessions (cleanup)
   */
  clearOldSessions(maxAgeMs: number = 3600000): number {
    // For now, this is a no-op since we don't track timestamps
    // In production with DB, this would delete sessions older than maxAgeMs
    return 0;
  }

  /**
   * Test OpenAI connection
   */
  async testConnection(): Promise<boolean> {
    return await this.openaiClient.testConnection();
  }
}
