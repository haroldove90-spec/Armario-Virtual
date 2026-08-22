import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { AdminTab } from '../../types';
import { MetricsModule } from './MetricsModule';
import { ProductsModule } from './ProductsModule';
import { CategoriesModule } from './CategoriesModule';
import { OrdersModule } from './OrdersModule';
import { ShippingModule } from './ShippingModule';
import { DesignModule } from './DesignModule';
import { AdminProfileModule } from './AdminProfileModule';
import { CustomersModule } from './CustomersModule';
import { EmployeesModule } from './EmployeesModule';
import { SizeGuidesModule } from './SizeGuidesModule';
import { SupabaseDiagnosticModal } from './SupabaseDiagnosticModal';
import {
  BarChart3,
  Package,
  Layers,
  ShoppingBag,
  Truck,
  Palette,
  UserCheck,
  Users,
  ShieldCheck,
  Store,
  User,
  Database,
  Ruler,
  Menu,
  LogOut
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { products, adminTab, setAdminTab, setActiveRole, adminLogout, adminProfile, setSidebarOpen, unreadSalesCount } = useStore();
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  const currentTabLabel = {
    'metricas': '📊 Métricas & Ventas',
    'productos': '📦 Productos & Inventario',
    'tablas-medidas': '📏 Tabla de Medidas & Tallas',
    'categorias': '🏷️ Gestión de Categorías',
    'ventas': '📋 Gestión de Pedidos',
    'envio': '🚚 Envíos & Tarifas',
    'diseno': '🎨 Diseño de Tienda & Banners',
    'perfil': '👤 Mi Perfil y Fiscal',
    'usuarios': '👥 Usuarios Registrados',
    'empleados': '👨‍💼 Empleados & Credenciales'
  }[adminTab] || 'Módulo';

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-slate-100 text-slate-900 pb-12 font-sans">
      {/* Admin Top Banner (Sin menú horizontal) */}
      <div className="w-full max-w-full bg-[#9E0D0D] text-white border-b border-red-900 py-4 sm:py-5 px-3 sm:px-6 lg:px-8 shadow-md overflow-hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-start sm:items-center gap-2.5 sm:gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="relative p-2.5 sm:p-3 bg-red-950/90 hover:bg-slate-950 rounded-xl border border-red-400 hover:border-amber-400 shadow-md transition-all cursor-pointer group shrink-0"
              title="Abrir Menú de Módulos"
            >
              <Menu className="w-5 sm:w-6 h-5 sm:h-6 text-[#E05A1B] group-hover:text-amber-300 transition-colors" />
              {unreadSalesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white font-black text-[10px] px-1.5 py-0.2 rounded-full animate-bounce shadow-md border-2 border-slate-950">
                  {unreadSalesCount}
                </span>
              )}
            </button>
            <div className="min-w-0">
              <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
                <span className="text-[9px] sm:text-[10px] font-black bg-[#E05A1B] text-white px-2 py-0.5 rounded uppercase tracking-wider shrink-0">
                  MODO ADMIN
                </span>
                <span className="text-[9px] sm:text-[10px] bg-red-950/80 text-amber-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-red-800 truncate">
                  {currentTabLabel}
                </span>
                {unreadSalesCount > 0 && (
                  <button
                    onClick={() => setAdminTab('ventas')}
                    className="text-[9px] sm:text-[10px] bg-red-600 hover:bg-red-700 text-white font-black px-2 py-0.5 rounded uppercase tracking-wider border border-red-400 animate-pulse cursor-pointer shrink-0"
                  >
                    🔥 {unreadSalesCount} Venta{unreadSalesCount > 1 ? 's' : ''}
                  </button>
                )}
              </div>
              <h1 className="text-lg sm:text-2xl font-black tracking-tight uppercase mt-0.5 truncate">
                Panel - {adminProfile?.storeName || 'Armario Virtual'}
              </h1>
              <p className="text-[11px] sm:text-xs text-red-200 truncate">
                Admin: <strong className="text-white">{adminProfile?.name || 'Adrian Morga'}</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-950 hover:bg-black text-amber-300 font-black text-[11px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-amber-500/40 cursor-pointer"
            >
              <Menu className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#E05A1B]" />
              <span>Módulos</span>
            </button>
            <button
              onClick={() => setDiagnosticOpen(true)}
              className="inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-900 text-emerald-400 font-black text-[11px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-emerald-500/40 cursor-pointer"
              title="Comprobar conexión a Supabase y subir datos"
            >
              <Database className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-emerald-400 animate-pulse" />
              <span>Supabase</span>
            </button>
            <button
              onClick={() => setActiveRole('tienda')}
              className="inline-flex items-center gap-1.5 bg-white text-slate-900 hover:bg-red-50 font-black text-[11px] sm:text-xs uppercase tracking-wider px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Store className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#9E0D0D]" />
              <span>Tienda</span>
            </button>
            <button
              onClick={() => adminLogout()}
              className="inline-flex items-center gap-1 bg-red-950 hover:bg-black text-red-200 hover:text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider px-2.5 sm:px-3.5 py-2 sm:py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-red-700/60 cursor-pointer"
              title="Cerrar Sesión de Administrador"
            >
              <LogOut className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-red-400" />
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 pt-4 sm:pt-8 overflow-hidden">
        {adminTab === 'metricas' && <MetricsModule />}
        {adminTab === 'productos' && <ProductsModule />}
        {adminTab === 'tablas-medidas' && <SizeGuidesModule />}
        {adminTab === 'categorias' && <CategoriesModule />}
        {adminTab === 'ventas' && <OrdersModule />}
        {adminTab === 'envio' && <ShippingModule />}
        {adminTab === 'diseno' && <DesignModule />}
        {adminTab === 'perfil' && <AdminProfileModule />}
        {adminTab === 'usuarios' && <CustomersModule />}
        {adminTab === 'empleados' && <EmployeesModule />}
      </main>

      {/* Supabase Diagnostic & Sync Modal */}
      <SupabaseDiagnosticModal
        isOpen={diagnosticOpen}
        onClose={() => setDiagnosticOpen(false)}
      />
    </div>
  );
};

