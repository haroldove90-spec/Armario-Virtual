import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { X, Star, Truck, ShieldCheck, ShoppingBag, Heart, MapPin, Check } from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Única');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Estándar');
  const [quantity, setQuantity] = useState(1);
  const [postalCode, setPostalCode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);

  const handleEstimateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (postalCode.length === 5) {
      setDeliveryEstimate('Recíbelo en tu domicilio entre 24 y 48 horas con SubuEntrega Exprés');
    } else {
      setDeliveryEstimate('Por favor ingresa un código postal válido de 5 dígitos.');
    }
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image Gallery */}
        <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col justify-between">
          <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-white shadow-inner mb-4 border border-gray-200">
            <img
              src={selectedImage || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.discountPercentage && (
              <span className="absolute top-3 left-3 bg-pink-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md">
                -{product.discountPercentage}% DE DESCUENTO
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all ${
                    selectedImage === img ? 'border-purple-600 ring-2 ring-purple-100' : 'border-gray-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Specs & Options */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-purple-700 uppercase tracking-wider mb-1">
              <span>{product.subcategory}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9 (48 opiniones)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-3">
              {product.name}
            </h2>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4 bg-purple-50/50 p-3 rounded-2xl border border-purple-100/80">
              <span className="text-3xl font-black text-purple-900">
                ${product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.originalPrice.toFixed(2)} MXN
                </span>
              )}
              <span className="text-xs text-purple-700 font-bold ml-auto">
                SKU: {product.sku}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Talla Seleccionada: <span className="text-purple-700">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === size
                          ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-purple-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selector */}
            {product.colors.length > 0 && (
              <div className="mb-6">
                <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
                  Color: <span className="text-purple-700">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map(col => (
                    <button
                      key={col.name}
                      onClick={() => setSelectedColor(col.name)}
                      style={{ backgroundColor: col.hex }}
                      className={`w-7 h-7 rounded-full border-2 transition-all shadow-xs relative ${
                        selectedColor === col.name
                          ? 'ring-2 ring-purple-600 ring-offset-2 scale-110'
                          : 'border-gray-300'
                      }`}
                      title={col.name}
                    >
                      {selectedColor === col.name && (
                        <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${col.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">Cantidad:</span>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  -
                </button>
                <span className="px-4 py-1.5 text-xs font-black text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                >
                  +
                </button>
              </div>
              <span className="text-xs text-gray-500 font-medium">
                ({product.stock} disponibles en stock)
              </span>
            </div>

            {/* Postal Code Delivery Estimator */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 mb-6">
              <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-purple-700" />
                Calcular tiempo de envío a tu C.P.:
              </label>
              <form onSubmit={handleEstimateDelivery} className="flex gap-2">
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Ej: 01000"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-28 text-xs px-3 py-1.5 border border-gray-300 rounded-lg focus:border-purple-600 outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-900"
                >
                  Calcular
                </button>
              </form>
              {deliveryEstimate && (
                <p className="text-[11px] text-purple-800 font-medium mt-2 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                  {deliveryEstimate}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Agregar al Carrito</span>
            </button>

            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3.5 rounded-2xl border transition-all ${
                wishlisted
                  ? 'bg-pink-50 border-pink-300 text-pink-600'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:text-pink-600'
              }`}
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-pink-600' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
