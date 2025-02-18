import { SupabaseClient } from '@supabase/supabase-js';
import type { 
  Product, 
  ProductFilters, 
  ProductFormData,
  Category,
  Unit 
} from '@/types/product';
import type { 
  Company, 
  CompanyFilters, 
  CompanyImport 
} from '@/types/company';
import type { 
  Client, 
  ClientFilters, 
  ClientFormData 
} from '@/types/client';
import type { 
  OrderForm, 
  OrderFormProduct, 
  Order, 
  OrderData, 
  OrderFormData 
} from '@/types/order';

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
  // Create new Tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('Tenants')
    .insert({
      name: name,
      subdomain: userId,
      plan: 'free',
      role: 'user'
    })
    .select()
    .single();

  if (tenantError) throw tenantError;
  if (!tenant) throw new Error('No tenant found');
  console.log('tenant', tenant);

  // Create UserTenant record
  const { error: userTenantError } = await supabase
    .from('UserTenants')
    .insert({
      user_id: userId,
      tenant_id: tenant.id
    });

  if (userTenantError) throw userTenantError;

  // Create default units for tenant
  const units = [
    { tenant_id: tenant.id, code: 'kg', name: 'Kilogram', is_measurement: true, is_packaging: false },
    { tenant_id: tenant.id, code: 'g', name: 'Gram', is_measurement: true, is_packaging: false },
    { tenant_id: tenant.id, code: 'oz', name: 'Ounce', is_measurement: true, is_packaging: false },
    { tenant_id: tenant.id, code: 'pcs', name: 'Pieces', is_measurement: true, is_packaging: true },
    { tenant_id: tenant.id, code: 'ctn', name: 'Carton', is_measurement: false, is_packaging: true },
    { tenant_id: tenant.id, code: 'pkt', name: 'Packet', is_measurement: false, is_packaging: true },
    { tenant_id: tenant.id, code: 'can', name: 'Can', is_measurement: false, is_packaging: true },
    { tenant_id: tenant.id, code: 'box', name: 'Box', is_measurement: false, is_packaging: true },
    { tenant_id: tenant.id, code: 'lb', name: 'Pound', is_measurement: true, is_packaging: false },
    { tenant_id: tenant.id, code: 'ml', name: 'Milliliter', is_measurement: true, is_packaging: false },
    { tenant_id: tenant.id, code: 'l', name: 'Liter', is_measurement: true, is_packaging: false },
  ]
  const { error: unitsError } = await supabase
    .from('Units')
    .insert(units);

  if (unitsError) throw unitsError;

  // Create default categories for tenant
  const categories = [
    { tenant_id: tenant.id, name: 'Seafood' },
    { tenant_id: tenant.id, name: 'Meat & Poultry' },
    { tenant_id: tenant.id, name: 'Dairy & Eggs' },
    { tenant_id: tenant.id, name: 'Fruits & Vegetables' },
    { tenant_id: tenant.id, name: 'Grains & Legumes' },
    { tenant_id: tenant.id, name: 'Baked Goods & Desserts' },
    { tenant_id: tenant.id, name: 'Beverages' },
    { tenant_id: tenant.id, name: 'Other' }
  ]
  const { error: categoriesError } = await supabase
    .from('Categories')
    .insert(categories);

  if (categoriesError) throw categoriesError;

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

export async function importCompanies(
  supabase: SupabaseClient,
  companies: CompanyImport[],
  tenantId: string
) {
  // Remove duplicates by UEN, keeping the last occurrence
  const uniqueCompanies = companies.reduce((acc, company) => {
    acc[company.uen] = {
      ...company,
      date_incorporation: company.date_incorporation ? new Date(company.date_incorporation) : null,
      tenant_id: tenantId
    };
    return acc;
  }, {} as Record<string, any>);

  const { data, error } = await supabase
    .from('Companies')
    .upsert(
      Object.values(uniqueCompanies),
      {
        onConflict: 'uen',
        ignoreDuplicates: true
      }
    );

  if (error) throw error;
  return data;
}

