import { Product } from '../types';

/**
 * Calculates the effective unit price for a product.
 * Returns `offerPrice` if an offer is active (`isOffer` is true and `offerPrice` > 0);
 * otherwise returns regular `price`.
 */
export const getProductEffectivePrice = (product: Product): number => {
  if (Boolean(product.isOffer) && Number(product.offerPrice || 0) > 0) {
    return Number(product.offerPrice);
  }
  return Number(product.price || 0);
};

/**
 * Obtains the specific image URL corresponding to the selected color of a product.
 * Checks `colorImages` dictionary, `colors` list `imageUrl`, or falls back to main images.
 */
export const getProductColorImage = (product: Product, colorName?: string): string => {
  if (colorName && colorName !== 'Estándar') {
    // 1. Check colorImages dictionary
    if (product.colorImages && product.colorImages[colorName]) {
      const val = product.colorImages[colorName];
      if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string' && val[0].trim().length > 0) {
        return val[0].trim();
      }
      if (typeof val === 'string' && val.trim().length > 0) {
        return val.trim();
      }
    }

    // 2. Check colors list for imageUrl
    if (product.colors && Array.isArray(product.colors)) {
      const colObj = product.colors.find(c => (typeof c === 'string' ? c : c.name) === colorName);
      if (colObj && typeof colObj !== 'string' && colObj.imageUrl && colObj.imageUrl.trim().length > 0) {
        return colObj.imageUrl.trim();
      }
    }
  }

  // 3. Fallback to main images array
  if (product.images && Array.isArray(product.images) && product.images.length > 0) {
    const firstValid = product.images.find(img => typeof img === 'string' && img.trim().length > 0);
    if (firstValid) return firstValid.trim();
  }

  return 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg';
};
