import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { X, Trash2, ShoppingBag, Truck, ArrowRight, ShieldCheck, Tag } from 'lucide-react';

interface CartDrawerProps {
  onOpenCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onOpenCheckout }) => {
  const { cart, cartOpen, setCartOpen, updateCartQuantity, removeFromCart, shippingConfig } = useStore();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);

  if (!cartOpen) return null;

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const freeShippingThreshold = shippingConfig.freeShippingThreshold || 499;
  const missingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeShippingThreshold) * 100);

  const discountAmount = couponApplied ? subtotal * 0.1 : 0;
  const estimatedTotal = subtotal - discountAmount;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (code === 'MODA10' || code === 'ROPA10') {
      setCouponApplied(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between relative border-l border-gray-200">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-purple-50/50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-purple-700" />
            <h3 className="font-extrabold text-gray-900 text-lg">Mi Bolsa de Compras</h3>
            <span className="bg-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-purple-900 text-white p-3.5 text-xs">
          <div className="flex items-center justify-between font-bold mb-1.5">
            <span className="flex items-center gap-1.5">
              <Truck className="w-4 h-4 text-yellow-300" />
              {missingForFreeShipping === 0
                ? '¡Felicidades! Tienes Envío Gratis'
                : `Agrega $${missingForFreeShipping.toFixed(2)} MXN más para Envío Gratis`}
            </span>
            <span className="text-yellow-300">{Math.round(progressPercent)}%</span>
          </div>
          <div className="w-full bg-purple-950/80 rounded-full h-2 overflow-hidden">
            <div
              style={{ width: `${progressPercent}%` }}
              className="bg-yellow-400 h-full rounded-full transition-all duration-500"
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {cart.length > 0 ? (
            cart.map((item, index) => (
              <div
                key={`${item.product.id}-${index}`}
                className="flex gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100 hover:border-purple-200 transition-all"
              >
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-20 object-cover rounded-xl border border-gray-200 shrink-0"
                />

                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h4 className="text-xs font-bold text-gray-900 line-clamp-1">{item.product.name}</h4>
                      <button
                        onClick={() => removeFromCart(index)}
                        className="text-gray-400 hover:text-pink-600 p-1 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex gap-2 text-[11px] text-gray-500 mt-0.5">
                      {item.selectedSize && <span>Talla: <strong className="text-gray-800">{item.selectedSize}</strong></span>}
                      {item.selectedColor && <span>Color: <strong className="text-gray-800">{item.selectedColor}</strong></span>}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm font-black text-purple-900">
                      ${(item.product.price * item.quantity).toFixed(2)} MXN
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity - 1)}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        -
                      </button>
                      <span className="px-2.5 font-bold text-gray-900">{item.quantity}</span>
                      <button
                        onClick={() => updateCartQuantity(index, item.quantity + 1)}
                        className="px-2 py-0.5 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-16 text-gray-500">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-3" />
              <p className="font-bold text-gray-700 text-sm">Tu carrito está vacío</p>
              <p className="text-xs text-gray-400 mt-1">Explora nuestras ofertas y agrega tus prendas favoritas.</p>
            </div>
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {cart.length > 0 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
            {/* Promo coupon input */}
            <form onSubmit={handleApplyCoupon} className="flex gap-2">
              <div className="relative flex-1">
                <Tag className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Cupón (ej: MODA10)"
                  value={couponCode}
                  onChange={e => setCouponCode(e.target.value)}
                  className="w-full bg-white text-xs pl-8 pr-3 py-2 border border-gray-200 rounded-xl outline-hidden focus:border-purple-600 uppercase"
                />
              </div>
              <button
                type="submit"
                className="bg-gray-800 hover:bg-gray-900 text-white text-xs font-bold px-3 py-2 rounded-xl"
              >
                Aplicar
              </button>
            </form>
            {couponApplied && (
              <p className="text-[11px] text-emerald-700 font-bold">¡Cupón de descuento aplicado! (-10% de descuento)</p>
            )}

            {/* Price breakdown */}
            <div className="space-y-1 text-xs text-gray-600 pt-1">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="font-bold text-gray-900">${subtotal.toFixed(2)} MXN</span>
              </div>
              {couponApplied && (
                <div className="flex justify-between text-pink-600 font-bold">
                  <span>Descuento Cupón:</span>
                  <span>-${discountAmount.toFixed(2)} MXN</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío estimado:</span>
                <span className="font-bold text-emerald-600">
                  {subtotal >= freeShippingThreshold ? 'GRATIS' : `$${shippingConfig.defaultFlatRate}.00 MXN`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-purple-950 pt-2 border-t border-gray-200">
                <span>Total Estimado:</span>
                <span>${(estimatedTotal + (subtotal >= freeShippingThreshold ? 0 : shippingConfig.defaultFlatRate)).toFixed(2)} MXN</span>
              </div>
            </div>

            <button
              onClick={() => {
                setCartOpen(false);
                onOpenCheckout();
              }}
              className="w-full bg-pink-600 hover:bg-pink-700 text-white font-extrabold text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Continuar con el Pedido</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-gray-400 font-medium pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Garantía de Satisfacción y Compra Segura</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
