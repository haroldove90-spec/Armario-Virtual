import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CustomerTab, OrderStatus } from '../../types';
import { ProductCard } from '../store/ProductCard';
import {
  ShoppingBag,
  User,
  MapPin,
  Heart,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  ChevronRight,
  Plus,
  Trash2,
  Building,
  Edit2,
  LogOut
} from 'lucide-react';

export const CustomerPanel: React.FC = () => {
  const {
    customer,
    orders,
    products,
    customerTab,
    setCustomerTab,
    updateCustomerProfile,
    addCustomerAddress,
    customerLogout,
    setSelectedProduct,
    setActiveRole
  } = useStore();

  const [selectedOrder, setSelectedOrder] = useState<string | null>(orders[0]?.id || null);
  const [quickViewProduct, setQuickViewProduct] = useState<any>(null);

  // Profile form state
  const [profileName, setProfileName] = useState(customer.name);
  const [profileEmail, setProfileEmail] = useState(customer.email);
  const [profilePhone, setProfilePhone] = useState(customer.phone);
  const [profileStore, setProfileStore] = useState(customer.favoriteStore);

  // Address form state
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    recipientName: customer.name,
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    neighborhood: '',
    city: 'CDMX',
    state: 'CDMX',
    postalCode: '',
    phone: customer.phone
  });

  const customerOrders = orders.filter(o => o.customerEmail.toLowerCase() === customer.email.toLowerCase());
  const activeOrderObj = customerOrders.find(o => o.id === selectedOrder) || customerOrders[0];

  const wishlistProducts = products.filter(p => customer.wishlistProductIds.includes(p.id));

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCustomerProfile(profileName, profileEmail, profilePhone, profileStore);
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.exteriorNumber || !newAddr.postalCode) return;
    addCustomerAddress(newAddr);
    setShowAddressModal(false);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pendiente':
        return <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-bold">Pago Pendiente</span>;
      case 'en_preparacion':
        return <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-bold">En Preparación</span>;
      case 'enviado':
        return <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-1 rounded-full font-bold">En Camino (Enviado)</span>;
      case 'entregado':
        return <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-1 rounded-full font-bold">Entregado</span>;
      case 'cancelado':
        return <span className="bg-red-100 text-red-800 text-xs px-2.5 py-1 rounded-full font-bold">Cancelado</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Welcome Header */}
      <div className="bg-gradient-to-r from-purple-900 via-purple-800 to-pink-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={customer.avatarUrl || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'}
            alt="Avatar"
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-purple-400/50 shadow-md"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-black">¡Hola, {customer.name}!</h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-0.5">
              Cliente Frecuente | Sucursal preferida: <strong className="text-yellow-300">{customer.favoriteStore}</strong>
            </p>
          </div>
        </div>

        {/* Tab Selector & Logout */}
        <div className="flex flex-wrap items-center gap-2 bg-purple-950/60 p-1.5 rounded-2xl border border-purple-700/50">
          {[
            { id: 'compras', label: 'Mis Compras', icon: ShoppingBag },
            { id: 'domicilios', label: 'Mis Domicilios', icon: MapPin },
            { id: 'favoritos', label: 'Mis Favoritos', icon: Heart },
            { id: 'perfil', label: 'Mi Perfil', icon: User }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = customerTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setCustomerTab(tab.id as CustomerTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-yellow-400 text-purple-950 shadow-md'
                    : 'text-purple-200 hover:text-white hover:bg-purple-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
          <button
            onClick={() => customerLogout()}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs font-bold bg-pink-600 hover:bg-pink-700 text-white transition-all shadow-xs"
            title="Cerrar Sesión de Cliente"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Salir</span>
          </button>
        </div>
      </div>

      {/* TAB 1: MIS COMPRAS */}
      {customerTab === 'compras' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order list */}
          <div className="space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-purple-700" />
              Historial de Pedidos ({customerOrders.length})
            </h3>

            {customerOrders.length > 0 ? (
              customerOrders.map(ord => (
                <div
                  key={ord.id}
                  onClick={() => setSelectedOrder(ord.id)}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    activeOrderObj?.id === ord.id
                      ? 'border-purple-600 bg-purple-50/50 shadow-md'
                      : 'border-gray-200 bg-white hover:border-purple-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-extrabold text-xs text-purple-900">{ord.orderNumber}</span>
                    {getStatusBadge(ord.status)}
                  </div>

                  <p className="text-xs text-gray-500 font-medium">Fecha: {ord.createdAt}</p>
                  <p className="text-xs text-gray-700 font-bold mt-1">
                    {ord.items.length} {ord.items.length === 1 ? 'producto' : 'productos'} | Total: ${ord.total.toFixed(2)} MXN
                  </p>

                  <div className="mt-3 flex items-center justify-between text-[11px] text-purple-700 font-bold pt-2 border-t border-gray-100">
                    <span>Ver Rastreo y Detalles</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center bg-gray-50 rounded-2xl border border-gray-200">
                <ShoppingBag className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                <p className="font-bold text-gray-700 text-sm">Aún no tienes pedidos registrados</p>
              </div>
            )}
          </div>

          {/* Detailed Order Timeline */}
          {activeOrderObj && (
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-100 pb-4">
                <div>
                  <span className="text-xs text-purple-700 font-bold uppercase tracking-wider">Detalle de Pedido</span>
                  <h3 className="text-xl font-black text-gray-900">{activeOrderObj.orderNumber}</h3>
                  <p className="text-xs text-gray-500">Realizado el {activeOrderObj.createdAt}</p>
                </div>
                {getStatusBadge(activeOrderObj.status)}
              </div>

              {/* Status Timeline */}
              <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100">
                <h4 className="text-xs font-black text-purple-950 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-purple-700" />
                  Estatus de Envío: <span className="text-pink-600">{activeOrderObj.shippingProvider}</span>
                </h4>

                {activeOrderObj.trackingNumber && (
                  <p className="text-xs text-gray-700 font-medium mb-3">
                    Guía de Rastreo: <strong className="font-mono bg-white px-2 py-0.5 rounded border border-purple-200">{activeOrderObj.trackingNumber}</strong>
                  </p>
                )}

                {/* Timeline progress steps */}
                <div className="space-y-3 pl-2">
                  {activeOrderObj.statusHistory.map((hist, idx) => (
                    <div key={idx} className="flex items-start gap-3 relative">
                      <div className="w-6 h-6 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0 text-xs font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="text-xs">
                        <p className="font-bold text-gray-900 capitalize">{hist.status.replace('_', ' ')}</p>
                        <p className="text-gray-600">{hist.note}</p>
                        <span className="text-[10px] text-gray-400">{hist.timestamp}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Itemized List */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Artículos en este Pedido</h4>
                <div className="space-y-3">
                  {activeOrderObj.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl border border-gray-100">
                      <img src={item.productImage} alt={item.productName} className="w-14 h-14 object-cover rounded-xl border border-gray-200" />
                      <div className="flex-1 text-xs">
                        <h5 className="font-bold text-gray-900">{item.productName}</h5>
                        <p className="text-gray-500">Talla: {item.size || 'N/A'} | Color: {item.color || 'N/A'} | Cantidad: {item.quantity}</p>
                      </div>
                      <span className="font-black text-xs text-purple-900">${(item.price * item.quantity).toFixed(2)} MXN</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address Summary */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1">
                <p className="font-bold text-gray-900 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-purple-700" />
                  Dirección de Entrega
                </p>
                <p className="text-gray-700 font-medium">{activeOrderObj.shippingAddress.recipientName}</p>
                <p className="text-gray-500">
                  {activeOrderObj.shippingAddress.street} #{activeOrderObj.shippingAddress.exteriorNumber}, Col. {activeOrderObj.shippingAddress.neighborhood}, {activeOrderObj.shippingAddress.city}, C.P. {activeOrderObj.shippingAddress.postalCode}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: MIS DOMICILIOS */}
      {customerTab === 'domicilios' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-black text-gray-900">Mis Domicilios de Entrega</h3>
              <p className="text-xs text-gray-500">Administra tus direcciones para agilizar tus compras en línea</p>
            </div>
            <button
              onClick={() => setShowAddressModal(true)}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Nueva Dirección</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {customer.addresses.map(addr => (
              <div key={addr.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm relative space-y-2">
                {addr.isDefault && (
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Predeterminada
                  </span>
                )}
                <h4 className="font-black text-gray-900 text-sm pt-1">{addr.recipientName}</h4>
                <p className="text-xs text-gray-600">
                  {addr.street} #{addr.exteriorNumber} {addr.interiorNumber && `Int ${addr.interiorNumber}`}
                </p>
                <p className="text-xs text-gray-500">
                  Col. {addr.neighborhood}, {addr.city}, {addr.state} - C.P. {addr.postalCode}
                </p>
                <p className="text-xs text-gray-500 font-medium">Tel: {addr.phone}</p>
              </div>
            ))}
          </div>

          {/* Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
              <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-4">Registrar Nuevo Domicilio</h3>
                <form onSubmit={handleSaveAddress} className="space-y-3 text-xs">
                  <input
                    type="text"
                    placeholder="Nombre de quien recibe"
                    value={newAddr.recipientName}
                    onChange={e => setNewAddr({ ...newAddr, recipientName: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <input
                    type="text"
                    placeholder="Calle"
                    value={newAddr.street}
                    onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Num Ext"
                      value={newAddr.exteriorNumber}
                      onChange={e => setNewAddr({ ...newAddr, exteriorNumber: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Num Int (Opcional)"
                      value={newAddr.interiorNumber}
                      onChange={e => setNewAddr({ ...newAddr, interiorNumber: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Colonia / Fraccionamiento"
                    value={newAddr.neighborhood}
                    onChange={e => setNewAddr({ ...newAddr, neighborhood: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Código Postal (5 dígitos)"
                      value={newAddr.postalCode}
                      onChange={e => setNewAddr({ ...newAddr, postalCode: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                      required
                    />
                    <input
                      type="text"
                      placeholder="Alcaldía / Municipio"
                      value={newAddr.city}
                      onChange={e => setNewAddr({ ...newAddr, city: e.target.value })}
                      className="w-full p-2.5 border rounded-xl"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-3">
                    <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl">
                      Guardar Dirección
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: MIS FAVORITOS */}
      {customerTab === 'favoritos' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Mis Productos Favoritos</h3>
            <p className="text-xs text-gray-500">Tus prendas y artículos guardados para después</p>
          </div>

          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {wishlistProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onQuickView={p => {
                    setSelectedProduct(p);
                    setActiveRole('tienda');
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300">
              <Heart className="w-12 h-12 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-gray-700 text-sm">Aún no has agregado favoritos</p>
              <p className="text-xs text-gray-400 mt-1">Navega por la tienda y presiona el ícono del corazón en las prendas que te gusten.</p>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: MI PERFIL */}
      {customerTab === 'perfil' && (
        <div className="max-w-2xl bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-black text-gray-900">Configuración de Perfil</h3>
            <p className="text-xs text-gray-500">Actualiza tus datos de contacto y preferencias</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Nombre Completo</label>
              <input
                type="text"
                value={profileName}
                onChange={e => setProfileName(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Correo Electrónico</label>
              <input
                type="email"
                value={profileEmail}
                onChange={e => setProfileEmail(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Teléfono Móvil</label>
              <input
                type="text"
                value={profilePhone}
                onChange={e => setProfilePhone(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl font-medium"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Sucursal Preferida</label>
              <input
                type="text"
                value={profileStore}
                onChange={e => setProfileStore(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-xl font-medium"
                required
              />
            </div>

            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-3.5 rounded-xl shadow-md transition-all"
            >
              Guardar Cambios de Perfil
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
