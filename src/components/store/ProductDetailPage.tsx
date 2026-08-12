import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { ProductCard } from './ProductCard';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Star,
  Truck,
  MapPin,
  Check,
  Tag,
  Percent,
  Video,
  ImageIcon,
  Sparkles,
  Share2,
  ShieldCheck,
  RotateCcw,
  Clock,
  ChevronRight
} from 'lucide-react';

interface ProductDetailPageProps {
  product: Product;
  onBack: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({ product, onBack }) => {
  const { addToCart, toggleWishlist, isWishlisted, products, setSelectedCategory, setCartOpen } = useStore();
  const wishlisted = isWishlisted(product.id);

  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'video'>('photos');
  const [selectedImage, setSelectedImage] = useState(product.images[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'Única');
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Estándar');
  const [quantity, setQuantity] = useState(1);
  const [postalCode, setPostalCode] = useState('');
  const [deliveryEstimate, setDeliveryEstimate] = useState<string | null>(null);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setSelectedImage(product.images[0] || '');
    if (product.sizes.length > 0) setSelectedSize(product.sizes[0]);
    if (product.colors.length > 0) setSelectedColor(product.colors[0].name);
    setQuantity(1);
    setActiveMediaTab('photos');
    setDeliveryEstimate(null);
  }, [product]);

