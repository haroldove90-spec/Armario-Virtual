import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { User, Lock, Mail, Phone, UserPlus, LogIn, ArrowRight, ShieldCheck, ShoppingBag, MapPin, Heart, AlertCircle } from 'lucide-react';

export const CustomerLoginForm: React.FC = () => {
  const { customerLogin, registerCustomer, storeDesign, setActiveRole } = useStore();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!loginEmail.trim()) {
      setError('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!loginPassword.trim()) {
      setError('Por favor ingresa tu contraseña.');
      return;
    }

    setLoading(true);
    try {
      const res = await customerLogin(loginEmail, loginPassword);
      if (typeof res === 'object' && !res.success) {
        setError(res.error || 'No se pudo iniciar sesión. Verifica tus datos.');
      } else {
        setActiveRole('cliente');
      }
    } catch (err: any) {
      setError('Ocurrió un error al procesar el inicio de sesión.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!regName.trim()) {
      setError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!regEmail.trim()) {
      setError('Por favor ingresa un correo electrónico válido.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setError('Por favor ingresa una contraseña de al menos 4 caracteres.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      const res = await registerCustomer({
        name: regName.trim(),
        email: regEmail.trim(),
        phone: regPhone.trim(),
        password: regPassword
      });

      if (!res.success) {
        setError(res.error || 'No se pudo registrar la cuenta. Intenta de nuevo.');
      } else {
        setActiveRole('cliente');
      }
    } catch (err: any) {
      setError('Ocurrió un error al registrar tu cuenta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto my-8 p-6 sm:p-8 bg-white rounded-3xl border border-slate-200 shadow-xl font-sans">
      <div className="text-center mb-6">
        <div className="flex items-center justify-center mb-3">
          <img
            src={storeDesign?.logoUrl || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg'}
            alt={storeDesign?.storeName || 'Armario Virtual'}
            className="h-20 max-w-[220px] object-contain rounded-xl shadow-md mx-auto"
          />
        </div>
        <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Portal de Clientes</h2>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Accede para realizar compras, guardar tus direcciones y rastrear tus pedidos en {storeDesign?.storeName || 'Armario Virtual'}.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex bg-slate-100 p-1 rounded-2xl mb-6 border border-slate-200">
        <button
          type="button"
          onClick={() => {
            setActiveTab('login');
            setError('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'login'
              ? 'bg-[#9E0D0D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Iniciar Sesión</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveTab('register');
            setError('');
          }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
            activeTab === 'register'
              ? 'bg-[#9E0D0D] text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Crear Cuenta</span>
        </button>
      </div>

      {error && (
        <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* TAB 1: LOGIN */}
      {activeTab === 'login' ? (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Correo Electrónico
            </label>
            <div className="relative">
              <input
                type="email"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Contraseña
              </label>
            </div>
            <div className="relative">
              <input
                type="password"
                value={loginPassword}
                onChange={e => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
                required
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#9E0D0D] hover:bg-red-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
          >
            <span>{loading ? 'Ingresando...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4 text-[#E05A1B]" />
          </button>

          <p className="text-center text-xs text-slate-500 mt-3 font-medium">
            ¿Aún no tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('register')}
              className="text-[#9E0D0D] font-bold hover:underline"
            >
              Regístrate aquí
            </button>
          </p>
        </form>
      ) : (
        /* TAB 2: REGISTER */
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Nombre Completo *
            </label>
            <div className="relative">
              <input
                type="text"
                value={regName}
                onChange={e => setRegName(e.target.value)}
                placeholder="Ej. Juan Pérez"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
                required
              />
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Correo Electrónico *
            </label>
            <div className="relative">
              <input
                type="email"
                value={regEmail}
                onChange={e => setRegEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
                required
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Teléfono / WhatsApp
            </label>
            <div className="relative">
              <input
                type="tel"
                value={regPhone}
                onChange={e => setRegPhone(e.target.value)}
                placeholder="Ej. 55 1234 5678"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
              />
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Contraseña *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Confirmar *
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={regConfirmPassword}
                  onChange={e => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] focus:ring-1 focus:ring-[#9E0D0D] outline-hidden transition-all"
                  required
                />
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#9E0D0D] hover:bg-red-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-3 cursor-pointer"
          >
            <span>{loading ? 'Creando cuenta...' : 'Crear Cuenta y Entrar'}</span>
            <UserPlus className="w-4 h-4 text-[#E05A1B]" />
          </button>

          <p className="text-center text-xs text-slate-500 mt-3 font-medium">
            ¿Ya tienes una cuenta registrada?{' '}
            <button
              type="button"
              onClick={() => setActiveTab('login')}
              className="text-[#9E0D0D] font-bold hover:underline"
            >
              Inicia sesión aquí
            </button>
          </p>
        </form>
      )}

      {/* Feature highlights */}
      <div className="mt-8 pt-5 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-[10px] text-slate-500">
        <div className="flex flex-col items-center">
          <ShoppingBag className="w-4 h-4 text-[#9E0D0D] mb-1" />
          <span>Historial de Compras</span>
        </div>
        <div className="flex flex-col items-center">
          <MapPin className="w-4 h-4 text-[#9E0D0D] mb-1" />
          <span>Direcciones Guardadas</span>
        </div>
        <div className="flex flex-col items-center">
          <Heart className="w-4 h-4 text-[#E05A1B] mb-1" />
          <span>Lista de Favoritos</span>
        </div>
      </div>
    </div>
  );
};

