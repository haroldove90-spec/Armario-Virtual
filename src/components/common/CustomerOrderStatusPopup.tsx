import React from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, CheckCircle2, Clock, PackageCheck, AlertCircle, X, ArrowRight, Volume2 } from 'lucide-react';
import { playNotificationSound } from '../../utils/audioNotification';
import { OrderStatus } from '../../types';

export const CustomerOrderStatusPopup: React.FC = () => {
  const {
    customerStatusPopup,
    dismissCustomerStatusPopup,
    setActiveRole,
    setCustomerTab
  } = useStore();

  if (!customerStatusPopup) return null;

  const { order, oldStatus, newStatus } = customerStatusPopup;

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'enviado':
        return {
          title: '🚚 ¡Tu pedido va en camino!',
          desc: 'El paquete ha salido de nuestro centro de distribución y está en ruta de entrega.',
          bg: 'from-blue-600 to-indigo-700',
          badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
          label: 'EN CAMINO / ENVIADO',
          icon: <Truck className="w-7 h-7 text-white animate-bounce" />
        };
      case 'entregado':
        return {
          title: '🎉 ¡Pedido Entregado!',
          desc: 'Tu paquete ha sido entregado exitosamente en tu domicilio. ¡Esperamos que lo disfrutes!',
          bg: 'from-emerald-600 to-teal-700',
          badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          label: 'ENTREGADO',
          icon: <PackageCheck className="w-7 h-7 text-white" />
        };
      case 'en_preparacion':
        return {
          title: '📦 ¡Pedido en Preparación!',
          desc: 'Estamos empacando tus artículos con el mayor cuidado para enviártelos.',
          bg: 'from-purple-600 to-indigo-800',
          badgeBg: 'bg-purple-100 text-purple-800 border-purple-300',
          label: 'EN PREPARACIÓN',
          icon: <Clock className="w-7 h-7 text-white" />
        };
      case 'cancelado':
        return {
          title: '⚠️ Pedido Cancelado',
          desc: 'El pedido ha sido cancelado. Si tienes dudas, contáctanos.',
          bg: 'from-red-600 to-rose-700',
          badgeBg: 'bg-red-100 text-red-800 border-red-300',
          label: 'CANCELADO',
          icon: <AlertCircle className="w-7 h-7 text-white" />
        };
      default:
        return {
          title: '📋 Actualización en tu Pedido',
          desc: 'El estado de tu compra se ha actualizado en tiempo real.',
          bg: 'from-slate-700 to-slate-900',
          badgeBg: 'bg-slate-100 text-slate-800 border-slate-300',
          label: status.toUpperCase(),
          icon: <Clock className="w-7 h-7 text-white" />
        };
    }
  };

  const statusInfo = getStatusBadge(newStatus as OrderStatus);

  const handleGoToCustomerOrders = () => {
    setActiveRole('cliente');
    setCustomerTab('compras');
    dismissCustomerStatusPopup();
  };

  return (
    <div className="fixed bottom-6 right-4 sm:right-6 z-[99999] max-w-md w-full animate-slideUp font-sans">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-indigo-500 overflow-hidden relative">
        {/* Header */}
        <div className={`bg-gradient-to-r ${statusInfo.bg} p-4 text-white flex items-center justify-between`}>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30">
              {statusInfo.icon}
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-0.5">
                Notificación en Vivo
              </span>
              <h4 className="font-black text-base leading-tight">{statusInfo.title}</h4>
            </div>
          </div>

          <button
            onClick={dismissCustomerStatusPopup}
            className="p-1 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Cerrar notificación"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3.5">
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-100 text-xs">
            <div>
              <span className="text-slate-400 text-[10px] uppercase font-bold block">No. de Pedido</span>
              <span className="font-black text-slate-900 font-mono text-sm">{order.orderNumber}</span>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase border ${statusInfo.badgeBg}`}>
              {statusInfo.label}
            </span>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">{statusInfo.desc}</p>

          {order.trackingNumber && (
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-2.5 text-xs text-indigo-900 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase text-indigo-700 block">Número de Guía:</span>
                <span className="font-mono font-black">{order.trackingNumber}</span>
              </div>
              <span className="text-[11px] font-semibold text-indigo-600">{order.shippingProvider}</span>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => playNotificationSound()}
              className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
              title="Escuchar sonido"
            >
              <Volume2 className="w-4 h-4" />
            </button>
            <button
              onClick={dismissCustomerStatusPopup}
              className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold text-center transition-colors cursor-pointer"
            >
              Entendido
            </button>
            <button
              onClick={handleGoToCustomerOrders}
              className="flex-1 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-black flex items-center justify-center gap-1.5 shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <span>Ver Pedido</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
