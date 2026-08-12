import React from 'react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Heart, ShoppingBag, Eye, Star, Truck, Percent, Tag, Video } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onQuickView }) => {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);

  const [activeColorImg, setActiveColorImg] = useState<string | null>(null);

  const isOfferActive = product.isOffer || (!!product.offerPrice && product.offerPrice < product.price);
  const displayPrice = isOfferActive && product.offerPrice ? product.offerPrice : product.price;
  const originalPriceVal = isOfferActive ? (product.originalPrice || product.price) : product.originalPrice;

  const currentDisplayImage = activeColorImg || product.images[0] || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg';

  return (
    <div className="group bg-white rounded-lg sm:rounded-xl border border-slate-200 shadow-2xs hover:shadow-md hover:border-red-300 transition-all duration-300 flex flex-col overflow-hidden relative font-sans">
      {/* Badges Overlay */}
      <div className="absolute top-2 left-2 sm:top-3 sm:left-3 z-10 flex flex-col gap-1 items-start max-w-[75%] pointer-events-none">
        {isOfferActive && (
          <span className="bg-red-600 text-white font-black text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5 uppercase tracking-wider animate-pulse">
            <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            ¡OFERTA!
          </span>
        )}

        {product.discountPercentage && product.discountPercentage > 0 && !isOfferActive && (
          <span className="bg-pink-600 text-white font-extrabold text-[8px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow-xs flex items-center gap-0.5 uppercase tracking-wider">
            <Percent className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            -{product.discountPercentage}%
          </span>
        )}

        {product.stock <= 0 ? (
          <span className="bg-gray-900 text-white font-black text-[8px] sm:text-[9px] px-2 py-0.5 rounded uppercase">
            AGOTADO
          </span>
        ) : product.stock <= 3 ? (
          <span className="bg-amber-500 text-white font-bold text-[8px] sm:text-[9px] px-1.5 py-0.5 rounded uppercase">
            ¡Últimas {product.stock}!
          </span>
        ) : null}

        {product.youtubeUrl && (
          <span className="bg-slate-900/80 backdrop-blur-xs text-white font-bold text-[8px] px-1.5 py-0.5 rounded flex items-center gap-1">
            <Video className="w-2.5 h-2.5 text-red-500" />
            Video
          </span>
        )}
      </div>

      {/* Wishlist Button */}
      <button
        onClick={e => {
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 p-1.5 sm:p-2 rounded-full transition-all shadow-md ${
          wishlisted
            ? 'bg-pink-50 text-pink-600 border border-pink-200'
            : 'bg-white/80 hover:bg-white text-slate-400 hover:text-pink-600 backdrop-blur-xs'
        }`}
        title="Agregar a Favoritos"
      >
        <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${wishlisted ? 'fill-pink-600' : ''}`} />
      </button>

      {/* Image Container with Quick View Trigger */}
      <div
        onClick={() => onQuickView(product)}
        className="relative w-full h-40 xs:h-48 sm:h-72 bg-slate-100 overflow-hidden cursor-pointer flex items-center justify-center"
      >
        <img
          src={currentDisplayImage}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
        />
        {!activeColorImg && product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="w-full h-full object-cover object-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}

        {/* Quick View Hover Button */}
        <div className="absolute inset-x-0 bottom-2 sm:bottom-3 px-2 sm:px-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 hidden sm:block">
          <button
            onClick={e => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="w-full bg-[#9E0D0D] hover:bg-red-900 text-white text-[10px] sm:text-xs font-bold py-1.5 sm:py-2 rounded-lg shadow-lg flex items-center justify-center gap-1.5 transition-all uppercase tracking-wider"
          >
            <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E05A1B]" />
            Ver Detalles y Fotos
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-slate-500 mb-0.5 sm:mb-1 gap-1">
            <span className="uppercase tracking-wider sm:tracking-widest font-extrabold text-[#9E0D0D] line-clamp-1">
              {product.subcategory || product.category}
            </span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-amber-500 font-bold shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400" />
              <span>4.9</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="text-[11px] sm:text-xs font-bold text-slate-900 line-clamp-2 hover:text-[#9E0D0D] cursor-pointer transition-colors leading-tight sm:leading-snug min-h-[1.75rem] sm:min-h-0"
            title={product.name}
          >
            {product.name}
          </h3>

          {product.description && (
            <p className="text-[10px] text-slate-500 line-clamp-1 mt-1 hidden sm:block font-normal">
              {product.description}
            </p>
          )}

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-1.5 flex items-center gap-1 overflow-x-auto py-0.5" onClick={e => e.stopPropagation()}>
              {product.colors.map(col => {
                const colImg = col.imageUrl || (product.colorImages && product.colorImages[col.name]);
                const isActive = activeColorImg === colImg || (!activeColorImg && colImg === product.images[0]);
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (colImg) {
                        setActiveColorImg(colImg);
                      } else {
                        onQuickView(product);
                      }
                    }}
                    onMouseEnter={() => {
                      if (colImg) setActiveColorImg(colImg);
                    }}
                    style={{ backgroundColor: col.hex }}
                    className={`w-3.5 h-3.5 rounded-full border border-gray-300 transition-all shrink-0 cursor-pointer ${
                      isActive ? 'ring-2 ring-[#9E0D0D] ring-offset-1 scale-110' : 'hover:scale-110 opacity-80 hover:opacity-100'
                    }`}
                    title={`Ver en color ${col.name}`}
                  />
                );
              })}
            </div>
          )}

          {/* Stock badge indicator */}
          <div className="mt-1.5 flex items-center gap-1 text-[10px] font-bold">
            {product.stock <= 0 ? (
              <span className="text-red-700 bg-red-50 border border-red-200 px-1.5 py-0.2 rounded font-black">
                Agotado
              </span>
            ) : product.stock <= 3 ? (
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded font-black">
                ⚡ ¡Solo {product.stock} disponible{product.stock > 1 ? 's' : ''}!
              </span>
            ) : (
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded">
                Stock: {product.stock} pzas
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Stock */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100 flex items-center justify-between gap-1 sm:gap-2">
          <div className="min-w-0">
            {originalPriceVal && originalPriceVal > displayPrice && (
              <span className="text-[9px] sm:text-[11px] text-slate-400 line-through block font-mono leading-none mb-0.5">
                ${originalPriceVal.toFixed(2)}
              </span>
            )}
            <div
              className={`text-xs xs:text-sm sm:text-lg font-black font-mono leading-none truncate ${
                isOfferActive ? 'text-red-700 font-extrabold' : 'text-[#9E0D0D]'
              }`}
            >
              ${displayPrice.toFixed(2)}{' '}
              <span className="text-[7px] sm:text-[9px] font-sans font-bold text-slate-500 uppercase">MXN</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product.stock <= 0}
            className={`p-1.5 xs:p-2 sm:p-2.5 rounded-md sm:rounded-lg transition-all shadow-xs flex items-center justify-center shrink-0 ${
              product.stock > 0
                ? 'bg-[#9E0D0D] hover:bg-red-800 text-white active:scale-95'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
            title={product.stock > 0 ? 'Agregar a la bolsa' : 'Agotado'}
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
