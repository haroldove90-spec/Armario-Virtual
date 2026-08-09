import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Truck, ShieldCheck, Plus, Check, Zap, Clock, PackageCheck, Sparkles, RefreshCw, Key, MapPin } from 'lucide-react';

export const ShippingModule: React.FC = () => {
  const { shippingConfig, updateShippingConfig, toggleCarrierActive } = useStore();

  const [freeMin, setFreeMin] = useState(shippingConfig.freeShippingThreshold);
  const [flatRate, setFlatRate] = useState(shippingConfig.defaultFlatRate);
  const [expressRate, setExpressRate] = useState(shippingConfig.expressRate);

  // Envios.com configuration state
  const [enviosKey, setEnviosKey] = useState(shippingConfig.enviosApiKey || '9661a48692fa526939383a4598656bb525f82159e7026ebdfc30a3a1700bb7b8');
  const [originZip, setOriginZip] = useState(shippingConfig.enviosOriginZip || '06600');
  const [useLiveApi, setUseLiveApi] = useState(shippingConfig.useLiveEnviosApi ?? true);

  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleSaveGeneralShipping = (e: React.FormEvent) => {
    e.preventDefault();
    updateShippingConfig({
      freeShippingThreshold: Number(freeMin),
      defaultFlatRate: Number(flatRate),
      expressRate: Number(expressRate),
      enviosApiKey: enviosKey,
      enviosOriginZip: originZip,
      useLiveEnviosApi: useLiveApi
    });
    setTestResult({ success: true, message: '¡Configuración de Envíos.com guardada correctamente!' });
  };

  const handleTestEnviosApi = async () => {
    setTestingConnection(true);
    setTestResult(null);
    try {
      const res = await fetch('/api/envios/status');
      const data = await res.json();
      if (data.status === 'connected') {
        setTestResult({
          success: true,
          message: `Conexión exitosa con API Envíos.com (${data.supportedCarriers.length} paqueterías disponibles: ${data.supportedCarriers.join(', ')})`
        });
      } else {
        setTestResult({ success: false, message: 'No se pudo verificar la API de Envíos.com.' });
      }
    } catch (_err) {
      setTestResult({ success: false, message: 'Error de red al conectar con el servidor de Envíos.com.' });
    } finally {
      setTestingConnection(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Truck className="w-5 h-5 text-[#9E0D0D]" />
          Módulo de Envíos y API Envíos.com
        </h3>
        <p className="text-xs text-gray-500">Configura la API de Envíos.com, costos de envío y mínimos para envío gratis</p>
      </div>

      {/* Envios.com API Card */}
      <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#9E0D0D] rounded-2xl shadow-md border border-red-500">
              <Zap className="w-6 h-6 text-[#E05A1B]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-[#E05A1B] text-white px-2 py-0.5 rounded uppercase">API LOGÍSTICA OFICIAL</span>
                <span className="text-[10px] text-emerald-400 font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> ACTIVA Y CONECTADA
                </span>
              </div>
              <h4 className="text-lg font-black tracking-tight uppercase mt-0.5">Integración Envíos.com</h4>
              <p className="text-xs text-slate-300">Permite cotizar en tiempo real con FedEx, Estafeta, DHL Express, Paquetexpress, Redpack y 99minutos.</p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleTestEnviosApi}
            disabled={testingConnection}
            className="flex items-center gap-2 bg-[#9E0D0D] hover:bg-red-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md active:scale-95 shrink-0"
          >
            <RefreshCw className={`w-4 h-4 text-[#E05A1B] ${testingConnection ? 'animate-spin' : ''}`} />
            <span>{testingConnection ? 'Probando...' : 'Probar Conexión API'}</span>
          </button>
        </div>

        {testResult && (
          <div className={`p-3 rounded-xl text-xs font-bold flex items-center gap-2 ${
            testResult.success ? 'bg-emerald-950/80 text-emerald-200 border border-emerald-700' : 'bg-red-950/80 text-red-200 border border-red-700'
          }`}>
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{testResult.message}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5 text-[#E05A1B]" />
              Clave de API de Envíos.com (API Key / Token)
            </label>
            <input
              type="text"
              value={enviosKey}
              onChange={e => setEnviosKey(e.target.value)}
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl font-mono text-xs font-bold text-yellow-300 focus:border-[#9E0D0D] outline-hidden"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">Token activo: <code className="text-red-300">9661a48692fa526939383a4598656bb525f82159e7026ebdfc30a3a1700bb7b8</code></p>
          </div>

          <div>
            <label className="block font-bold text-slate-300 mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#E05A1B]" />
              Código Postal de Origen (Almacén Central)
            </label>
            <input
              type="text"
              value={originZip}
              onChange={e => setOriginZip(e.target.value)}
              placeholder="06600"
              className="w-full p-3 bg-slate-800 border border-slate-700 rounded-xl font-mono text-xs font-bold text-white focus:border-[#9E0D0D] outline-hidden"
              required
            />
            <p className="text-[10px] text-slate-400 mt-1">Dirección de expedición en Juárez/Cuauhtémoc, CDMX (C.P. 06600)</p>
          </div>
        </div>
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
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-[#9E0D0D]"
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
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-[#9E0D0D]"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Costo cobrado cuando la compra no alcanza el mínimo gratis.</p>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Tarifa Exprés Garantizada ($ MXN)</label>
            <input
              type="number"
              value={expressRate}
              onChange={e => setExpressRate(Number(e.target.value))}
              className="w-full p-3 border border-gray-200 rounded-xl font-bold text-[#9E0D0D]"
              required
            />
            <p className="text-[10px] text-gray-400 mt-1">Envío prioritario en menos de 24 horas.</p>
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
            >
              Guardar Configuración y Token de Envíos.com
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
                carrier.active ? 'border-red-200 bg-red-50/30' : 'border-gray-200 bg-gray-50 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sm text-gray-900">{carrier.name}</span>
                  <span className="font-mono text-[10px] bg-red-100 text-[#9E0D0D] px-2 py-0.5 rounded font-bold">
                    {carrier.code}
                  </span>
                </div>
                <p className="text-xs text-gray-600">Entrega estimada: <strong>{carrier.estimatedDays}</strong></p>
                <p className="text-xs text-[#9E0D0D] font-bold">Costo base: ${carrier.cost}.00 MXN</p>
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
