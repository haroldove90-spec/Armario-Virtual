export type Category = string;

export interface SubcategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string;
  active: boolean;
}

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  active: boolean;
  subcategories: SubcategoryItem[];
}

export interface ProductVariantStock {
  id: string;
  size?: string;
  color?: string;
  stock: number;
  sku?: string;
}

export interface Product {
  id: string;
  name: string;
  category: Category;
  subcategory: string;
  price: number;
  originalPrice?: number;
  discountPercentage?: number;
  isOffer?: boolean;
  offerPrice?: number;
  stock: number;
  sku: string;
  images: string[]; // Max 5 images (1 primary, 4 secondary)
  sizes: string[];
  colors: { name: string; hex: string }[];
  productType?: 'sencillo' | 'variable';
  variantStock?: ProductVariantStock[];
  description: string;
  tags: string[];
  isFeatured?: boolean;
  youtubeUrl?: string;
  dateAdded: string;
}

export type OrderStatus = 'pendiente' | 'en_preparacion' | 'enviado' | 'entregado' | 'cancelado';

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export interface ShippingAddress {
  id: string;
  recipientName: string;
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  postalCode: string;
  phone: string;
  isDefault?: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  shippingCost: number;
  discountAmount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: string;
  shippingProvider: string;
  trackingNumber?: string;
  createdAt: string;
  estimatedDelivery: string;
  statusHistory: {
    status: OrderStatus;
    timestamp: string;
    note: string;
  }[];
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  favoriteStore: string;
  addresses: ShippingAddress[];
  wishlistProductIds: string[];
  registeredAt: string;
  status?: 'activo' | 'suspendido' | 'inactivo';
  totalOrders?: number;
  totalSpent?: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  username: string;
  password?: string;
  role: string;
  status: 'activo' | 'suspendido';
  permissions: string[];
  createdAt: string;
  lastAccess?: string;
  avatarUrl?: string;
}

export interface AdminProfile {
  name: string;
  email: string;
  phone: string;
  roleTitle: string;
  storeName: string;
  avatarUrl?: string;
  createdAt: string;
}

export interface EnviosRate {
  id: string;
  carrier: string;
  service: string;
  estimatedDays: string;
  cost: number;
  carrierCode: string;
  recommended?: boolean;
  badge?: string;
}

export interface ShippingCarrier {
  id: string;
  name: string;
  code: string;
  estimatedDays: string;
  cost: number;
  active: boolean;
  iconName: string;
  trackingUrlTemplate: string;
}

export interface ShippingConfig {
  freeShippingThreshold: number;
  defaultFlatRate: number;
  expressRate: number;
  carriers: ShippingCarrier[];
  enviosApiKey?: string;
  enviosOriginZip?: string;
  useLiveEnviosApi?: boolean;
}

export interface HeroSlider {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  buttonText: string;
  categoryTarget: Category;
  imageUrl: string;
  bgGradient: string;
  active: boolean;
}

export interface PromoFlyer {
  id: string;
  title: string;
  subtitle: string;
  discountBadge: string;
  imageUrl: string;
  categoryTarget: Category;
  gridSpan: 'single' | 'double' | 'wide';
  active: boolean;
}

export interface StoreDesignConfig {
  storeName: string;
  logoText: string;
  logoSubtext: string;
  logoUrl?: string;
  announcementBarText: string;
  announcementBarActive: boolean;
  primaryColor: string; // e.g. #632488 (Purple)
  accentColor: string;  // e.g. #d81b60 (Magenta)
  heroSliders: HeroSlider[];
  promotionalFlyers: PromoFlyer[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export type ActiveRole = 'tienda' | 'cliente' | 'admin';
export type AdminTab = 'metricas' | 'productos' | 'categorias' | 'ventas' | 'envio' | 'diseno' | 'perfil' | 'usuarios' | 'empleados';
export type CustomerTab = 'compras' | 'perfil' | 'domicilios' | 'favoritos';