export async function getCompanies(
  supabase: SupabaseClient,
  tenantId: string,
  page?: number,
  itemsPerPage?: number,
  filters?: CompanyFilters
) {
  let query = supabase
    .from('Companies')
    .select(`
      *
    `, { count: 'exact' })
    .eq('tenant_id', tenantId);

  // Apply filters
  if (filters) {
    if (filters.searchTerm) {
      query = query.or(`company_name.ilike.%${filters.searchTerm}%,uen.ilike.%${filters.searchTerm}%`);
    }
    if (filters.industries?.length) {
      query = query.in('company_industry', filters.industries);
    }
    if (filters.ssicCodes?.length) {
      query = query.in('ssic_code', filters.ssicCodes);
    }
  }

  // Apply pagination
  if (page && itemsPerPage) {
    const from = (page - 1) * itemsPerPage;
    const to = from + itemsPerPage - 1;
    query = query.range(from, to);
  }

  const { data: companies, error, count } = await query;

  if (error) throw error;

  return {
    companies,
    count
  };
}

export async function getProducts(
  supabase: SupabaseClient,
  tenantId: string,
  page: number,
  pageSize: number,
  filters: ProductFilters
) {
  let query = supabase
    .from('Products')
    .select(`
      *,
      categories:ProductCategories!inner (
        category:Categories!inner (*)
      ),
      packaging:ProductPackaging!productpackaging_product_id_fkey (
        id,
        quantity,
        price,
        inner_quantity,
        inner_pieces,
        unit:Units!productpackaging_unit_id_fkey (
          id,
          code,
          name
        ),
        inner_unit:Units!productpackaging_inner_unit_id_fkey (
          id,
          code,
          name
        )
      )
    `, { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .eq('is_deleted', false);

  // Apply filters
  if (filters.searchTerm) {
    query = query.or(`code.ilike.%${filters.searchTerm}%,name.ilike.%${filters.searchTerm}%`);
  }

  if (filters.brand) {
    query = query.ilike('brand', `%${filters.brand}%`);
  }

  // Category filter
  if (filters.categories?.length) {
    query = query.eq('categories.category_id', filters.categories[0]);
  }

  // UOM filter
  if (filters.uomTypes?.length) {
    query = query
      .eq('packaging.unit.code', filters.uomTypes[0]);
  }

  // Price range filters
  if (filters.priceMin !== undefined) {
    query = query.gte('packaging.price', filters.priceMin);
  }

  if (filters.priceMax !== undefined) {
    query = query.lte('packaging.price', filters.priceMax);
  }

  // Add pagination
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;
  
  const { data: products, error, count } = await query
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Query error:', error);
    throw error;
  }

  return {
    products: products || [],
    count
  };
}

export async function getCategories(
  supabase: SupabaseClient,
  tenantId: string
): Promise<Category[]> {
  const { data: categories, error } = await supabase
    .from('Categories')
    .select('id, name')
    .eq('tenant_id', tenantId);

  if (error) throw error;
  return categories as Category[];
}

export async function getUnits(
  supabase: SupabaseClient,
  tenantId: string
): Promise<Unit[]> {
  const { data: units, error } = await supabase
    .from('Units')
    .select('id, code, name, is_measurement, is_packaging')
    .eq('tenant_id', tenantId);

  if (error) throw error;
  return units as Unit[];
}

export async function createProduct(
  supabase: SupabaseClient,
  tenantId: string,
  data: ProductFormData
): Promise<Product> {
  const { data: product, error: productError } = await supabase
    .from('Products')
    .insert({
      tenant_id: tenantId,
      code: data.code,
      name: data.name,
      brand: data.brand,
      note: data.note,
      image_url: data.image_url,
      is_active: true
    })
    .select()
    .single();

  if (productError) throw productError;

  // Insert categories
  if (data.categories.length > 0) {
    const { error: categoriesError } = await supabase
      .from('ProductCategories')
      .insert(
        data.categories.map(category => ({
          product_id: product.id,
          category_id: category.id
        }))
      );

    if (categoriesError) throw categoriesError;
  }

  // Insert packaging options
  if (data.packaging.length > 0) {
    const { error: packagingError } = await supabase
      .from('ProductPackaging')
      .insert(
        data.packaging.map(pkg => ({
          product_id: product.id,
          unit_id: pkg.unit_id,
          quantity: parseFloat(pkg.quantity || '0'),
          price: parseFloat(pkg.price || '0'),
          inner_quantity: pkg.inner_quantity ? parseFloat(pkg.inner_quantity) : null,
          inner_unit_id: pkg.inner_unit_id || null,
          inner_pieces: pkg.inner_pieces ? parseInt(pkg.inner_pieces) : null
        }))
      );

    if (packagingError) throw packagingError;
  }

  return product;
}

export async function updateProduct(
  supabase: SupabaseClient,
  productId: string,
  data: ProductFormData
): Promise<void> {
  // Get existing product to check image
  const { data: existingProduct } = await supabase
    .from('Products')
    .select('image_url')
    .eq('id', productId)
    .single();

  // Handle image deletion
  if (existingProduct?.image_url && data.image_url === null) {
    // Extract path from URL
    const matches = existingProduct.image_url.match(/product-images\/(.+)$/);
    if (matches) {
      const filePath = matches[1];
      await supabase.storage
        .from('product-images')
        .remove([filePath]);
    }
  }

  // Update product details
  const { error: productError } = await supabase
    .from('Products')
    .update({
      code: data.code,
      name: data.name,
      brand: data.brand,
      note: data.note,
      image_url: data.image_url // This will be null if image was deleted
    })
    .eq('id', productId);

  if (productError) throw productError;

  // Delete existing categories and insert new ones
  const { error: deleteCategoriesError } = await supabase
    .from('ProductCategories')
    .delete()
    .eq('product_id', productId);

  if (deleteCategoriesError) throw deleteCategoriesError;

  if (data.categories.length > 0) {
    const { error: categoriesError } = await supabase
      .from('ProductCategories')
      .insert(
        data.categories.map(category => ({
          product_id: productId,
          category_id: category.id
        }))
      );

    if (categoriesError) throw categoriesError;
  }

  // Handle packaging updates
  const { error: deletePackagingError } = await supabase
    .from('ProductPackaging')
    .delete()
    .eq('product_id', productId);

  if (deletePackagingError) throw deletePackagingError;

  if (data.packaging.length > 0) {
    const { error: packagingError } = await supabase
      .from('ProductPackaging')
      .insert(
        data.packaging.map(pkg => ({
          product_id: productId,
          unit_id: pkg.unit_id,
          quantity: parseFloat(pkg.quantity || '0'),
          price: parseFloat(pkg.price || '0'),
          inner_quantity: pkg.inner_quantity ? parseFloat(pkg.inner_quantity) : null,
          inner_unit_id: pkg.inner_unit_id || null,
          inner_pieces: pkg.inner_pieces ? parseInt(pkg.inner_pieces) : null
        }))
      );

    if (packagingError) throw packagingError;
  }
}

// export async function deleteProduct(
//   supabase: SupabaseClient,
//   productId: string
// ): Promise<void> {
//   // Get the product's image URL first
//   const { data: product } = await supabase
//     .from('Products')
//     .select('image_url')
//     .eq('id', productId)
//     .single();

//   // Delete the image if it exists
//   if (product?.image_url) {
//     const matches = product.image_url.match(/product-images\/(.+)$/);
//     if (matches) {
//       const filePath = matches[1];
//       await supabase.storage
//         .from('product-images')
//         .remove([filePath]);
//     }
//   }

//   // Delete the product
//   const { error } = await supabase
//     .from('Products')
//     .delete()
//     .eq('id', productId);

//   if (error) throw error;
// }

export async function getClients(
  supabase: SupabaseClient,
  tenantId: string,
  page: number,
  itemsPerPage: number,
  filters: ClientFilters
): Promise<{ clients: Client[]; count: number }> {
  // First get all orders with their items
  const ordersQuery = supabase
    .from('Orders')
    .select(`
      id,
      status,
      client_id,
      created_at,
      items:OrderItems (
        quantity,
        price
      )
    `)
    .neq('status', 'cancelled');

  const { data: orders, error: ordersError } = await ordersQuery;
  
  if (ordersError) {
    console.error('Error loading orders:', ordersError);
    throw ordersError;
  }

  // Group orders by client
  const ordersByClient = orders?.reduce((acc, order) => {
    if (!acc[order.client_id]) {
      acc[order.client_id] = [];
    }
    acc[order.client_id].push(order);
    return acc;
  }, {} as Record<string, any[]>);

  // Now get clients with pagination
  let query = supabase
    .from('Clients')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId);

  // Apply filters
  if (filters.searchTerm) {
    query = query.or(
      `name.ilike.%${filters.searchTerm}%,code.ilike.%${filters.searchTerm}%,phone.ilike.%${filters.searchTerm}%,email.ilike.%${filters.searchTerm}%`
    );
  }

  if (filters.isActive !== undefined) {
    query = query.eq('is_active', filters.isActive);
  }

  // Add pagination
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  // Add sorting
  query = query.order('name');

  const { data: clients, error: clientsError, count } = await query;

  if (clientsError) {
    console.error('Error loading clients:', clientsError);
    throw clientsError;
  }

  // Process the data to calculate order statistics
  const processedClients = clients?.map(client => {
    const clientOrders = ordersByClient[client.id] || [];
    const totalOrders = clientOrders.length;
    const totalSpend = clientOrders.reduce((sum, order) => {
      const orderTotal = order.items?.reduce((orderSum, item) => 
        orderSum + (item.quantity * (item.price || 0)), 0) || 0;
      return sum + orderTotal;
    }, 0);

    // Find last order date
    const lastOrder = clientOrders.sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )[0];

    return {
      ...client,
      total_orders: totalOrders,
      total_spend: totalSpend,
      last_order_date: lastOrder?.created_at
    };
  }) || [];

  return { clients: processedClients, count: count || 0 };
}

