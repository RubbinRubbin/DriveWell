import { supabaseAdmin } from '../../config/supabase.config';

export interface Customer {
  id: string;
  authUserId: string | null;
  email: string;
  fullName: string;
  phone: string | null;
  driverLicenseNumber: string | null;
  driverLicenseYears: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateCustomerDTO {
  fullName?: string;
  phone?: string;
  driverLicenseNumber?: string;
  driverLicenseYears?: number;
}

export interface CustomerWithProfile extends Customer {
  driverProfile?: {
    overallScore: number | null;
    overallGrade: string | null;
    riskLevel: string | null;
    premiumModifier: number | null;
  };
}

export class CustomerRepository {
  // Get all active customers with their profile summary
  async getAllCustomers(): Promise<CustomerWithProfile[]> {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        auth_user_id,
        email,
        full_name,
        phone,
        driver_license_number,
        driver_license_years,
        is_active,
        created_at,
        updated_at,
        driver_profiles (
          overall_score,
          overall_grade,
          risk_level,
          premium_modifier
        )
      `)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(`Errore nel recupero dei clienti: ${error.message}`);
    }

    return (data || []).map(this.mapCustomerWithProfile);
  }

  // Get a single customer by ID
  async getCustomerById(customerId: string): Promise<CustomerWithProfile | null> {
    const { data, error } = await supabaseAdmin
      .from('customers')
      .select(`
        id,
        auth_user_id,
        email,
        full_name,
        phone,
        driver_license_number,
        driver_license_years,
        is_active,
        created_at,
        updated_at,
        driver_profiles (
          overall_score,
          overall_grade,
          risk_level,
          premium_modifier
        )
      `)
      .eq('id', customerId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return null;
      throw new Error(`Errore nel recupero del cliente: ${error.message}`);
    }

    return this.mapCustomerWithProfile(data);
  }

  // Update customer info
  async updateCustomer(customerId: string, dto: UpdateCustomerDTO): Promise<Customer> {
    const updateData: any = {};
    if (dto.fullName !== undefined) updateData.full_name = dto.fullName;
    if (dto.phone !== undefined) updateData.phone = dto.phone;
    if (dto.driverLicenseNumber !== undefined) updateData.driver_license_number = dto.driverLicenseNumber;
    if (dto.driverLicenseYears !== undefined) updateData.driver_license_years = dto.driverLicenseYears;

    const { data, error } = await supabaseAdmin
      .from('customers')
      .update(updateData)
      .eq('id', customerId)
      .select()
      .single();

    if (error) {
      throw new Error(`Errore nell'aggiornamento del cliente: ${error.message}`);
    }

    return this.mapCustomer(data);
  }

  // Soft delete customer
  async deleteCustomer(customerId: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('customers')
      .update({ is_active: false })
      .eq('id', customerId);

    if (error) {
      throw new Error(`Errore nell'eliminazione del cliente: ${error.message}`);
    }
  }

  // Get customer statistics
  async getStatistics(): Promise<{
    totalCustomers: number;
    averageScore: number;
    highRiskCount: number;
  }> {
    // Get total customers
    const { count: totalCustomers, error: countError } = await supabaseAdmin
      .from('customers')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true);

    if (countError) {
      throw new Error(`Errore nel conteggio clienti: ${countError.message}`);
    }

    // Get profiles for stats
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('driver_profiles')
      .select('overall_score, risk_level, customer_id')
      .not('overall_score', 'is', null);

    if (profilesError) {
      throw new Error(`Errore nel recupero statistiche: ${profilesError.message}`);
    }

    const scoresArray = profiles?.filter(p => p.overall_score !== null) || [];
    const averageScore = scoresArray.length > 0
      ? scoresArray.reduce((sum, p) => sum + Number(p.overall_score), 0) / scoresArray.length
      : 0;

    const highRiskCount = profiles?.filter(p =>
      p.risk_level === 'high' || p.risk_level === 'very-high'
    ).length || 0;

    return {
      totalCustomers: totalCustomers || 0,
      averageScore: Math.round(averageScore * 10) / 10,
      highRiskCount
    };
  }

  // Map database row to Customer
  private mapCustomer(row: any): Customer {
    return {
      id: row.id,
      authUserId: row.auth_user_id,
      email: row.email,
      fullName: row.full_name,
      phone: row.phone,
      driverLicenseNumber: row.driver_license_number,
      driverLicenseYears: row.driver_license_years,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }

  // Map database row to CustomerWithProfile
  private mapCustomerWithProfile(row: any): CustomerWithProfile {
    const profile = Array.isArray(row.driver_profiles)
      ? row.driver_profiles[0]
      : row.driver_profiles;

    return {
      id: row.id,
      authUserId: row.auth_user_id,
      email: row.email,
      fullName: row.full_name,
      phone: row.phone,
      driverLicenseNumber: row.driver_license_number,
      driverLicenseYears: row.driver_license_years,
      isActive: row.is_active,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      driverProfile: profile ? {
        overallScore: profile.overall_score,
        overallGrade: profile.overall_grade,
        riskLevel: profile.risk_level,
        premiumModifier: profile.premium_modifier
      } : undefined
    };
  }
}
