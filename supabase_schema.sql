-- ========================================================
-- SUPABASE DATABASE SCHEMA & INITIAL SEED FOR ROPA EN LÍNEA
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
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  original_price NUMERIC(10, 2),
  discount_percentage INTEGER DEFAULT 0,
  stock INTEGER NOT NULL DEFAULT 0,
  sku TEXT NOT NULL UNIQUE,
  images JSONB NOT NULL DEFAULT '[]'::jsonb,
  sizes JSONB NOT NULL DEFAULT '[]'::jsonb,
  colors JSONB NOT NULL DEFAULT '[]'::jsonb,
  description TEXT,
  tags JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT FALSE,
  date_added TEXT NOT NULL
);

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
  primary_color TEXT DEFAULT '#632488',
  accent_color TEXT DEFAULT '#d81b60',
  hero_sliders JSONB NOT NULL DEFAULT '[]'::jsonb,
  promotional_flyers JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.store_design ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a diseno" ON public.store_design FOR ALL USING (true);

-- ========================================================
-- INSERCIÓN DE DATOS INICIALES (SEED DATA)
-- ========================================================

INSERT INTO public.products (
  id, name, category, subcategory, price, original_price, discount_percentage, stock, sku, images, sizes, colors, description, tags, is_featured, date_added
) VALUES
(
  'prod-1',
  'Chamarra Capitonada con Gorro Acolchada',
  'mujer',
  'Abrigos y Chamarras',
  699.00,
  1199.00,
  41,
  24,
  'REL-M-9021',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["CH", "M", "G", "XG"]'::jsonb,
  '[{"name": "Morado Elegante", "hex": "#632488"}, {"name": "Negro Azabache", "hex": "#1a1a1a"}, {"name": "Palo de Rosa", "hex": "#e8b4b8"}]'::jsonb,
  'Chamarra capitonada acolchada de cuello alto con gorro desmontable y bolsas laterales con cierre. Ideal para protegerte del frío con estilo moderno y confort supremo.',
  '["Gran Barata", "Otoño e Invierno", "Exclusivo en Línea"]'::jsonb,
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
  37,
  18,
  'SUB-M-8820',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["CH", "M", "G"]'::jsonb,
  '[{"name": "Floral Azul", "hex": "#1e3d59"}, {"name": "Vino", "hex": "#581845"}]'::jsonb,
  'Elegante vestido corte A con manga larga suave y escote sutil. Perfecto para eventos casuales y de oficina. Tejido elástico y fresco.',
  '["Moda Mujer", "Tendencia", "Novedad"]'::jsonb,
  TRUE,
  '2026-07-10'
),
(
  'prod-3',
  'Jeans Corte Slim Fit Mezclilla Stretch',
  'hombre',
  'Pantalones y Jeans',
  399.00,
  649.00,
  38,
  35,
  'SUB-H-4410',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["28", "30", "32", "34", "36"]'::jsonb,
  '[{"name": "Azul Índigo", "hex": "#203a43"}, {"name": "Azul Claro Deslavado", "hex": "#637373"}, {"name": "Negro", "hex": "#000000"}]'::jsonb,
  'Pantalón de mezclilla corte slim stretch para hombre. Confeccionado con algodón suave de alta durabilidad y libertad de movimiento.',
  '["Básicos Hombre", "Gran Barata"]'::jsonb,
  TRUE,
  '2026-07-12'
),
(
  'prod-4',
  'Saco Formal de Vestir Corte Moderno',
  'hombre',
  'Sacos y Trajes',
  1199.00,
  1899.00,
  36,
  12,
  'SUB-H-1022',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["38R", "40R", "42R"]'::jsonb,
  '[{"name": "Azul Marino", "hex": "#0a192f"}, {"name": "Gris Oxford", "hex": "#333333"}]'::jsonb,
  'Saco vestir para caballero de estructura semi-armada. Incluye bolsas frontales con solapa e interior completamente forrado.',
  '["Elegante", "Moda Caballero"]'::jsonb,
  FALSE,
  '2026-06-25'
),
(
  'prod-5',
  'Tenis Urbanos Casuales Suela Ancha',
  'calzado',
  'Tenis Casuales',
  549.00,
  899.00,
  38,
  40,
  'SUB-Z-5501',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["25 MX", "26 MX", "27 MX", "28 MX", "29 MX"]'::jsonb,
  '[{"name": "Blanco Puro", "hex": "#ffffff"}, {"name": "Negro con Blanco", "hex": "#111111"}]'::jsonb,
  'Tenis estilo streetwear de suela antiderrapante de goma, ajuste por agujetas y plantilla confort acolchada para uso diario prolongado.',
  '["Calzado", "Envío Gratis", "Top Ventas"]'::jsonb,
  TRUE,
  '2026-07-15'
),
(
  'prod-6',
  'Conjunto Infantil Deportivo Sudadera y Pants',
  'ninos',
  'Moda Infantil',
  349.00,
  599.00,
  41,
  30,
  'SUB-N-3011',
  '["https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg"]'::jsonb,
  '["4 Años", "6 Años", "8 Años", "10 Años"]'::jsonb,
  '[{"name": "Azul Rey", "hex": "#0055ff"}, {"name": "Amarillo Mostaza", "hex": "#e6a100"}]'::jsonb,
  'Conjunto deportivo de felpa súper suave para niñas y niños. Sudadera con gorro y pants con resorte ajustable en la cintura.',
  '["Infantil", "Gran Barata"]'::jsonb,
  FALSE,
  '2026-07-02'
);