export async function createClientQuery(
  supabase: SupabaseClient,
  tenantId: string,
  data: ClientFormData
) {
  const { error } = await supabase.from('Clients').insert({
    tenant_id: tenantId,
    code: data.code,
    name: data.name,
    phone: data.phone,
    email: data.email,
    address_street1: data.address_street1,
    address_street2: data.address_street2,
    address_city: data.address_city,
    address_state: data.address_state,
    address_country: data.address_country,
    address_postal_code: data.address_postal_code,
    note: data.note,
    // Add new fields
    tax_number: data.tax_number,
    payment_terms: data.payment_terms,
    currency: data.currency,
    billing_address: data.billing_address,
    billing_city: data.billing_city,
    billing_state: data.billing_state,
    billing_postal_code: data.billing_postal_code,
    billing_country: data.billing_country,
  });

  if (error) throw error;
}

export async function updateClient(
  supabase: SupabaseClient,
  clientId: string,
  data: ClientFormData
) {
  const { error } = await supabase
    .from('Clients')
    .update({
      code: data.code,
      name: data.name,
      phone: data.phone,
      email: data.email,
      address_street1: data.address_street1,
      address_street2: data.address_street2,
      address_city: data.address_city,
      address_state: data.address_state,
      address_country: data.address_country,
      address_postal_code: data.address_postal_code,
      note: data.note,
      // Add new fields
      tax_number: data.tax_number,
      payment_terms: data.payment_terms,
      currency: data.currency,
      billing_address: data.billing_address,
      billing_city: data.billing_city,
      billing_state: data.billing_state,
      billing_postal_code: data.billing_postal_code,
      billing_country: data.billing_country,
    })
    .eq('id', clientId);

  if (error) throw error;
}

