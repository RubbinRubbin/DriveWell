import { PrismaClient, CoachingSession, CoachingMessage } from '@prisma/client';

/**
 * Coaching Repository Service
 * Handles all database operations for coaching sessions and messages
 */
export class CoachingRepositoryService {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create a new coaching session
   */
  async createSession(driverId: string): Promise<CoachingSession> {
    // Ensure driver exists
    await this.prisma.driver.upsert({
      where: { id: driverId },
      update: { updatedAt: new Date() },
      create: { id: driverId }
    });

    // Create new session
    const session = await this.prisma.coachingSession.create({
      data: {
        driverId,
        isActive: true
      }
    });

    return session;
  }

  /**
   * Get active session for a driver, or create new one if none exists
   */
  async getActiveSession(driverId: string): Promise<CoachingSession> {
    // Try to find active session
    let session = await this.prisma.coachingSession.findFirst({
      where: {
        driverId,
        isActive: true
      },
      orderBy: { createdAt: 'desc' }
    });

    // If no active session, create new one
    if (!session) {
      session = await this.createSession(driverId);
    }

    return session;
  }

  /**
   * Get session by ID
   */
  async getSessionById(sessionId: string): Promise<CoachingSession | null> {
    const session = await this.prisma.coachingSession.findUnique({
      where: { id: sessionId }
    });

    return session;
  }

  /**
   * Deactivate a session
   */
  async deactivateSession(sessionId: string): Promise<CoachingSession> {
    const session = await this.prisma.coachingSession.update({
      where: { id: sessionId },
      data: { isActive: false }
    });

    return session;
  }

  /**
   * Save a chat message
   */
  async saveMessage(
    sessionId: string,
    driverId: string,
    role: 'user' | 'assistant',
    content: string,
    contextMetadata?: Record<string, any>
  ): Promise<CoachingMessage> {
    const message = await this.prisma.coachingMessage.create({
      data: {
        sessionId,
        driverId,
        role,
        content,
        contextMetadata: contextMetadata || {}
      }
    });

    return message;
  }

  /**
   * Get session conversation history
   */
  async getSessionHistory(
    sessionId: string,
    limit: number = 50
  ): Promise<CoachingMessage[]> {
    const messages = await this.prisma.coachingMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'asc' },
      take: limit
    });

    return messages;
  }

  /**
   * Get recent messages from a session (for AI context window)
   */
  async getRecentMessages(
    sessionId: string,
    limit: number = 10
  ): Promise<CoachingMessage[]> {
    const messages = await this.prisma.coachingMessage.findMany({
      where: { sessionId },
      orderBy: { timestamp: 'desc' },
      take: limit
    });

    // Return in chronological order (oldest first)
    return messages.reverse();
  }

  /**
   * Get all sessions for a driver
   */
  async getDriverSessions(driverId: string): Promise<CoachingSession[]> {
    const sessions = await this.prisma.coachingSession.findMany({
      where: { driverId },
      orderBy: { createdAt: 'desc' }
    });

    return sessions;
  }

  /**
   * Count messages in a session
   */
  async countSessionMessages(sessionId: string): Promise<number> {
    const count = await this.prisma.coachingMessage.count({
      where: { sessionId }
    });

    return count;
  }

  /**
   * Delete old inactive sessions (cleanup utility)
   */
  async deleteOldSessions(daysOld: number = 30): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysOld);

    const result = await this.prisma.coachingSession.deleteMany({
      where: {
        isActive: false,
        updatedAt: { lt: cutoffDate }
      }
    });

    return result.count;
  }
}
