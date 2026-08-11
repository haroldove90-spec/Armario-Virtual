import React from 'react';
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
import { BarChart3, Package, Layers, ShoppingBag, Truck, Palette, UserCheck, Users, ShieldCheck, Store, User } from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { products, adminTab, setAdminTab, setActiveRole, adminLogout, adminProfile } = useStore();
  const lowStockCount = products.filter(p => p.stock <= 3).length;

  const tabs = [
    { id: 'metricas' as AdminTab, label: '📊 Métricas & Ventas', icon: BarChart3, description: 'Estadísticas generales y reportes' },
    { id: 'productos' as AdminTab, label: '📦 Productos & Stock', icon: Package, description: 'Catálogo e inventarios' },
    { id: 'categorias' as AdminTab, label: '🏷️ Categorías', icon: Layers, description: 'Categorías y subcategorías' },
    { id: 'ventas' as AdminTab, label: '📋 Ventas & Pedidos', icon: ShoppingBag, description: 'Administrar compras y envíos' },
    { id: 'envio' as AdminTab, label: '🚚 Envíos (API)', icon: Truck, description: 'Tarifas y Envíos.com' },
    { id: 'diseno' as AdminTab, label: '🎨 Banners & Diseño', icon: Palette, description: 'Sliders y estética de tienda' },
    { id: 'perfil' as AdminTab, label: '👤 Perfil Admin', icon: UserCheck, description: 'Datos personales y tienda' },
    { id: 'usuarios' as AdminTab, label: '👥 Usuarios Registrados', icon: Users, description: 'Clientes y compradores' },
    { id: 'empleados' as AdminTab, label: '👨‍💼 Empleados', icon: User, description: 'Control de usuarios y acceso' }
  ];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 pb-12 font-sans">
      {/* Admin Top Banner */}
      <div className="bg-[#9E0D0D] text-white border-b border-red-900 py-6 px-4 sm:px-6 lg:px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-red-950/80 rounded-xl border border-red-400 shadow-md">
              <ShieldCheck className="w-6 h-6 text-[#E05A1B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-[#E05A1B] text-white px-2 py-0.5 rounded uppercase tracking-wider">MODO ADMINISTRADOR</span>
                <span className="text-[10px] text-red-200 uppercase font-mono">PANEL V3.0</span>
              </div>
              <h1 className="text-2xl font-black tracking-tight uppercase mt-0.5">
                Panel de Control - {adminProfile?.storeName || 'Armario Virtual'}
              </h1>
              <p className="text-xs text-red-200">
                Administrador: <strong className="text-white">{adminProfile?.name || 'Adrian Morga'}</strong> ({adminProfile?.email})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveRole('tienda')}
              className="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-red-50 font-black text-xs uppercase tracking-wider px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
            >
              <Store className="w-4 h-4 text-[#9E0D0D]" />
              <span>Ver Tienda</span>
            </button>
            <button
              onClick={() => adminLogout()}
              className="inline-flex items-center gap-1.5 bg-red-900 hover:bg-red-950 text-white font-bold text-xs uppercase tracking-wider px-3 py-2.5 rounded-xl transition-all shadow-md active:scale-95 border border-red-700"
              title="Cerrar Sesión de Administrador"
            >
              <span>Salir</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons Navigation */}
        <div className="max-w-7xl mx-auto mt-6 flex overflow-x-auto gap-2 pb-1 scrollbar-none">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = adminTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id)}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-slate-900 border-red-500 text-white shadow-md'
                    : 'bg-red-950/60 border-red-800 text-red-100 hover:bg-red-900 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#E05A1B]' : 'text-red-300'}`} />
                <span>{tab.label}</span>
                {tab.id === 'productos' && lowStockCount > 0 && (
                  <span className="bg-amber-400 text-slate-950 font-black text-[10px] px-2 py-0.5 rounded-full animate-pulse shadow-xs">
                    ⚠️ {lowStockCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {adminTab === 'metricas' && <MetricsModule />}
        {adminTab === 'productos' && <ProductsModule />}
        {adminTab === 'categorias' && <CategoriesModule />}
        {adminTab === 'ventas' && <OrdersModule />}
        {adminTab === 'envio' && <ShippingModule />}
        {adminTab === 'diseno' && <DesignModule />}
        {adminTab === 'perfil' && <AdminProfileModule />}
        {adminTab === 'usuarios' && <CustomersModule />}
        {adminTab === 'empleados' && <EmployeesModule />}
      </main>
    </div>
  );
};

