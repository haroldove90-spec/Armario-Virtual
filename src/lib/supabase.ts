import { createClient } from '@supabase/supabase-js';

export const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://aouvpbvjrsbtufhrmwaj.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFvdXZwYnZqcnNidHVmaHJtd2FqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU0OTI3NTgsImV4cCI6MjEwMTA2ODc1OH0.Vhp1pHIGIbWyRxNgvHOSBGi98WlFbGqoMnGiNdeHbtU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export const SUPABASE_PROJECT_ID = 'aouvpbvjrsbtufhrmwaj';
export const SUPABASE_URL_ENDPOINT = 'https://aouvpbvjrsbtufhrmwaj.supabase.co/rest/v1/';

export interface TableDiagnostic {
  tableName: string;
  exists: boolean;
  canRead: boolean;
  canWrite: boolean;
  rowCount: number;
  readError?: string;
  writeError?: string;
  rlsBlocked?: boolean;
}

export interface SupabaseDiagnosticReport {
  connected: boolean;
  url: string;
  projectId: string;
  latencyMs: number;
  overallStatus: 'ok' | 'rls_warning' | 'tables_missing' | 'error';
  tables: Record<string, TableDiagnostic>;
  summary: string;
  recommendations: string[];
}

export async function runCompleteSupabaseDiagnostic(): Promise<SupabaseDiagnosticReport> {
  const startTime = performance.now();
  const tablesToCheck = [
    'categories',
    'products',
    'size_guide_templates',
    'orders',
    'customers',
    'employees',
    'admin_profile',
    'shipping_config',
    'store_design'
  ];

  const results: Record<string, TableDiagnostic> = {};
  let anyError = false;
  let anyRlsBlocked = false;
  let anyMissing = false;

  for (const table of tablesToCheck) {
    const diag: TableDiagnostic = {
      tableName: table,
      exists: false,
      canRead: false,
      canWrite: false,
      rowCount: 0
    };

    // 1. Check READ (SELECT)
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: false })
        .limit(10);

      if (error) {
        diag.readError = error.message;
        if (error.code === '42P01' || error.message.toLowerCase().includes('relation') || error.message.toLowerCase().includes('does not exist')) {
          diag.exists = false;
          anyMissing = true;
        } else if (error.code === '42501' || error.message.toLowerCase().includes('policy') || error.message.toLowerCase().includes('permission')) {
          diag.exists = true;
          diag.rlsBlocked = true;
          anyRlsBlocked = true;
        } else {
          diag.exists = true;
        }
      } else {
        diag.exists = true;
        diag.canRead = true;
        diag.rowCount = count ?? (data ? data.length : 0);
      }
    } catch (err: any) {
      diag.readError = err.message || String(err);
      anyError = true;
    }

    // 2. Check WRITE (Test upsert / delete a temporary diagnostic flag)
    if (diag.exists) {
      try {
        const testId = `__diag_test_${Date.now()}__`;
        let testPayload: any = { id: testId };
        if (table === 'categories') {
          testPayload = { id: testId, name: 'DiagTest', slug: 'diag-test', icon_name: 'Tag', subcategories: [] };
        } else if (table === 'products') {
          testPayload = { id: testId, name: 'DiagTest', price: 10, stock: 1, category: 'Test', sku: 'TEST-001', images: [], sizes: [], colors: [] };
        } else if (table === 'size_guide_templates') {
          testPayload = { id: testId, name: 'DiagTestTpl', columns: [], rows: [] };
        } else if (table === 'orders') {
          testPayload = { id: testId, order_number: 'TEST-001', customer_name: 'DiagTest', total: 10, status: 'pendiente', items: [] };
        }

        const { error: writeError } = await supabase.from(table).upsert(testPayload);
        if (writeError) {
          diag.writeError = writeError.message;
          if (writeError.code === '42501' || writeError.message.toLowerCase().includes('row-level security') || writeError.message.toLowerCase().includes('policy')) {
            diag.rlsBlocked = true;
            anyRlsBlocked = true;
          }
        } else {
          diag.canWrite = true;
          // Clean up test row immediately
          await supabase.from(table).delete().eq('id', testId);
        }
      } catch (err: any) {
        diag.writeError = err.message || String(err);
      }
    }

    results[table] = diag;
  }

  const latencyMs = Math.round(performance.now() - startTime);
  const connected = Object.values(results).some(t => t.exists || t.canRead);

  let overallStatus: 'ok' | 'rls_warning' | 'tables_missing' | 'error' = 'ok';
  if (!connected) {
    overallStatus = 'error';
  } else if (anyRlsBlocked) {
    overallStatus = 'rls_warning';
  } else if (anyMissing) {
    overallStatus = 'tables_missing';
  }

  const recommendations: string[] = [];
  if (anyRlsBlocked) {
    recommendations.push('⚠️ Se detectaron restricciones de Políticas RLS (Row Level Security) que impiden guardar datos con la clave pública/anon. Ejecuta el script SQL para habilitar permisos o desactivar RLS en las tablas.');
  }
  if (anyMissing) {
    recommendations.push('⚠️ Faltan algunas tablas en la base de datos de Supabase. Ejecuta el script SQL maestro para crearlas con todos sus campos.');
  }
  if (!anyRlsBlocked && !anyMissing && connected) {
    recommendations.push('✅ La conexión con Supabase está 100% activa y todas las tablas tienen permisos completos de lectura y escritura.');
  }

  return {
    connected,
    url: SUPABASE_URL,
    projectId: SUPABASE_PROJECT_ID,
    latencyMs,
    overallStatus,
    tables: results,
    summary: connected
      ? (anyRlsBlocked ? 'Conectado pero con bloqueo de permisos RLS' : 'Conexión activa con Supabase')
      : 'No se pudo conectar con Supabase',
    recommendations
  };
}

