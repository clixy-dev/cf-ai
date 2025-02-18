-- Add tenant_status enum
create type tenant_status as enum ('pending', 'approved', 'suspended', 'exited');

create table
  public."Tenants" (
    id uuid not null default gen_random_uuid (),
    name character varying(255) not null,
    subdomain character varying(100) not null,
    plan character varying(50) not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    is_active boolean not null default true,
    is_deleted boolean not null default false,
    role text not null,
    status tenant_status not null default 'pending',
    constraint tenants_pkey primary key (id),
    constraint unique_subdomain unique (subdomain)
  ) tablespace pg_default;

  create table
  public."UserTenants" (
    id uuid not null default gen_random_uuid (),
    user_id uuid not null,
    tenant_id uuid not null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint usertenants_pkey primary key (id),
    constraint unique_user_tenant unique (user_id, tenant_id),
    constraint usertenants_tenant_id_fkey foreign key (tenant_id) references "Tenants" (id) on delete cascade,
    constraint usertenants_user_id_fkey foreign key (user_id) references auth.users (id) on delete cascade
  ) tablespace pg_default;



create table
  public."TenantSettings" (
    id uuid not null default gen_random_uuid (),
    tenant_id uuid not null,
    company_name varchar(255) null,
    company_uen varchar(50) null,
    company_email varchar(255) null,
    company_phone varchar(50) null,
    company_address text null,
    company_description text null,
    terms_accepted boolean default false,
    logo_url text null,
    created_at timestamp with time zone not null default now(),
    updated_at timestamp with time zone not null default now(),
    constraint tenant_settings_pkey primary key (id),
    constraint tenant_settings_tenant_id_fkey foreign key (tenant_id) references "Tenants" (id),
    constraint tenant_settings_tenant_unique unique (tenant_id)
  ) tablespace pg_default;

-- Add theme_colors column to TenantSettings table
ALTER TABLE public."TenantSettings"
ADD COLUMN theme_colors jsonb DEFAULT '{"primary": "#8AB661", "secondary": "#2F855A"}'::jsonb;


-- Add storage bucket for company logos
insert into storage.buckets (id, name, public) 
values ('company-logos', 'company-logos', true);

-- Create storage policies for company logos
create policy "Authenticated users can upload company logos"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'company-logos' AND
  auth.role() = 'authenticated'
);

create policy "Anyone can view company logos"
on storage.objects for select
to public
using ( bucket_id = 'company-logos' );

create policy "Authenticated users can delete their company logos"
on storage.objects for delete
to authenticated
using ( bucket_id = 'company-logos' );

-- Enable RLS

-- Messages table for all platforms
create type message_direction as enum ('inbound', 'outbound');
create type message_status as enum ('pending', 'sent', 'delivered', 'read', 'failed');
create type messaging_platform as enum ('telegram', 'whatsapp', 'instagram', 'line');

create table messages (
  id uuid primary key default uuid_generate_v4(),
  platform messaging_platform not null,
  direction message_direction not null,
  status message_status not null default 'pending',
  platform_message_id text,
  platform_chat_id text not null,
  platform_user_id text,
  content text not null,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table messages enable row level security;

-- Platform credentials table
create table platform_credentials (
  id uuid primary key default uuid_generate_v4(),
  platform messaging_platform not null,
  credentials jsonb not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform)
);

-- Message templates
create table message_templates (
  id uuid primary key default uuid_generate_v4(),
  platform messaging_platform not null,
  name text not null,
  content text not null,
  parameters jsonb,
  metadata jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (platform, name)
);

-- RLS Policies
create policy "Messages are viewable by authenticated users only"
  on messages for select
  to authenticated
  using (true);

create policy "Messages are insertable by service role only"
  on messages for insert
  to service_role
  with check (true);

-- Indexes
create index messages_platform_chat_id_idx on messages(platform, platform_chat_id);
create index messages_platform_message_id_idx on messages(platform, platform_message_id);
create index messages_created_at_idx on messages(created_at);

-- Functions
create or replace function handle_message_update()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers
create trigger messages_updated_at
  before update on messages
  for each row
  execute procedure handle_message_update();