export async function deleteClient(
  supabase: SupabaseClient,
  clientId: string
): Promise<void> {
  const { error } = await supabase
    .from('Clients')
    .delete()
    .eq('id', clientId);

  if (error) throw error;
}

// Create order form
export async function createOrderForm(
  supabase: SupabaseClient,
  tenantId: string,
  data: Omit<OrderFormData, 'products'> & { products?: { product_id: string; packaging_id: string; }[] }
): Promise<OrderForm> {
  // First, create the order form without products
  const { data: orderForm, error } = await supabase
    .from('OrderForms')
    .insert({
      tenant_id: tenantId,
      code: data.code,
      name: data.name,
      client_id: data.client_id,
      expires_at: data.expires_at,
      access_code: data.access_code,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order form:', error);
    throw error;
  }

  // Then, if there are products, insert them
  if (data.products && data.products.length > 0) {
    const { error: productsError } = await supabase
      .from('OrderFormProducts')
      .insert(
        data.products.map((p, index) => ({
          order_form_id: orderForm.id,
          product_id: p.product_id,
          packaging_id: p.packaging_id,
          sort_order: index
        }))
      );

    if (productsError) {
      console.error('Error adding order form products:', productsError);
      throw productsError;
    }
  }

  return orderForm;
}

// Get order form with products
export async function getOrderForm(
  supabase: SupabaseClient,
  formId: string
): Promise<OrderForm & { products: OrderFormProduct[] }> {
  const { data: orderForm, error } = await supabase
    .from('OrderForms')
    .select(`
      *,
      OrderFormProducts (
        *,
        product:Products!orderformproducts_product_id_fkey (
          id,
          code,
          name,
          description,
          image_url
        ),
        packaging:ProductPackaging!orderformproducts_packaging_id_fkey (
          id,
          quantity,
          price,
          unit:Units!productpackaging_unit_id_fkey (
            id,
            code,
            name
          ),
          inner_quantity,
          inner_unit:Units!productpackaging_inner_unit_id_fkey (
            id,
            code,
            name
          ),
          inner_pieces
        )
      )
    `)
    .eq('id', formId)
    .single();

  if (error) {
    console.error('Error loading order form:', error);
    throw error;
  }

  // Transform the response to match the expected type
  return {
    ...orderForm,
    products: (orderForm.OrderFormProducts || []).map(p => ({
      order_form_id: p.order_form_id,
      product_id: p.product_id,
      packaging_id: p.packaging_id,
      price: p.price,
      sort_order: p.sort_order,
      product: p.product,
      packaging: p.packaging
    }))
  };
}

// Create order
export async function createOrder(
  supabase: SupabaseClient,
  orderFormId: string,
  clientId: string,
  data: OrderData
): Promise<Order> {
  // First create the order
  const { data: order, error: orderError } = await supabase
    .from('Orders')
    .insert({
      order_form_id: orderFormId,
      client_id: clientId,
      notes: data.notes,
      delivery_date: data.delivery_date,
      status: 'pending'
    })
    .select()
    .single();

  if (orderError) {
    console.error('Error creating order:', orderError);
    throw orderError;
  }

  // Then create order items
  if (data.items && data.items.length > 0) {
    const { error: itemsError } = await supabase
      .from('OrderItems')
      .insert(
        data.items.map(item => ({
          order_id: order.id,
          product_id: item.product_id,
          packaging_id: item.packaging_id,
          quantity: item.quantity,
          price: item.price // Using price instead of unit_price
        }))
      );

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }
  }

  return order;
}

