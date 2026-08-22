import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, Sparkles, X, ArrowRight, Volume2, CheckCircle2, User, CreditCard, Truck } from 'lucide-react';
import { playNotificationSound } from '../../utils/audioNotification';

export const NewSalePopup: React.FC = () => {
  const {
    newSalePopupOrder,
    dismissNewSalePopup,
    setActiveRole,
    setAdminTab,
    adminLogin,
    isAdminLoggedIn
  } = useStore();

  if (!newSalePopupOrder) return null;

  const handleGoToOrder = () => {
    if (!isAdminLoggedIn) {
      adminLogin('admin@armariovirtual.com', 'admin123');
    }
    setActiveRole('admin');
    setAdminTab('ventas');
    dismissNewSalePopup();
  };

  const handleReplayAudio = () => {
    playNotificationSound();
  };

  const itemsCount = newSalePopupOrder.items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border-2 border-emerald-500 transform transition-all animate-scaleUp relative">
        {/* Top Header with vibrant gradient */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 p-5 text-white relative">
          <button
            onClick={dismissNewSalePopup}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Cerrar Notificación"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-amber-300 shadow-inner border border-white/30 animate-bounce">
              <Sparkles className="w-7 h-7" />
            </div>
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider mb-1 shadow-xs">
                ¡Venta en Tiempo Real!
              </span>
              <h2 className="text-xl font-black tracking-tight leading-none text-white">
                ¡Nueva Venta Registrada!
              </h2>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6 space-y-4">
          {/* Order Highlight Box */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Número de Pedido
              </span>
              <span className="text-lg font-black text-slate-900 font-mono">
                {newSalePopupOrder.orderNumber}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                Total Pagado
              </span>
              <span className="text-2xl font-black text-emerald-700">
                ${newSalePopupOrder.total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} <span className="text-xs font-bold text-emerald-600">MXN</span>
              </span>
            </div>
          </div>

          {/* Customer & Info Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                <User className="w-3.5 h-3.5 text-purple-600" />
                <span>Cliente:</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{newSalePopupOrder.customerName}</p>
              <p className="text-[11px] text-slate-500 truncate">{newSalePopupOrder.customerEmail}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <div className="flex items-center gap-1.5 text-slate-500 font-semibold mb-1">
                <Truck className="w-3.5 h-3.5 text-blue-600" />
                <span>Envío & Entrega:</span>
              </div>
              <p className="font-bold text-slate-800 truncate">{newSalePopupOrder.shippingProvider || 'Envío Estándar'}</p>
              <p className="text-[11px] text-slate-500 truncate">{newSalePopupOrder.shippingAddress?.city || 'México'}</p>
            </div>
          </div>

          {/* Purchased Items Preview */}
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
              <span className="flex items-center gap-1.5">
                <ShoppingBag className="w-3.5 h-3.5 text-[#9E0D0D]" />
                Artículos ({itemsCount})
              </span>
              <span className="text-[11px] text-slate-400 font-normal">
                {newSalePopupOrder.paymentMethod}
              </span>
            </div>
            
            <div className="max-h-36 overflow-y-auto space-y-2 pr-1">
              {newSalePopupOrder.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-slate-50 p-2 rounded-xl border border-slate-100">
                  <img
                    src={item.productImage || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=100&auto=format&fit=crop&q=60'}
                    alt={item.productName}
                    className="w-10 h-10 object-cover rounded-lg bg-white border border-slate-200"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 truncate">{item.productName}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500">
                      {item.size && <span>Talla: <strong className="text-slate-700">{item.size}</strong></span>}
                      {item.color && <span>Color: <strong className="text-slate-700">{item.color}</strong></span>}
                      <span>Cant: <strong className="text-slate-700">{item.quantity}</strong></span>
                    </div>
                  </div>
                  <div className="text-right font-black text-xs text-slate-800">
                    ${(item.price * item.quantity).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleReplayAudio}
              className="px-3.5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              title="Escuchar sonido de notificación nuevamente"
            >
              <Volume2 className="w-4 h-4 text-slate-600" />
              <span className="hidden sm:inline">Sonido</span>
            </button>

            <button
              onClick={dismissNewSalePopup}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs text-center transition-colors cursor-pointer"
            >
              Entendido / Cerrar
            </button>

            <button
              onClick={handleGoToOrder}
              className="flex-1 py-3 px-4 rounded-2xl bg-[#9E0D0D] hover:bg-red-800 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-900/30 transition-all active:scale-95 cursor-pointer"
            >
              <span>Ver en Pedidos</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
