-- ========================================================
-- SUPABASE DATABASE SCHEMA & COMPLETE FIX FOR ARMARIO VIRTUAL
-- Proyecto: online@appdesignsoftware.com's Project
-- Project ID: aouvpbvjrsbtufhrmwaj
-- URL: https://aouvpbvjrsbtufhrmwaj.supabase.co
-- ========================================================

-- 1. Habilitar extensión UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE CATEGORÍAS (categories)
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  description TEXT,
  icon_name TEXT DEFAULT 'Tag',
  subcategories JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'Tag';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

-- 3. TABLA DE PRODUCTOS (products)
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_type TEXT DEFAULT 'sencillo',
  category TEXT NOT NULL,
  subcategory TEXT DEFAULT 'General',
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  is_offer BOOLEAN DEFAULT FALSE,
  offer_price NUMERIC(10, 2),
  discount_percentage NUMERIC DEFAULT 0,
  stock NUMERIC DEFAULT 0,
  sku TEXT,
  images JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '[]'::jsonb,
  colors JSONB DEFAULT '[]'::jsonb,
  color_images JSONB DEFAULT '{}'::jsonb,
  variant_stock JSONB DEFAULT '[]'::jsonb,
  size_guide JSONB DEFAULT NULL,
  size_guide_template_id TEXT,
  description TEXT,
  tags JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  is_published BOOLEAN DEFAULT TRUE,
  youtube_url TEXT,
  date_added TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'sencillo';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT 'General';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS offer_price NUMERIC(10, 2);
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_images JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variant_stock JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide JSONB DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide_template_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS date_added TEXT;
ALTER TABLE public.products ALTER COLUMN sku DROP NOT NULL;

-- 4. TABLA DE PLANTILLAS DE MEDIDAS (size_guide_templates)
CREATE TABLE IF NOT EXISTS public.size_guide_templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT DEFAULT 'General',
  unit TEXT DEFAULT 'cm',
  columns JSONB DEFAULT '[]'::jsonb,
  rows JSONB DEFAULT '[]'::jsonb,
  image_url TEXT,
  instructions TEXT,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TEXT
);

-- 5. TABLA DE CLIENTES (customers)
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  favorite_store TEXT,
  status TEXT DEFAULT 'activo',
  addresses JSONB DEFAULT '[]'::jsonb,
  wishlist_product_ids JSONB DEFAULT '[]'::jsonb,
  total_orders NUMERIC DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  registered_at TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. TABLA DE PEDIDOS / VENTAS (orders)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL,
  customer_name TEXT,
  customer_email TEXT,
  customer_phone TEXT,
  shipping_address JSONB DEFAULT '{}'::jsonb,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) DEFAULT 0,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) DEFAULT 0,
  status TEXT DEFAULT 'pendiente',
  payment_method TEXT,
  shipping_provider TEXT,
  tracking_number TEXT,
  created_at TEXT,
  estimated_delivery TEXT,
  status_history JSONB DEFAULT '[]'::jsonb
);

-- 7. TABLA DE CONFIGURACIÓN DE ENVÍOS (shipping_config)
CREATE TABLE IF NOT EXISTS public.shipping_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  default_origin_postal_code TEXT,
  free_shipping_threshold NUMERIC(10, 2) DEFAULT 499,
  local_delivery_cost NUMERIC(10, 2) DEFAULT 49,
  national_delivery_cost NUMERIC(10, 2) DEFAULT 79,
  express_delivery_cost NUMERIC(10, 2) DEFAULT 149,
  carriers JSONB DEFAULT '[]'::jsonb,
  envios_com_api_key TEXT,
  envios_com_sandbox_mode BOOLEAN DEFAULT TRUE,
  auto_generate_labels BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 8. TABLA DE DISEÑO DE TIENDA (store_design)
CREATE TABLE IF NOT EXISTS public.store_design (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT DEFAULT 'Armario Virtual',
  primary_color TEXT DEFAULT '#9E0D0D',
  top_announcement_text TEXT,
  top_announcement_active BOOLEAN DEFAULT TRUE,
  hero_sliders JSONB DEFAULT '[]'::jsonb,
  promotional_flyers JSONB DEFAULT '[]'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 9. TABLA DE EMPLEADOS Y ROLES (employees)
CREATE TABLE IF NOT EXISTS public.employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT DEFAULT 'vendedor',
  department TEXT,
  status TEXT DEFAULT 'activo',
  permissions JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 10. TABLA DE PERFIL ADMINISTRADOR (admin_profile)
CREATE TABLE IF NOT EXISTS public.admin_profile (
  id TEXT PRIMARY KEY DEFAULT 'admin-1',
  name TEXT,
  email TEXT,
  phone TEXT,
  role TEXT,
  store_name TEXT,
  store_description TEXT,
  store_address TEXT,
  whatsapp_number TEXT,
  social_links JSONB DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ========================================================
-- PERMISOS Y DESACTIVACIÓN DE RLS PARA PERMITIR ACCESO TOTAL
-- ========================================================
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_guide_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_design DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profile DISABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;

NOTIFY pgrst, 'reload schema';
