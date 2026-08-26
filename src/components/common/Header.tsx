import React, { useState, useRef } from 'react';
import { useStore } from '../../context/StoreContext';
import { Category } from '../../types';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Sparkles,
  Percent,
  ShieldCheck,
  ShoppingBasket,
  Layers,
  ChevronRight,
  ArrowRight,
  LogOut,
  LogIn
} from 'lucide-react';
import { SupabaseSmartButton } from './SupabaseSmartButton';

export const Header: React.FC = () => {
  const {
    storeDesign,
    cart,
    setCartOpen,
    customer,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveRole,
    setCustomerTab,
    setSidebarOpen,
    categories,
    products,
    isCustomerLoggedIn,
    isAdminLoggedIn,
    customerLogout,
    adminLogout,
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeLocation] = useState('Perisur, CDMX');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [showLiveSearch, setShowLiveSearch] = useState(false);

  const closeCategoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleCategoriesMouseEnter = () => {
    if (closeCategoriesTimeoutRef.current) {
      clearTimeout(closeCategoriesTimeoutRef.current);
      closeCategoriesTimeoutRef.current = null;
    }
    setCategoriesDropdownOpen(true);
  };

  const handleCategoriesMouseLeave = () => {
    if (closeCategoriesTimeoutRef.current) {
      clearTimeout(closeCategoriesTimeoutRef.current);
    }
    closeCategoriesTimeoutRef.current = setTimeout(() => {
      setCategoriesDropdownOpen(false);
    }, 450);
  };

  const normalize = (str: string) =>
    (str || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');

  const getCategoryDisplayName = (catValue: string | undefined): string => {
    if (!catValue) return 'General';
    const clean = catValue.trim().toLowerCase();
    const found = categories.find(
      c =>
        c.slug.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        c.name.toLowerCase() === clean
    );
    return found ? found.name : catValue;
  };

  const liveMatches = React.useMemo(() => {
    const raw = searchQuery.trim();
    if (!raw) return [];
    const norm = normalize(raw);
    const words = norm.split(/\s+/).filter(Boolean);

    return products.filter(p => {
      const nameNorm = normalize(p.name);
      const descNorm = normalize(p.description);
      const catNorm = normalize(p.category);
      const subNorm = normalize(p.subcategory);
      const skuNorm = p.sku ? normalize(p.sku) : '';
      const tagsNorm = p.tags ? p.tags.map(t => normalize(t)) : [];
      const sizesNorm = p.sizes ? p.sizes.map(s => normalize(s)) : [];
      const colorsNorm = p.colors ? p.colors.map(c => (typeof c === 'string' ? normalize(c) : normalize(c.name))) : [];

      return words.every(w =>
        nameNorm.includes(w) ||
        descNorm.includes(w) ||
        catNorm.includes(w) ||
        subNorm.includes(w) ||
        skuNorm.includes(w) ||
        tagsNorm.some(t => t.includes(w)) ||
        sizesNorm.some(s => s.includes(w)) ||
        colorsNorm.some(c => c.includes(w))
      );
    });
  }, [products, searchQuery]);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full max-w-full bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-xs font-sans overflow-x-clip">
      {/* 1. Top Announcement Bar */}
      {storeDesign.announcementBarActive && (
        <div className="w-full bg-[#9E0D0D] text-white text-[10px] py-1.5 px-3 sm:px-6 flex items-center justify-between uppercase tracking-wider font-medium overflow-hidden">
          <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 truncate">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse shrink-0" />
            <span className="truncate">{storeDesign.announcementBarText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px] shrink-0">
            <span className="hover:underline cursor-pointer">Atención a Clientes</span>
            <span className="hover:underline cursor-pointer">Localizar Tiendas</span>
            <span className="bg-[#E05A1B] text-white px-2 py-0.5 rounded font-bold uppercase">Envío Gratis &gt; $499</span>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4 w-full">
          
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-1.5 sm:p-2 text-slate-700 hover:text-[#9E0D0D] focus:outline-hidden flex items-center shrink-0 cursor-pointer"
            title="Abrir menú de navegación"
          >
            <Menu className="w-6 h-6 text-[#9E0D0D]" />
          </button>

          {/* Logo */}
          <div
            onClick={() => {
              setActiveRole('tienda');
              setSelectedCategory('todas');
            }}
            className="cursor-pointer flex items-center gap-1.5 sm:gap-2.5 group shrink min-w-0"
          >
            <img
              src={storeDesign.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
              alt={storeDesign.storeName || 'Armario Virtual'}
              className="h-8 sm:h-12 w-auto object-contain rounded-md group-hover:scale-105 transition-transform shrink-0"
            />
            <div className="flex flex-col justify-center min-w-0">
              <span className="text-sm sm:text-2xl font-black text-[#9E0D0D] tracking-tight uppercase leading-none font-sans truncate">
                {storeDesign.logoText || 'ARMARIO VIRTUAL'}
              </span>
              <span className="text-[8px] sm:text-[11px] font-black text-[#E05A1B] tracking-wider uppercase leading-none mt-0.5 sm:mt-1 font-sans truncate">
                {storeDesign.logoSubtext || 'TU ESTILO LIBRE'}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-4 relative">
            <div className="relative w-full flex items-center">
              <input
                type="text"
                placeholder="Buscar vestidos, chamarras, tenis, marcas..."
                value={searchQuery}
                onFocus={() => setShowLiveSearch(true)}
                onChange={e => {
                  setSearchQuery(e.target.value);
                  setShowLiveSearch(true);
                }}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 rounded-full py-2.5 pl-11 pr-10 border border-transparent focus:border-[#9E0D0D] focus:ring-2 focus:ring-red-100 transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setShowLiveSearch(false);
                  }}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Live Search Popup */}
            {showLiveSearch && searchQuery.trim().length > 0 && (
              <div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[999] p-3 text-xs animate-fadeIn overflow-hidden"
                onClick={e => e.stopPropagation()}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                  <span className="font-extrabold text-slate-800 text-[11px] uppercase tracking-wider flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5 text-[#E05A1B]" />
                    Resultados ({liveMatches.length})
                  </span>
                  <button
                    onClick={() => setShowLiveSearch(false)}
                    className="text-[10px] text-slate-400 hover:text-slate-700 font-bold cursor-pointer"
                  >
                    Cerrar ✕
                  </button>
                </div>

                {liveMatches.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto space-y-1.5 pr-1">
                    {liveMatches.slice(0, 5).map(prod => (
                      <div
                        key={prod.id}
                        onClick={() => {
                          setActiveRole('tienda');
                          setShowLiveSearch(false);
                          const el = document.getElementById('catalogo');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-2 rounded-xl hover:bg-red-50/60 transition-colors flex items-center gap-3 cursor-pointer group"
                      >
                        <img
                          src={prod.images[0] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=100&q=80'}
                          alt={prod.name}
                          className="w-10 h-10 object-cover rounded-lg border border-slate-200 group-hover:scale-105 transition-transform shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 truncate group-hover:text-[#9E0D0D] transition-colors">
                            {prod.name}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px]">
                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-bold">
                              {getCategoryDisplayName(prod.category)} {prod.subcategory && prod.subcategory !== 'General' ? `• ${prod.subcategory}` : ''}
                            </span>
                            <span className="font-extrabold text-[#9E0D0D] font-mono">
                              ${prod.price} MXN
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <button
                      onClick={() => {
                        setActiveRole('tienda');
                        setShowLiveSearch(false);
                        const el = document.getElementById('catalogo');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="w-full mt-2 bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold text-xs py-2 rounded-xl text-center shadow-xs transition-all uppercase tracking-wider block cursor-pointer"
                    >
                      Ver los {liveMatches.length} resultados en la tienda ↓
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 text-slate-500">
                    <p className="font-bold text-xs">No se encontraron productos</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">Intenta buscar "vestido", "chamarra", "tenis", "bolso"</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1.5 sm:gap-3 text-xs font-medium shrink-0">
            {/* Preferred Store Selector */}
            <div className="hidden xl:flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 hover:bg-slate-100 p-2 rounded-xl border border-slate-200 cursor-pointer">
              <MapPin className="w-4 h-4 text-[#9E0D0D]" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-400 leading-none">Mi Tienda</span>
                <span className="font-bold text-slate-800">{storeLocation}</span>
              </div>
            </div>

            {/* Wishlist */}
            <button
              onClick={() => {
                setActiveRole('cliente');
                setCustomerTab('favoritos');
              }}
              className="relative p-1.5 sm:p-2 text-slate-700 hover:text-[#9E0D0D] rounded-full hover:bg-red-50 transition-colors flex flex-col items-center cursor-pointer shrink-0"
              title="Mis Favoritos"
            >
              <Heart className="w-5 h-5 text-[#9E0D0D]" />
              {customer.wishlistProductIds.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#E05A1B] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {customer.wishlistProductIds.length}
                </span>
              )}
              <span className="text-[10px] text-slate-600 font-semibold hidden sm:inline mt-0.5">Favoritos</span>
            </button>

            {/* Account / User Profile */}
            <div className="relative shrink-0">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="relative flex items-center gap-1 sm:gap-2 p-1 sm:p-1.5 text-slate-700 hover:text-[#9E0D0D] rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
              >
                {customer.avatarUrl ? (
                  <img src={customer.avatarUrl} alt="Avatar" className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-red-200" />
                ) : (
                  <div className="w-7 h-7 sm:w-8 sm:h-8 bg-red-100 text-[#9E0D0D] rounded-full flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                {(unreadSalesCount > 0 || customerActiveOrdersCount > 0) && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[9px] font-black rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center animate-bounce shadow-xs">
                    {unreadSalesCount > 0 ? unreadSalesCount : customerActiveOrdersCount}
                  </span>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 leading-none">Mi Cuenta</span>
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">{customer.name.split(' ')[0]}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 bg-red-50/60">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{customer.email}</p>
                    <span className="inline-block mt-1 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-white border border-red-200 text-[#9E0D0D]">
                      {isCustomerLoggedIn ? '🟢 Sesión Cliente Activa' : '⚪ Invitado'}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setActiveRole('cliente');
                      setCustomerTab('compras');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-[#9E0D0D] flex items-center justify-between font-medium cursor-pointer"
                  >
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-[#9E0D0D]" />
                      <span>Mis Compras / Pedidos</span>
                    </div>
                    {customerActiveOrdersCount > 0 && (
                      <span className="bg-[#E05A1B] text-white text-[9px] font-black rounded-full px-1.5 py-0.2 animate-pulse">
                        {customerActiveOrdersCount}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setActiveRole('cliente');
                      setCustomerTab('domicilios');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-[#9E0D0D] flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <MapPin className="w-4 h-4 text-[#9E0D0D]" />
                    Mis Domicilios de Entrega
                  </button>

                  <button
                    onClick={() => {
                      setActiveRole('cliente');
                      setCustomerTab('perfil');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-[#9E0D0D] flex items-center gap-2 font-medium cursor-pointer"
                  >
                    <User className="w-4 h-4 text-[#9E0D0D]" />
                    Mi Perfil
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1 space-y-0.5">
                    <button
                      onClick={() => {
                        setActiveRole('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-[#9E0D0D] hover:bg-red-50 flex items-center justify-between font-bold cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#9E0D0D]" />
                        <span>Panel de Administración</span>
                      </div>
                      {unreadSalesCount > 0 && (
                        <span className="bg-red-500 text-white text-[9px] font-black rounded-full px-1.5 py-0.2 animate-bounce shadow-sm">
                          {unreadSalesCount}
                        </span>
                      )}
                    </button>

                    {isCustomerLoggedIn && (
                      <button
                        onClick={() => {
                          customerLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-pink-700 hover:bg-pink-50 flex items-center gap-2 font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-pink-600" />
                        <span>Cerrar Sesión Cliente</span>
                      </button>
                    )}

                    {isAdminLoggedIn && (
                      <button
                        onClick={() => {
                          adminLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-red-700 hover:bg-red-50 flex items-center gap-2 font-bold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-600" />
                        <span>Cerrar Sesión Admin</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Supabase Smart Button for Authorized Roles */}
            <SupabaseSmartButton variant="header" />

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-1.5 bg-[#9E0D0D] hover:bg-red-900 text-white p-2 sm:px-4 sm:py-2 rounded-full shadow-xs transition-all active:scale-95 shrink-0 cursor-pointer"
              title="Ver Bolsa de Compras"
            >
              <div className="relative">
                <ShoppingBasket className="w-4 h-4" />
                {totalCartItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#E05A1B] text-white text-[9px] font-black rounded-full px-1 py-0.2 min-w-[16px] text-center">
                    {totalCartItems}
                  </span>
                )}
              </div>
              <span className="font-bold text-xs hidden sm:inline uppercase tracking-wider">Bolsa</span>
            </button>
          </div>
        </div>

        {/* Search Bar on Mobile */}
        <div className="mt-2.5 md:hidden w-full">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Buscar ropa, vestidos, calzado..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-xs text-slate-900 rounded-full py-2 pl-9 pr-8 border border-slate-200 focus:bg-white focus:border-[#9E0D0D] outline-hidden transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Dynamic Categories Header Mega Nav Bar & Full Screen Unencapsulated Mega Menu */}
      <nav className="bg-white border-t border-slate-100 hidden lg:block relative z-[100]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-2 sm:gap-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider relative">
          
          {/* Main Dropdown Button for "Todas las Categorías" */}
          <div
            className="relative shrink-0 z-[110]"
            onMouseEnter={handleCategoriesMouseEnter}
            onMouseLeave={handleCategoriesMouseLeave}
          >
            <button
              onClick={() => {
                if (closeCategoriesTimeoutRef.current) {
                  clearTimeout(closeCategoriesTimeoutRef.current);
                }
                setSelectedCategory('todas');
                setSearchQuery('');
                setActiveRole('tienda');
                setCategoriesDropdownOpen(!categoriesDropdownOpen);
              }}
              className={`py-1.5 px-3.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer ${
                selectedCategory === 'todas'
                  ? 'bg-[#9E0D0D] text-white font-extrabold shadow-md'
                  : 'bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-[#9E0D0D]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#E05A1B]" />
              <span>Todas las Categorías</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Unencapsulated Wide Mega Menu Across Screen with Viewport Boundaries */}
            {categoriesDropdownOpen && (
              <div
                className="absolute left-0 top-full pt-1.5 w-[680px] max-w-[calc(100vw-2rem)] sm:max-w-[700px] z-[999] animate-fadeIn font-sans cursor-default"
                onMouseEnter={handleCategoriesMouseEnter}
                onMouseLeave={handleCategoriesMouseLeave}
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-white rounded-2xl shadow-2xl border-2 border-slate-200/90 p-5 sm:p-6 overflow-hidden">
                  {/* Mega Menu Top Info Bar */}
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3.5 mb-4 gap-2 flex-wrap">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 bg-red-50 text-[#9E0D0D] rounded-xl border border-red-100 shrink-0">
                        <Layers className="w-4 h-4 sm:w-5 sm:h-5" />
                      </div>
                      <div>
                        <h3 className="text-xs sm:text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                          <span>Departamentos y Categorías</span>
                          <span className="text-[10px] sm:text-xs bg-[#E05A1B] text-white px-2 py-0.5 rounded-full font-mono">
                            {categories.length} Disponibles
                          </span>
                        </h3>
                        <p className="text-[10px] sm:text-[11px] text-slate-500 font-normal mt-0.5 line-clamp-1">
                          Selecciona cualquier categoría o subcategoría para explorar las prendas y productos
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedCategory('todas');
                        setSearchQuery('');
                        setActiveRole('tienda');
                        setCategoriesDropdownOpen(false);
                      }}
                      className="bg-[#9E0D0D] hover:bg-red-800 text-white font-black text-[11px] sm:text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
                    >
                      Ver Todo
                    </button>
                  </div>

                  {/* Open Multi-Column Grid of Categories & Subcategories */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto pr-1">
                    {categories.map(cat => (
                      <div
                        key={cat.id}
                        className="bg-slate-50/90 hover:bg-red-50/40 p-3.5 sm:p-4 rounded-xl border border-slate-200/80 hover:border-red-200 transition-all flex flex-col justify-between group"
                      >
                        <div>
                          {/* Main Category Header Button */}
                          <button
                            onClick={() => {
                              setSelectedCategory(cat.slug);
                              setSearchQuery('');
                              setActiveRole('tienda');
                              setCategoriesDropdownOpen(false);
                            }}
                            className="w-full text-left flex items-center justify-between pb-2 border-b border-slate-200/80 group-hover:border-red-200 cursor-pointer"
                          >
                            <span className="font-black text-slate-900 text-xs uppercase tracking-tight group-hover:text-[#9E0D0D] transition-colors flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full bg-[#E05A1B] group-hover:scale-125 transition-transform" />
                              {cat.name}
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9E0D0D] group-hover:translate-x-1 transition-all" />
                          </button>

                          {/* Subcategories List */}
                          <div className="mt-2.5 space-y-1">
                            {cat.subcategories && cat.subcategories.length > 0 ? (
                              cat.subcategories.map(sub => (
                                <button
                                  key={sub.id}
                                  onClick={() => {
                                    setSelectedCategory(cat.slug);
                                    setSearchQuery(sub.name);
                                    setActiveRole('tienda');
                                    setCategoriesDropdownOpen(false);
                                  }}
                                  className="w-full text-left text-[11px] font-semibold text-slate-600 hover:text-[#9E0D0D] hover:translate-x-1 transition-all py-1 px-2 rounded-lg hover:bg-white flex items-center justify-between cursor-pointer"
                                >
                                  <span>{sub.name}</span>
                                  <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 font-mono">→</span>
                                </button>
                              ))
                            ) : (
                              <p className="text-[11px] text-slate-400 italic py-1 px-2">
                                Ver prendas de {cat.name}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Bottom Quick Filter Link */}
                        <button
                          onClick={() => {
                            setSelectedCategory(cat.slug);
                            setSearchQuery('');
                            setActiveRole('tienda');
                            setCategoriesDropdownOpen(false);
                          }}
                          className="mt-3 pt-2 text-[10px] font-black text-[#E05A1B] group-hover:text-[#9E0D0D] uppercase tracking-wider flex items-center justify-end gap-1 border-t border-slate-200/50 hover:underline cursor-pointer"
                        >
                          <span>Explorar {cat.name}</span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Direct Dynamic Category Tabs for ALL Created Categories */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar py-0.5">
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                setActiveRole('tienda');
              }}
              className={`py-1 px-2.5 transition-all flex items-center gap-1.5 border-b-2 shrink-0 ${
                selectedCategory === 'todas'
                  ? 'border-[#9E0D0D] text-[#9E0D0D] font-black'
                  : 'border-transparent text-slate-600 hover:text-[#9E0D0D]'
              }`}
            >
              <span>Todos</span>
            </button>

            {categories.map(cat => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.slug);
                    setSearchQuery('');
                    setActiveRole('tienda');
                  }}
                  className={`py-1 px-2.5 transition-all flex items-center gap-1.5 border-b-2 shrink-0 whitespace-nowrap ${
                    isSelected
                      ? 'border-[#9E0D0D] text-[#9E0D0D] font-black'
                      : cat.slug === 'ofertas'
                      ? 'border-transparent text-[#E05A1B] hover:text-orange-700 font-black'
                      : 'border-transparent text-slate-600 hover:text-[#9E0D0D]'
                  }`}
                >
                  {cat.slug === 'ofertas' && <Percent className="w-3.5 h-3.5 text-[#E05A1B] animate-bounce" />}
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