-- 7. TABLA DE CATEGORÍAS Y SUBCATEGORÍAS (categories)
DROP TABLE IF EXISTS public.categories CASCADE;
CREATE TABLE public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  subcategories JSONB NOT NULL DEFAULT '[]'::jsonb
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a categorias" ON public.categories FOR ALL USING (true);

-- 8. TABLA DE EMPLEADOS Y CREDENCIALES (employees)
DROP TABLE IF EXISTS public.employees CASCADE;
CREATE TABLE public.employees (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  username TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'vendedor',
  status TEXT NOT NULL DEFAULT 'activo',
  created_at TEXT NOT NULL
);

ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a empleados" ON public.employees FOR ALL USING (true);

-- 9. TABLA DE PERFIL DE ADMINISTRADOR (admin_profile)
DROP TABLE IF EXISTS public.admin_profile CASCADE;
CREATE TABLE public.admin_profile (
  id TEXT PRIMARY KEY DEFAULT 'admin-default',
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'Administrador General',
  store_name TEXT NOT NULL DEFAULT 'Armario Virtual',
  rfc TEXT,
  address TEXT
);

ALTER TABLE public.admin_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Permitir acceso a perfil admin" ON public.admin_profile FOR ALL USING (true);

-- ========================================================
-- INSERCIÓN DE DATOS INICIALES (CATEGORÍAS, EMPLEADOS, PERFIL ADMIN)
-- ========================================================

