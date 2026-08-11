import React, { useState } from 'react';
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
  ChevronRight
} from 'lucide-react';

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
    categories
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeLocation] = useState('Perisur, CDMX');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [categoriesDropdownOpen, setCategoriesDropdownOpen] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-[100] shadow-xs font-sans">
      {/* 1. Top Announcement Bar */}
      {storeDesign.announcementBarActive && (
        <div className="bg-[#9E0D0D] text-white text-[10px] py-1.5 px-6 flex items-center justify-between uppercase tracking-wider font-medium">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
            <span>{storeDesign.announcementBarText}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-[10px]">
            <span className="hover:underline cursor-pointer">Atención a Clientes</span>
            <span className="hover:underline cursor-pointer">Localizar Tiendas</span>
            <span className="bg-[#E05A1B] text-white px-2 py-0.5 rounded font-bold uppercase">Envío Gratis &gt; $499</span>
          </div>
        </div>
      )}

      {/* 2. Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex items-center justify-between gap-4">
          
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#9E0D0D] focus:outline-hidden flex items-center gap-1"
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
            className="cursor-pointer flex items-center gap-2.5 group shrink-0"
          >
            <img
              src={storeDesign.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
              alt={storeDesign.storeName || 'Armario Virtual'}
              className="h-10 sm:h-12 w-auto object-contain rounded-md group-hover:scale-105 transition-transform"
            />
            <div className="flex flex-col justify-center">
              <span className="text-base sm:text-2xl font-black text-[#9E0D0D] tracking-tight uppercase leading-none font-sans">
                {storeDesign.logoText || 'ARMARIO VIRTUAL'}
              </span>
              <span className="text-[9px] sm:text-[11px] font-black text-[#E05A1B] tracking-wider uppercase leading-none mt-1 font-sans">
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
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 rounded-full py-2.5 pl-11 pr-10 border border-transparent focus:border-[#9E0D0D] focus:ring-2 focus:ring-red-100 transition-all outline-hidden"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5 text-xs font-medium">
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
              className="relative p-2 text-slate-700 hover:text-[#9E0D0D] rounded-full hover:bg-red-50 transition-colors flex flex-col items-center"
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
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 p-1.5 text-slate-700 hover:text-[#9E0D0D] rounded-xl hover:bg-red-50 transition-colors"
              >
                {customer.avatarUrl ? (
                  <img src={customer.avatarUrl} alt="Avatar" className="w-8 h-8 rounded-full object-cover border border-red-200" />
                ) : (
                  <div className="w-8 h-8 bg-red-100 text-[#9E0D0D] rounded-full flex items-center justify-center font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-[10px] text-slate-400 leading-none">Mi Cuenta</span>
                  <span className="text-xs font-bold text-slate-800 max-w-[90px] truncate">{customer.name.split(' ')[0]}</span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 text-xs">
                  <div className="px-4 py-2 border-b border-slate-100 bg-red-50/60">
                    <p className="font-bold text-slate-900">{customer.name}</p>
                    <p className="text-slate-500 text-[11px] truncate">{customer.email}</p>
                  </div>

                  <button
                    onClick={() => {
                      setActiveRole('cliente');
                      setCustomerTab('compras');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-[#9E0D0D] flex items-center gap-2 font-medium"
                  >
                    <ShoppingBag className="w-4 h-4 text-[#9E0D0D]" />
                    Mis Compras / Pedidos
                  </button>

                  <button
                    onClick={() => {
                      setActiveRole('cliente');
                      setCustomerTab('domicilios');
                      setUserDropdownOpen(false);
                    }}
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-[#9E0D0D] flex items-center gap-2 font-medium"
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
                    className="w-full text-left px-4 py-2.5 text-slate-700 hover:bg-red-50 hover:text-[#9E0D0D] flex items-center gap-2 font-medium"
                  >
                    <User className="w-4 h-4 text-[#9E0D0D]" />
                    Mi Perfil
                  </button>

                  <div className="border-t border-slate-100 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setActiveRole('admin');
                        setUserDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[#9E0D0D] hover:bg-red-100 flex items-center gap-2 font-bold"
                    >
                      <ShieldCheck className="w-4 h-4 text-[#9E0D0D]" />
                      Ir al Panel de Administración
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Cart Button */}
            <button
              onClick={() => setCartOpen(true)}
              className="flex items-center gap-2 bg-[#9E0D0D] hover:bg-red-900 text-white px-4 py-2 rounded-full shadow-xs transition-all active:scale-95"
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
        <div className="mt-3 md:hidden">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              placeholder="Buscar ropa, vestidos, calzado..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100 text-xs text-slate-900 rounded-full py-2.5 pl-9 pr-8 border border-slate-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3" />
          </div>
        </div>
      </div>

      {/* 3. Dynamic Categories Header Mega Nav Bar & Full Screen Unencapsulated Mega Menu */}
      <nav className="bg-white border-t border-slate-100 hidden lg:block relative z-[100]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-start sm:justify-center gap-2 sm:gap-4 py-2 text-xs font-bold text-slate-600 uppercase tracking-wider relative">
          
          {/* Main Dropdown Button for "Todas las Categorías" */}
          <div
            className="relative shrink-0 z-[110]"
            onMouseEnter={() => setCategoriesDropdownOpen(true)}
            onMouseLeave={() => setCategoriesDropdownOpen(false)}
          >
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                setActiveRole('tienda');
                setCategoriesDropdownOpen(!categoriesDropdownOpen);
              }}
              className={`py-1.5 px-3.5 rounded-xl flex items-center gap-2 transition-all ${
                selectedCategory === 'todas'
                  ? 'bg-[#9E0D0D] text-white font-extrabold shadow-md'
                  : 'bg-slate-100 text-slate-800 hover:bg-red-50 hover:text-[#9E0D0D]'
              }`}
            >
              <Layers className="w-4 h-4 text-[#E05A1B]" />
              <span>Todas las Categorías</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${categoriesDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Unencapsulated Wide Mega Menu Across Screen */}
            {categoriesDropdownOpen && (
              <div
                className="absolute left-0 top-full mt-2 w-[92vw] max-w-6xl bg-white/98 backdrop-blur-md rounded-3xl shadow-2xl border-2 border-slate-200/90 p-6 z-[999] animate-fadeIn font-sans cursor-default"
                onClick={e => e.stopPropagation()}
              >
                {/* Mega Menu Top Info Bar */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-red-50 text-[#9E0D0D] rounded-2xl border border-red-100">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                        <span>Departamentos y Categorías</span>
                        <span className="text-xs bg-[#E05A1B] text-white px-2 py-0.5 rounded-full font-mono">
                          {categories.length} Disponibles
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500 font-normal mt-0.5">
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
                    className="bg-[#9E0D0D] hover:bg-red-800 text-white font-black text-xs px-4 py-2 rounded-xl transition-all shadow-xs"
                  >
                    Ver Todo el Catálogo
                  </button>
                </div>

                {/* Open Multi-Column Grid of Categories & Subcategories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-h-[65vh] overflow-y-auto pr-2">
                  {categories.map(cat => (
                    <div
                      key={cat.id}
                      className="bg-slate-50/80 hover:bg-red-50/40 p-4 rounded-2xl border border-slate-200/80 hover:border-red-200 transition-all flex flex-col justify-between group"
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
                          className="w-full text-left flex items-center justify-between pb-2 border-b border-slate-200/80 group-hover:border-red-200"
                        >
                          <span className="font-black text-slate-900 text-xs uppercase tracking-tight group-hover:text-[#9E0D0D] transition-colors flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-[#E05A1B] group-hover:scale-125 transition-transform" />
                            {cat.name}
                          </span>
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#9E0D0D] group-hover:translate-x-1 transition-all" />
                        </button>

                        {/* Subcategories List */}
                        <div className="mt-3 space-y-1.5">
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
                                className="w-full text-left text-[11px] font-semibold text-slate-600 hover:text-[#9E0D0D] hover:translate-x-1 transition-all py-1 px-2 rounded-lg hover:bg-white flex items-center justify-between"
                              >
                                <span>{sub.name}</span>
                                <span className="text-[9px] text-slate-400 opacity-0 group-hover:opacity-100 font-mono">→</span>
                              </button>
                            ))
                          ) : (
                            <button
                              onClick={() => {
                                setSelectedCategory(cat.slug);
                                setSearchQuery('');
                                setActiveRole('tienda');
                                setCategoriesDropdownOpen(false);
                              }}
                              className="text-[11px] text-slate-400 hover:text-[#9E0D0D] italic py-1 block"
                            >
                              Ver prendas de {cat.name}
                            </button>
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
                        className="mt-3 text-[10px] font-black text-[#E05A1B] group-hover:text-[#9E0D0D] uppercase tracking-wider text-right block hover:underline"
                      >
                        Explorar {cat.name} &rarr;
                      </button>
                    </div>
                  ))}
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
