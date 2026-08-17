import React from 'react';
import { useStore } from '../../context/StoreContext';
import { DollarSign, ShoppingBag, TrendingUp, Users, PackageCheck, AlertTriangle } from 'lucide-react';

export const MetricsModule: React.FC = () => {
  const { orders, products, customer, categories } = useStore();

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

  const totalSales = orders.reduce((acc, ord) => acc + ord.total, 0);
  const totalOrdersCount = orders.length;
  const avgOrderValue = totalOrdersCount > 0 ? totalSales / totalOrdersCount : 0;
  const lowStockCount = products.filter(p => p.stock <= 5).length;

  const statusCounts = {
    pendiente: orders.filter(o => o.status === 'pendiente').length,
    en_preparacion: orders.filter(o => o.status === 'en_preparacion').length,
    enviado: orders.filter(o => o.status === 'enviado').length,
    entregado: orders.filter(o => o.status === 'entregado').length,
    cancelado: orders.filter(o => o.status === 'cancelado').length
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Sales */}
        <div className="bg-[#9E0D0D] text-white p-5 rounded-xl border border-red-600 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black opacity-80 uppercase tracking-widest">Ventas Totales</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">${totalSales.toFixed(2)}</h3>
            <span className="text-[10px] text-[#E05A1B] font-bold flex items-center gap-1 mt-1 uppercase bg-white/10 px-2 py-0.5 rounded">
              <TrendingUp className="w-3.5 h-3.5 text-[#E05A1B]" /> +18.4% este mes
            </span>
          </div>
          <div className="p-3 bg-red-950/80 text-[#E05A1B] rounded-xl border border-red-500">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-slate-900 text-white p-5 rounded-xl border border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black opacity-80 uppercase tracking-widest text-slate-300">Pedidos Registrados</span>
            <h3 className="text-2xl sm:text-3xl font-black text-white font-mono mt-1">{totalOrdersCount}</h3>
            <span className="text-[10px] text-red-300 font-bold mt-1 block uppercase">Pasarelas Activas</span>
          </div>
          <div className="p-3 bg-slate-800 text-red-400 rounded-xl border border-slate-700">
            <ShoppingBag className="w-6 h-6" />
          </div>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-white text-slate-900 p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ticket Promedio</span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#9E0D0D] font-mono mt-1">${avgOrderValue.toFixed(2)}</h3>
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">Por transaccion</span>
          </div>
          <div className="p-3 bg-red-100 text-[#9E0D0D] rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>

        {/* Alertas de Stock */}
        <div className="bg-white text-slate-900 p-5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Bajo Stock</span>
            <h3 className="text-2xl sm:text-3xl font-black text-pink-600 font-mono mt-1">{lowStockCount}</h3>
            <span className="text-[10px] text-pink-600 font-bold mt-1 block uppercase">Reabastecer</span>
          </div>
          <div className="p-3 bg-pink-100 text-pink-600 rounded-xl">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Breakdown Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Status breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Desglose de Pedidos por Estado</h4>
          <div className="space-y-3">
            {[
              { label: 'Entregados', count: statusCounts.entregado, color: 'bg-emerald-500' },
              { label: 'En Camino (Enviados)', count: statusCounts.enviado, color: 'bg-purple-600' },
              { label: 'En Preparación', count: statusCounts.en_preparacion, color: 'bg-blue-500' },
              { label: 'Pendientes de Pago', count: statusCounts.pendiente, color: 'bg-amber-500' },
              { label: 'Cancelados', count: statusCounts.cancelado, color: 'bg-red-500' }
            ].map(item => {
              const pct = totalOrdersCount > 0 ? (item.count / totalOrdersCount) * 100 : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex justify-between text-xs font-bold text-gray-700">
                    <span>{item.label}</span>
                    <span>{item.count} ({Math.round(pct)}%)</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div style={{ width: `${pct}%` }} className={`h-full ${item.color} rounded-full`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Selling Inventory */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Top Productos en Inventario</h4>
          <div className="space-y-3">
            {products.slice(0, 5).map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl border border-gray-100 text-xs">
                <div className="flex items-center gap-3">
                  <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-xl border border-gray-200" />
                  <div>
                    <h5 className="font-bold text-gray-900 line-clamp-1">{p.name}</h5>
                    <span className="text-[#9E0D0D] uppercase font-bold text-[10px]">
                      {getCategoryDisplayName(p.category)} {p.subcategory && p.subcategory !== 'General' ? `• ${p.subcategory}` : ''}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-black text-purple-900 block">${p.price.toFixed(2)} MXN</span>
                  <span className="text-[11px] text-gray-500">Stock: {p.stock} pzas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