// Add these new queries
export async function getOrderFormProducts(
  supabase: SupabaseClient,
  orderFormId: string
): Promise<OrderFormProduct[]> {
  const { data, error } = await supabase
    .from('OrderFormProducts')
    .select(`
      *,
      product:Products (
        id,
        code,
        name,
        description,
        image_url
      ),
      packaging:ProductPackaging!orderformproducts_packaging_id_fkey (
        id,
        quantity,
        price,
        unit:Units!productpackaging_unit_id_fkey (
          id,
          code,
          name
        ),
        inner_quantity,
        inner_unit:Units!productpackaging_inner_unit_id_fkey (
          id,
          code,
          name
        ),
        inner_pieces
      )
    `)
    .eq('order_form_id', orderFormId)
    .order('sort_order');

  if (error) {
    console.error('Error loading order form products:', error);
    throw error;
  }

  return data || [];
}

export async function addOrderFormProduct(
  supabase: SupabaseClient,
  orderFormId: string,
  productId: string,
  packagingId: string,
  price: number,
  sortOrder: number
): Promise<void> {
  const { error } = await supabase
    .from('OrderFormProducts')
    .insert({
      order_form_id: orderFormId,
      product_id: productId,
      packaging_id: packagingId,
      price,
      sort_order: sortOrder
    });

  if (error) {
    console.error('Error adding order form product:', error);
    throw error;
  }
}

