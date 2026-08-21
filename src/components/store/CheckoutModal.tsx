import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress, EnviosRate } from '../../types';
import { getProductEffectivePrice, getProductColorImage } from '../../utils/cartHelpers';
import {
  X,
  MapPin,
  Truck,
  CreditCard,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Plus,
  PackageCheck,
  Loader2,
  Zap,
  Check,
  Sparkles,
  User,
  Lock,
  Mail,
  Phone,
  UserPlus,
  LogIn,
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderCompleted }) => {
  if (!isOpen) return null;

  const {
    customer,
    isCustomerLoggedIn,
    customerLogin,
    registerCustomer,
    cart,
    shippingConfig,
    placeOrder,
    addCustomerAddress,
    storeDesign
  } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(
    customer?.addresses?.find(a => a.isDefault) || customer?.addresses?.[0] || null
  );
  const [selectedCarrier, setSelectedCarrier] = useState(
    shippingConfig.carriers.find(c => c.active) || shippingConfig.carriers[0]
  );
  
  // Auth state for unregistered/guest users
  const [authTab, setAuthTab] = useState<'register' | 'login'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [showAuthPassword, setShowAuthPassword] = useState(false);
  const [authName, setAuthName] = useState('');
  const [authPhone, setAuthPhone] = useState('');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Envios.com API live state
  const [enviosRates, setEnviosRates] = useState<EnviosRate[]>([]);
  const [loadingEnvios, setLoadingEnvios] = useState<boolean>(false);
  const [selectedEnviosRate, setSelectedEnviosRate] = useState<EnviosRate | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<string>('Tarjeta de Crédito / Débito (Visa, Mastercard, AMEX)');

  // New address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    recipientName: customer?.name || '',
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    neighborhood: '',
    city: 'CDMX',
    state: 'CDMX',
    postalCode: '',
    phone: customer?.phone || ''
  });

  // Keep selectedAddress updated when customer addresses change
  useEffect(() => {
    if (customer?.addresses?.length > 0) {
      if (!selectedAddress || !customer.addresses.some(a => a.id === selectedAddress.id)) {
        setSelectedAddress(customer.addresses.find(a => a.isDefault) || customer.addresses[0]);
      }
    }
  }, [customer?.addresses]);

  // Fetch real-time quotes from Envios.com API when entering Step 2 or changing address
  useEffect(() => {
    if (step === 2 && selectedAddress?.postalCode) {
      setLoadingEnvios(true);
      fetch('/api/envios/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          originPostalCode: shippingConfig.enviosOriginZip || '06600',
          destinationPostalCode: selectedAddress.postalCode,
          weight: 1,
          customApiKey: shippingConfig.enviosApiKey || '9661a48692fa526939383a4598656bb525f82159e7026ebdfc30a3a1700bb7b8'
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && Array.isArray(data.rates) && data.rates.length > 0) {
            setEnviosRates(data.rates);
            const rec = data.rates.find((r: EnviosRate) => r.recommended) || data.rates[0];
            setSelectedEnviosRate(rec);
          }
        })
        .catch(err => {
          console.error('Error conectando con API Envios.com:', err);
        })
        .finally(() => {
          setLoadingEnvios(false);
        });
    }
  }, [step, selectedAddress, shippingConfig.enviosApiKey, shippingConfig.enviosOriginZip]);

  const subtotal = cart.reduce((acc, item) => acc + getProductEffectivePrice(item.product) * item.quantity, 0);
  const isFreeShipping = subtotal >= shippingConfig.freeShippingThreshold;
  
  const activeShippingCost = selectedEnviosRate
    ? selectedEnviosRate.cost
    : selectedCarrier.cost;
    
  const shippingCost = isFreeShipping ? 0 : activeShippingCost;
  const totalAmount = subtotal + shippingCost;

  const handleAuthRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authName.trim()) {
      setAuthError('Por favor ingresa tu nombre completo.');
      return;
    }
    if (!authEmail.trim()) {
      setAuthError('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!authPassword || authPassword.length < 4) {
      setAuthError('Por favor ingresa una contraseña de al menos 4 caracteres.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await registerCustomer({
        name: authName.trim(),
        email: authEmail.trim(),
        phone: authPhone.trim(),
        password: authPassword
      });

      if (!res.success) {
        setAuthError(res.error || 'No se pudo registrar la cuenta. Intenta de nuevo.');
      } else {
        setStep(1);
      }
    } catch (err: any) {
      setAuthError('Ocurrió un error al registrar tu cuenta.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAuthLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail.trim()) {
      setAuthError('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!authPassword.trim()) {
      setAuthError('Por favor ingresa tu contraseña.');
      return;
    }

    setAuthLoading(true);
    try {
      const res = await customerLogin(authEmail.trim(), authPassword);
      if (typeof res === 'object' && !res.success) {
        setAuthError(res.error || 'No se pudo iniciar sesión. Verifica tus datos.');
      } else {
        setStep(1);
      }
    } catch (err: any) {
      setAuthError('Ocurrió un error al iniciar sesión.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.street || !newAddrForm.exteriorNumber || !newAddrForm.postalCode) return;

    const added = addCustomerAddress({
      ...newAddrForm,
      recipientName: newAddrForm.recipientName || customer?.name || 'Cliente'
    });
    setSelectedAddress(added);
    setShowAddAddress(false);
  };

  const handleFinalizeOrder = () => {
    if (!selectedAddress) return;
    const providerName = selectedEnviosRate
      ? `${selectedEnviosRate.carrier} ${selectedEnviosRate.service} (vía envios.com)`
      : selectedCarrier.name;

    const createdOrder = placeOrder(
      selectedAddress,
      paymentMethod,
      providerName,
      shippingCost
    );
    setStep(4);
    onOrderCompleted(createdOrder.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-[#9E0D0D] text-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#E05A1B]" />
            <h3 className="font-extrabold text-base">Finalizar Compra - {storeDesign?.storeName || 'Armario Virtual'}</h3>
          </div>
          {step !== 4 && (
            <button onClick={onClose} className="p-1.5 hover:bg-red-900 rounded-full text-red-200 hover:text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        {isCustomerLoggedIn && step !== 4 && (
          <div className="bg-gray-50 border-b border-gray-200 p-3 px-6 flex items-center justify-between text-xs font-bold text-gray-500">
            <span className={step === 1 ? 'text-[#9E0D0D]' : 'text-gray-400'}>1. Domicilio</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={step === 2 ? 'text-[#9E0D0D]' : 'text-gray-400'}>2. Envío</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={step === 3 ? 'text-[#9E0D0D]' : 'text-gray-400'}>3. Pago</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex-1 space-y-6">
          
          {/* STEP 0: Required Authentication if user is not logged in */}
          {!isCustomerLoggedIn ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 bg-red-100 text-[#9E0D0D] rounded-2xl flex items-center justify-center mx-auto mb-2">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-slate-900">Registro requerido para realizar tu compra</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  Crea tu cuenta en segundos para registrar tu dirección, aplicar garantías de compra y dar seguimiento a tu pedido.
                </p>
              </div>

              {/* Tab Selector */}
              <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('register');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === 'register'
                      ? 'bg-[#9E0D0D] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Crear Cuenta Nueva</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setAuthTab('login');
                    setAuthError('');
                  }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    authTab === 'login'
                      ? 'bg-[#9E0D0D] text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Ya tengo una cuenta</span>
                </button>
              </div>

              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-bold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Tab 1: Register */}
              {authTab === 'register' ? (
                <form onSubmit={handleAuthRegister} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nombre Completo *</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={authName}
                        onChange={e => setAuthName(e.target.value)}
                        placeholder="Ej. Juan Pérez"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                        required
                      />
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Teléfono / WhatsApp</label>
                      <div className="relative">
                        <input
                          type="tel"
                          value={authPhone}
                          onChange={e => setAuthPhone(e.target.value)}
                          placeholder="Ej. 55 1234 5678"
                          className="w-full pl-8 pr-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                        />
                        <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña</label>
                      <div className="relative">
                        <input
                          type={showAuthPassword ? 'text' : 'password'}
                          value={authPassword}
                          onChange={e => setAuthPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full pl-8 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                        />
                        <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                        <button
                          type="button"
                          onClick={() => setShowAuthPassword(!showAuthPassword)}
                          className="absolute right-2 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
                          title={showAuthPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                        >
                          {showAuthPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 bg-[#9E0D0D] hover:bg-red-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span>{authLoading ? 'Creando cuenta...' : 'Crear Cuenta y Continuar con el Pedido'}</span>
                    <ChevronRight className="w-4 h-4 text-[#E05A1B]" />
                  </button>
                </form>
              ) : (
                /* Tab 2: Login */
                <form onSubmit={handleAuthLogin} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Correo Electrónico *</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={authEmail}
                        onChange={e => setAuthEmail(e.target.value)}
                        placeholder="tu.correo@ejemplo.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                        required
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contraseña *</label>
                    <div className="relative">
                      <input
                        type={showAuthPassword ? 'text' : 'password'}
                        value={authPassword}
                        onChange={e => setAuthPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                        required
                      />
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <button
                        type="button"
                        onClick={() => setShowAuthPassword(!showAuthPassword)}
                        className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 p-0.5 transition-colors cursor-pointer"
                        title={showAuthPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
                      >
                        {showAuthPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full py-3.5 bg-[#9E0D0D] hover:bg-red-900 disabled:opacity-50 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span>{authLoading ? 'Verificando...' : 'Iniciar Sesión y Continuar'}</span>
                    <ChevronRight className="w-4 h-4 text-[#E05A1B]" />
                  </button>
                </form>
              )}
            </div>
          ) : (
            <>
              {/* STEP 1: Address */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#9E0D0D]" />
                        Dirección de Entrega
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Comprando como: <strong className="text-gray-900">{customer.name}</strong> ({customer.email})
                      </p>
                    </div>
                    <button
                      onClick={() => setShowAddAddress(!showAddAddress)}
                      className="text-xs font-bold text-[#9E0D0D] hover:text-red-900 flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Nueva Dirección
                    </button>
                  </div>

                  {/* Add Address Form */}
                  {showAddAddress || !customer.addresses || customer.addresses.length === 0 ? (
                    <form onSubmit={handleCreateAddress} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                      <p className="text-xs font-bold text-gray-800">
                        {!customer.addresses || customer.addresses.length === 0
                          ? 'Ingresa tu domicilio de entrega para continuar:'
                          : 'Agregar nuevo domicilio de entrega:'}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <input
                          type="text"
                          placeholder="Calle"
                          value={newAddrForm.street}
                          onChange={e => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                          className="p-2 border rounded-lg bg-white"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Num Exterior"
                          value={newAddrForm.exteriorNumber}
                          onChange={e => setNewAddrForm({ ...newAddrForm, exteriorNumber: e.target.value })}
                          className="p-2 border rounded-lg bg-white"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Colonia"
                          value={newAddrForm.neighborhood}
                          onChange={e => setNewAddrForm({ ...newAddrForm, neighborhood: e.target.value })}
                          className="p-2 border rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Código Postal (ej: 06600)"
                          value={newAddrForm.postalCode}
                          onChange={e => setNewAddrForm({ ...newAddrForm, postalCode: e.target.value })}
                          className="p-2 border rounded-lg bg-white"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Alcaldía / Municipio"
                          value={newAddrForm.city}
                          onChange={e => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                          className="p-2 border rounded-lg bg-white"
                        />
                        <input
                          type="text"
                          placeholder="Estado"
                          value={newAddrForm.state}
                          onChange={e => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                          className="p-2 border rounded-lg bg-white"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button type="submit" className="bg-[#9E0D0D] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                          Guardar y Usar Dirección
                        </button>
                        {customer.addresses && customer.addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(false)}
                            className="bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
                          >
                            Cancelar
                          </button>
                        )}
                      </div>
                    </form>
                  ) : (
                    <div className="space-y-3">
                      {customer.addresses.map(addr => (
                        <div
                          key={addr.id}
                          onClick={() => setSelectedAddress(addr)}
                          className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                            selectedAddress?.id === addr.id
                              ? 'border-[#9E0D0D] bg-red-50/50 shadow-xs'
                              : 'border-gray-200 bg-white hover:border-red-200'
                          }`}
                        >
                          <input
                            type="radio"
                            checked={selectedAddress?.id === addr.id}
                            onChange={() => setSelectedAddress(addr)}
                            className="mt-1 accent-[#9E0D0D]"
                          />
                          <div className="text-xs space-y-0.5">
                            <p className="font-bold text-gray-900">{addr.recipientName}</p>
                            <p className="text-gray-600">
                              {addr.street} #{addr.exteriorNumber} {addr.interiorNumber && `Int ${addr.interiorNumber}`}
                            </p>
                            <p className="text-gray-500">
                              Col. {addr.neighborhood}, {addr.city}, {addr.state} C.P. {addr.postalCode}
                            </p>
                            <p className="text-gray-500 font-medium">Tel: {addr.phone}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: Carrier selection via Envios.com API */}
              {step === 2 && (
                <div className="space-y-4">
                  {/* Header & API Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-gray-100">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                        <Truck className="w-4 h-4 text-[#9E0D0D]" />
                        Selecciona tu Método de Envío y Paquetería
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Cotización en tiempo real para el C.P. <strong className="text-gray-900">{selectedAddress?.postalCode || '06600'}</strong> ({selectedAddress?.city || 'Ciudad de México'})
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <Sparkles className="w-3 h-3 text-emerald-600" />
                      <span>API envios.com Conectada</span>
                    </div>
                  </div>

                  {/* Free shipping alert */}
                  {isFreeShipping && (
                    <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 p-3 rounded-2xl text-xs font-bold flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>¡Tu compra supera el mínimo! El costo de paquetería es 100% GRATIS para ti.</span>
                    </div>
                  )}

                  {/* Dynamic Envios.com Rates List */}
                  {loadingEnvios ? (
                    <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
                      <Loader2 className="w-8 h-8 text-[#9E0D0D] animate-spin" />
                      <p className="text-xs font-bold text-gray-700">Cotizando mejores tarifas en tiempo real...</p>
                    </div>
                  ) : enviosRates.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-700">Tarifas disponibles vía Envios.com:</p>
                      {enviosRates.map((rate, idx) => (
                        <div
                          key={idx}
                          onClick={() => setSelectedEnviosRate(rate)}
                          className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                            selectedEnviosRate?.carrier === rate.carrier && selectedEnviosRate?.service === rate.service
                              ? 'border-[#9E0D0D] bg-red-50/50 shadow-xs'
                              : 'border-gray-200 bg-white hover:border-red-200'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              checked={selectedEnviosRate?.carrier === rate.carrier && selectedEnviosRate?.service === rate.service}
                              onChange={() => setSelectedEnviosRate(rate)}
                              className="accent-[#9E0D0D]"
                            />
                            <div>
                              <p className="font-bold text-xs text-gray-900">{rate.carrier} - {rate.service}</p>
                              <p className="text-[11px] text-gray-500">Entrega estimada: {rate.estimatedDays}</p>
                            </div>
                          </div>

                          <span className="text-xs font-extrabold text-[#9E0D0D]">
                            {isFreeShipping ? '¡GRATIS!' : `${rate.cost}.00 MXN`}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    /* Fallback to standard carriers */
                    <div className="space-y-2">
                      {shippingConfig.carriers
                        .filter(c => c.active)
                        .map(carrier => (
                          <div
                            key={carrier.id}
                            onClick={() => {
                              setSelectedEnviosRate(null);
                              setSelectedCarrier(carrier);
                            }}
                            className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                              !selectedEnviosRate && selectedCarrier?.id === carrier.id
                                ? 'border-[#9E0D0D] bg-red-50/50 shadow-xs'
                                : 'border-gray-200 bg-white hover:border-red-200'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <input
                                type="radio"
                                checked={!selectedEnviosRate && selectedCarrier?.id === carrier.id}
                                onChange={() => {
                                  setSelectedEnviosRate(null);
                                  setSelectedCarrier(carrier);
                                }}
                                className="accent-[#9E0D0D]"
                              />
                              <div>
                                <p className="font-bold text-xs text-gray-900">{carrier.name}</p>
                                <p className="text-[11px] text-gray-500">Tiempo estimado: {carrier.estimatedDays}</p>
                              </div>
                            </div>

                            <span className="text-xs font-extrabold text-[#9E0D0D]">
                              {isFreeShipping ? '¡GRATIS!' : `${carrier.cost}.00 MXN`}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 3: Payment method */}
              {step === 3 && (
                <div className="space-y-4">
                  <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-[#9E0D0D]" />
                    Selecciona la Forma de Pago
                  </h4>

                  <div className="space-y-2.5">
                    {[
                      { name: 'Tarjeta de Crédito / Débito (Visa, Mastercard, AMEX)', note: 'Hasta 12 Meses Sin Intereses' },
                      { name: 'Mercado Pago / OXXO Pay', note: 'Pago seguro en efectivo o saldo en cuenta' },
                      { name: 'PayPal Express', note: 'Protección al comprador' }
                    ].map(pm => (
                      <div
                        key={pm.name}
                        onClick={() => setPaymentMethod(pm.name)}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                          paymentMethod === pm.name
                            ? 'border-[#9E0D0D] bg-red-50/50 shadow-xs'
                            : 'border-gray-200 bg-white hover:border-red-200'
                        }`}
                      >
                        <input
                          type="radio"
                          checked={paymentMethod === pm.name}
                          onChange={() => setPaymentMethod(pm.name)}
                          className="accent-[#9E0D0D]"
                        />
                        <div className="text-xs">
                          <p className="font-bold text-gray-900">{pm.name}</p>
                          <p className="text-gray-500 text-[11px]">{pm.note}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order summary box */}
                  <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-3">
                    <p className="font-bold text-gray-800 border-b border-gray-200 pb-1.5 flex justify-between items-center">
                      <span>Resumen del Pedido</span>
                      <span className="text-[11px] font-normal text-gray-500">
                        {cart.reduce((a, b) => a + b.quantity, 0)} artículo(s)
                      </span>
                    </p>

                    {/* Itemized preview */}
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {cart.map((item, idx) => {
                        const unitPrice = getProductEffectivePrice(item.product);
                        const colorImg = getProductColorImage(item.product, item.selectedColor);
                        return (
                          <div key={idx} className="flex items-center gap-2.5 bg-white p-2 rounded-xl border border-gray-100">
                            <img src={colorImg} alt={item.product.name} className="w-10 h-10 object-cover rounded-lg border border-gray-200 shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-gray-900 truncate">{item.product.name}</p>
                              <p className="text-[10px] text-gray-500">
                                {item.selectedSize && `Talla: ${item.selectedSize}`} {item.selectedColor && `| Color: ${item.selectedColor}`} | Cant: {item.quantity}
                              </p>
                            </div>
                            <span className="font-extrabold text-gray-900 shrink-0">
                              ${(unitPrice * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-gray-200">
                      <div className="flex justify-between text-gray-600">
                        <span>Subtotal Productos:</span>
                        <span className="font-bold text-gray-800">${subtotal.toFixed(2)} MXN</span>
                      </div>
                      <div className="flex justify-between text-gray-600">
                        <span>Envío ({selectedEnviosRate ? `${selectedEnviosRate.carrier} (${selectedEnviosRate.service})` : selectedCarrier.name}):</span>
                        <span className="font-bold text-emerald-600">{isFreeShipping ? 'GRATIS' : `${shippingCost}.00 MXN`}</span>
                      </div>
                      <div className="flex justify-between text-sm font-black text-slate-900 pt-1.5 border-t border-gray-200">
                        <span>Total a Pagar:</span>
                        <span className="text-[#9E0D0D] font-mono">${totalAmount.toFixed(2)} MXN</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Order Success Confirmation */}
              {step === 4 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900">¡Gracias por tu compra en {storeDesign?.storeName || 'Armario Virtual'}!</h3>
                  <p className="text-xs text-gray-600 max-w-md mx-auto">
                    Hemos enviado la confirmación y el recibo detallado de tu pedido a tu correo electrónico. Puedes consultar el estado y rastreo en tu sección <strong className="text-[#9E0D0D]">"Mis Compras"</strong>.
                  </p>

                  <button
                    onClick={onClose}
                    className="bg-[#9E0D0D] hover:bg-red-800 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md cursor-pointer"
                  >
                    Volver a la Tienda
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Controls Footer */}
        {isCustomerLoggedIn && step !== 4 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-3xl">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && !selectedAddress) {
                    alert('Por favor agrega o selecciona una dirección de entrega.');
                    return;
                  }
                  setStep((step + 1) as any);
                }}
                className="bg-[#9E0D0D] hover:bg-red-800 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md cursor-pointer"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleFinalizeOrder}
                className="bg-[#E05A1B] hover:bg-orange-700 text-white text-xs font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer"
              >
                Confirmar y Pagar ${totalAmount.toFixed(2)} MXN
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

