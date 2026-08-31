import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  ShoppingBag,
  User,
  ShieldCheck,
  Tag,
  Percent,
  MapPin,
  Heart,
  BarChart3,
  Package,
  Truck,
  Palette,
  X,
  LogOut,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Menu,
  Key,
  Ruler
} from 'lucide-react';
import { ActiveRole, AdminTab, CustomerTab, Category } from '../../types';
import { SupabaseSmartButton } from './SupabaseSmartButton';

export const SidebarNav: React.FC = () => {
  const {
    activeRole,
    setActiveRole,
    sidebarOpen,
    setSidebarOpen,
    adminTab,
    setAdminTab,
    customerTab,
    setCustomerTab,
    selectedCategory,
    setSelectedCategory,
    setSearchQuery,
    categories,
    isCustomerLoggedIn,
    isAdminLoggedIn,
    customerLogout,
    adminLogout,
    resetToDefaultData,
    storeDesign,
    unreadSalesCount,
    orders,
    customer
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

  const handleSelectRole = (role: ActiveRole) => {
    setActiveRole(role);
    setSidebarOpen(false);
  };

  const categoriesList: { id: Category | 'todas'; label: string; icon: React.ReactNode }[] = [
    { id: 'todas', label: 'Todos los Productos', icon: <Tag className="w-4 h-4 text-[#9E0D0D]" /> },
    { id: 'ofertas', label: 'Gran Barata & Ofertas ⚡', icon: <Percent className="w-4 h-4 text-[#E05A1B] animate-bounce" /> },
    { id: 'mujer', label: 'Moda Mujer', icon: <Tag className="w-4 h-4 text-red-600" /> },
    { id: 'hombre', label: 'Moda Hombre', icon: <Tag className="w-4 h-4 text-blue-600" /> },
    { id: 'ninos', label: 'Niños y Bebés', icon: <Tag className="w-4 h-4 text-amber-500" /> },
    { id: 'calzado', label: 'Calzado & Zapatos', icon: <Tag className="w-4 h-4 text-emerald-600" /> },
    { id: 'hogar', label: 'Hogar y Blancos', icon: <Tag className="w-4 h-4 text-teal-600" /> }
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/70 backdrop-blur-xs z-[9990] transition-opacity"
        />
      )}

      {/* Left Sidebar Drawer / Fixed Panel */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-[9999] w-80 max-w-[85vw] bg-slate-900 text-slate-100 flex flex-col justify-between shadow-2xl transition-transform duration-300 ease-in-out font-sans ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Header of Sidebar */}
        <div>
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80">
            <div
              onClick={() => {
                setActiveRole('tienda');
                setSelectedCategory('todas');
                setSidebarOpen(false);
              }}
              className="cursor-pointer flex items-center gap-2.5 group"
            >
              <img
                src={storeDesign.logoUrl || 'https://cgnieenzvgimdpoihipu.supabase.co/storage/v1/object/public/logo/armariovirtualogo.jpeg'}
                alt={storeDesign.storeName || 'Armario Virtual'}
                className="h-9 w-auto object-contain rounded-md shadow-md"
              />
              <div className="flex flex-col">
                <span className="text-sm font-black tracking-tight text-white uppercase leading-none">
                  {storeDesign.logoText || 'ARMARIO VIRTUAL'}
                </span>
                <span className="text-[9px] text-[#E05A1B] font-bold uppercase tracking-wider mt-0.5 leading-none">
                  {storeDesign.logoSubtext || 'TU ESTILO LIBRE'}
                </span>
              </div>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Cerrar barra lateral"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Section 1: Main Role Selector */}
          <div className="p-4 border-b border-slate-800">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2.5">
              Modos de Navegación
            </p>

            <div className="space-y-1.5">
              {/* Tienda en línea button */}
              <button
                onClick={() => handleSelectRole('tienda')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeRole === 'tienda'
                    ? 'bg-[#9E0D0D] text-white shadow-lg ring-1 ring-red-400/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#E05A1B]" />
                  <span>Tienda en Línea</span>
                </div>
                <span className="text-[9px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded-full font-mono">
                  PÚBLICO
                </span>
              </button>

              {/* Panel cliente button */}
              <button
                onClick={() => handleSelectRole('cliente')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeRole === 'cliente'
                    ? 'bg-[#9E0D0D] text-white shadow-lg ring-1 ring-red-400/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-red-400" />
                  <span>Panel del Cliente</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {customerActiveOrdersCount > 0 && (
                    <span className="bg-[#E05A1B] text-white text-[9px] font-black rounded-full px-1.5 py-0.2 animate-pulse">
                      {customerActiveOrdersCount}
                    </span>
                  )}
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isCustomerLoggedIn
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                        : 'bg-amber-900/60 text-amber-300 border border-amber-700'
                    }`}
                  >
                    {isCustomerLoggedIn ? 'SESIÓN ACTIVA' : 'ACCESO'}
                  </span>
                </div>
              </button>

              {/* Panel admin button */}
              <button
                onClick={() => handleSelectRole('admin')}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeRole === 'admin'
                    ? 'bg-[#9E0D0D] text-white shadow-lg ring-1 ring-red-400/40'
                    : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-yellow-400" />
                  <span>Panel Administrador</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {unreadSalesCount > 0 && (
                    <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2 animate-bounce shadow-sm">
                      {unreadSalesCount}
                    </span>
                  )}
                  <span
                    className={`text-[9px] px-2 py-0.5 rounded-full font-mono font-bold ${
                      isAdminLoggedIn
                        ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700'
                        : 'bg-pink-900/80 text-pink-300 border border-pink-700'
                    }`}
                  >
                    {isAdminLoggedIn ? 'ADMIN ACTIVO' : 'ACCESO'}
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Section 2: Contextual Navigation Sub-menu */}
          <div className="p-4 overflow-y-auto max-h-[calc(100vh-320px)] space-y-4">
            {activeRole === 'tienda' && (
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  Categorías de Tienda ({categories.length})
                </p>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setSelectedCategory('todas');
                      if (setSearchQuery) setSearchQuery('');
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-bold transition-colors ${
                      selectedCategory === 'todas'
                        ? 'bg-red-900/60 text-white font-extrabold border-l-2 border-[#E05A1B]'
                        : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                    }`}
                  >
                    <Tag className="w-4 h-4 text-[#E05A1B]" />
                    <span>Todas las Categorías</span>
                  </button>

                  {categories.map(cat => (
                    <div key={cat.id} className="space-y-1">
                      <button
                        onClick={() => {
                          setSelectedCategory(cat.slug);
                          if (setSearchQuery) setSearchQuery('');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-colors ${
                          selectedCategory === cat.slug
                            ? 'bg-red-900/60 text-white font-extrabold border-l-2 border-[#E05A1B]'
                            : 'text-slate-300 hover:text-white hover:bg-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="w-3.5 h-3.5 text-red-400" />
                          <span>{cat.name}</span>
                        </div>
                        {cat.subcategories && cat.subcategories.length > 0 && (
                          <span className="text-[10px] text-slate-500 font-mono">({cat.subcategories.length})</span>
                        )}
                      </button>

                      {/* Nested subcategories in mobile sidebar */}
                      {cat.subcategories && cat.subcategories.length > 0 && (
                        <div className="pl-6 space-y-0.5 border-l border-slate-800 ml-3">
                          {cat.subcategories.map(sub => (
                            <button
                              key={sub.id}
                              onClick={() => {
                                setSelectedCategory(cat.slug);
                                if (setSearchQuery) setSearchQuery(sub.name);
                                setSidebarOpen(false);
                              }}
                              className="w-full text-left py-1 px-2 text-[11px] text-slate-400 hover:text-amber-300 transition-colors block truncate"
                            >
                              • {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeRole === 'cliente' && (
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  Secciones del Cliente
                </p>
                {isCustomerLoggedIn ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setCustomerTab('compras');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                        customerTab === 'compras'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-purple-400" />
                        <span>Mis Compras y Pedidos</span>
                      </div>
                      {customerActiveOrdersCount > 0 && (
                        <span className="bg-[#E05A1B] text-white text-[9px] font-black rounded-full px-1.5 py-0.2 animate-pulse">
                          {customerActiveOrdersCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setCustomerTab('domicilios');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        customerTab === 'domicilios'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <MapPin className="w-4 h-4 text-purple-400" />
                      <span>Mis Domicilios</span>
                    </button>

                    <button
                      onClick={() => {
                        setCustomerTab('favoritos');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        customerTab === 'favoritos'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Heart className="w-4 h-4 text-pink-400" />
                      <span>Mis Favoritos</span>
                    </button>

                    <button
                      onClick={() => {
                        setCustomerTab('perfil');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        customerTab === 'perfil'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-4 h-4 text-purple-400" />
                      <span>Mi Perfil</span>
                    </button>

                    <button
                      onClick={() => {
                        customerLogout();
                        setSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-pink-400 hover:bg-pink-950/40 hover:text-pink-300 mt-4 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión Cliente</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
                    <p className="text-[11px] text-amber-300 font-medium">
                      🔒 Inicia sesión con credenciales simuladas para desbloquear tu panel personal.
                    </p>
                  </div>
                )}
              </div>
            )}

            {activeRole === 'admin' && (
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">
                  Módulos de Administración
                </p>
                {isAdminLoggedIn ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => {
                        setAdminTab('metricas');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'metricas'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <BarChart3 className="w-4 h-4 text-yellow-400" />
                      <span>Métricas & Ventas</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('productos');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'productos'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Package className="w-4 h-4 text-yellow-400" />
                      <span>Productos & Inventario</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('tablas-medidas');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'tablas-medidas'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Ruler className="w-4 h-4 text-yellow-400" />
                      <span>Tabla de Medidas</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('categorias');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'categorias'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Tag className="w-4 h-4 text-yellow-400" />
                      <span>Gestión de Categorías</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('ventas');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'ventas'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-yellow-400" />
                        <span>Gestión de Pedidos</span>
                      </div>
                      {unreadSalesCount > 0 && (
                        <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2 animate-bounce shadow-sm">
                          {unreadSalesCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('envio');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'envio'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Truck className="w-4 h-4 text-yellow-400" />
                      <span>Envíos & Tarifas</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('diseno');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'diseno'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <Palette className="w-4 h-4 text-yellow-400" />
                      <span>Diseño de Tienda</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('perfil');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'perfil'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-4 h-4 text-yellow-400" />
                      <span>Perfil Administrador</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('usuarios');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'usuarios'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-4 h-4 text-yellow-400" />
                      <span>Usuarios Registrados</span>
                    </button>

                    <button
                      onClick={() => {
                        setAdminTab('empleados');
                        setSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium transition-colors ${
                        adminTab === 'empleados'
                          ? 'bg-purple-900/60 text-purple-200 font-bold border-l-2 border-pink-500'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
                      }`}
                    >
                      <User className="w-4 h-4 text-yellow-400" />
                      <span>Empleados & Credenciales</span>
                    </button>

                    {/* Supabase Smart Monitor in Sidebar */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[10px] uppercase font-bold text-slate-500 mb-1.5 px-1">
                        Base de Datos Supabase
                      </div>
                      <SupabaseSmartButton variant="compact" />
                    </div>

                    <button
                      onClick={() => {
                        adminLogout();
                        setSidebarOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 p-2 rounded-lg text-xs font-medium text-pink-400 hover:bg-pink-950/40 hover:text-pink-300 mt-4 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión Admin</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700 text-xs text-slate-300 space-y-2">
                    <p className="text-[11px] text-pink-300 font-medium">
                      🛡️ Requiere autenticación de administrador para acceder a las herramientas.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Section / Demo Reset */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 space-y-2">
          <button
            onClick={() => {
              resetToDefaultData();
              setSidebarOpen(false);
            }}
            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-colors border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5 text-pink-400" />
            <span>Restablecer Datos Demo</span>
          </button>

          <p className="text-[10px] text-slate-500 text-center font-mono">
            Ropa en Línea • v2.5 Responsive
          </p>
        </div>
      </aside>
    </>
  );
};
