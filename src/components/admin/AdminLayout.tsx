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
  Menu
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { products, adminTab, setAdminTab, setActiveRole, adminLogout, adminProfile, setSidebarOpen } = useStore();
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
    'perfil': '👤 Perfil Administrador',
    'usuarios': '👥 Usuarios Registrados',
    'empleados': '👨‍💼 Empleados & Credenciales'
  }[adminTab] || 'Módulo';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12 font-sans">
      {/* Admin Top Banner (Sin menú horizontal) */}
      <div className="bg-[#9E0D0D] text-white border-b border-red-900 py-5 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-3 bg-red-950/90 hover:bg-slate-950 rounded-xl border border-red-400 hover:border-amber-400 shadow-md transition-all cursor-pointer group"
              title="Abrir Menú de Módulos"
            >
              <Menu className="w-6 h-6 text-[#E05A1B] group-hover:text-amber-300 transition-colors" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-[#E05A1B] text-white px-2 py-0.5 rounded uppercase tracking-wider">
                  MODO ADMINISTRADOR
                </span>
                <span className="text-[10px] bg-red-950/80 text-amber-300 font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-red-800">
                  {currentTabLabel}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight uppercase mt-0.5">
                Panel de Control - {adminProfile?.storeName || 'Armario Virtual'}
              </h1>
              <p className="text-xs text-red-200">
                Administrador: <strong className="text-white">{adminProfile?.name || 'Adrian Morga'}</strong> ({adminProfile?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center flex-wrap gap-2">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-950 hover:bg-black text-amber-300 font-black text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-amber-500/40 cursor-pointer"
            >
              <Menu className="w-4 h-4 text-[#E05A1B]" />
              <span>Ver Todos los Módulos</span>
            </button>
            <button
              onClick={() => setDiagnosticOpen(true)}
              className="inline-flex items-center gap-2 bg-slate-900/90 hover:bg-slate-900 text-emerald-400 font-black text-xs uppercase tracking-wider px-3.5 py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-emerald-500/40 cursor-pointer"
              title="Comprobar conexión a Supabase y subir datos"
            >
              <Database className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Diagnóstico Supabase</span>
            </button>
            <button
              onClick={() => setActiveRole('tienda')}
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-red-50 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Store className="w-4 h-4 text-[#9E0D0D]" />
              <span>Ver Tienda</span>
            </button>
            <button
              onClick={() => adminLogout()}
              className="inline-flex items-center gap-1.5 bg-red-900 hover:bg-red-950 text-white font-bold text-xs uppercase tracking-wider px-3 py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-red-700 cursor-pointer"
              title="Cerrar Sesión de Administrador"
            >
              <span>Salir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
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

