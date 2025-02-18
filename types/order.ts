import { Product, ProductPackaging } from "./product";

export interface OrderForm {
  id: string;
  tenant_id: string;
  client_id: string;
  code: string;
  name: string;
  supplier_name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  expires_at?: string;
  access_code?: string;
  supplier_phone?: string;
  client_name: string;
}

export interface OrderFormProduct {
  order_form_id: string;
  product_id: string;
  packaging_id: string;
  sort_order: number;
  price: number;
  product: {
    id: string;
    code: string;
    name: string;
    description?: string;
    image_url?: string;
  };
  packaging: {
    id: string;
    quantity: number;
    price: number;
    unit: {
      id: string;
      code: string;
      name: string;
    };
    inner_quantity?: number;
    inner_unit?: {
      id: string;
      code: string;
      name: string;
    };
    inner_pieces?: number;
  };
}

export interface Order {
  id: string;
  order_form_id: string;
  client_id: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  updated_at: string;
  notes?: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  packaging_id: string;
  quantity: number;
  price: number;
  product?: Product;
  packaging?: ProductPackaging;
}

export interface OrderFormData {
  code: string;
  name: string;
  client_id: string;
  is_active: boolean;
  expires_at?: string;
  access_code?: string;
  supplier_name?: string;
  products: OrderFormProductCompact[];
}

export interface OrderData {
  items: {
    product_id: string;
    packaging_id: string;
    quantity: number;
    price: number;
  }[];
  delivery_date?: string;
  notes?: string;
} 

export interface OrderFormProductCompact {
  product_id: string;
  packaging_id: string;
  price?: number;
}