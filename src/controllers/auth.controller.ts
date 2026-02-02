import { Request, Response, NextFunction } from 'express';
import { supabaseAdmin, supabasePublic } from '../config/supabase.config';

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterCustomerRequest {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  driverLicenseNumber?: string;
  driverLicenseYears?: number;
  registrationCode: string;
}

export class AuthController {
  // Login for both company users and customers
  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password }: LoginRequest = req.body;

      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email e password sono obbligatori' }
        });
      }

      // Authenticate with Supabase (use public client for user auth)
      const { data: authData, error: authError } = await supabasePublic.auth.signInWithPassword({
        email,
        password
      });

      if (authError || !authData.user) {
        console.error('Supabase auth error:', authError);
        return res.status(401).json({
          success: false,
          error: { message: authError?.message || 'Credenziali non valide' }
        });
      }

      // Check if user is a company user
      const { data: companyUser } = await supabaseAdmin
        .from('company_users')
        .select('id, email, full_name')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (companyUser) {
        return res.status(200).json({
          success: true,
          data: {
            userType: 'company',
            user: {
              id: companyUser.id,
              email: companyUser.email,
              fullName: companyUser.full_name
            },
            session: {
              accessToken: authData.session?.access_token,
              refreshToken: authData.session?.refresh_token,
              expiresAt: authData.session?.expires_at
            }
          }
        });
      }

      // Check if user is a customer
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('id, email, full_name, is_active')
        .eq('auth_user_id', authData.user.id)
        .single();

      if (customer) {
        if (!customer.is_active) {
          return res.status(403).json({
            success: false,
            error: { message: 'Account disattivato. Contatta l\'assistenza.' }
          });
        }

        return res.status(200).json({
          success: true,
          data: {
            userType: 'customer',
            user: {
              id: customer.id,
              email: customer.email,
              fullName: customer.full_name
            },
            session: {
              accessToken: authData.session?.access_token,
              refreshToken: authData.session?.refresh_token,
              expiresAt: authData.session?.expires_at
            }
          }
        });
      }

      // User exists in auth but not in any table
      return res.status(403).json({
        success: false,
        error: { message: 'Utente non autorizzato' }
      });

    } catch (error) {
      next(error);
    }
  };

  // Customer self-registration
  registerCustomer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        email,
        password,
        fullName,
        phone,
        driverLicenseNumber,
        driverLicenseYears,
        registrationCode
      }: RegisterCustomerRequest = req.body;

      // Validate required fields
      if (!email || !password || !fullName || !registrationCode) {
        return res.status(400).json({
          success: false,
          error: { message: 'Email, password, nome completo e codice registrazione sono obbligatori' }
        });
      }

      // Verify registration code
      const validCode = process.env.CUSTOMER_REGISTRATION_CODE || 'DRIVEWELL2024';
      console.log('Registration attempt:', { email, fullName, registrationCode, validCode });
      if (registrationCode !== validCode) {
        console.log('Invalid registration code:', registrationCode, 'expected:', validCode);
        return res.status(400).json({
          success: false,
          error: { message: 'Codice di registrazione non valido' }
        });
      }

      // Check if email already exists
      const { data: existingCustomer } = await supabaseAdmin
        .from('customers')
        .select('id')
        .eq('email', email)
        .single();

      if (existingCustomer) {
        return res.status(409).json({
          success: false,
          error: { message: 'Email già registrata' }
        });
      }

      // Create auth user (use public client for user registration)
      const { data: authData, error: authError } = await supabasePublic.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (authError || !authData.user) {
        console.error('Supabase signUp error:', authError);
        return res.status(400).json({
          success: false,
          error: { message: authError?.message || 'Errore nella creazione dell\'account' }
        });
      }

      // Create customer record
      const { data: customer, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({
          auth_user_id: authData.user.id,
          email,
          full_name: fullName,
          phone: phone || null,
          driver_license_number: driverLicenseNumber || null,
          driver_license_years: driverLicenseYears || null
        })
        .select()
        .single();

      if (customerError) {
        // Rollback: delete auth user if customer creation fails
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        return res.status(500).json({
          success: false,
          error: { message: 'Errore nella creazione del profilo cliente' }
        });
      }

      res.status(201).json({
        success: true,
        data: {
          message: 'Registrazione completata con successo',
          user: {
            id: customer.id,
            email: customer.email,
            fullName: customer.full_name
          },
          session: {
            accessToken: authData.session?.access_token,
            refreshToken: authData.session?.refresh_token,
            expiresAt: authData.session?.expires_at
          }
        }
      });

    } catch (error) {
      next(error);
    }
  };

  // Logout
  logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.replace('Bearer ', '');
        // Invalidate the session on Supabase
        await supabaseAdmin.auth.admin.signOut(token);
      }

      res.status(200).json({
        success: true,
        data: { message: 'Logout effettuato con successo' }
      });

    } catch (error) {
      next(error);
    }
  };

  // Refresh token
  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({
          success: false,
          error: { message: 'Refresh token mancante' }
        });
      }

      const { data, error } = await supabasePublic.auth.refreshSession({
        refresh_token: refreshToken
      });

      if (error || !data.session) {
        return res.status(401).json({
          success: false,
          error: { message: 'Refresh token non valido' }
        });
      }

      res.status(200).json({
        success: true,
        data: {
          accessToken: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expiresAt: data.session.expires_at
        }
      });

    } catch (error) {
      next(error);
    }
  };

  // Get current user info
  getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token di autenticazione mancante' }
        });
      }

      const token = authHeader.replace('Bearer ', '');
      const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);

      if (error || !user) {
        return res.status(401).json({
          success: false,
          error: { message: 'Token non valido' }
        });
      }

      // Check if company user
      const { data: companyUser } = await supabaseAdmin
        .from('company_users')
        .select('id, email, full_name')
        .eq('auth_user_id', user.id)
        .single();

      if (companyUser) {
        return res.status(200).json({
          success: true,
          data: {
            userType: 'company',
            user: {
              id: companyUser.id,
              email: companyUser.email,
              fullName: companyUser.full_name
            }
          }
        });
      }

      // Check if customer
      const { data: customer } = await supabaseAdmin
        .from('customers')
        .select('id, email, full_name, phone, driver_license_number, driver_license_years, is_active')
        .eq('auth_user_id', user.id)
        .single();

      if (customer) {
        return res.status(200).json({
          success: true,
          data: {
            userType: 'customer',
            user: {
              id: customer.id,
              email: customer.email,
              fullName: customer.full_name,
              phone: customer.phone,
              driverLicenseNumber: customer.driver_license_number,
              driverLicenseYears: customer.driver_license_years,
              isActive: customer.is_active
            }
          }
        });
      }

      return res.status(404).json({
        success: false,
        error: { message: 'Utente non trovato' }
      });

    } catch (error) {
      next(error);
    }
  };
}
