export interface Company {
  uen: string;
  company_name: string;
  url?: string;
  address?: string;
  former_name?: string;
  date_incorporation?: string;
  registration_type?: string;
  registration_address?: string;
  google_map_url?: string;
  company_industry?: string;
  ssic_code?: string;
  tenant_id: string;
}

export interface CompanyImport {
  uen: string;
  company_name: string;
  url?: string;
  address?: string;
  former_name?: string;
  date_incorporation?: string;
  registration_type?: string;
  registration_address?: string;
  google_map_url?: string;
  company_industry?: string;
  ssic_code?: string;
}

export interface CompanyFilters {
  searchTerm?: string;
  industries?: string[];
  ssicCodes?: string[];
} 