export async function checkSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('products').select('id').limit(1);
    if (error) {
      console.warn('Supabase database check:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase offline or table pending:', err);
    return false;
  }
}

export const SUPABASE_COMPLETE_SQL_FIX = `-- =========================================================================
-- SCRIPT MAESTRO DE CONFIGURACIÓN Y PERMISOS COMPLETOS PARA SUPABASE
-- Proyecto: aouvpbvjrsbtufhrmwaj
-- =========================================================================

-- 1. CREACIÓN O AJUSTE DE TABLAS
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    icon_name TEXT DEFAULT 'Tag',
    subcategories JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía previamente
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon_name TEXT DEFAULT 'Tag';
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS subcategories JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now();

CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    product_type TEXT DEFAULT 'sencillo',
    category TEXT NOT NULL,
    subcategory TEXT DEFAULT 'General',
    price NUMERIC NOT NULL,
    original_price NUMERIC,
    is_offer BOOLEAN DEFAULT false,
    offer_price NUMERIC,
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
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    youtube_url TEXT,
    date_added TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas si la tabla ya existía previamente
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS product_type TEXT DEFAULT 'sencillo';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS subcategory TEXT DEFAULT 'General';
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS original_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_offer BOOLEAN DEFAULT false;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS offer_price NUMERIC;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS discount_percentage NUMERIC DEFAULT 0;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS color_images JSONB DEFAULT '{}'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS variant_stock JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide JSONB DEFAULT NULL;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS size_guide_template_id TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT true;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS youtube_url TEXT;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS date_added TEXT;
ALTER TABLE public.products ALTER COLUMN sku DROP NOT NULL;

CREATE TABLE IF NOT EXISTS public.size_guide_templates (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT DEFAULT 'General',
    unit TEXT DEFAULT 'cm',
    columns JSONB DEFAULT '[]'::jsonb,
    rows JSONB DEFAULT '[]'::jsonb,
    image_url TEXT,
    instructions TEXT,
    is_default BOOLEAN DEFAULT false,
    created_at TEXT
);

CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT NOT NULL,
    customer_name TEXT,
    customer_email TEXT,
    customer_phone TEXT,
    shipping_address JSONB DEFAULT '{}'::jsonb,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC DEFAULT 0,
    shipping_cost NUMERIC DEFAULT 0,
    discount_amount NUMERIC DEFAULT 0,
    total NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'pendiente',
    payment_method TEXT,
    shipping_provider TEXT,
    tracking_number TEXT,
    created_at TEXT,
    estimated_delivery TEXT,
    status_history JSONB DEFAULT '[]'::jsonb
);

CREATE TABLE IF NOT EXISTS public.customers (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    registered_date TEXT,
    total_orders NUMERIC DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    favorite_store TEXT,
    status TEXT DEFAULT 'activo',
    addresses JSONB DEFAULT '[]'::jsonb,
    wishlist_product_ids JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    role TEXT,
    department TEXT,
    phone TEXT,
    status TEXT DEFAULT 'activo',
    date_joined TEXT,
    permissions JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.shipping_config (
    id TEXT PRIMARY KEY,
    default_origin_postal_code TEXT,
    free_shipping_threshold NUMERIC,
    local_delivery_cost NUMERIC,
    national_delivery_cost NUMERIC,
    express_delivery_cost NUMERIC,
    carriers JSONB DEFAULT '[]'::jsonb,
    envios_com_api_key TEXT,
    envios_com_sandbox_mode BOOLEAN DEFAULT true,
    auto_generate_labels BOOLEAN DEFAULT false,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.store_design (
    id TEXT PRIMARY KEY,
    primary_color TEXT DEFAULT '#9E0D0D',
    top_announcement_text TEXT,
    top_announcement_active BOOLEAN DEFAULT true,
    hero_sliders JSONB DEFAULT '[]'::jsonb,
    promotional_flyers JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.admin_profile (
    id TEXT PRIMARY KEY,
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

-- 2. DESACTIVAR RLS O PERMITIR ACCESO TOTAL A LA CLAVE PÚBLICA (ANON)
-- Esto soluciona de inmediato el problema donde los productos o categorías no se guardan.
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_guide_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_design DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profile DISABLE ROW LEVEL SECURITY;

-- 3. GARANTIZAR PERMISOS TOTALES AL ROL ANON Y AUTHENTICATED
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;

-- 4. RECARGAR ESQUEMA EN LA API REST
NOTIFY pgrst, 'reload schema';
`;
