import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Lock, Key, Mail, ArrowRight, ShieldAlert, BarChart3, Package, Truck, Eye, EyeOff } from 'lucide-react';

export const AdminLoginForm: React.FC = () => {
  const { adminLogin, storeDesign } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tu correo y contraseña de administrador.');
      return;
    }
    const success = adminLogin(email, password);
    if (!success) {
      setError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-slate-900 text-white rounded-3xl border border-slate-800 shadow-2xl font-sans">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <div className="relative">
            <img
              src={storeDesign?.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
              alt={storeDesign?.storeName || 'Armario Virtual'}
              className="h-20 max-w-[220px] object-contain rounded-xl shadow-xl mx-auto"
            />
            <div className="absolute -bottom-1 -right-1 bg-[#9E0D0D] text-white p-1.5 rounded-full border border-red-500 shadow-md">
              <ShieldCheck className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
        <span className="text-[10px] font-black bg-[#E05A1B] text-white px-3 py-1 rounded-full uppercase tracking-wider">
          ACCESO RESTRINGIDO
        </span>
        <h2 className="text-xl font-black text-white uppercase tracking-tight mt-2.5">
          Panel de Control Administrador
        </h2>
        <p className="text-xs text-slate-400 mt-1 font-medium">
          Control integral de inventario, pedidos, métricas de ventas y diseño de tienda.
        </p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500 text-red-200 text-xs rounded-xl font-bold flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-[#E05A1B] shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Usuario o Correo de Administrador
          </label>
          <div className="relative">
            <input
              type="text"
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                setError('');
              }}
              placeholder="armario_virtual ó admin@armariovirtual.com"
              className="w-full pl-9 pr-3 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-medium focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-hidden transition-all"
              required
            />
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
            Contraseña de Seguridad
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                setError('');
              }}
              placeholder="••••••••"
              className="w-full pl-9 pr-10 py-2.5 bg-slate-800 border border-slate-700 text-white rounded-xl text-xs font-medium focus:border-red-400 focus:ring-1 focus:ring-red-400 outline-hidden transition-all"
              required
            />
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white p-1 transition-colors cursor-pointer"
              title={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="w-full py-3.5 bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 border border-red-500/30 cursor-pointer mt-2"
        >
          <span>Ingresar al Panel Admin</span>
          <ArrowRight className="w-4 h-4 text-[#E05A1B]" />
        </button>
      </form>

      {/* Admin Modules Preview */}
      <div className="mt-6 pt-5 border-t border-slate-800">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
          <span>Credenciales Rápidas de Acceso:</span>
          <span className="text-[10px] text-emerald-400 font-normal">Toca para autocompletar</span>
        </div>
        
        <div className="space-y-1.5">
          <button
            type="button"
            onClick={() => {
              setEmail('harold.anguiano@armariovirtual.com');
              setPassword('Chevropar#1970');
              setError('');
            }}
            className="w-full text-left p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Harold Anguiano Morales
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                harold.anguiano@armariovirtual.com • Chevropar#1970
              </div>
            </div>
            <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800 font-bold">
              ADMIN
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('armario_virtual@armariovirtual.com');
              setPassword('ArmarioVirtual#2026!Key');
              setError('');
            }}
            className="w-full text-left p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Armario Virtual Master
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                armario_virtual@armariovirtual.com • ArmarioVirtual#2026!Key
              </div>
            </div>
            <span className="text-[10px] bg-red-950 text-red-300 px-2 py-0.5 rounded border border-red-800 font-bold">
              MASTER
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEmail('admin');
              setPassword('admin123');
              setError('');
            }}
            className="w-full text-left p-2.5 bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 rounded-xl transition-all flex items-center justify-between group cursor-pointer"
          >
            <div>
              <div className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                Acceso Rápido Desarrollador
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                admin • admin123
              </div>
            </div>
            <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold">
              DEV
            </span>
          </button>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-400">
        <div className="flex flex-col items-center">
          <BarChart3 className="w-4 h-4 text-[#E05A1B] mb-1" />
          <span>Ventas & KPI</span>
        </div>
        <div className="flex flex-col items-center">
          <Package className="w-4 h-4 text-[#E05A1B] mb-1" />
          <span>Inventario</span>
        </div>
        <div className="flex flex-col items-center">
          <Truck className="w-4 h-4 text-[#E05A1B] mb-1" />
          <span>Guías & Envíos</span>
        </div>
      </div>
    </div>
  );
};
