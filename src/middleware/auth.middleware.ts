import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin } from '../config/supabase.config';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
  accessToken?: string;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token di autenticazione mancante' }
      });
    }

    const token = authHeader.replace('Bearer ', '');

    // Verify the JWT token with Supabase
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Token non valido o scaduto' }
      });
    }

    // Attach user info to request
    req.user = {
      id: user.id,
      email: user.email || ''
    };
    req.accessToken = token;

    next();
  } catch (error) {
    console.error('[AUTH] Error verifying token:', error);
    return res.status(401).json({
      success: false,
      error: { message: 'Errore di autenticazione' }
    });
  }
};
