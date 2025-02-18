create or replace function create_default_tenant(tenant_name text, owner_id uuid)
returns uuid as $$
declare
  new_tenant_id uuid;
begin
  -- Insert new tenant
  insert into tenants (name, created_by)
  values (tenant_name, owner_id)
  returning id into new_tenant_id;

  -- Add owner as tenant admin
  insert into tenant_users (tenant_id, user_id, role)
  values (new_tenant_id, owner_id, 'admin');

  return new_tenant_id;
end;
$$ language plpgsql security definer;