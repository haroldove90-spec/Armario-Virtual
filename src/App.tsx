import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { RoleSwitcher } from './components/common/RoleSwitcher';
import { SidebarNav } from './components/common/SidebarNav';
import { Header } from './components/common/Header';
import { HeroSlider } from './components/store/HeroSlider';
import { PromoFlyers } from './components/store/PromoFlyers';
import { ProductGrid } from './components/store/ProductGrid';
import { CartDrawer } from './components/store/CartDrawer';
import { CheckoutModal } from './components/store/CheckoutModal';
import { CustomerPanel } from './components/customer/CustomerPanel';
import { CustomerLoginForm } from './components/auth/CustomerLoginForm';
import { ProductDetailPage } from './components/store/ProductDetailPage';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLoginForm } from './components/auth/AdminLoginForm';
import { Footer } from './components/common/Footer';
import { Sparkles } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeRole,
    toastMessage,
    selectedCategory,
    searchQuery,
    selectedProduct,
    setSelectedProduct,
    isCustomerLoggedIn,
    isAdminLoggedIn
  } = useStore();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-900 flex flex-col justify-between selection:bg-purple-200 selection:text-purple-900">
      {/* Top Role Switcher Bar */}
      <RoleSwitcher />

      {/* Left Navigation Sidebar Drawer (Mobile, Tablet, Desktop) */}
      <SidebarNav />

      {/* Toast Notification Popup */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-3 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-2.5 animate-bounce">
          <Sparkles className="w-4 h-4 text-yellow-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ROLE 1: TIENDA EN LÍNEA (Public Catalog & Storefront) */}
      {activeRole === 'tienda' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Header />

            {selectedProduct ? (
              <ProductDetailPage
                product={selectedProduct}
                onBack={() => setSelectedProduct(null)}
              />
            ) : (
              <>
                {/* Show Hero Slider & Promo Flyers if user is on main store page without search */}
                {selectedCategory === 'todas' && !searchQuery && (
                  <>
                    <HeroSlider />
                    <PromoFlyers />
                  </>
                )}

                {/* Main Catalog Product Grid */}
                <ProductGrid />
              </>
            )}
          </div>

          <Footer />

          {/* Cart Drawer */}
          <CartDrawer onOpenCheckout={() => setCheckoutOpen(true)} />

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            onOrderCompleted={() => {}}
          />
        </div>
      )}

      {/* ROLE 2: PANEL DEL CLIENTE (Customer Account Portal) */}
      {activeRole === 'cliente' && (
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <Header />

            <div className="py-6">
              {isCustomerLoggedIn ? (
                <CustomerPanel />
              ) : (
                <CustomerLoginForm />
              )}
            </div>
          </div>

          <Footer />

          {/* Cart Drawer */}
          <CartDrawer onOpenCheckout={() => setCheckoutOpen(true)} />

          {/* Checkout Modal */}
          <CheckoutModal
            isOpen={checkoutOpen}
            onClose={() => setCheckoutOpen(false)}
            onOrderCompleted={() => {}}
          />
        </div>
      )}

      {/* ROLE 3: PANEL DE ADMINISTRACIÓN (Admin Dashboard) */}
      {activeRole === 'admin' && (
        <div className="flex-1 flex flex-col justify-between bg-slate-100">
          <div>
            {isAdminLoggedIn ? (
              <AdminLayout />
            ) : (
              <div className="py-12">
                <AdminLoginForm />
              </div>
            )}
          </div>

          <Footer />
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <MainAppContent />
    </StoreProvider>
  );
}
