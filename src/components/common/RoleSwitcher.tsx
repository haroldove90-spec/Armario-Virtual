import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, UserCheck, RefreshCw, ShoppingBag, PanelLeft, Menu } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    adminTab,
    setAdminTab,
    resetToDefaultData,
    setSidebarOpen,
    isCustomerLoggedIn,
    isAdminLoggedIn
  } = useStore();

  return (
    <div className="bg-slate-900 text-white text-xs py-2 px-3 sm:px-4 shadow-md sticky top-0 z-50 border-b border-slate-800 font-sans">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        
        {/* Left: Open Sidebar Button + Active Mode Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 bg-[#9E0D0D] hover:bg-red-800 text-white px-2.5 py-1.5 rounded-lg font-bold transition-all shadow-xs border border-red-400/30 active:scale-95"
            title="Abrir Menú Lateral de Navegación"
          >
            <Menu className="w-4 h-4 text-[#E05A1B]" />
            <span className="font-extrabold text-[11px] uppercase tracking-wider hidden sm:inline">Menú Lateral</span>
          </button>

          <span className="hidden sm:inline-flex items-center gap-1.5 bg-slate-800 text-slate-200 px-2.5 py-1 rounded-md font-medium border border-slate-700">
            <span className="text-slate-400 text-[10px]">Vista:</span>
            <span className="text-white font-black uppercase text-[11px] tracking-wider">
              {activeRole === 'tienda' ? '🛍️ TIENDA' : activeRole === 'cliente' ? '👤 CLIENTE' : '🛡️ ADMIN'}
            </span>
          </span>
        </div>

        {/* Center: Admin Module Quick Tabs if Admin is active & logged in */}
        {activeRole === 'admin' && isAdminLoggedIn && (
          <div className="hidden xl:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700">
            {[
              { id: 'metricas', label: '📊 Métricas' },
              { id: 'productos', label: '📦 Productos' },
              { id: 'ventas', label: '📋 Pedidos' },
              { id: 'envio', label: '🚚 Envíos' },
              { id: 'diseno', label: '🎨 Diseño' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`px-2.5 py-1 rounded-md transition-all font-bold text-[11px] ${
                  adminTab === tab.id
                    ? 'bg-[#9E0D0D] text-white shadow-xs border border-red-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Right: 3 Role Selector Buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center gap-0.5">
            {/* Tienda en Línea Button */}
            <button
              onClick={() => setActiveRole('tienda')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-extrabold text-[11px] uppercase tracking-wider ${
                activeRole === 'tienda'
                  ? 'bg-[#9E0D0D] text-white shadow-xs ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E05A1B]" />
              <span className="hidden md:inline">Tienda</span>
            </button>

            {/* Cliente Button */}
            <button
              onClick={() => setActiveRole('cliente')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-extrabold text-[11px] uppercase tracking-wider ${
                activeRole === 'cliente'
                  ? 'bg-[#9E0D0D] text-white shadow-xs ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden md:inline">Cliente</span>
            </button>

            {/* Admin Button */}
            <button
              onClick={() => setActiveRole('admin')}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-extrabold text-[11px] uppercase tracking-wider ${
                activeRole === 'admin'
                  ? 'bg-[#9E0D0D] text-white shadow-xs ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden md:inline">Admin</span>
            </button>
          </div>

          <button
            onClick={resetToDefaultData}
            title="Restablecer datos predeterminados"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
