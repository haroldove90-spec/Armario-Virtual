import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, Lock, Key, ShieldCheck, ShoppingBag, MapPin, Heart, ArrowRight } from 'lucide-react';

export const CustomerLoginForm: React.FC = () => {
  const { customerLogin, customer, storeDesign } = useStore();
  const [email, setEmail] = useState('maria.lopez@example.com');
  const [password, setPassword] = useState('123456');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa un correo y contraseña.');
      return;
    }
    customerLogin(email, password);
  };

  const handleQuickLogin = () => {
    customerLogin('maria.lopez@example.com', '123456');
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 bg-white rounded-2xl border border-slate-200 shadow-xl font-sans">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <img
            src={storeDesign?.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
            alt={storeDesign?.storeName || 'Armario Virtual'}
            className="h-20 max-w-[220px] object-contain rounded-xl shadow-md mx-auto"
          />
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Acceso a Tu Cuenta</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Ingresa para gestionar tus compras, direcciones de entrega y favoritos en {storeDesign?.storeName || 'Armario Virtual'}.
        </p>
      </div>

      {/* Banner de Credenciales Simuladas */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3.5 mb-5 text-xs text-red-950">
        <div className="flex items-center gap-2 font-bold mb-1 text-[#9E0D0D]">
          <Key className="w-4 h-4 text-[#E05A1B]" />
          <span>Credenciales Simuladas de Prueba:</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-1.5 font-mono text-[11px] bg-white p-2 rounded-lg border border-red-100">
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-sans">Usuario / Email:</span>
            <strong className="text-slate-800">maria.lopez@example.com</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[9px] uppercase font-sans">Contraseña:</span>
            <strong className="text-slate-800">123456</strong>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Correo Electrónico
          </label>
          <div className="relative">
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="tu.correo@ejemplo.com"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden"
              required
            />
            <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
            Contraseña
          </label>
          <div className="relative">
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden"
              required
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <span>Iniciar Sesión</span>
          <ArrowRight className="w-4 h-4 text-[#E05A1B]" />
        </button>
      </form>

      <div className="relative my-5">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-[10px] uppercase font-black text-slate-400 bg-white px-2">
          O prueba rápidamente
        </div>
      </div>

      <button
        type="button"
        onClick={handleQuickLogin}
        className="w-full py-2.5 bg-[#E05A1B] hover:bg-orange-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        <ShieldCheck className="w-4 h-4" />
        <span>Acceso Rápido Demo Cliente</span>
      </button>

      {/* Feature highlights */}
      <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
        <div className="flex flex-col items-center">
          <ShoppingBag className="w-4 h-4 text-[#9E0D0D] mb-1" />
          <span>Historial de Compras</span>
        </div>
        <div className="flex flex-col items-center">
          <MapPin className="w-4 h-4 text-[#9E0D0D] mb-1" />
          <span>Envío Guardado</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-4 h-4 text-[#E05A1B] mb-1" />
          <span>Lista de Favoritos</span>
        </div>
      </div>
    </div>
  );
};
