import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress, EnviosRate, Order } from '../../types';
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
  EyeOff,
  FlaskConical,
  Database,
  CheckCircle2,
  ExternalLink,
  ShoppingBag,
  Sliders
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
    storeDesign,
    setActiveRole
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

  // Default to Sandbox / Fictitious purchase mode for instant testability
  const [paymentMethod, setPaymentMethod] = useState<string>('🧪 Modo Compra Ficticia / Prueba (Sandbox 1-Click)');
  const [createdOrderData, setCreatedOrderData] = useState<Order | null>(null);
  const [isPlacingSandbox, setIsPlacingSandbox] = useState<boolean>(false);

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
    : (selectedCarrier?.cost || 0);
    
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

  const handleFillTestCustomer = async () => {
    // Quick login or register as test customer
    setAuthLoading(true);
    try {
      const res = await customerLogin('cynthia90@hotmail.com', 'password123');
      if (typeof res === 'object' && !res.success) {
        await registerCustomer({
          name: 'Cynthia Roque De Lucio',
          email: 'cynthia90@hotmail.com',
          phone: '5624222449',
          password: 'password123'
        });
      }
      setStep(1);
    } catch (e) {
      setStep(1);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFillTestAddress = () => {
    const testAddr: ShippingAddress = {
      id: `addr-${Date.now()}`,
      recipientName: customer?.name || 'Cynthia Roque De Lucio',
      street: 'Av. Insurgentes Sur',
      exteriorNumber: '1602',
      interiorNumber: 'Piso 4',
      neighborhood: 'Crédito Constructor',
      city: 'Benito Juárez',
      state: 'CDMX',
      postalCode: '03940',
      phone: customer?.phone || '5624222449',
      isDefault: true
    };
    const added = addCustomerAddress(testAddr);
    setSelectedAddress(added);
    setShowAddAddress(false);
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
      : (selectedCarrier?.name || 'SubuEntrega Exprés');

    const createdOrder = placeOrder(
      selectedAddress,
      paymentMethod,
      providerName,
      shippingCost
    );
    setCreatedOrderData(createdOrder);
    setStep(4);
    onOrderCompleted(createdOrder.id);
  };

  // 1-Click Fast Sandbox Checkout handler
  const handleQuickSandboxOrder = async () => {
    setIsPlacingSandbox(true);
    try {
      // If customer not logged in, auto-login test account
      if (!isCustomerLoggedIn) {
        await handleFillTestCustomer();
      }

      // Ensure address is ready
      let targetAddress = selectedAddress;
      if (!targetAddress) {
        if (customer?.addresses && customer.addresses.length > 0) {
          targetAddress = customer.addresses[0];
        } else {
          targetAddress = {
            id: `addr-${Date.now()}`,
            recipientName: customer?.name || 'Cynthia Roque De Lucio',
            street: 'Av. Insurgentes Sur',
            exteriorNumber: '1602',
            interiorNumber: 'Piso 4',
            neighborhood: 'Crédito Constructor',
            city: 'Benito Juárez',
            state: 'CDMX',
            postalCode: '03940',
            phone: customer?.phone || '5624222449',
            isDefault: true
          };
          addCustomerAddress(targetAddress);
        }
        setSelectedAddress(targetAddress);
      }

      const providerName = selectedEnviosRate
        ? `${selectedEnviosRate.carrier} ${selectedEnviosRate.service} (vía envios.com)`
        : (selectedCarrier?.name || 'SubuEntrega Exprés CDMX');

      const cost = isFreeShipping ? 0 : (selectedEnviosRate?.cost || selectedCarrier?.cost || 0);

      const ord = placeOrder(
        targetAddress,
        '🧪 Modo Compra Ficticia / Prueba (Sandbox 1-Click)',
        providerName,
        cost
      );

      setCreatedOrderData(ord);
      setStep(4);
      onOrderCompleted(ord.id);
    } catch (err) {
      console.error('Error procesando compra ficticia:', err);
    } finally {
      setIsPlacingSandbox(false);
    }
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

        {/* PROMINENT SANDBOX BANNER (Visible on all steps before completion) */}
        {step !== 4 && (
          <div className="bg-linear-to-r from-amber-500 via-orange-500 to-[#9E0D0D] text-white p-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black tracking-wide uppercase">Modo Compra Ficticia Activo</span>
                  <span className="bg-emerald-400 text-emerald-950 text-[9px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1">
                    <Database className="w-2.5 h-2.5" />
                    Guarda en Supabase
                  </span>
                </div>
                <p className="text-[11px] text-white/90">
                  Prueba el sistema completo sin cobro real. Crea órdenes reales en tu base de datos.
                </p>
              </div>
            </div>

            <button
              onClick={handleQuickSandboxOrder}
              disabled={isPlacingSandbox}
              className="bg-white hover:bg-amber-50 text-slate-900 font-extrabold text-xs px-3.5 py-1.5 rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50"
              title="Realiza la compra automáticamente con datos de prueba"
            >
              {isPlacingSandbox ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-600" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <Zap className="w-3.5 h-3.5 text-amber-600 fill-amber-500" />
                  <span>Compra Rápida 1-Clic</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Step Progress Bar */}
        {isCustomerLoggedIn && step !== 4 && (
          <div className="bg-gray-50 border-b border-gray-200 p-3 px-6 flex items-center justify-between text-xs font-bold text-gray-500">
            <span className={step === 1 ? 'text-[#9E0D0D] font-extrabold' : 'text-gray-400'}>1. Domicilio</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={step === 2 ? 'text-[#9E0D0D] font-extrabold' : 'text-gray-400'}>2. Envío</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={step === 3 ? 'text-[#9E0D0D] font-extrabold' : 'text-gray-400'}>3. Pago</span>
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

              {/* Fast Test Account Shortcut */}
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-xs text-amber-900">
                  <FlaskConical className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>¿Probando el sistema?</strong> Usa una cuenta de prueba en 1 solo clic.</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillTestCustomer}
                  disabled={authLoading}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs px-3 py-1.5 rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Continuar como Cliente de Prueba</span>
                </button>
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
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[#9E0D0D]" />
                        Dirección de Entrega
                      </h4>
                      <p className="text-[11px] text-gray-500">
                        Comprando como: <strong className="text-gray-900">{customer.name}</strong> ({customer.email})
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleFillTestAddress}
                        className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer"
                        title="Carga una dirección de prueba en CDMX"
                      >
                        <FlaskConical className="w-3 h-3 text-amber-600" />
                        <span>Dirección de Prueba</span>
                      </button>

                      <button
                        onClick={() => setShowAddAddress(!showAddAddress)}
                        className="text-xs font-bold text-[#9E0D0D] hover:text-red-900 flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Nueva Dirección
                      </button>
                    </div>
                  </div>

                  {/* Add Address Form */}
                  {showAddAddress || !customer.addresses || customer.addresses.length === 0 ? (
                    <form onSubmit={handleCreateAddress} className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <p className="text-xs font-black text-slate-800 uppercase tracking-wide">
                          {!customer.addresses || customer.addresses.length === 0
                            ? 'Ingresa tu domicilio de entrega para continuar:'
                            : 'Agregar nuevo domicilio de entrega:'}
                        </p>
                        <button
                          type="button"
                          onClick={handleFillTestAddress}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 underline flex items-center gap-1 cursor-pointer"
                        >
                          <FlaskConical className="w-3 h-3 text-amber-600" />
                          <span>Llenar datos de prueba</span>
                        </button>
                      </div>

                      <div className="space-y-3 text-xs">
                        {/* Recipient Name */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Nombre de quien recibe *
                          </label>
                          <input
                            type="text"
                            placeholder="Nombre completo de quien recibe el paquete"
                            value={newAddrForm.recipientName}
                            onChange={e => setNewAddrForm({ ...newAddrForm, recipientName: e.target.value })}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                            required
                          />
                        </div>

                        {/* Calle y Número */}
                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
                          <div className="sm:col-span-7">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Calle y número *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. Av. Insurgentes Sur, Calle Roble..."
                              value={newAddrForm.street}
                              onChange={e => setNewAddrForm({ ...newAddrForm, street: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                              required
                            />
                          </div>

                          <div className="sm:col-span-3">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Núm. Exterior *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. 1602, 45-B"
                              value={newAddrForm.exteriorNumber}
                              onChange={e => setNewAddrForm({ ...newAddrForm, exteriorNumber: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                              required
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Núm. Int <span className="font-normal text-slate-400">(Opc.)</span>
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. 302, Depto B"
                              value={newAddrForm.interiorNumber}
                              onChange={e => setNewAddrForm({ ...newAddrForm, interiorNumber: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                            />
                          </div>
                        </div>

                        {/* Colonia & Código Postal */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Colonia *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. Crédito Constructor, Del Valle, Centro..."
                              value={newAddrForm.neighborhood}
                              onChange={e => setNewAddrForm({ ...newAddrForm, neighborhood: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Código Postal *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. 03940 (5 dígitos)"
                              value={newAddrForm.postalCode}
                              onChange={e => setNewAddrForm({ ...newAddrForm, postalCode: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                              required
                            />
                          </div>
                        </div>

                        {/* Municipio / Alcaldía & Estado */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Municipio / Alcaldía *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. Benito Juárez, Zapopan, Monterrey..."
                              value={newAddrForm.city}
                              onChange={e => setNewAddrForm({ ...newAddrForm, city: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                              required
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">
                              Estado *
                            </label>
                            <input
                              type="text"
                              placeholder="Ej. CDMX, Jalisco, Nuevo León, Edomex..."
                              value={newAddrForm.state}
                              onChange={e => setNewAddrForm({ ...newAddrForm, state: e.target.value })}
                              className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                              required
                            />
                          </div>
                        </div>

                        {/* Teléfono */}
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">
                            Teléfono de Contacto <span className="font-normal text-slate-400">(Para paquetería)</span>
                          </label>
                          <input
                            type="tel"
                            placeholder="Ej. 55 1234 5678"
                            value={newAddrForm.phone}
                            onChange={e => setNewAddrForm({ ...newAddrForm, phone: e.target.value })}
                            className="w-full p-2.5 bg-white border border-slate-200 rounded-xl font-medium focus:border-[#9E0D0D] outline-hidden"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2 border-t border-slate-200">
                        <button type="submit" className="bg-[#9E0D0D] hover:bg-red-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all cursor-pointer">
                          Guardar y Usar Dirección
                        </button>
                        {customer.addresses && customer.addresses.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setShowAddAddress(false)}
                            className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
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
                        Cotización para el C.P. <strong className="text-gray-900">{selectedAddress?.postalCode || '03940'}</strong> ({selectedAddress?.city || 'Ciudad de México'})
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
                  <div className="flex items-center justify-between">
                    <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                      <CreditCard className="w-4 h-4 text-[#9E0D0D]" />
                      Selecciona la Forma de Pago
                    </h4>
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                      Modo Compra Ficticia Disponible
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {/* Sandbox / Fictitious Purchase Option */}
                    <div
                      onClick={() => setPaymentMethod('🧪 Modo Compra Ficticia / Prueba (Sandbox 1-Click)')}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3 relative ${
                        paymentMethod.includes('Ficticia') || paymentMethod.includes('Sandbox')
                          ? 'border-amber-500 bg-amber-50/70 shadow-sm'
                          : 'border-gray-200 bg-white hover:border-amber-300'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={paymentMethod.includes('Ficticia') || paymentMethod.includes('Sandbox')}
                        onChange={() => setPaymentMethod('🧪 Modo Compra Ficticia / Prueba (Sandbox 1-Click)')}
                        className="mt-0.5 accent-amber-600"
                      />
                      <div className="text-xs flex-1">
                        <div className="flex items-center justify-between gap-2">
                          <p className="font-extrabold text-gray-900 flex items-center gap-1.5">
                            <span>🧪 Modo Compra Ficticia / Prueba (Sandbox 1-Click)</span>
                          </p>
                          <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0 flex items-center gap-1">
                            <Database className="w-2.5 h-2.5" />
                            Guarda en BD Supabase
                          </span>
                        </div>
                        <p className="text-gray-600 text-[11px] mt-0.5">
                          Genera la orden inmediatamente sin requerir tarjeta. Descuenta inventario y almacena el pedido en la base de datos de Supabase.
                        </p>
                      </div>
                    </div>

                    {/* Standard Payment Options */}
                    {[
                      { name: 'Tarjeta de Crédito / Débito (Visa, Mastercard, AMEX)', note: 'Hasta 12 Meses Sin Intereses con procesador seguro' },
                      { name: 'Mercado Pago / OXXO Pay', note: 'Pago seguro en efectivo o saldo en cuenta Mercado Pago' },
                      { name: 'PayPal Express', note: 'Protección al comprador de PayPal' }
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
                        <span>Envío ({selectedEnviosRate ? `${selectedEnviosRate.carrier} (${selectedEnviosRate.service})` : selectedCarrier?.name || 'Estándar'}):</span>
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
                <div className="text-center py-4 space-y-4">
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                    <CheckCircle className="w-10 h-10" />
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-black text-gray-900">¡Pedido Realizado con Éxito!</h3>
                    <p className="text-xs text-gray-600 max-w-md mx-auto mt-1">
                      Tu orden ha sido procesada correctamente en <strong className="text-gray-900">{storeDesign?.storeName || 'Armario Virtual'}</strong>.
                    </p>
                  </div>

                  {/* Order Details Card */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left text-xs space-y-2.5 max-w-md mx-auto">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">No. de Pedido:</span>
                      <span className="font-mono font-black text-slate-900 text-sm">
                        {createdOrderData?.orderNumber || 'SUB-2026-NUEVO'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Método de Pago:</span>
                      <span className="font-bold text-amber-700">
                        {createdOrderData?.paymentMethod || paymentMethod}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Estatus del Pedido:</span>
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md uppercase text-[10px]">
                        {createdOrderData?.status || 'PAGADO'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-slate-500 font-medium">Guía de Rastreo:</span>
                      <span className="font-mono font-bold text-slate-800">
                        {createdOrderData?.trackingNumber || 'SUB-102938-MX'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-0.5">
                      <span className="text-slate-500 font-medium">Total:</span>
                      <span className="font-extrabold text-sm text-[#9E0D0D]">
                        ${Number(createdOrderData?.total || totalAmount).toFixed(2)} MXN
                      </span>
                    </div>

                    {/* Supabase Persistence Confirmation Banner */}
                    <div className="mt-3 p-2.5 bg-emerald-50 border border-emerald-200 rounded-xl text-[11px] text-emerald-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <p className="font-extrabold">Guardado en Base de Datos Supabase</p>
                        <p className="text-[10px] text-emerald-700">Tabla <code className="bg-emerald-100 px-1 py-0.2 rounded font-mono">orders</code> sincronizada en tiempo real.</p>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Actions */}
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        onClose();
                        setActiveRole('cliente');
                      }}
                      className="w-full sm:w-auto bg-[#9E0D0D] hover:bg-red-800 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Ver en "Mis Compras"</span>
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        setActiveRole('admin');
                      }}
                      className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Sliders className="w-4 h-4" />
                      <span>Ver en Panel Admin (Ventas)</span>
                    </button>

                    <button
                      onClick={onClose}
                      className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2.5 rounded-xl transition-all cursor-pointer"
                    >
                      Seguir Comprando
                    </button>
                  </div>
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
                className="bg-linear-to-r from-[#9E0D0D] to-[#E05A1B] hover:opacity-95 text-white text-xs font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirmar y Pagar ${totalAmount.toFixed(2)} MXN</span>
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
