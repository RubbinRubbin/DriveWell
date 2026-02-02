import { Response, NextFunction } from 'express';
import { AuthenticatedRequest } from './auth.middleware';
import { supabaseAdmin } from '../config/supabase.config';

export interface CompanyUserRequest extends AuthenticatedRequest {
  companyUser?: {
    id: string;
    email: string;
    fullName: string | null;
  };
}

export interface CustomerRequest extends AuthenticatedRequest {
  customer?: {
    id: string;
    email: string;
    fullName: string;
    phone: string | null;
    driverLicenseNumber: string | null;
    driverLicenseYears: number | null;
    isActive: boolean;
  };
}

// Middleware: Only allow company users (admins)
export const companyOnly = async (
  req: CompanyUserRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Utente non autenticato' }
      });
    }

    const { data: companyUser, error } = await supabaseAdmin
      .from('company_users')
      .select('id, email, full_name')
      .eq('auth_user_id', req.user.id)
      .single();

    if (error || !companyUser) {
      return res.status(403).json({
        success: false,
        error: { message: 'Accesso riservato agli utenti aziendali' }
      });
    }

    req.companyUser = {
      id: companyUser.id,
      email: companyUser.email,
      fullName: companyUser.full_name
    };

    next();
  } catch (error) {
    console.error('[ROLE] Error checking company user:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Errore nella verifica del ruolo' }
    });
  }
};

// Middleware: Only allow customers
export const customerOnly = async (
  req: CustomerRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: { message: 'Utente non autenticato' }
      });
    }

    const { data: customer, error } = await supabaseAdmin
      .from('customers')
      .select('id, email, full_name, phone, driver_license_number, driver_license_years, is_active')
      .eq('auth_user_id', req.user.id)
      .eq('is_active', true)
      .single();

    if (error || !customer) {
      return res.status(403).json({
        success: false,
        error: { message: 'Accesso riservato ai clienti registrati' }
      });
    }

    req.customer = {
      id: customer.id,
      email: customer.email,
      fullName: customer.full_name,
      phone: customer.phone,
      driverLicenseNumber: customer.driver_license_number,
      driverLicenseYears: customer.driver_license_years,
      isActive: customer.is_active
    };

    next();
  } catch (error) {
    console.error('[ROLE] Error checking customer:', error);
    return res.status(500).json({
      success: false,
      error: { message: 'Errore nella verifica del ruolo' }
    });
  }
};
