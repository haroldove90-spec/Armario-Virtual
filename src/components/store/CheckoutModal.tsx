import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShippingAddress } from '../../types';
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
  PackageCheck
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

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const isFreeShipping = subtotal >= shippingConfig.freeShippingThreshold;
  const shippingCost = isFreeShipping ? 0 : selectedCarrier.cost;
  const totalAmount = subtotal + shippingCost;

  const handleCreateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrForm.street || !newAddrForm.exteriorNumber || !newAddrForm.postalCode) return;

    addCustomerAddress(newAddrForm);
    setShowAddAddress(false);
  };

  const handleFinalizeOrder = () => {
    if (!selectedAddress) return;
    const createdOrder = placeOrder(
      selectedAddress,
      paymentMethod,
      selectedCarrier.name,
      shippingCost
    );
    setStep(4);
    onOrderCompleted(createdOrder.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col">
        {/* Modal Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between bg-purple-900 text-white rounded-t-3xl">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-yellow-300" />
            <h3 className="font-extrabold text-base">Finalizar Compra - Ropa en Línea</h3>
          </div>
          {step !== 4 && (
            <button onClick={onClose} className="p-1.5 hover:bg-purple-800 rounded-full text-purple-200 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Step Progress Bar */}
        {step !== 4 && (
          <div className="bg-gray-50 border-b border-gray-200 p-3 px-6 flex items-center justify-between text-xs font-bold text-gray-500">
            <span className={step === 1 ? 'text-purple-700' : 'text-gray-400'}>1. Domicilio</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={step === 2 ? 'text-purple-700' : 'text-gray-400'}>2. Envío</span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
            <span className={step === 3 ? 'text-purple-700' : 'text-gray-400'}>3. Pago</span>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 flex-1 space-y-6">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-purple-700" />
                  Selecciona la Dirección de Entrega
                </h4>
                <button
                  onClick={() => setShowAddAddress(!showAddAddress)}
                  className="text-xs font-bold text-purple-700 hover:text-purple-800 flex items-center gap-1"
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
                    <button type="submit" className="bg-purple-600 text-white text-xs font-bold px-4 py-2 rounded-xl">
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
                          ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-purple-200'
                      }`}
                    >
                      <input
                        type="radio"
                        checked={selectedAddress?.id === addr.id}
                        onChange={() => setSelectedAddress(addr)}
                        className="mt-1 accent-purple-600"
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

          {/* STEP 2: Carrier selection */}
          {step === 2 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <Truck className="w-4 h-4 text-purple-700" />
                Selecciona la Empresa de Envío y Paquetería
              </h4>

              <div className="space-y-3">
                {shippingConfig.carriers
                  .filter(c => c.active)
                  .map(carrier => (
                    <div
                      key={carrier.id}
                      onClick={() => setSelectedCarrier(carrier)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                        selectedCarrier?.id === carrier.id
                          ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                          : 'border-gray-200 bg-white hover:border-purple-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          checked={selectedCarrier?.id === carrier.id}
                          onChange={() => setSelectedCarrier(carrier)}
                          className="accent-purple-600"
                        />
                        <div>
                          <p className="font-bold text-xs text-gray-900">{carrier.name}</p>
                          <p className="text-[11px] text-gray-500">Tiempo estimado: {carrier.estimatedDays}</p>
                        </div>
                      </div>

                      <span className="text-xs font-extrabold text-purple-900">
                        {isFreeShipping ? '¡GRATIS!' : `$${carrier.cost}.00 MXN`}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* STEP 3: Payment method */}
          {step === 3 && (
            <div className="space-y-4">
              <h4 className="font-extrabold text-gray-900 text-sm flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-purple-700" />
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
                        ? 'border-purple-600 bg-purple-50/50 shadow-xs'
                        : 'border-gray-200 bg-white hover:border-purple-200'
                    }`}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === pm.name}
                      onChange={() => setPaymentMethod(pm.name)}
                      className="accent-purple-600"
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
                  <span>Envío ({selectedCarrier.name}):</span>
                  <span>{isFreeShipping ? 'GRATIS' : `$${shippingCost}.00 MXN`}</span>
                </div>
                <div className="flex justify-between text-sm font-black text-purple-950 pt-1 border-t border-gray-200">
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
                Hemos enviado la confirmación y el recibo detallado de tu pedido a tu correo electrónico. Puedes consultar el rastreo en tu sección <strong className="text-purple-800">"Mis Compras"</strong>.
              </p>

              <button
                onClick={onClose}
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-6 py-3 rounded-full shadow-md"
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
                className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-extrabold px-6 py-3 rounded-xl shadow-md"
              >
                Continuar
              </button>
            ) : (
              <button
                onClick={handleFinalizeOrder}
                className="bg-pink-600 hover:bg-pink-700 text-white text-xs font-extrabold px-8 py-3.5 rounded-xl shadow-lg transition-all"
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