  // Sync color image when color selection changes
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    const colObj = product.colors.find(c => c.name === colorName);
    const colorImg = colObj?.imageUrl || (product.colorImages && product.colorImages[colorName]);
    if (colorImg) {
      setSelectedImage(colorImg);
      setActiveMediaTab('photos');
    }
  };

  const isOfferActive = product.isOffer || (!!product.offerPrice && product.offerPrice < product.price);
  const displayPrice = isOfferActive && product.offerPrice ? product.offerPrice : product.price;
  const originalPriceVal = isOfferActive ? (product.originalPrice || product.price) : product.originalPrice;
  const savings = originalPriceVal && originalPriceVal > displayPrice ? originalPriceVal - displayPrice : 0;

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
    if (postalCode.trim().length === 5) {
      setDeliveryEstimate('Recíbelo en tu domicilio entre 24 y 48 horas hábiles con Envío Exprés');
    } else {
      setDeliveryEstimate('Ingresa un código postal válido de 5 dígitos.');
    }
  };

  const handleAddToCart = () => {
    if (activeVariantStock <= 0) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 2000);
  };

  const handleBuyNow = () => {
    if (activeVariantStock <= 0) return;
    addToCart(product, selectedSize, selectedColor, quantity);
    setCartOpen(true);
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

  // Related products in same category
  const relatedProducts = useMemo(() => {
    return products
      .filter(p => p.id !== product.id && (p.category === product.category || p.subcategory === product.subcategory))
      .slice(0, 4);
  }, [products, product]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-16">
      {/* Top Breadcrumb & Navigation Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 bg-slate-100 hover:bg-[#9E0D0D] text-slate-800 hover:text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver al Catálogo</span>
          </button>

          {/* Breadcrumb links */}
          <nav className="hidden sm:flex items-center gap-2 text-xs font-medium text-slate-500 overflow-x-auto">
            <button
              onClick={() => {
                setSelectedCategory('todas');
                onBack();
              }}
              className="hover:text-[#9E0D0D] transition-colors cursor-pointer"
            >
              Inicio
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <button
              onClick={() => {
                setSelectedCategory(product.category as any);
                onBack();
              }}
              className="hover:text-[#9E0D0D] font-bold text-slate-700 transition-colors cursor-pointer capitalize"
            >
              {product.category}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
            <span className="text-slate-900 font-bold truncate max-w-[200px]">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Main Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-8 lg:p-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* LEFT COLUMN: Gallery & Media (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Media Selector Tabs (if YouTube video exists) */}
              {youtubeEmbed && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setActiveMediaTab('photos')}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeMediaTab === 'photos'
                        ? 'bg-[#9E0D0D] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Fotos ({product.images.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveMediaTab('video')}
                    className={`flex-1 py-2 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      activeMediaTab === 'video'
                        ? 'bg-red-600 text-white shadow-sm'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <Video className="w-4 h-4 text-red-600" />
                    <span>Ver Video de Muestra</span>
                  </button>
                </div>
              )}

              {/* Main Photo / Video Container */}
              {activeMediaTab === 'video' && youtubeEmbed ? (
                <div className="relative aspect-4/3 sm:aspect-16/10 rounded-2xl overflow-hidden bg-black shadow-inner border border-slate-300">
                  <iframe
                    src={youtubeEmbed}
                    title={`Video de ${product.name}`}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <div className="relative aspect-4/3 sm:aspect-1/1 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-inner flex items-center justify-center group">
                  <img
                    src={selectedImage || product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover object-center transition-all duration-300"
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                    {isOfferActive && (
                      <span className="bg-red-600 text-white font-black text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider animate-pulse">
                        <Tag className="w-3.5 h-3.5" />
                        ¡OFERTA ESPECIAL!
                      </span>
                    )}

                    {product.discountPercentage && product.discountPercentage > 0 && !isOfferActive && (
                      <span className="bg-pink-600 text-white font-extrabold text-xs px-3 py-1 rounded-full shadow-md flex items-center gap-1 uppercase tracking-wider">
                        <Percent className="w-3.5 h-3.5" />
                        -{product.discountPercentage}% DESCUENTO
                      </span>
                    )}

                    {product.stock <= 0 && (
                      <span className="bg-slate-900 text-white font-black text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                        AGOTADO
                      </span>
                    )}
                  </div>

                  {/* Wishlist Floating Button */}
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className={`absolute top-4 right-4 z-10 p-3 rounded-full transition-all shadow-md cursor-pointer ${
                      wishlisted
                        ? 'bg-pink-50 text-pink-600 border border-pink-200 scale-110'
                        : 'bg-white/90 hover:bg-white text-slate-400 hover:text-pink-600'
                    }`}
                    title="Guardar en favoritos"
                  >
                    <Heart className={`w-5 h-5 ${wishlisted ? 'fill-pink-600' : ''}`} />
                  </button>
                </div>
              )}

              {/* Thumbnails Gallery */}
              {product.images && product.images.length > 0 && (
                <div>
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Galería de Fotografías ({product.images.length})
                  </p>
                  <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {product.images.map((imgUrl, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSelectedImage(imgUrl);
                          setActiveMediaTab('photos');
                        }}
                        className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                          selectedImage === imgUrl && activeMediaTab === 'photos'
                            ? 'border-[#9E0D0D] shadow-md ring-2 ring-red-300'
                            : 'border-slate-200 opacity-70 hover:opacity-100 hover:border-slate-300'
                        }`}
                      >
                        <img src={imgUrl} alt={`Vista ${idx + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quality & Trust Badges */}
              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <Truck className="w-5 h-5 text-[#9E0D0D] mb-1" />
                  <span className="text-[11px] font-extrabold text-slate-800">Envío Gratis</span>
                  <span className="text-[10px] text-slate-500">En compras mayores a $499</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <ShieldCheck className="w-5 h-5 text-[#9E0D0D] mb-1" />
                  <span className="text-[11px] font-extrabold text-slate-800">Garantía Total</span>
                  <span className="text-[10px] text-slate-500">Calidad 100% asegurada</span>
                </div>
                <div className="flex flex-col items-center text-center p-3 bg-slate-50 rounded-2xl border border-slate-100">
                  <RotateCcw className="w-5 h-5 text-[#9E0D0D] mb-1" />
                  <span className="text-[11px] font-extrabold text-slate-800">Devolución Fácil</span>
                  <span className="text-[10px] text-slate-500">30 días de cambio</span>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: Product Info & Purchase Controls (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                {/* Header Info */}
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="bg-[#9E0D0D]/10 text-[#9E0D0D] font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-full tracking-wider">
                      {product.category} {product.subcategory ? `• ${product.subcategory}` : ''}
                    </span>
                    {product.sku && (
                      <span className="text-[11px] font-mono text-slate-400 font-bold">
                        SKU: {product.sku}
                      </span>
                    )}
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight leading-tight">
                    {product.name}
                  </h1>

                  {/* Rating Stars */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-600">5.0 (Reseñas verificadas)</span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
                  <div className="flex items-baseline gap-3 flex-wrap">
                    <span className="text-3xl sm:text-4xl font-black text-[#9E0D0D] tracking-tight">
                      ${displayPrice.toFixed(2)}
                      <span className="text-xs font-bold text-slate-500 ml-1">MXN</span>
                    </span>

                    {originalPriceVal && originalPriceVal > displayPrice && (
                      <span className="text-base font-bold text-slate-400 line-through">
                        ${originalPriceVal.toFixed(2)}
                      </span>
                    )}
                  </div>

                  {savings > 0 && (
                    <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-lg w-fit">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>¡Ahorras ${savings.toFixed(2)} MXN con esta promoción!</span>
                    </div>
                  )}
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="space-y-2">
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      COLOR SELECCIONADO: <span className="text-[#9E0D0D]">{selectedColor}</span>
                    </label>
                    <div className="flex flex-wrap gap-2.5">
                      {product.colors.map((col, idx) => {
                        const colName = typeof col === 'string' ? col : col.name;
                        const colHex = typeof col === 'string' ? '#333' : col.hex;
                        const isSelected = selectedColor === colName;

                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectColor(colName)}
                            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'border-[#9E0D0D] bg-red-50/50 text-[#9E0D0D] ring-2 ring-red-200 shadow-2xs'
                                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                            }`}
                          >
                            <span
                              className="w-4 h-4 rounded-full border border-slate-300 shadow-xs shrink-0"
                              style={{ backgroundColor: colHex || '#666' }}
                            />
                            <span>{colName}</span>
                            {isSelected && <Check className="w-3.5 h-3.5 text-[#9E0D0D]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Size Selection */}
                {product.sizes && product.sizes.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                        TALLA SELECCIONADA: <span className="text-[#9E0D0D]">{selectedSize}</span>
                      </label>
                      <span className="text-[11px] font-bold text-slate-400 underline">Guía de Tallas</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {product.sizes.map((sz, idx) => {
                        const isSelected = selectedSize === sz;
                        return (
                          <button
                            key={idx}
                            onClick={() => setSelectedSize(sz)}
                            className={`min-w-11 h-11 px-3 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                              isSelected
                                ? 'bg-[#9E0D0D] text-white border-[#9E0D0D] shadow-sm scale-105'
                                : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200'
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Quantity & Stock Status */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                      CANTIDAD A COMPRAR:
                    </label>
                    <span className={`text-xs font-extrabold ${activeVariantStock > 0 ? 'text-emerald-700' : 'text-red-600'}`}>
                      {activeVariantStock > 0
                        ? `✓ (${activeVariantStock} piezas disponibles)`
                        : '✕ Agotado temporalmente'}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 p-1">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        disabled={quantity <= 1}
                        className="w-9 h-9 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-black text-sm text-slate-900">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(activeVariantStock, quantity + 1))}
                        disabled={quantity >= activeVariantStock}
                        className="w-9 h-9 flex items-center justify-center font-bold text-slate-700 hover:bg-white rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* Postal Code Delivery Estimator */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-extrabold text-slate-800 uppercase tracking-wider">
                    <Truck className="w-4 h-4 text-[#9E0D0D]" />
                    <span>CALCULAR TIEMPO DE ENVÍO A TU C.P.</span>
                  </label>
                  <form onSubmit={handleEstimateDelivery} className="flex gap-2">
                    <input
                      type="text"
                      maxLength={5}
                      placeholder="Ej. 01000"
                      value={postalCode}
                      onChange={e => setPostalCode(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold text-slate-800 focus:outline-hidden focus:border-[#9E0D0D]"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs px-4 py-2 rounded-xl transition-colors cursor-pointer"
                    >
                      Calcular
                    </button>
                  </form>
                  {deliveryEstimate && (
                    <p className="text-xs font-bold text-[#9E0D0D] bg-red-50 p-2.5 rounded-xl border border-red-200 animate-fadeIn">
                      {deliveryEstimate}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="space-y-2.5 pt-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={activeVariantStock <= 0}
                    className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      addedAnimation
                        ? 'bg-emerald-600 text-white'
                        : 'bg-[#9E0D0D] hover:bg-red-900 text-white shadow-red-900/20 active:scale-[0.99]'
                    } disabled:bg-slate-300 disabled:cursor-not-allowed`}
                  >
                    <ShoppingBag className="w-5 h-5" />
                    <span>
                      {addedAnimation
                        ? '¡AGREGADO A TU BOLSA DE COMPRA!'
                        : activeVariantStock <= 0
                        ? 'PRODUCTO AGOTADO'
                        : `AGREGAR A LA BOLSA • $${(displayPrice * quantity).toFixed(2)} MXN`}
                    </span>
                  </button>

                  <button
                    onClick={handleBuyNow}
                    disabled={activeVariantStock <= 0}
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all cursor-pointer disabled:bg-slate-300 shadow-md"
                  >
                    Comprar Ahora Mismo
                  </button>
                </div>

                {/* Description Box */}
                {product.description && (
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Descripción del Producto
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                      {product.description}
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS SECTION */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#9E0D0D]" />
                <span>También te podría interesar</span>
              </h2>
              <p className="text-xs text-slate-500">
                Otras prendas destacadas de la categoría <strong className="capitalize">{product.category}</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(relProd => (
                <ProductCard key={relProd.id} product={relProd} onQuickView={() => {}} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
