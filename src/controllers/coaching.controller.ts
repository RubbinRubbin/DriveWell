import { Request, Response, NextFunction } from 'express';
import { AICoachService } from '../services/ai/ai-coach.service';
import { RiskAssessmentService } from '../services/risk-assessment.service';
import { ChatRequest } from '../models/coaching.model';

/**
 * Coaching Controller
 * Handles AI coaching chat requests
 */
export class CoachingController {
  private aiCoachService: AICoachService;
  private riskAssessmentService: RiskAssessmentService;

  constructor() {
    this.aiCoachService = new AICoachService();
    this.riskAssessmentService = new RiskAssessmentService();
  }

  /**
   * POST /api/v1/coach/chat
   * Send a message to the AI coach
   */
  chat = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId, message, sessionId, drivingData }: ChatRequest & { drivingData?: any } = req.body;

      if (!driverId || !message) {
        return res.status(400).json({
          success: false,
          error: { message: 'driverId and message are required' }
        });
      }

      // Optionally generate fresh profile if driving data provided
      let currentProfile;
      if (drivingData) {
        currentProfile = await this.riskAssessmentService.assessDriver(drivingData);
      }

      // Generate AI response
      const response = await this.aiCoachService.generateCoachingResponse(
        driverId,
        message,
        sessionId,
        currentProfile
      );

      res.status(200).json({
        success: true,
        data: response
      });
    } catch (error: any) {
      console.error('Chat error:', error);
      next(error);
    }
  };

  /**
   * GET /api/v1/coach/sessions/:driverId/active
   * Get or create active session for a driver
   */
  getActiveSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { driverId } = req.params;

      const sessionId = this.aiCoachService.getActiveSession(driverId);
      const messages = this.aiCoachService.getSessionHistory(sessionId);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/coach/sessions/:sessionId/history
   * Get conversation history for a session
   */
  getSessionHistory = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { sessionId } = req.params;

      const messages = this.aiCoachService.getSessionHistory(sessionId);

      res.status(200).json({
        success: true,
        data: {
          sessionId,
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            timestamp: msg.timestamp
          }))
        }
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * GET /api/v1/coach/test
   * Test OpenAI connection
   */
  testConnection = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const isConnected = await this.aiCoachService.testConnection();

      res.status(200).json({
        success: true,
        data: {
          openaiConnected: isConnected,
          message: isConnected
            ? 'OpenAI connection successful'
            : 'OpenAI connection failed - check API key'
        }
      });
    } catch (error) {
      next(error);
    }
  };
}
