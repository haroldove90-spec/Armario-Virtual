import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress, EnviosRate } from '../../types';
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
  Sparkles
} from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOrderCompleted: (orderId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onOrderCompleted }) => {
  if (!isOpen) return null;

  const { customer, cart, shippingConfig, placeOrder, addCustomerAddress } = useStore();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress>(
    customer.addresses.find(a => a.isDefault) || customer.addresses[0]
  );
  const [selectedCarrier, setSelectedCarrier] = useState(
    shippingConfig.carriers.find(c => c.active) || shippingConfig.carriers[0]
  );
  
  // Envios.com API live state
  const [enviosRates, setEnviosRates] = useState<EnviosRate[]>([]);
  const [loadingEnvios, setLoadingEnvios] = useState<boolean>(false);
  const [selectedEnviosRate, setSelectedEnviosRate] = useState<EnviosRate | null>(null);

  const [paymentMethod, setPaymentMethod] = useState<string>('Tarjeta de Crédito / Débito (Visa, Mastercard, AMEX)');

  // New address form state
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddrForm, setNewAddrForm] = useState({
    recipientName: customer.name,
    street: '',
    exteriorNumber: '',
    interiorNumber: '',
    neighborhood: '',
    city: '',
    state: 'CDMX',
    postalCode: '',
    phone: customer.phone
  });

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

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= shippingConfig.freeShippingThreshold;
  
  const activeShippingCost = selectedEnviosRate
    ? selectedEnviosRate.cost
    : selectedCarrier.cost;
    
  const shippingCost = isFreeShipping ? 0 : activeShippingCost;
  const totalAmount = subtotal + shippingCost;

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.street || !newAddrForm.exteriorNumber || !newAddrForm.postalCode) return;

    addCustomerAddress(newAddrForm);
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
            <h3 className="font-extrabold text-base">Finalizar Compra - Ropa en Línea</h3>
          </div>
          {step !== 4 && (
            <button onClick={onClose} className="p-1.5 hover:bg-red-900 rounded-full text-red-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        {step !== 4 && (
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
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#9E0D0D]" />
                  Selecciona la Dirección de Entrega
                </h4>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-[#9E0D0D] hover:text-red-900 flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nueva Dirección
                </button>
              </div>

              {/* Add Address Form */}
              {showAddAddress ? (
                <form onSubmit={handleCreateAddress} className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <p className="text-xs font-bold text-gray-800">Agregar nuevo domicilio de entrega</p>
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
                      placeholder="Código Postal"
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
                    <button type="submit" className="bg-[#9E0D0D] text-white text-xs font-bold px-4 py-2 rounded-xl">
                      Guardar Dirección
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddAddress(false)}
                      className="bg-gray-200 text-gray-700 text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Cancelar
                    </button>
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
                    Cotización en tiempo real para el C.P. <strong className="text-gray-900">{selectedAddress?.postalCode || '01000'}</strong> ({selectedAddress?.city || 'Ciudad de México'})
                  </p>
                </div>

                <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shrink-0">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>API envios.com Activada</span>
                </div>
              </div>

              {/* API Connection Indicator */}
              <div className="bg-slate-900 text-white p-3 rounded-2xl text-[11px] flex items-center justify-between shadow-xs">
                <div className="flex items-center gap-2.5">
                  <div className="p-1.5 bg-[#9E0D0D] rounded-lg">
                    <Zap className="w-4 h-4 text-[#E05A1B]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p className="font-extrabold text-xs text-white">Conexión Segura con Envíos.com</p>
                      <span className="bg-emerald-500/20 text-emerald-300 font-extrabold text-[9px] px-1.5 py-0.2 rounded border border-emerald-500/30">
                        CONECTADO
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-300">
                      Token API Envíos.com: <code className="text-yellow-300 font-mono">9661a48692fa52693...700bb7b8</code>
                    </p>
                  </div>
                </div>
                <span className="text-[9px] font-mono bg-white/10 px-2.5 py-1 rounded-lg text-slate-200 border border-white/10 hidden sm:inline">
                  v2.1 REST API
                </span>
              </div>

              {/* Loading State */}
              {loadingEnvios ? (
                <div className="py-8 text-center space-y-3 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <Loader2 className="w-8 h-8 text-[#9E0D0D] animate-spin mx-auto" />
                  <p className="text-xs font-bold text-gray-700">Cotizando tarifas en tiempo real con la API de envios.com...</p>
                  <p className="text-[10px] text-gray-400">Consultando FedEx, Estafeta, DHL Express, Paquetexpress, Redpack y 99minutos</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
                  {enviosRates.map(rate => {
                    const isSelected = selectedEnviosRate?.id === rate.id;
                    return (
                      <div
                        key={rate.id}
                        onClick={() => setSelectedEnviosRate(rate)}
                        className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                          isSelected
                            ? 'border-[#9E0D0D] bg-red-50/60 shadow-xs ring-1 ring-red-200'
                            : 'border-gray-200 bg-white hover:border-red-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            checked={isSelected}
                            onChange={() => setSelectedEnviosRate(rate)}
                            className="accent-[#9E0D0D] w-4 h-4"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-extrabold text-xs text-gray-900">{rate.carrier}</span>
                              <span className="text-[10px] font-semibold text-gray-600 bg-gray-100 px-2 py-0.5 rounded-md">
                                {rate.service}
                              </span>
                              {rate.badge && (
                                <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full uppercase ${
                                  rate.recommended ? 'bg-[#E05A1B] text-white' : 'bg-slate-800 text-slate-100'
                                }`}>
                                  {rate.badge}
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1">
                              <Truck className="w-3 h-3 text-gray-400 inline" />
                              Entrega estimada: <strong>{rate.estimatedDays}</strong>
                            </p>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span className={`text-sm font-black font-mono block ${isSelected ? 'text-[#9E0D0D]' : 'text-gray-900'}`}>
                            {isFreeShipping ? (
                              <span className="text-emerald-600 font-extrabold">¡GRATIS!</span>
                            ) : (
                              `$${rate.cost}.00 MXN`
                            )}
                          </span>
                          <span className="text-[9px] text-gray-400 block font-sans">
                            vía envios.com
                          </span>
                        </div>
                      </div>
                    );
                  })}

                  {/* Option to select default store carriers as fallback if API return is empty */}
                  {enviosRates.length === 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-700">Opciones de envío disponibles:</p>
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
                              {isFreeShipping ? '¡GRATIS!' : `$${carrier.cost}.00 MXN`}
                            </span>
                          </div>
                        ))}
                    </div>
                  )}
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
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 text-xs space-y-1.5">
                <p className="font-bold text-gray-800 border-b border-gray-200 pb-1">Resumen final del pedido</p>
                <div className="flex justify-between text-gray-600">
                  <span>Productos ({cart.reduce((a, b) => a + b.quantity, 0)}):</span>
                  <span>${subtotal.toFixed(2)} MXN</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío ({selectedEnviosRate ? `${selectedEnviosRate.carrier} (${selectedEnviosRate.service})` : selectedCarrier.name}):</span>
                  <span>{isFreeShipping ? 'GRATIS' : `$${shippingCost}.00 MXN`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-slate-900 pt-1 border-t border-gray-200">
                  <span>Total a Pagar:</span>
                  <span>${totalAmount.toFixed(2)} MXN</span>
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
              <h3 className="text-2xl font-black text-gray-900">¡Gracias por tu compra en Ropa en Línea!</h3>
              <p className="text-xs text-gray-600 max-w-md mx-auto">
                Hemos enviado la confirmación y el recibo detallado de tu pedido a tu correo electrónico. Puedes consultar el rastreo en tu sección <strong className="text-[#9E0D0D]">"Mis Compras"</strong>.
              </p>

              <button
                onClick={onClose}
                className="bg-[#9E0D0D] hover:bg-red-800 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md"
              >
                Volver a la Tienda
              </button>
            </div>
          )}
        </div>

        {/* Modal Controls Footer */}
        {step !== 4 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between rounded-b-3xl">
            {step > 1 ? (
              <button
                onClick={() => setStep((step - 1) as any)}
                className="flex items-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 px-4 py-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Regresar
              </button>
            ) : (
              <div />
            )}

            {step < 3 ? (
              <button
                onClick={() => setStep((step + 1) as any)}
                className="bg-[#9E0D0D] hover:bg-red-800 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleFinalizeOrder}
                className="bg-[#E05A1B] hover:bg-orange-700 text-white text-xs font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all"
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
