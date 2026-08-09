import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, ShieldCheck, Plus, Check, Zap, Clock, PackageCheck } from 'lucide-react';

export const ShippingModule: React.FC = () => {
  const { shippingConfig, updateShippingConfig, toggleCarrierActive } = useStore();

  const [freeMin, setFreeMin] = useState(shippingConfig.freeShippingThreshold);
  const [flatRate, setFlatRate] = useState(shippingConfig.defaultFlatRate);
  const [expressRate, setExpressRate] = useState(shippingConfig.expressRate);

  const handleSaveGeneralShipping = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingConfig({
      freeShippingThreshold: Number(freeMin),
      defaultFlatRate: Number(flatRate),
      expressRate: Number(expressRate)
    });
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-purple-700" />
          Módulo de Envíos y Configuración de Paqueterías
        </h3>
        <p className="text-xs text-gray-500">Configura los costos de envío, mínimos para envío gratis y tus proveedores logísticos</p>
      </div>

      {/* General Settings Card */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Reglas Tarifarias Generales</h4>

        <form onSubmit={handleSaveGeneralShipping} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Mínimo para Envío GRATIS ($ MXN)</label>
            <input
              type="number"
              value={freeMin}
              onChange={e => setFreeMin(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-purple-900"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Los pedidos superiores a esta suma no pagarán flete.</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Tarifa Estándar de Envío ($ MXN)</label>
            <input
              type="number"
              value={flatRate}
              onChange={e => setFlatRate(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-purple-900"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Costo cobrado cuando la compra no alcanza el mínimo gratis.</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Tarifa Exprés Garatizada ($ MXN)</label>
            <input
              type="number"
              value={expressRate}
              onChange={e => setExpressRate(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-purple-900"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Envío prioritario en menos de 24 horas.</p>
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Guardar Reglas de Envío
            </button>
          </div>
        </form>
      </div>

      {/* Carriers List */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider">Empresas de Paquetería Habilitadas</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {shippingConfig.carriers.map(carrier => (
            <div
              key={carrier.id}
              className={`p-5 rounded-2xl border-2 transition-all flex items-center justify-between ${
                carrier.active ? 'border-purple-200 bg-purple-50/30' : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900">{carrier.name}</span>
                  <span className="font-mono text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                    {carrier.code}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Entrega estimada: <strong>{carrier.estimatedDays}</strong></p>
                <p className="text-xs text-purple-900 font-bold">Costo base: ${carrier.cost}.00 MXN</p>
              </div>

              <button
                onClick={() => toggleCarrierActive(carrier.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  carrier.active
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
              >
                {carrier.active ? 'Activo' : 'Inactivo'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