export async function updateOrderFormProduct(
  supabase: SupabaseClient,
  orderFormId: string,
  productId: string,
  packagingId: string,
  updates: {
    price?: number;
    sort_order?: number;
  }
) {
  const { data, error } = await supabase
    .from('OrderFormProducts')
    .update(updates)
    .eq('order_form_id', orderFormId)
    .eq('product_id', productId)
    .eq('packaging_id', packagingId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function removeOrderFormProduct(
  supabase: SupabaseClient,
  orderFormId: string,
  productId: string,
  packagingId: string
): Promise<void> {
  const { error } = await supabase
    .from('OrderFormProducts')
    .delete()
    .eq('order_form_id', orderFormId)
    .eq('product_id', productId)
    .eq('packaging_id', packagingId);

  if (error) {
    console.error('Error removing order form product:', error);
    throw error;
  }
}

export async function getActiveProducts(
  supabase: SupabaseClient,
  tenantId: string
): Promise<Product[]> {
  const { data, error } = await supabase
    .from('Products')
    .select(`
      *,
      packaging:ProductPackaging!productpackaging_product_id_fkey (
        id,
        quantity,
        price,
        unit:Units!productpackaging_unit_id_fkey (
          id,
          code,
          name
        ),
        inner_quantity,
        inner_unit:Units!productpackaging_inner_unit_id_fkey (
          id,
          code,
          name
        ),
        inner_pieces
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .order('name');

  if (error) {
    console.error('Error loading products:', error);
    throw error;
  }

  return data || [];
}

// Add new queries for OrderFormsPage
export async function getOrderForms(
  supabase: SupabaseClient,
  tenantId: string,
  page: number,
  itemsPerPage: number
): Promise<{ data: OrderForm[]; count: number }> {
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;

  const { data, error, count } = await supabase
    .from('OrderForms')
    .select(`
      *,
      client:Clients (
        id,
        name,
        code
      )
    `, { count: 'exact' })
    .eq('tenant_id', tenantId)
    .range(from, to)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error loading order forms:', error);
    throw error;
  }

  return { data: data || [], count: count || 0 };
}

export async function deleteOrderForm(
  supabase: SupabaseClient,
  formId: string
): Promise<void> {
  const { error } = await supabase
    .from('OrderForms')
    .delete()
    .eq('id', formId);

  if (error) {
    console.error('Error deleting order form:', error);
    throw error;
  }
}

export async function updateOrderForm(
  supabase: SupabaseClient,
  formId: string,
  data: Partial<OrderForm>
): Promise<void> {
  const { error } = await supabase
    .from('OrderForms')
    .update({
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq('id', formId);

  if (error) {
    console.error('Error updating order form:', error);
    throw error;
  }
}

export async function updateOrderFormDetails(
  supabase: SupabaseClient,
  formId: string,
  data: {
    name: string;
    is_active: boolean;
    expires_at?: string;
    access_code?: string;
    supplier_name?: string;
  }
): Promise<void> {
  const { error } = await supabase
    .from('OrderForms')
    .update({
      name: data.name,
      is_active: data.is_active,
      expires_at: data.expires_at,
      access_code: data.access_code,
      supplier_name: data.supplier_name,
      updated_at: new Date().toISOString()
    })
    .eq('id', formId);

  if (error) {
    console.error('Error updating order form details:', error);
    throw error;
  }
}

export async function createOrderFormWithProducts(
  supabase: SupabaseClient,
  tenantId: string,
  data: OrderFormData
): Promise<void> {
  // First create the order form
  const { data: orderForm, error: formError } = await supabase
    .from('OrderForms')
    .insert({
      tenant_id: tenantId,
      code: data.code,
      name: data.name,
      client_id: data.client_id,
      expires_at: data.expires_at,
      access_code: data.access_code,
      supplier_name: data.supplier_name,
      is_active: true
    })
    .select()
    .single();

  if (formError) {
    console.error('Error creating order form:', formError);
    throw formError;
  }

  // Then add products if any
  if (data.products && data.products.length > 0) {
    // Get current prices for all products
    const { data: packagingPrices } = await supabase
      .from('ProductPackaging')
      .select('id, price')
      .in('id', data.products.map(p => p.packaging_id));

    const pricesMap = new Map(packagingPrices?.map(p => [p.id, p.price]));

    const { error: productsError } = await supabase
      .from('OrderFormProducts')
      .insert(
        data.products.map((p, index) => ({
          order_form_id: orderForm.id,
          product_id: p.product_id,
          packaging_id: p.packaging_id,
          price: pricesMap.get(p.packaging_id),
          sort_order: index
        }))
      );

    if (productsError) {
      console.error('Error adding order form products:', productsError);
      throw productsError;
    }
  }
}

interface SearchClientsParams {
  searchTerm: string;
  limit?: number;
}

export async function searchClients(
  supabase: SupabaseClient,
  tenantId: string,
  { searchTerm, limit = 10 }: SearchClientsParams
) {
  if (!searchTerm.trim()) {
    return {
      clients: [],
      count: 0,
    };
  }

  const cleanSearchTerm = searchTerm.trim().toLowerCase();
  
  const query = supabase
    .from('Clients')
    .select('*', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .or(
      `name.ilike.%${cleanSearchTerm}%,` +
      `code.ilike.%${cleanSearchTerm}%,` +
      `email.ilike.%${cleanSearchTerm}%,` +
      `phone.ilike.%${cleanSearchTerm}%`
    )
    .order('name')
    .limit(limit);

  const { data: clients, error, count } = await query;

  if (error) {
    console.error('Error searching clients:', error);
    throw error;
  }

  return {
    clients: (clients || []) as Client[],
    count: count || 0,
  };
}

export async function getOrders(
  supabase: SupabaseClient,
  page: number,
  itemsPerPage: number,
  filters: {
    searchTerm?: string;
    clientId?: string | null;
    status?: string | null;
    startDate?: Date | null;
    endDate?: Date | null;
  }
): Promise<{ data: Order[]; count: number }> {
  let query = supabase
    .from('Orders')
    .select(`
      *,
      client:Clients (
        id,
        name,
        code
      ),
      order_form:OrderForms (
        name,
        supplier_name
      )
    `, { count: 'exact' })
    .range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

  // Apply filters
  if (filters.searchTerm) {
    query = query.or(
      `notes.ilike.%${filters.searchTerm}%`
    );
  }

  if (filters.clientId) {
    query = query.eq('client_id', filters.clientId);
  }

  if (filters.status) {
    query = query.eq('status', filters.status);
  }

  if (filters.startDate) {
    query = query.gte('created_at', filters.startDate.toISOString());
  }

  if (filters.endDate) {
    query = query.lte('created_at', filters.endDate.toISOString());
  }

  // Add pagination
  const from = (page - 1) * itemsPerPage;
  const to = from + itemsPerPage - 1;
  query = query.range(from, to);

  // Add sorting
  query = query.order('created_at', { ascending: false });

  const { data, error, count } = await query;

  if (error) {
    console.error('Error loading orders:', error);
    throw error;
  }

  return { data: data || [], count: count || 0 };
}

export async function createOrderFormForClient(
  supabase: SupabaseClient,
  tenantId: string,
  client: Client
): Promise<OrderForm> {
  const { data: orderForm, error } = await supabase
    .from('OrderForms')
    .insert({
      tenant_id: tenantId,
      client_id: client.id,
      code: `OF-${Date.now()}`,
      name: `Order Form for ${client.name}`,
      is_active: true
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order form:', error);
    throw error;
  }

  return orderForm;
}

export async function getClientDetails(
  supabase: SupabaseClient,
  clientId: string
): Promise<Client> {
  const { data: client, error } = await supabase
    .from('Clients')
    .select('*')
    .eq('id', clientId)
    .single();

  if (error) {
    console.error('Error loading client details:', error);
    throw error;
  }

  return client;
}

export const deleteProduct = async (
  supabase: SupabaseClient,
  productId: string
) => {
  // Soft delete by updating is_deleted flag
  const { error } = await supabase
    .from('Products')
    .update({ is_deleted: true })
    .eq('id', productId);

  if (error) throw error;
};

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

export async function getInvoiceSettings(
  supabase: SupabaseClient,
  tenantId: string
) {
  const { data, error } = await supabase
    .from('InvoiceSettings')
    .select('*')
    .eq('tenant_id', tenantId)
    .single();

  // If no record is found, return an empty object instead of throwing an error
  if (error && error.code !== 'PGRST116') { // PGRST116 is the error code for "No rows found"
    throw error;
  }

  return data || {
    company_name: '',
    company_registration: '',
    company_address: '',
    company_phone: '',
    company_email: '',
    invoice_prefix: 'INV-',
    next_invoice_number: 1,
    tax_rate: 0,
    currency: 'USD',
    payment_terms: 'Net 30',
    payment_instructions: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
    footer_notes: '',
    terms_conditions: ''
  };
}

export async function updateInvoiceSettings(
  supabase: SupabaseClient,
  tenantId: string,
  settings: {
    company_name?: string;
    company_registration?: string;
    company_address?: string;
    company_phone?: string;
    company_email?: string;
    invoice_prefix?: string;
    next_invoice_number?: number;
    tax_rate?: number;
    currency?: string;
    payment_terms?: string;
    payment_instructions?: string;
    bank_name?: string;
    bank_account_name?: string;
    bank_account_number?: string;
    footer_notes?: string;
    terms_conditions?: string;
  }
) {
  const { data, error } = await supabase
    .from('InvoiceSettings')
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

export async function createOrderFormProduct(
  supabase: SupabaseClient,
  orderFormId: string,
  product: {
    product_id: string;
    packaging_id: string;
    price: number;
    sort_order: number;
  }
) {
  const { data, error } = await supabase
    .from('OrderFormProducts')
    .insert({
      order_form_id: orderFormId,
      ...product
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
