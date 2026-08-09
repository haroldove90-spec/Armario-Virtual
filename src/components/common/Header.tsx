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
  ShoppingBasket
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    storeDesign,
    cart,
    cartOpen,
    setCartOpen,
    customer,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setActiveRole,
    setCustomerTab,
    activeRole,
    setSidebarOpen
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [storeLocation, setStoreLocation] = useState('Perisur, CDMX');
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const totalCartItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const categories: { id: Category | 'todas'; label: string; badge?: string }[] = [
    { id: 'todas', label: 'Todos los Departamentos' },
    { id: 'ofertas', label: 'Gran Barata ⚡', badge: 'HASTA -50%' },
    { id: 'mujer', label: 'Moda Mujer' },
    { id: 'hombre', label: 'Moda Hombre' },
    { id: 'ninos', label: 'Niños y Bebés' },
    { id: 'calzado', label: 'Calzado' },
    { id: 'hogar', label: 'Hogar y Blancos' }
  ];

  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-10 z-40 shadow-xs font-sans">
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
          
          {/* Mobile/Tablet hamburger menu toggle -> Opens Left Sidebar */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-slate-700 hover:text-[#9E0D0D] focus:outline-hidden flex items-center gap-1"
            title="Abrir menú de navegación"
          >
            <Menu className="w-6 h-6 text-[#9E0D0D]" />
          </button>

          {/* Logo image + 2-line title (ARMARIO VIRTUAL / TU ESTILO LIBRE) */}
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
                className="w-full bg-slate-100 hover:bg-slate-50 focus:bg-white text-xs font-medium text-slate-800 rounded-full py-2.5 pl-11 pr-10 border border-transparent focus:border-purple-300 focus:ring-2 focus:ring-purple-100 transition-all outline-hidden"
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

          {/* Right Action Icons: Store Selector, Wishlist, Account, Cart */}
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

      {/* 3. Department Categories Mega Bar */}
      <nav className="bg-white border-t border-slate-100 hidden lg:block overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 py-2.5 text-xs font-bold text-slate-600 uppercase tracking-wider">
          {categories.map(cat => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveRole('cliente');
                }}
                className={`py-1 px-2 transition-all flex items-center gap-1.5 border-b-2 ${
                  isSelected
                    ? 'border-[#9E0D0D] text-[#9E0D0D] font-black'
                    : cat.id === 'ofertas'
                    ? 'border-transparent text-[#E05A1B] hover:text-orange-700 font-black'
                    : 'border-transparent text-slate-600 hover:text-[#9E0D0D]'
                }`}
              >
                {cat.id === 'ofertas' && <Percent className="w-3.5 h-3.5 text-[#E05A1B] animate-bounce" />}
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className="bg-pink-500 text-white text-[9px] px-1.5 py-0.5 rounded font-extrabold uppercase">
                    {cat.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-4 space-y-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Departamentos</p>
          <div className="grid grid-cols-2 gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setActiveRole('cliente');
                  setMobileMenuOpen(false);
                }}
                className={`p-2.5 text-left rounded-lg text-xs font-semibold flex items-center justify-between ${
                  selectedCategory === cat.id
                    ? 'bg-purple-100 text-purple-900 font-bold'
                    : 'bg-gray-50 text-gray-800 hover:bg-gray-100'
                }`}
              >
                <span>{cat.label}</span>
                {cat.badge && (
                  <span className="bg-pink-600 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                    {cat.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
