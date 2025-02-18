import { SupabaseClient } from '@supabase/supabase-js';

export const getUser = async (supabase: SupabaseClient) => {
  const {
    data: { user }
  } = await supabase.auth.getUser();
  return user;
};

export async function createUserTenant(
  supabase: SupabaseClient,
  userId: string,
  name: string
) {
  // Start a transaction
  const { data: tenant, error: tenantError } = await supabase
    .from('Tenants')
    .insert({
      name: name,
      subdomain: userId,
      plan: 'free',
      role: 'user',
      status: 'pending'
    })
    .select()
    .single();

  if (tenantError) throw tenantError;
  if (!tenant) throw new Error('No tenant found');

  // Create UserTenant record
  const { error: userTenantError } = await supabase
    .from('UserTenants')
    .insert({
      user_id: userId,
      tenant_id: tenant.id
    });

  if (userTenantError) throw userTenantError;

  // Create or update tenant settings using upsert
  const defaultSettings = {
    tenant_id: tenant.id,
    company_name: name,
    company_email: '', // Will be updated with user's email
    theme_colors: {
      primary: '#4A90E2',
      secondary: '#7B61FF'
    }
  };

  const { error: settingsError } = await supabase
    .from('TenantSettings')
    .upsert(defaultSettings) // Using upsert instead of insert
    .select()
    .single();

  if (settingsError) throw settingsError;

  return tenant;
}

export async function getUserTenants(supabase: SupabaseClient, userId: string) {
  const { data: userTenants, error } = await supabase
    .from('UserTenants')
    .select(`
      *,
      tenant:Tenants(*)
    `)
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching user tenants:', error);
    return null;
  }

  return userTenants;
}


export async function getTenantSettings(
  supabase: SupabaseClient,
  tenantId: string
) {
  const { data, error } = await supabase
    .from('TenantSettings')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  // If no record is found, return an empty object instead of throwing an error
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "No rows found"
    throw error;
  }

  return data || {
    company_name: '',
    company_uen: '',
    company_email: '',
    company_phone: '',
    company_address: '',
    company_description: '',
    terms_accepted: false,
    logo_url: ''
  };
}

export async function updateTenantSettings(
  supabase: SupabaseClient,
  tenantId: string,
  settings: {
    company_name?: string;
    company_uen?: string;
    company_email?: string;
    company_phone?: string;
    company_address?: string;
    company_description?: string;
    terms_accepted?: boolean;
    logo_url?: string;
    theme_colors?: {
      primary: string;
      secondary: string;
    };
  }
) {
  const { data, error } = await supabase
    .from('TenantSettings')
    .upsert({
      tenant_id: tenantId,
      ...settings,
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
