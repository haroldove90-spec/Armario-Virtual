import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Key, Mail, ArrowRight, ShieldAlert, BarChart3, Package, Truck } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const { adminLogin, storeDesign } = useStore();
  const [email, setEmail] = useState('admin@ropaenlinea.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa credenciales válidas de administrador.');
      return;
    }
    adminLogin(email, password);
  };

  const handleQuickLogin = () => {
    adminLogin('admin@ropaenlinea.com', 'admin123');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-slate-900 text-white rounded-3xl border border-purple-800/50 shadow-2xl font-sans">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <img
              src={storeDesign?.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
              alt={storeDesign?.storeName || 'Armario Virtual'}
              className="h-20 max-w-[220px] object-contain rounded-xl shadow-xl mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#9E0D0D] text-yellow-300 p-1.5 rounded-full border border-red-400 shadow-md">
              <ShieldCheck className="w-4 h-4 text-[#E05A1B]" />
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black bg-[#E05A1B] text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider">
          ACCESO RESTRINGIDO
        </span>
        <h2 className="text-xl font-black text-white uppercase tracking-tight mt-2">
          Panel de Control Administrador
        </h2>
        <p className="text-xs text-red-200 mt-1 font-medium">
          Control integral de inventario, pedidos, métricas de ventas y diseño de tienda.
        </p>
      </div>

      {/* Banner de Credenciales Simuladas Admin */}
      <div className="bg-red-950/80 border border-red-700/60 rounded-xl p-3.5 mb-5 text-xs text-red-100">
        <div className="flex items-center gap-2 font-bold mb-1 text-yellow-300">
          <Key className="w-4 h-4 text-[#E05A1B]" />
          <span>Credenciales Simuladas Admin:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[11px] bg-slate-950 p-2 rounded-lg border border-red-900/50">
          <div>
            <span className="text-red-300 block text-[9px] uppercase font-sans">Usuario Admin:</span>
            <strong className="text-white">admin@ropaenlinea.com</strong>
          </div>
          <div>
            <span className="text-red-300 block text-[9px] uppercase font-sans">Contraseña:</span>
            <strong className="text-white">admin123</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2.5 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded-xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#E05A1B] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-red-200 uppercase tracking-wider mb-1">
            Correo de Administrador
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@ropaenlinea.com"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-medium focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-hidden"
              required
            />
            <Mail className="w-4 h-4 text-red-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-red-200 uppercase tracking-wider mb-1">
            Contraseña de Seguridad
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-medium focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-hidden"
              required
            />
            <Lock className="w-4 h-4 text-red-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-red-400/20"
        >
          <span>Ingresar al Panel Admin</span>
          <ArrowRight className="w-4 h-4 text-yellow-300" />
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-purple-900" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black text-purple-400 bg-slate-900 px-2">
          Acceso rápido para evaluación
        </div>
      </div>

      <button
        type="button"
        onClick={handleQuickLogin}
        className="w-full py-2.5 bg-yellow-500 hover:bg-yellow-400 text-slate-950 font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-4 h-4 text-slate-950" />
        <span>🛡️ Acceso Rápido Demo Admin</span>
      </button>

      {/* Admin Modules Preview */}
      <div className="mt-6 pt-4 border-t border-purple-900/60 grid grid-cols-3 gap-2 text-center text-[10px] text-purple-300">
        <div className="flex flex-col items-center">
          <BarChart3 className="w-4 h-4 text-yellow-300 mb-1" />
          <span>Ventas & KPi</span>
        </div>
        <div className="flex flex-col items-center">
          <Package className="w-4 h-4 text-yellow-300 mb-1" />
          <span>Inventario</span>
        </div>
        <div className="flex flex-col items-center">
          <Truck className="w-4 h-4 text-yellow-300 mb-1" />
          <span>Guías & Envíos</span>
        </div>
      </div>
    </div>
  );
};
