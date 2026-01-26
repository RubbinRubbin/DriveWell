/**
 * Coaching Session and Message Models
 */

export interface CoachingSession {
  id: string;
  driverId: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CoachingMessage {
  id: string;
  sessionId: string;
  driverId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  contextMetadata?: Record<string, any>;
}

export interface ChatRequest {
  driverId: string;
  message: string;
  sessionId?: string; // Optional - will create new session if not provided
}

export interface ChatResponse {
  sessionId: string;
  response: string;
  context?: {
    referencedAssessments?: string[];
    detectedPatterns?: string[];
  };
}
