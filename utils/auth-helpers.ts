import { SupabaseClient } from '@supabase/supabase-js';
import { getUserTenants } from './supabase/queries';

export async function verifyUserTenant(supabase: SupabaseClient, userId: string) {
  try {
    // Get user's tenants
    const userTenants = await getUserTenants(supabase, userId);
    
    if (!userTenants || userTenants.length === 0) {
      // No tenants found - sign out the user
      await supabase.auth.signOut();
      throw new Error('Invalid login credentials');
    }

    // Return the first tenant as default
    return userTenants[0].tenant;
  } catch (error) {
    console.error('Error verifying tenant:', error);
    throw error;
  }
}

export async function verifyAdminUser(supabase: any, userId: string): Promise<boolean> {
  // Check if user exists in UserTenants
  const { data: userTenant } = await supabase
    .from('UserTenants')
    .select('id')
    .eq('user_id', userId)
    .single();

  // If user exists in UserTenants, they are not an admin
  return !userTenant;
} 