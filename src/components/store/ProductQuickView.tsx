import React, { useState } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { SizeGuideModal } from './SizeGuideModal';
import {
  X,
  Star,
  Truck,
  ShoppingBag,
  Heart,
  MapPin,
  Check,
  Video,
  Tag,
  ImageIcon,
  Ruler
} from 'lucide-react';

interface ProductQuickViewProps {
  product: Product | null;
  onClose: () => void;
}

export const ProductQuickView: React.FC<ProductQuickViewProps> = ({ product, onClose }) => {
  if (!product) return null;

  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Única');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Estándar');
  const [quantity, setQuantity] = useState(1);
  const [postalCode, setPostalCode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  // Color-specific images for chosen color
  const selectedColorImages = React.useMemo(() => {
    const imgs: string[] = [];
    if (!selectedColor) return imgs;

    const colObj = product.colors?.find(c => (typeof c === 'string' ? c : c.name) === selectedColor);
    if (colObj && typeof colObj !== 'string' && colObj.imageUrl && colObj.imageUrl.trim()) {
      imgs.push(colObj.imageUrl.trim());
    }

    if (product.colorImages && product.colorImages[selectedColor]) {
      const val = product.colorImages[selectedColor];
      if (typeof val === 'string' && val.trim() && !imgs.includes(val.trim())) {
        imgs.push(val.trim());
      } else if (Array.isArray(val)) {
        val.forEach(item => {
          if (typeof item === 'string' && item.trim() && !imgs.includes(item.trim())) {
            imgs.push(item.trim());
          }
        });
      }
    }
    return imgs;
  }, [product, selectedColor]);

  // Gallery images filtered strictly by color
  const galleryImages = React.useMemo(() => {
    if (selectedColorImages.length > 0) return selectedColorImages;
    if (product.images && Array.isArray(product.images)) {
      const valid = product.images.filter(img => typeof img === 'string' && img.trim().length > 0);
      if (valid.length > 0) return valid;
    }
    return ['https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'];
  }, [selectedColorImages, product]);

  // Keep selected image aligned with active color gallery
  React.useEffect(() => {
    if (galleryImages.length > 0 && !galleryImages.includes(selectedImage)) {
      setSelectedImage(galleryImages[0]);
    }
  }, [galleryImages]);

  // Sync color image when color selection changes
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const colObj = product.colors.find(c => c.name === colorName);
    const rawImg = colObj?.imageUrl || (product.colorImages && product.colorImages[colorName]);
    const colorImg = Array.isArray(rawImg) ? rawImg[0] : rawImg;
    if (colorImg) {
      setSelectedImage(colorImg);
    } else if (product.images && product.images[0]) {
      setSelectedImage(product.images[0]);
    }
    setActiveMediaTab('photos');
  };

  const isOfferActive = product.isOffer && !!product.offerPrice && product.offerPrice > 0;
  const displayPrice = isOfferActive ? product.offerPrice : product.price;
  const originalPriceVal = isOfferActive
    ? (product.originalPrice || product.price)
    : (product.originalPrice && product.originalPrice > product.price ? product.originalPrice : undefined);

  // Variant specific stock calculation
  const getSelectedVariantStock = (): number => {
    if (product.variantStock && product.variantStock.length > 0) {
      const match = product.variantStock.find(
        v =>
          (!v.size || v.size === selectedSize) &&
          (!v.color || v.color === selectedColor)
      );
      if (match) return match.stock;
    }
    return product.stock;
  };

  const activeVariantStock = getSelectedVariantStock();

  const handleEstimateDelivery = (e: React.FormEvent) => {
    e.preventDefault();
    if (postalCode.length === 5) {
      setDeliveryEstimate('Recíbelo en tu domicilio entre 24 y 48 horas con SubuEntrega Exprés');
    } else {
      setDeliveryEstimate('Ingresa un código postal de 5 dígitos.');
    }
  };

  const handleAddToCart = () => {
    if (activeVariantStock <= 0) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    onClose();
  };

  const getYouTubeEmbedUrl = (urlStr?: string): string | null => {
    if (!urlStr) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = urlStr.match(regExp);
    if (match && match[2].length === 11) {
      return `https://www.youtube.com/embed/${match[2]}`;
    }
    if (urlStr.trim().length === 11) {
      return `https://www.youtube.com/embed/${urlStr.trim()}`;
    }
    return null;
  };

  const youtubeEmbed = getYouTubeEmbedUrl(product.youtubeUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-gray-100 flex flex-col md:flex-row">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Media Gallery (Photos + Embedded YouTube Video) */}
        <div className="md:w-1/2 p-6 bg-gray-50 flex flex-col justify-between">
          <div>
            {/* Media Selector Tabs (if YouTube video exists) */}
            {youtubeEmbed && (
              <div className="flex gap-2 mb-3">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeMediaTab === 'photos'
                      ? 'bg-[#9E0D0D] text-white shadow-xs'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <ImageIcon className="w-3.5 h-3.5" />
                  <span>Fotos ({product.images.length})</span>
                </button>
                <button
                  onClick={() => setActiveMediaTab('video')}
                  className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                    activeMediaTab === 'video'
                      ? 'bg-red-600 text-white shadow-xs'
                      : 'bg-white text-red-700 border border-red-200 hover:bg-red-50'
                  }`}
                >
                  <Video className="w-3.5 h-3.5" />
                  <span>Ver Video YouTube</span>
                </button>
              </div>
            )}

            {/* Main Display: Photo or Video Player */}
            {activeMediaTab === 'video' && youtubeEmbed ? (
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-black shadow-inner mb-4 border border-gray-300">
                <iframe
                  src={youtubeEmbed}
                  title={`Video de ${product.name}`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden bg-white shadow-inner mb-4 border border-gray-200">
                <img
                  src={selectedImage || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />

                {isOfferActive && (
                  <span className="absolute top-3 left-3 bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                    <Tag className="w-3 h-3" />
                    ¡OFERTA ESPECIAL!
                  </span>
                )}
              </div>
            )}

            {/* Thumbnails list (filtered by selected color) */}
            {activeMediaTab === 'photos' && galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(img)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                      selectedImage === img
                        ? 'border-[#9E0D0D] ring-2 ring-red-100 scale-105'
                        : 'border-gray-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Product Specs & Options */}
        <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs font-bold text-[#9E0D0D] uppercase tracking-wider mb-1">
              <span>{product.subcategory || product.category}</span>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>4.9 (48 opiniones)</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-gray-900 leading-snug mb-3">
              {product.name}
            </h2>

            {/* Price Box */}
            <div className="flex items-baseline gap-3 mb-4 bg-red-50/50 p-3.5 rounded-2xl border border-red-100">
              <span className="text-3xl font-black text-[#9E0D0D]">
                ${displayPrice.toFixed(2)} <span className="text-xs">MXN</span>
              </span>
              {originalPriceVal && originalPriceVal > displayPrice && (
                <span className="text-sm text-gray-400 line-through">
                  ${originalPriceVal.toFixed(2)}
                </span>
              )}
              <span className="text-xs text-[#9E0D0D] font-bold ml-auto font-mono">
                SKU: {product.sku}
              </span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Size Selector */}
            {product.sizes.length > 0 && (
              <div className="mb-5">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-gray-800 uppercase tracking-wider">
                    Talla Seleccionada: <span className="text-[#9E0D0D]">{selectedSize}</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[11px] font-extrabold text-[#9E0D0D] hover:text-red-900 bg-red-50 hover:bg-red-100/80 px-2 py-0.5 rounded-lg border border-red-200 flex items-center gap-1 transition-all cursor-pointer"
                    title="Ver tabla de medidas"
                  >
                    <Ruler className="w-3 h-3 text-[#9E0D0D]" />
                    <span>Guía de Tallas</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map(size => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#9E0D0D] text-white border-[#9E0D0D] shadow-xs'
                          : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-red-300'
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
                  Color: <span className="text-[#9E0D0D]">{selectedColor}</span>
                </label>
                <div className="flex items-center gap-3">
                  {product.colors.map(col => {
                    const hasSpecificImg = Boolean(col.imageUrl || (product.colorImages && product.colorImages[col.name]));
                    return (
                      <button
                        key={col.name}
                        onClick={() => handleSelectColor(col.name)}
                        style={{ backgroundColor: col.hex }}
                        className={`w-7 h-7 rounded-full border-2 transition-all shadow-xs relative ${
                          selectedColor === col.name
                            ? 'ring-2 ring-[#9E0D0D] ring-offset-2 scale-110'
                            : 'border-gray-300 hover:scale-105'
                        }`}
                        title={`${col.name}${hasSpecificImg ? ' (Foto disponible)' : ''}`}
                      >
                        {selectedColor === col.name && (
                          <Check className={`w-3.5 h-3.5 absolute inset-0 m-auto ${col.hex === '#ffffff' ? 'text-black' : 'text-white'}`} />
                        )}
                        {hasSpecificImg && selectedColor !== col.name && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-1 ring-white" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quantity Selector & Stock Status */}
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
                  onClick={() => setQuantity(Math.min(activeVariantStock, quantity + 1))}
                  className="px-3 py-1.5 text-gray-600 hover:bg-gray-200 font-bold"
                  disabled={quantity >= activeVariantStock}
                >
                  +
                </button>
              </div>

              <span
                className={`text-xs font-bold ${
                  activeVariantStock <= 0
                    ? 'text-red-600'
                    : activeVariantStock <= 3
                    ? 'text-amber-600 font-black'
                    : 'text-emerald-700'
                }`}
              >
                {activeVariantStock <= 0
                  ? '¡Agotado en esta combinación!'
                  : activeVariantStock <= 3
                  ? `(⚡ ¡Solo ${activeVariantStock} disponible${activeVariantStock > 1 ? 's' : ''}!)`
                  : `(${activeVariantStock} pzas disponibles en stock)`}
              </span>
            </div>

            {/* Postal Code Delivery Estimator */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 mb-6">
              <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#9E0D0D]" />
                Calcular tiempo de envío a tu C.P.:
              </label>
              <form onSubmit={handleEstimateDelivery} className="flex gap-2">
                <input
                  type="text"
                  maxLength={5}
                  placeholder="Ej: 01000"
                  value={postalCode}
                  onChange={e => setPostalCode(e.target.value)}
                  className="w-28 text-xs px-3 py-1.5 border border-gray-300 rounded-lg focus:border-[#9E0D0D] outline-hidden"
                />
                <button
                  type="submit"
                  className="bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-slate-900"
                >
                  Calcular
                </button>
              </form>
              {deliveryEstimate && (
                <p className="text-[11px] text-red-800 font-medium mt-2 flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-[#9E0D0D] shrink-0" />
                  {deliveryEstimate}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleAddToCart}
              disabled={activeVariantStock <= 0}
              className={`flex-1 font-black text-sm py-3.5 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 ${
                activeVariantStock > 0
                  ? 'bg-[#9E0D0D] hover:bg-red-900 text-white active:scale-95'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="w-5 h-5" />
              <span>{activeVariantStock > 0 ? 'Agregar a la Bolsa' : 'Variante Agotada'}</span>
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

      {/* Floating Size Guide Modal */}
      <SizeGuideModal
        isOpen={showSizeGuide}
        onClose={() => setShowSizeGuide(false)}
        product={product}
        selectedSize={selectedSize}
        onSelectSize={(newSize) => setSelectedSize(newSize)}
      />
    </div>
  );
};
