-- ========================================================
-- SUPABASE DATABASE SCHEMA & INITIAL SEED FOR ARMARIO VIRTUAL
-- Proyecto: online@appdesignsoftware.com's Project
-- Project ID: aouvpbvjrsbtufhrmwaj
-- URL: https://aouvpbvjrsbtufhrmwaj.supabase.co
-- ========================================================

-- 1. Habilitar extensión UUID si es necesaria
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. TABLA DE PRODUCTOS (products)
DROP TABLE IF EXISTS public.products CASCADE;
CREATE TABLE public.products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  product_type TEXT DEFAULT 'variable',
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  is_offer BOOLEAN DEFAULT FALSE,
  offer_price NUMERIC(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT NOT NULL UNIQUE,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  youtube_url TEXT,
  description TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  date_added TEXT NOT NULL
);

-- Si la tabla products ya existe en Supabase, ejecuta esta linea para agregar la columna product_type:
-- ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'variable';

-- Habilitar RLS y políticas en products
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir lectura publica de productos" ON public.products FOR SELECT USING (true);
CREATE POLICY "Permitir insercion/modificacion a todos" ON public.products FOR ALL USING (true);

-- 3. TABLA DE CLIENTES (customers)
DROP TABLE IF EXISTS public.customers CASCADE;
CREATE TABLE public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  avatar_url TEXT,
  favorite_store TEXT,
  addresses JSONB NOT NULL DEFAULT '[]'::jsonb,
  wishlist_product_ids JSONB NOT NULL DEFAULT '[]'::jsonb,
  registered_at TEXT
);

ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a clientes" ON public.customers FOR ALL USING (true);

-- 4. TABLA DE PEDIDOS / VENTAS (orders)
DROP TABLE IF EXISTS public.orders CASCADE;
CREATE TABLE public.orders (
  id TEXT PRIMARY KEY,
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address JSONB NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal NUMERIC(10, 2) NOT NULL,
  shipping_cost NUMERIC(10, 2) DEFAULT 0,
  discount_amount NUMERIC(10, 2) DEFAULT 0,
  total NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendiente',
  payment_method TEXT NOT NULL,
  shipping_provider TEXT NOT NULL,
  tracking_number TEXT,
  created_at TEXT NOT NULL,
  estimated_delivery TEXT,
  status_history JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a pedidos" ON public.orders FOR ALL USING (true);

-- 5. TABLA DE CONFIGURACIÓN DE ENVÍOS (shipping_config)
DROP TABLE IF EXISTS public.shipping_config CASCADE;
CREATE TABLE public.shipping_config (
  id TEXT PRIMARY KEY DEFAULT 'default',
  free_shipping_threshold NUMERIC(10, 2) NOT NULL DEFAULT 499,
  default_flat_rate NUMERIC(10, 2) NOT NULL DEFAULT 79,
  express_rate NUMERIC(10, 2) NOT NULL DEFAULT 149,
  carriers JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.shipping_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a envios" ON public.shipping_config FOR ALL USING (true);

-- 6. TABLA DE DISEÑO DE TIENDA (store_design)
DROP TABLE IF EXISTS public.store_design CASCADE;
CREATE TABLE public.store_design (
  id TEXT PRIMARY KEY DEFAULT 'default',
  store_name TEXT NOT NULL,
  logo_text TEXT NOT NULL,
  logo_subtext TEXT,
  logo_url TEXT,
  announcement_bar_text TEXT,
  announcement_bar_active BOOLEAN DEFAULT TRUE,
  primary_color TEXT DEFAULT '#9E0D0D',
  accent_color TEXT DEFAULT '#E05A1B',
  hero_sliders JSONB NOT NULL DEFAULT '[]'::jsonb,
  promotional_flyers JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.store_design ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a diseno" ON public.store_design FOR ALL USING (true);

-- 7. TABLA DE CATEGORÍAS Y SUBCATEGORÍAS (categories)
DROP TABLE IF EXISTS public.categories CASCADE;
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon_name TEXT,
  subcategories JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a categorias" ON public.categories FOR ALL USING (true);

-- 8. TABLA DE EMPLEADOS Y ROLES (employees)
DROP TABLE IF EXISTS public.employees CASCADE;
CREATE TABLE public.employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'vendedor',
  department TEXT,
  status TEXT NOT NULL DEFAULT 'activo',
  avatar_url TEXT,
  created_at TEXT NOT NULL,
  last_login TEXT
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a empleados" ON public.employees FOR ALL USING (true);

-- ========================================================
-- INSERCIÓN DE DATOS INICIALES (SEED DATA)
-- ========================================================

INSERT INTO public.products (
  id, name, category, subcategory, price, original_price, is_offer, offer_price, discount_percentage, stock, sku, images, sizes, colors, youtube_url, description, tags, is_featured, date_added
) VALUES
(
  'prod-1',
  'Chamarra Capitonada con Gorro Acolchada',
  'mujer',
  'Abrigos y Chamarras',
  699.00,
  1199.00,
  TRUE,
  499.00,
  41,
  24,
  'REL-M-9021',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["CH", "M", "G", "XG"]'::jsonb,
  '[{"name": "Morado Elegante", "hex": "#632488"}, {"name": "Negro Azabache", "hex": "#1a1a1a"}]'::jsonb,
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'Chamarra capitonada acolchada de cuello alto con gorro desmontable y bolsas laterales con cierre.',
  '["Gran Barata", "Otoño e Invierno"]'::jsonb,
  TRUE,
  '2026-07-01'
),
(
  'prod-2',
  'Vestido Casual Manga Larga Estampado Floral',
  'mujer',
  'Vestidos',
  499.00,
  799.00,
  FALSE,
  499.00,
  37,
  18,
  'SUB-M-8820',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["CH", "M", "G"]'::jsonb,
  '[{"name": "Floral Azul", "hex": "#1e3d59"}]'::jsonb,
  NULL,
  'Elegante vestido corte A con manga larga suave y escote sutil.',
  '["Moda Mujer", "Tendencia"]'::jsonb,
  TRUE,
  '2026-07-10'
);