INSERT INTO public.categories (id, name, slug, description, image_url, subcategories) VALUES
(
  'cat-1',
  'Moda Mujer',
  'mujer',
  'Ropa, vestidos, abrigos y calzado exclusivo para dama.',
  'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg',
  '[{"id": "sub-101", "name": "Vestidos"}, {"id": "sub-102", "name": "Abrigos y Chamarras"}, {"id": "sub-103", "name": "Blusas y Tops"}, {"id": "sub-104", "name": "Pantalones y Jeans"}]'::jsonb
),
(
  'cat-2',
  'Moda Hombre',
  'hombre',
  'Pantalones, camisas, sacos y ropa urbana para caballero.',
  'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg',
  '[{"id": "sub-201", "name": "Pantalones y Jeans"}, {"id": "sub-202", "name": "Sacos y Trajes"}, {"id": "sub-203", "name": "Camisas y Playeras"}]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.employees (id, name, username, password, email, phone, role, status, created_at) VALUES
('emp-1', 'Carlos Mendoza', 'cmendoza', 'cmendozapass2026', 'carlos.mendoza@armariovirtual.com', '55 9876 5432', 'vendedor', 'activo', '2026-01-15'),
('emp-2', 'Laura Gómez', 'lgomez', 'lgomezpass2026', 'laura.gomez@armariovirtual.com', '55 8765 4321', 'inventario', 'activo', '2026-02-01')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.admin_profile (id, name, email, phone, role, store_name, rfc, address) VALUES
('admin-default', 'Adrian Morga', 'adrian.morga@armariovirtual.com', '55 1234 5678', 'Super Administrador', 'Armario Virtual', 'MORA850412XYZ', 'Av. Insurgentes Sur 1602, Crédito Constructor, Benito Juárez, CDMX')
ON CONFLICT (id) DO NOTHING;

-- Diseño de Tienda
INSERT INTO public.store_design (
  id, store_name, logo_text, logo_subtext, announcement_bar_text, announcement_bar_active, primary_color, accent_color, hero_sliders, promotional_flyers
) VALUES (
  'default',
  'Armario Virtual',
  'ARMARIO VIRTUAL',
  'TU ESTILO LIBRE',
  '⚡ ¡GRAN BARATA ARMARIO VIRTUAL! Hasta 50% de descuento en Moda y Calzado + Envío Gratis desde $499',
  TRUE,
  '#632488',
  '#d81b60',
  '[
    {
      "id": "slide-1",
      "title": "GRAN BARATA DE TEMPORADA",
      "subtitle": "Hasta 50% de descuento directo en marcas seleccionadas de Moda Mujer y Caballero.",
      "badge": "OFERTA EXCLUSIVA WEB",
      "buttonText": "Ver Ofertas de Barata",
      "categoryTarget": "ofertas",
      "imageUrl": "https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerprincipal.png",
      "bgGradient": "from-purple-900/90 via-purple-800/80 to-pink-900/70",
      "active": true
    }
  ]'::jsonb,
  '[
    {
      "id": "flyer-1",
      "title": "Liquidación de Invierno",
      "subtitle": "Chamarras, suéteres y abrigos con descuentos irrepetibles.",
      "discountBadge": "HASTA 60% OFF",
      "imageUrl": "https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico01.jpg",
      "categoryTarget": "ofertas",
      "gridSpan": "single",
      "active": true
    },
    {
      "id": "flyer-2",
      "title": "Especial Jeans y Caballero",
      "subtitle": "Cortes Slim, Regular y Straight en marcas top.",
      "discountBadge": "3x2 O 40% OFF",
      "imageUrl": "https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico02.jpg",
      "categoryTarget": "hombre",
      "gridSpan": "single",
      "active": true
    },
    {
      "id": "flyer-3",
      "title": "Infantil & Regreso a Clases",
      "subtitle": "Conjuntos resistentes, cómodos y divertidos.",
      "discountBadge": "DESDE $199.00",
      "imageUrl": "https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico03.jpg",
      "categoryTarget": "ninos",
      "gridSpan": "single",
      "active": true
    },
    {
      "id": "flyer-4",
      "title": "Renueva tu Hogar con Ropa en Línea",
      "subtitle": "Sábanas, edredones y accesorios de decoración.",
      "discountBadge": "PRECIOS BODEGA",
      "imageUrl": "https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico04.jpg",
      "categoryTarget": "hogar",
      "gridSpan": "single",
      "active": true
    }
  ]'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- Cliente Demo
INSERT INTO public.customers (
  id, name, email, phone, avatar_url, favorite_store, addresses, wishlist_product_ids, registered_at
) VALUES (
  'cust-101',
  'María Fernanda López',
  'maria.lopez@example.com',
  '55 4321 9876',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  'Sucursal Perisur CDMX',
  '[{"id": "addr-1", "recipientName": "María Fernanda López", "street": "Av. Insurgentes Sur", "exteriorNumber": "2453", "interiorNumber": "Depto 402", "neighborhood": "Tlalpan Centro", "city": "Ciudad de México", "state": "CDMX", "postalCode": "14000", "phone": "55 4321 9876", "isDefault": true}]'::jsonb,
  '["prod-1", "prod-7"]'::jsonb,
  '2026-03-14'
) ON CONFLICT (id) DO NOTHING;

-- Pedido Demo
INSERT INTO public.orders (
  id, order_number, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping_cost, discount_amount, total, status, payment_method, shipping_provider, tracking_number, created_at, estimated_delivery, status_history
) VALUES (
  'ord-8801',
  'REL-2026-0941',
  'María Fernanda López',
  'maria.lopez@example.com',
  '55 4321 9876',
  '{"id": "addr-1", "recipientName": "María Fernanda López", "street": "Av. Insurgentes Sur", "exteriorNumber": "2453", "neighborhood": "Tlalpan Centro", "city": "Ciudad de México", "state": "CDMX", "postalCode": "14000", "phone": "55 4321 9876"}'::jsonb,
  '[{"productId": "prod-1", "productName": "Chamarra Capitonada con Gorro Acolchada", "productImage": "https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80", "price": 699, "quantity": 1, "size": "M", "color": "Morado Elegante"}]'::jsonb,
  699.00,
  0.00,
  100.00,
  599.00,
  'enviado',
  'Tarjeta de Crédito (Visa *** 4921)',
  'Entrega Exprés Ropa en Línea (Propio)',
  'REL-EX-889021-MX',
  '2026-07-28 14:30',
  '30 de Julio, 2026',
  '[{"status": "pendiente", "timestamp": "2026-07-28 14:30", "note": "Pago autorizado con éxito"}, {"status": "enviado", "timestamp": "2026-07-29 09:15", "note": "En tránsito"}]'::jsonb
) ON CONFLICT (id) DO NOTHING;
