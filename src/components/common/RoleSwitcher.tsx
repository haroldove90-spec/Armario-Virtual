import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, UserCheck, RefreshCw, ShoppingBag, PanelLeft, Menu, LogOut, User } from 'lucide-react';

export const RoleSwitcher: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    adminTab,
    setAdminTab,
    resetToDefaultData,
    setSidebarOpen,
    isCustomerLoggedIn,
    isAdminLoggedIn,
    customerLogout,
    adminLogout,
    customer,
    adminProfile,
    unreadSalesCount,
    orders
  } = useStore();

  const customerActiveOrdersCount = React.useMemo(() => {
    if (!customer?.email && !customer?.id) return 0;
    return orders.filter(
      o =>
        ((customer.id && o.customerId === customer.id) ||
          (customer.email && o.customerEmail?.toLowerCase() === customer.email.toLowerCase())) &&
        (o.status === 'en_preparacion' || o.status === 'enviado' || o.status === 'pendiente')
    ).length;
  }, [orders, customer]);

  return (
    <div className="w-full max-w-full bg-slate-900 text-white text-xs py-1.5 sm:py-2 px-2 sm:px-4 shadow-md sticky top-0 z-50 border-b border-slate-800 font-sans overflow-x-clip">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-1.5 sm:gap-2.5 overflow-hidden">
        
        {/* Left: Open Sidebar Button + Active Mode Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 bg-[#9E0D0D] hover:bg-red-800 text-white px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg font-bold transition-all shadow-xs border border-red-400/30 active:scale-95 cursor-pointer"
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
          <div className="hidden xl:flex items-center gap-1 bg-slate-800 p-1 rounded-lg border border-slate-700 shrink-0">
            {[
              { id: 'metricas', label: '📊 Métricas' },
              { id: 'productos', label: '📦 Productos' },
              { id: 'categorias', label: '🏷️ Categorías' },
              { id: 'ventas', label: '📋 Pedidos', badge: unreadSalesCount > 0 ? unreadSalesCount : undefined },
              { id: 'envio', label: '🚚 Envíos' },
              { id: 'perfil', label: '👤 Perfil' },
              { id: 'usuarios', label: '👥 Usuarios' },
              { id: 'empleados', label: '👨‍💼 Empleados' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setAdminTab(tab.id as any)}
                className={`relative px-2.5 py-1 rounded-md transition-all font-bold text-[11px] cursor-pointer flex items-center gap-1.5 ${
                  adminTab === tab.id
                    ? 'bg-[#9E0D0D] text-white shadow-xs border border-red-500'
                    : 'text-slate-300 hover:text-white hover:bg-slate-700/60'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span className="bg-red-500 text-white font-black text-[9px] px-1.5 py-0.2 rounded-full animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Right: 3 Role Selector Buttons + Session Indicator & Log Out */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          {/* Active Session Logout Buttons */}
          {activeRole === 'admin' && isAdminLoggedIn && (
            <button
              onClick={() => adminLogout()}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-500/50 rounded-md font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
              title="Cerrar sesión de administrador"
            >
              <LogOut className="w-3.5 h-3.5 text-red-300" />
              <span className="hidden sm:inline">Cerrar Sesión Admin</span>
              <span className="sm:hidden">Salir</span>
            </button>
          )}

          {activeRole === 'cliente' && isCustomerLoggedIn && (
            <button
              onClick={() => customerLogout()}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 bg-pink-950/80 hover:bg-pink-900 text-pink-100 border border-pink-500/50 rounded-md font-bold text-[10px] sm:text-[11px] transition-all cursor-pointer shadow-xs active:scale-95"
              title="Cerrar sesión de cliente"
            >
              <LogOut className="w-3.5 h-3.5 text-pink-300" />
              <span className="hidden sm:inline">Cerrar Sesión ({customer.name.split(' ')[0]})</span>
              <span className="sm:hidden">Salir</span>
            </button>
          )}

          {activeRole === 'tienda' && (isCustomerLoggedIn || isAdminLoggedIn) && (
            <div className="hidden md:flex items-center gap-1.5">
              {isCustomerLoggedIn && (
                <button
                  onClick={() => customerLogout()}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-pink-300 border border-slate-700 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                  title="Cerrar sesión de cliente actual"
                >
                  <LogOut className="w-3 h-3 text-pink-400" />
                  <span>Salir Cliente</span>
                </button>
              )}
              {isAdminLoggedIn && (
                <button
                  onClick={() => adminLogout()}
                  className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-red-300 border border-slate-700 rounded-md text-[10px] font-bold transition-all cursor-pointer"
                  title="Cerrar sesión de administrador actual"
                >
                  <LogOut className="w-3 h-3 text-red-400" />
                  <span>Salir Admin</span>
                </button>
              )}
            </div>
          )}

          <div className="bg-slate-800 p-0.5 rounded-lg border border-slate-700 flex items-center gap-0.5">
            {/* Tienda en Línea Button */}
            <button
              onClick={() => setActiveRole('tienda')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md transition-all font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider cursor-pointer ${
                activeRole === 'tienda'
                  ? 'bg-[#9E0D0D] text-white shadow-xs ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShoppingBag className="w-3.5 h-3.5 text-[#E05A1B]" />
              <span className="hidden sm:inline">Tienda</span>
            </button>

            {/* Cliente Button */}
            <button
              onClick={() => setActiveRole('cliente')}
              className={`relative flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md transition-all font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider cursor-pointer ${
                activeRole === 'cliente'
                  ? 'bg-[#9E0D0D] text-white shadow-xs ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-red-400" />
              <span className="hidden sm:inline">Cliente</span>
              {customerActiveOrdersCount > 0 && (
                <span className="bg-[#E05A1B] text-white text-[9px] font-black rounded-full px-1.5 py-0.2 ml-0.5 animate-pulse">
                  {customerActiveOrdersCount}
                </span>
              )}
            </button>

            {/* Admin Button */}
            <button
              onClick={() => setActiveRole('admin')}
              className={`relative flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-md transition-all font-extrabold text-[10px] sm:text-[11px] uppercase tracking-wider cursor-pointer ${
                activeRole === 'admin'
                  ? 'bg-[#9E0D0D] text-white shadow-xs ring-1 ring-red-400/40'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
              <span className="hidden sm:inline">Admin</span>
              {unreadSalesCount > 0 && (
                <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2 ml-0.5 animate-bounce shadow-sm">
                  {unreadSalesCount}
                </span>
              )}
            </button>
          </div>

          <button
            onClick={resetToDefaultData}
            title="Restablecer datos predeterminados"
            className="p-1 sm:p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-all cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
