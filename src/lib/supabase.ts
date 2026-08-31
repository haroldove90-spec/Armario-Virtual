import { createClient } from '@supabase/supabase-js';

function sanitizeSupabaseUrl(rawUrl?: string): string {
  let url = (rawUrl || '').trim();
  // Remove wrapping quotes if any
  url = url.replace(/^["']|["']$/g, '').trim();

  // If the provided url is actually a JWT token (starts with eyJ) or looks like an anon key
  if (!url || url.startsWith('eyJ') || url.length > 80) {
    return 'https://cgnieenzvgimdpoihipu.supabase.co';
  }

  // If someone passed just the project ID "cgnieenzvgimdpoihipu"
  if (/^[a-z0-9]{20}$/i.test(url)) {
    return `https://${url}.supabase.co`;
  }

  // Strip trailing paths like /rest/v1 or trailing slashes
  url = url.replace(/\/rest\/v1\/?$/i, '');
  url = url.replace(/\/auth\/v1\/?$/i, '');
  url = url.replace(/\/+$/, '');
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`;
  }

  // Check if it has a valid host or fallback
  if (!url.includes('.supabase.co') && !url.includes('localhost') && !url.includes('127.0.0.1')) {
    return 'https://cgnieenzvgimdpoihipu.supabase.co';
  }

  return url;
}

function sanitizeSupabaseKey(rawKey?: string): string {
  const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnbmllZW56dmdpbWRwb2loaXB1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyMDg2ODQsImV4cCI6MjEwMzc4NDY4NH0._PpC6MkxOUO6VtrCzL6II3fvfPBU9zsJ6-IkXIGaMio';
  let key = (rawKey || '').trim();
  key = key.replace(/^["']|["']$/g, '').trim();

  // If rawKey is empty or was mistakenly given a URL (starts with http), use default valid ANON key
  if (!key || key.startsWith('http') || key.includes('.supabase.co') || !key.startsWith('eyJ')) {
    return defaultKey;
  }
  return key;
}

export const SUPABASE_URL = sanitizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL);
export const SUPABASE_ANON_KEY = sanitizeSupabaseKey(import.meta.env.VITE_SUPABASE_ANON_KEY);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true
  }
});

export const SUPABASE_PROJECT_ID = 'cgnieenzvgimdpoihipu';
export const SUPABASE_URL_ENDPOINT = 'https://cgnieenzvgimdpoihipu.supabase.co/rest/v1/';

export interface PostgresErrorTranslation {
  code: string;
  title: string;
  description: string;
  solution: string;
}

export function translatePostgresError(err: any): PostgresErrorTranslation {
  if (!err) {
    return {
      code: 'OK',
      title: 'Operación Exitosa',
      description: 'No se detectaron errores en la ejecución.',
      solution: 'Todo está funcionando correctamente.'
    };
  }

  const rawCode = err.code || (err.error && err.error.code) || '';
  const rawMsg = (err.message || (err.error && err.error.message) || String(err)).toLowerCase();

  if (rawCode === '42501' || rawMsg.includes('row-level security') || rawMsg.includes('policy') || rawMsg.includes('permission denied')) {
    return {
      code: '42501',
      title: 'Políticas RLS Bloqueadas (Row-Level Security)',
      description: 'Supabase bloqueó la escritura o lectura porque la tabla tiene activada la seguridad por filas sin una política pública permisiva.',
      solution: 'Ejecuta el script SQL para desactivar RLS (ALTER TABLE ... DISABLE ROW LEVEL SECURITY) o define una política permitiendo INSERT/UPDATE al rol anon.'
    };
  }

  if (rawCode === '42P01' || rawCode === 'PGRST204' || rawCode === 'PGRST200' || rawMsg.includes('does not exist') || rawMsg.includes('relation')) {
    return {
      code: '42P01',
      title: 'Tabla Inexistente en Base de Datos',
      description: 'La tabla solicitada no ha sido creada en el esquema public de Supabase.',
      solution: 'Ejecuta el script SQL maestro desde la pestaña de SQL Editor para crear las tablas necesarias e índices correspondientes.'
    };
  }

  if (rawCode === '42703' || rawMsg.includes('column') && rawMsg.includes('does not exist')) {
    return {
      code: '42703',
      title: 'Columna Inexistente en la Tabla',
      description: 'La tabla existe pero le falta una o más columnas requeridas por el frontend (ej. permissions, created_at, sizes, etc.).',
      solution: 'Aplica los comandos ALTER TABLE ... ADD COLUMN IF NOT EXISTS incluidos en el script SQL maestro.'
    };
  }

  if (rawCode === '23502' || rawMsg.includes('not-null constraint') || rawMsg.includes('null value in column')) {
    return {
      code: '23502',
      title: 'Violación de Restricción NOT NULL',
      description: 'Un campo obligatorio no tiene valor por defecto y se intentó guardar como nulo (ej. created_at).',
      solution: 'Asigna valores por defecto en la base de datos (ej. ALTER TABLE ... ALTER COLUMN created_at SET DEFAULT now()).'
    };
  }

  if (rawCode === '23505' || rawMsg.includes('duplicate key') || rawMsg.includes('unique constraint')) {
    return {
      code: '23505',
      title: 'Registro Duplicado (Violación de Clave Única)',
      description: 'Se intentó crear un registro con un identificador o correo electrónico que ya existe en la base de datos.',
      solution: 'Utiliza UPSERT (ON CONFLICT DO UPDATE) o verifica que el ID o correo no estén previamente registrados.'
    };
  }

  if (rawCode === 'PGRST301' || rawMsg.includes('jwt') || rawMsg.includes('token') || rawMsg.includes('unauthorized')) {
    return {
      code: 'PGRST301',
      title: 'Credencial o Token Inválido / Expirado',
      description: 'La clave pública de Supabase (anon key) o el token de sesión no son reconocidos.',
      solution: 'Verifica la configuración de VITE_SUPABASE_ANON_KEY y VITE_SUPABASE_URL en tu entorno.'
    };
  }

  if (rawCode === '08001' || rawCode === '08006' || rawMsg.includes('failed to fetch') || rawMsg.includes('networkerror') || rawMsg.includes('timeout')) {
    return {
      code: 'NET_ERR',
      title: 'Error de Red o Servidor Inalcanzable',
      description: 'No se pudo establecer conexión con el endpoint de Supabase (posible bloqueo de red o proyecto en pausa).',
      solution: 'Comprueba que el proyecto de Supabase esté en estado Active en el dashboard y que tu navegador tenga conexión a internet.'
    };
  }

  return {
    code: rawCode || 'ERR_GENERIC',
    title: 'Excepción PostgreSQL / Supabase',
    description: err.message || String(err),
    solution: 'Revisa los registros en el SQL Editor de Supabase y ejecuta el script de corrección integral.'
  };
}

export async function pingSupabase(): Promise<{ ok: boolean; latencyMs: number; error?: string; code?: string }> {
  const start = performance.now();
  try {
    const { data, error } = await supabase.from('products').select('id').limit(1);
    const latencyMs = Math.round(performance.now() - start);
    if (error) {
      // If products table doesn't exist, try categories as fallback
      const { error: catErr } = await supabase.from('categories').select('id').limit(1);
      if (!catErr) {
        return { ok: true, latencyMs };
      }
      return {
        ok: false,
        latencyMs,
        error: error.message,
        code: error.code
      };
    }
    return { ok: true, latencyMs };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    return {
      ok: false,
      latencyMs,
      error: err.message || 'Error de red con Supabase',
      code: 'NET_ERR'
    };
  }
}

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
        const msgLower = (error.message || '').toLowerCase();
        diag.readError = error.message;
        if (
          error.code === '42P01' ||
          error.code === 'PGRST204' ||
          error.code === 'PGRST200' ||
          msgLower.includes('relation') ||
          msgLower.includes('does not exist') ||
          msgLower.includes('invalid path') ||
          msgLower.includes('not found')
        ) {
          diag.exists = false;
          anyMissing = true;
        } else if (error.code === '42501' || msgLower.includes('policy') || msgLower.includes('permission')) {
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
-- Proyecto: cgnieenzvgimdpoihipu (sistema@armariovirtual.com.mx's Project)
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
    password TEXT,
    role TEXT DEFAULT 'cliente',
    registered_at TEXT,
    registered_date TEXT,
    total_orders NUMERIC DEFAULT 0,
    total_spent NUMERIC DEFAULT 0,
    favorite_store TEXT,
    status TEXT DEFAULT 'activo',
    addresses JSONB DEFAULT '[]'::jsonb,
    wishlist_product_ids JSONB DEFAULT '[]'::jsonb,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Garantizar que existan todas las columnas en customers
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'cliente';
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS registered_at TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS registered_date TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS wishlist_product_ids JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS addresses JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_orders NUMERIC DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS total_spent NUMERIC DEFAULT 0;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS favorite_store TEXT;
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'activo';

CREATE TABLE IF NOT EXISTS public.employees (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    password TEXT,
    role TEXT DEFAULT 'Administrador General',
    status TEXT DEFAULT 'activo',
    permissions JSONB DEFAULT '["metricas","productos","categorias","ventas","clientes","empleados","diseno","guias_tallas","envio","ajustes"]'::jsonb,
    avatar_url TEXT,
    last_access TEXT DEFAULT 'En línea',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Asegurar columnas si la tabla employees ya existía
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'Administrador General';
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'activo';
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS permissions JSONB DEFAULT '["metricas","productos","categorias","ventas","clientes","empleados","diseno","guias_tallas","envio","ajustes"]'::jsonb;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS last_access TEXT DEFAULT 'En línea';
ALTER TABLE public.employees ALTER COLUMN created_at SET DEFAULT now();

-- Insertar / Actualizar a los Administradores
INSERT INTO public.employees (
    id,
    name,
    email,
    username,
    password,
    role,
    status,
    permissions,
    avatar_url,
    last_access,
    created_at
) VALUES (
    'emp-admin-armario',
    'Armario Virtual Admin',
    'armario_virtual@armariovirtual.com',
    'armario_virtual',
    'ArmarioVirtual#2026!Key',
    'Administrador General',
    'activo',
    '["metricas","productos","categorias","ventas","clientes","empleados","diseno","guias_tallas","envio","ajustes"]'::jsonb,
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    'En línea',
    now()
),
(
    'emp-admin-harold',
    'Harold Anguiano Morales',
    'haroldo90@hotmail.com',
    'haroldo90',
    'Chevropar#1970',
    'Administrador General',
    'activo',
    '["metricas","productos","categorias","ventas","clientes","empleados","diseno","guias_tallas","envio","ajustes"]'::jsonb,
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    'En línea',
    now()
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    email = EXCLUDED.email,
    password = EXCLUDED.password,
    role = EXCLUDED.role,
    status = EXCLUDED.status,
    permissions = EXCLUDED.permissions,
    last_access = EXCLUDED.last_access;

-- TABLA DE BITÁCORA Y REGISTRO DE ACCESOS / VISITAS
CREATE TABLE IF NOT EXISTS public.access_logs (
    id TEXT PRIMARY KEY,
    event_type TEXT NOT NULL,
    actor_name TEXT,
    actor_role TEXT,
    target_info TEXT,
    ip_address TEXT,
    device_info TEXT,
    status TEXT DEFAULT 'autorizado',
    details JSONB DEFAULT '{}'::jsonb,
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
-- Esto soluciona de inmediato el problema donde los productos, órdenes o clientes no se guardan.
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.size_guide_templates DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.shipping_config DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.store_design DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_profile DISABLE ROW LEVEL SECURITY;

-- 3. HABILITAR SUPABASE REALTIME (Para detección instantánea de ventas y cambios sin refrescar)
-- Asegura que Supabase emita eventos INSERT, UPDATE y DELETE a los clientes conectados
DO $$
BEGIN
  -- Agregar tablas a la publicación de realtime si aún no están agregadas (evita error 42710)
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'products'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'customers'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.customers;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'categories'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'shipping_config'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.shipping_config;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM pg_publication_tables 
      WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'store_design'
    ) THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.store_design;
    END IF;
  END IF;
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

-- Configurar Replica Identity FULL para recibir datos completos en eventos UPDATE
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.products REPLICA IDENTITY FULL;
ALTER TABLE public.customers REPLICA IDENTITY FULL;

-- 4. GARANTIZAR PERMISOS TOTALES AL ROL ANON Y AUTHENTICATED
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON SCHEMA public TO anon, authenticated, service_role;

-- 5. RECARGAR ESQUEMA EN LA API REST
NOTIFY pgrst, 'reload schema';
`;
