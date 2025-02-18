export interface Client {
  id: string;
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address_street1?: string;
  address_street2?: string;
  address_city?: string;
  address_state?: string;
  address_country?: string;
  address_postal_code?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  note?: string;
  last_order_date?: string;
  total_orders?: number;
  total_spend?: number;
  tax_number?: string;
  payment_terms?: string;
  currency?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
}

export interface ClientFilters {
  searchTerm?: string;
  isActive?: boolean;
}

export interface ClientFormData {
  code: string;
  name: string;
  phone?: string;
  email?: string;
  address_street1?: string;
  address_street2?: string;
  address_city?: string;
  address_state?: string;
  address_country?: string;
  address_postal_code?: string;
  note?: string;
  tax_number?: string;
  payment_terms?: string;
  currency?: string;
  billing_address?: string;
  billing_city?: string;
  billing_state?: string;
  billing_postal_code?: string;
  billing_country?: string;
} 