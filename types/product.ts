export interface Product {
  id: string;
  code: string;
  name: string;
  description?: string;
  image_url?: string;
  brand?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  tenant_id: string;
  note?: string;
  categories: {
    category: {
      id: string;
      name: string;
      tenant_id: string;
    } | null;
  }[];
  packaging: ProductPackaging[];
}

export interface ProductFilters {
  searchTerm?: string;
  categories?: string[];
  brand?: string;
  priceMin?: number;
  priceMax?: number;
  uomTypes?: string[];
}

export interface ProductFormData {
  code: string;
  name: string;
  brand?: string;
  note?: string;
  image_url?: string | null;
  categories: { id: string; name: string; }[];
  packaging: ProductPackagingForm[];
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  tenant_id: string;
}

export interface Unit {
  id: string;
  code: string;
  name: string;
  is_measurement: boolean;
  is_packaging: boolean;
  tenant_id: string;
}

export interface ProductPackaging {
  id: string;
  quantity: number;
  unit: {
    id: string;
    code: string;
    name: string;
  } | null;
  inner_quantity?: number;
  inner_unit?: {
    id: string;
    code: string;
    name: string;
  } | null;
  inner_pieces?: number;
  price: number;
}

export interface ProductPackagingForm {
  id?: string;
  quantity: string;
  unit_id: string;
  inner_quantity?: string;
  inner_unit_id?: string;
  inner_pieces?: string;
  price: string;
} 