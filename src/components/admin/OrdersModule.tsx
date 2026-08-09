import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OrderStatus } from '../../types';
import { ShoppingBag, Search, Filter, Truck, CheckCircle2, Clock, XCircle, Printer } from 'lucide-react';

export const OrdersModule: React.FC = () => {
  const { orders, updateOrderStatus, assignOrderTracking } = useStore();

  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('todos');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(orders[0]?.id || null);

  // Tracking modal / form
  const [trackingModalOrder, setTrackingModalOrder] = useState<string | null>(null);
  const [carrierInput, setCarrierInput] = useState('SubuEntrega Exprés');
  const [trackingNumInput, setTrackingNumInput] = useState('');

  const filteredOrders = orders.filter(o => {
    const matchesSearch =
      o.orderNumber.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName.toLowerCase().includes(search.toLowerCase()) ||
      o.customerEmail.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'todos' || o.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const selectedOrderObj = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleSaveTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingModalOrder || !trackingNumInput) return;
    assignOrderTracking(trackingModalOrder, carrierInput, trackingNumInput);
    setTrackingModalOrder(null);
    setTrackingNumInput('');
  };

  return (
    <div className="space-y-6">
      {/* Module Title */}
      <div>
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-purple-700" />
          Administración de Ventas y Pedidos ({orders.length})
        </h3>
        <p className="text-xs text-gray-500">Gestiona las compras realizadas, cambia su estatus y asigna números de guía</p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por # Pedido, Cliente o Email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-hidden focus:border-purple-600"
          />
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-800"
        >
          <option value="todos">Todos los Estados</option>
          <option value="pendiente">Pendiente de Pago</option>
          <option value="en_preparacion">En Preparación</option>
          <option value="enviado">Enviado (En camino)</option>
          <option value="entregado">Entregado</option>
          <option value="cancelado">Cancelado</option>
        </select>
      </div>

      {/* Orders Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders list */}
        <div className="space-y-3">
          {filteredOrders.map(ord => (
            <div
              key={ord.id}
              onClick={() => setSelectedOrderId(ord.id)}
              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                selectedOrderObj?.id === ord.id
                  ? 'border-purple-600 bg-purple-50/50 shadow-md'
                  : 'border-gray-200 bg-white hover:border-purple-200'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-extrabold text-xs text-purple-900">{ord.orderNumber}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  ord.status === 'entregado' ? 'bg-emerald-100 text-emerald-800' :
                  ord.status === 'enviado' ? 'bg-purple-100 text-purple-800' :
                  ord.status === 'en_preparacion' ? 'bg-blue-100 text-blue-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {ord.status.replace('_', ' ')}
                </span>
              </div>

              <p className="text-xs font-bold text-gray-900">{ord.customerName}</p>
              <p className="text-[11px] text-gray-500">{ord.createdAt}</p>

              <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-600 font-medium">{ord.items.length} prendas</span>
                <span className="text-sm font-black text-purple-950">${ord.total.toFixed(2)} MXN</span>
              </div>
            </div>
          ))}
        </div>

        {/* Selected Order Details */}
        {selectedOrderObj && (
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
              <div>
                <span className="text-xs text-purple-700 font-bold uppercase tracking-wider">Detalle de Venta</span>
                <h3 className="text-xl font-black text-gray-900">{selectedOrderObj.orderNumber}</h3>
                <p className="text-xs text-gray-500">Cliente: {selectedOrderObj.customerName} ({selectedOrderObj.customerEmail})</p>
              </div>

              {/* Status Change Control */}
              <div className="flex items-center gap-2">
                <label className="text-xs font-bold text-gray-700">Cambiar Estatus:</label>
                <select
                  value={selectedOrderObj.status}
                  onChange={e => updateOrderStatus(selectedOrderObj.id, e.target.value as OrderStatus)}
                  className="bg-purple-50 border border-purple-200 font-bold text-purple-900 text-xs py-1.5 px-3 rounded-xl"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en_preparacion">En Preparación</option>
                  <option value="enviado">Enviado</option>
                  <option value="entregado">Entregado</option>
                  <option value="cancelado">Cancelado</option>
                </select>
              </div>
            </div>

            {/* Carrier & Tracking Control */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                  <Truck className="w-4 h-4 text-purple-700" />
                  Empresa de Envío: <strong className="text-purple-900">{selectedOrderObj.shippingProvider}</strong>
                </span>
                <p className="text-xs text-gray-500 mt-0.5">
                  Guía: <span className="font-mono bg-white px-2 py-0.5 rounded border border-gray-300 font-bold">{selectedOrderObj.trackingNumber || 'No asignada'}</span>
                </p>
              </div>

              <button
                onClick={() => {
                  setTrackingModalOrder(selectedOrderObj.id);
                  setCarrierInput(selectedOrderObj.shippingProvider || 'SubuEntrega Exprés');
                  setTrackingNumInput(selectedOrderObj.trackingNumber || '');
                }}
                className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2 rounded-xl transition-all shadow-xs"
              >
                Asignar / Editar Guía
              </button>
            </div>

            {/* Items Purchased */}
            <div>
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-3">Prendas de la Venta</h4>
              <div className="space-y-3">
                {selectedOrderObj.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                    <div className="flex items-center gap-3">
                      <img src={item.productImage} alt={item.productName} className="w-12 h-12 object-cover rounded-xl border border-gray-200" />
                      <div>
                        <h5 className="font-bold text-gray-900">{item.productName}</h5>
                        <p className="text-gray-500">Talla: {item.size} | Color: {item.color} | Cantidad: {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-black text-purple-900 text-sm">${(item.price * item.quantity).toFixed(2)} MXN</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Address & Payment Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <p className="font-bold text-gray-900 mb-1">Domicilio de Destino:</p>
                <p className="text-gray-700">{selectedOrderObj.shippingAddress.street} #{selectedOrderObj.shippingAddress.exteriorNumber}</p>
                <p className="text-gray-500">Col. {selectedOrderObj.shippingAddress.neighborhood}, C.P. {selectedOrderObj.shippingAddress.postalCode}</p>
                <p className="text-gray-500">{selectedOrderObj.shippingAddress.city}, {selectedOrderObj.shippingAddress.state}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-1">
                <p className="font-bold text-gray-900 mb-1">Resumen de Pago:</p>
                <div className="flex justify-between text-gray-600">
                  <span>Método:</span>
                  <span className="font-bold text-gray-800">{selectedOrderObj.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <span>${selectedOrderObj.subtotal.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío:</span>
                  <span>${selectedOrderObj.shippingCost.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-sm font-black text-purple-950 pt-1 border-t border-gray-200">
                  <span>Total Cobrado:</span>
                  <span>${selectedOrderObj.total.toFixed(2)} MXN</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Assign Tracking Modal */}
      {trackingModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl relative border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4">Asignar Guía de Paquetería</h3>
            <form onSubmit={handleSaveTracking} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Empresa / Paquetería</label>
                <input
                  type="text"
                  value={carrierInput}
                  onChange={e => setCarrierInput(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Número de Guía o Rastreo</label>
                <input
                  type="text"
                  placeholder="Ej: ESTA-992014-MX"
                  value={trackingNumInput}
                  onChange={e => setTrackingNumInput(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono"
                  required
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl">
                  Guardar Guía
                </button>
                <button
                  type="button"
                  onClick={() => setTrackingModalOrder(null)}
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
  );
};
