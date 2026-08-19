import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Order,
  Customer,
  ShippingConfig,
  StoreDesignConfig,
  CartItem,
  ActiveRole,
  AdminTab,
  CustomerTab,
  Category,
  OrderStatus,
  ShippingAddress,
  CategoryItem,
  SubcategoryItem,
  Employee,
  AdminProfile,
  SizeGuideTemplate
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_ORDERS,
  INITIAL_CUSTOMER,
  INITIAL_SHIPPING_CONFIG,
  INITIAL_STORE_DESIGN,
  INITIAL_CATEGORIES,
  INITIAL_ADMIN_PROFILE,
  INITIAL_EMPLOYEES,
  INITIAL_CUSTOMERS_LIST,
  INITIAL_SIZE_GUIDE_TEMPLATES
} from '../data/initialData';
import { getProductEffectivePrice, getProductColorImage } from '../utils/cartHelpers';
import { supabase } from '../lib/supabase';

interface StoreContextType {
  // Role & Navigation Persistence
  activeRole: ActiveRole;
  setActiveRole: (role: ActiveRole) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  adminTab: AdminTab;
  setAdminTab: (tab: AdminTab) => void;
  customerTab: CustomerTab;
  setCustomerTab: (tab: CustomerTab) => void;
  selectedCategory: Category | 'todas';
  setSelectedCategory: (cat: Category | 'todas') => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Authentication & Access
  isCustomerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  customerLogin: (email?: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  registerCustomer: (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    address?: Omit<ShippingAddress, 'id'>;
  }) => Promise<{ success: boolean; error?: string; customer?: Customer }>;
  customerLogout: () => void;
  adminLogin: (email?: string, password?: string) => boolean;
  adminLogout: () => void;

  // Admin Profile
  adminProfile: AdminProfile;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;

  // Size Guide Templates Management
  sizeGuideTemplates: SizeGuideTemplate[];
  addSizeGuideTemplate: (template: Omit<SizeGuideTemplate, 'id' | 'createdAt'>) => void;
  updateSizeGuideTemplate: (id: string, template: Partial<SizeGuideTemplate>) => void;
  deleteSizeGuideTemplate: (id: string) => void;
  duplicateSizeGuideTemplate: (id: string) => void;
  restoreDefaultSizeGuideTemplates: () => void;

  // Categories & Subcategories
  categories: CategoryItem[];
  addCategory: (category: Omit<CategoryItem, 'id'>) => void;
  updateCategory: (id: string, category: Partial<CategoryItem>) => void;
  deleteCategory: (id: string) => void;
  addSubcategory: (categoryId: string, subcategory: Omit<SubcategoryItem, 'id'>) => void;
  deleteSubcategory: (categoryId: string, subcategoryId: string) => void;

  // Employees Management
  employees: Employee[];
  addEmployee: (employee: Omit<Employee, 'id'>) => void;
  updateEmployee: (id: string, employee: Partial<Employee>) => void;
  toggleEmployeeStatus: (id: string) => void;
  deleteEmployee: (id: string) => void;

  // Registered Customers List Management
  customersList: Customer[];
  addCustomerAccount: (customerData: Omit<Customer, 'id'>) => void;
  toggleCustomerStatus: (id: string) => void;
  deleteCustomerAccount: (id: string) => void;

  // Store Data
  products: Product[];
  orders: Order[];
  customer: Customer;
  shippingConfig: ShippingConfig;
  storeDesign: StoreDesignConfig;

  // Cart & Wishlist
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (product: Product, size?: string, color?: string, qty?: number) => void;
  updateCartQuantity: (index: number, newQty: number) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Checkout & Customer Operations
  placeOrder: (
    address: ShippingAddress,
    paymentMethod: string,
    carrierName: string,
    shippingCost: number
  ) => Order;
  addCustomerAddress: (address: Omit<ShippingAddress, 'id'>) => ShippingAddress;
  updateCustomerProfile: (name: string, email: string, phone: string, favoriteStore: string) => void;

  // Admin Product Operations
  addProduct: (product: Omit<Product, 'id' | 'dateAdded'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  clearSampleProducts: () => Promise<void>;
  clearAllProducts: () => Promise<void>;
  updateStock: (id: string, newStock: number) => void;

  // Admin Order Operations
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignOrderTracking: (orderId: string, provider: string, trackingNum: string) => void;

  // Admin Shipping Operations
  updateShippingConfig: (config: Partial<ShippingConfig>) => void;
  toggleCarrierActive: (carrierId: string) => void;

  // Admin Design Operations
  updateStoreDesign: (design: Partial<StoreDesignConfig>) => void;
  addHeroSlider: (slider: Omit<StoreDesignConfig['heroSliders'][0], 'id'>) => void;
  updateHeroSlider: (id: string, slider: Partial<StoreDesignConfig['heroSliders'][0]>) => void;
  deleteHeroSlider: (id: string) => void;
  addPromoFlyer: (flyer: Omit<StoreDesignConfig['promotionalFlyers'][0], 'id'>) => void;
  updatePromoFlyer: (id: string, flyer: Partial<StoreDesignConfig['promotionalFlyers'][0]>) => void;
  deletePromoFlyer: (id: string) => void;

  // Toast / Feedback
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Supabase Cloud Sync
  seedAllDataToSupabase: () => Promise<{ success: boolean; message: string; details?: Record<string, { success: boolean; count?: number; error?: string }> }>;
  reloadFromSupabase: () => Promise<void>;

  // Quick Reset
  resetToDefaultData: () => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local storage keys
  const LS_PRODUCTS = 'ropaenlinea_products_v1';
  const LS_ORDERS = 'ropaenlinea_orders_v1';
  const LS_CUSTOMER = 'ropaenlinea_customer_v1';
  const LS_SHIPPING = 'ropaenlinea_shipping_v1';
  const LS_DESIGN = 'ropaenlinea_design_v1';
  const LS_CART = 'ropaenlinea_cart_v1';
  const LS_AUTH_CUSTOMER = 'ropaenlinea_auth_customer_v1';
  const LS_AUTH_ADMIN = 'ropaenlinea_auth_admin_v1';
  const LS_ACTIVE_ROLE = 'ropaenlinea_active_role_v1';
  const LS_ADMIN_TAB = 'ropaenlinea_admin_tab_v1';
  const LS_CUSTOMER_TAB = 'ropaenlinea_customer_tab_v1';
  const LS_CATEGORIES = 'ropaenlinea_categories_v1';
  const LS_ADMIN_PROFILE = 'ropaenlinea_admin_profile_v1';
  const LS_EMPLOYEES = 'ropaenlinea_employees_v1';
  const LS_CUSTOMERS_LIST = 'ropaenlinea_customers_list_v1';
  const LS_SIZE_GUIDE_TEMPLATES = 'ropaenlinea_size_guide_templates_v1';

  // Role & UI state with lazy init from localStorage
  const [activeRole, setActiveRoleState] = useState<ActiveRole>(() => {
    const saved = localStorage.getItem(LS_ACTIVE_ROLE);
    return (saved as ActiveRole) || 'tienda';
  });

  const setActiveRole = (role: ActiveRole) => {
    setActiveRoleState(role);
    localStorage.setItem(LS_ACTIVE_ROLE, role);
  };

  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [adminTab, setAdminTabState] = useState<AdminTab>(() => {
    const saved = localStorage.getItem(LS_ADMIN_TAB);
    return (saved as AdminTab) || 'metricas';
  });

  const setAdminTab = (tab: AdminTab) => {
    setAdminTabState(tab);
    localStorage.setItem(LS_ADMIN_TAB, tab);
  };

  const [customerTab, setCustomerTabState] = useState<CustomerTab>(() => {
    const saved = localStorage.getItem(LS_CUSTOMER_TAB);
    return (saved as CustomerTab) || 'compras';
  });

  const setCustomerTab = (tab: CustomerTab) => {
    setCustomerTabState(tab);
    localStorage.setItem(LS_CUSTOMER_TAB, tab);
  };

  const [selectedCategory, setSelectedCategoryState] = useState<Category | 'todas'>('todas');
  const [selectedProduct, setSelectedProductState] = useState<Product | null>(null);
  const [searchQuery, setSearchQueryState] = useState<string>('');

  const setSelectedCategory = (cat: Category | 'todas') => {
    setSelectedCategoryState(cat);
    setSelectedProductState(null);
  };

  const setSelectedProduct = (prod: Product | null) => {
    setSelectedProductState(prod);
    if (prod) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const setSearchQuery = (query: string) => {
    setSearchQueryState(query);
    if (query.trim()) {
      setSelectedProductState(null);
    }
  };

  // Auth states
  const [isCustomerLoggedIn, setIsCustomerLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(LS_AUTH_CUSTOMER);
    return saved ? JSON.parse(saved) : false;
  });

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    const saved = localStorage.getItem(LS_AUTH_ADMIN);
    return saved ? JSON.parse(saved) : false;
  });

  useEffect(() => {
    localStorage.setItem(LS_AUTH_CUSTOMER, JSON.stringify(isCustomerLoggedIn));
  }, [isCustomerLoggedIn]);

  useEffect(() => {
    localStorage.setItem(LS_AUTH_ADMIN, JSON.stringify(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  const adminLogin = (email?: string, password?: string): boolean => {
    setIsAdminLoggedIn(true);
    showToast('🛡️ Sesión de Administrador iniciada correctamente');
    return true;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Sesión de administrador cerrada');
  };

  // Size Guide Templates State
  const [sizeGuideTemplates, setSizeGuideTemplates] = useState<SizeGuideTemplate[]>(() => {
    const saved = localStorage.getItem(LS_SIZE_GUIDE_TEMPLATES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    return INITIAL_SIZE_GUIDE_TEMPLATES;
  });

  useEffect(() => {
    localStorage.setItem(LS_SIZE_GUIDE_TEMPLATES, JSON.stringify(sizeGuideTemplates));
  }, [sizeGuideTemplates]);

  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(LS_CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(LS_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // Load all data from Supabase if tables exist
  const loadAllFromSupabase = useCallback(async () => {
    // 1. Categories
    try {
      const { data: dbCategories, error } = await supabase.from('categories').select('*');
      if (!error && dbCategories && dbCategories.length > 0) {
        const mapped: CategoryItem[] = dbCategories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          iconName: c.icon_name || 'Tag',
          active: true,
          subcategories: typeof c.subcategories === 'string' ? JSON.parse(c.subcategories) : (Array.isArray(c.subcategories) ? c.subcategories : [])
        }));
        setCategories(mapped);
      }
    } catch (e) {
      console.log('Supabase categories read skipped, using local fallback');
    }

    // 2. Products
    try {
      const { data: dbProducts, error } = await supabase.from('products').select('*');
      if (!error && dbProducts && dbProducts.length > 0) {
        const mapped: Product[] = dbProducts.map(p => ({
          id: p.id,
          name: p.name,
          productType: p.product_type || 'sencillo',
          category: p.category,
          subcategory: p.subcategory || 'General',
          price: Number(p.price),
          originalPrice: p.original_price ? Number(p.original_price) : undefined,
          isOffer: Boolean(p.is_offer),
          offerPrice: p.offer_price ? Number(p.offer_price) : undefined,
          discountPercentage: p.discount_percentage ? Number(p.discount_percentage) : 0,
          stock: Number(p.stock),
          sku: p.sku || '',
          images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
          sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
          colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors || [],
          colorImages: typeof p.color_images === 'string' ? JSON.parse(p.color_images) : p.color_images || {},
          variantStock: typeof p.variant_stock === 'string' ? JSON.parse(p.variant_stock) : (Array.isArray(p.variant_stock) ? p.variant_stock : []),
          sizeGuide: typeof p.size_guide === 'string' ? JSON.parse(p.size_guide) : (p.size_guide || undefined),
          sizeGuideTemplateId: p.size_guide_template_id || undefined,
          description: p.description || '',
          tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [],
          isFeatured: Boolean(p.is_featured),
          isPublished: p.is_published !== false,
          youtubeUrl: p.youtube_url || '',
          dateAdded: p.date_added
        }));
        setProducts(mapped);
      }
    } catch (e) {
      console.log('Supabase products read skipped, using local fallback');
    }

    // 3. Orders
    try {
      const { data: dbOrders, error } = await supabase.from('orders').select('*');
      if (!error && dbOrders && dbOrders.length > 0) {
        const mapped: Order[] = dbOrders.map(o => ({
          id: o.id,
          orderNumber: o.order_number,
          customerName: o.customer_name || '',
          customerEmail: o.customer_email || '',
          customerPhone: o.customer_phone || '',
          shippingAddress: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : (o.shipping_address || {}),
          items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
          subtotal: Number(o.subtotal || 0),
          shippingCost: Number(o.shipping_cost || 0),
          discountAmount: Number(o.discount_amount || 0),
          total: Number(o.total || 0),
          status: o.status,
          paymentMethod: o.payment_method || '',
          shippingProvider: o.shipping_provider || '',
          trackingNumber: o.tracking_number || '',
          createdAt: o.created_at,
          estimatedDelivery: o.estimated_delivery || '',
          statusHistory: typeof o.status_history === 'string' ? JSON.parse(o.status_history) : (o.status_history || [])
        }));
        setOrders(mapped);
      }
    } catch (e) {
      console.log('Supabase orders read skipped');
    }

    // 4. Customers
    try {
      const { data: dbCustomers, error } = await supabase.from('customers').select('*');
      if (!error && dbCustomers && dbCustomers.length > 0) {
        const mapped: Customer[] = dbCustomers.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          registeredAt: c.registered_at || c.registered_date || new Date().toISOString().split('T')[0],
          totalOrders: Number(c.total_orders || 0),
          totalSpent: Number(c.total_spent || 0),
          favoriteStore: c.favorite_store || '',
          status: (c.status === 'activo' || c.status === 'suspendido' || c.status === 'inactivo') ? c.status : 'activo',
          addresses: typeof c.addresses === 'string' ? JSON.parse(c.addresses) : (c.addresses || []),
          wishlistProductIds: typeof c.wishlist_product_ids === 'string' ? JSON.parse(c.wishlist_product_ids) : (c.wishlist_product_ids || []),
          avatarUrl: c.avatar_url || ''
        }));
        setCustomersList(mapped);
      }
    } catch (e) {
      console.log('Supabase customers read skipped');
    }

    // 5. Employees
    try {
      const { data: dbEmployees, error } = await supabase.from('employees').select('*');
      if (!error && dbEmployees && dbEmployees.length > 0) {
        const mapped: Employee[] = dbEmployees.map(e => ({
          id: e.id,
          name: e.name,
          email: e.email,
          username: e.username || e.email.split('@')[0],
          password: e.password || 'password123',
          role: e.role,
          status: (e.status === 'activo' || e.status === 'suspendido') ? e.status : 'activo',
          createdAt: e.created_at || e.date_joined || new Date().toISOString().split('T')[0],
          lastAccess: e.last_access || 'Recientemente',
          avatarUrl: e.avatar_url || '',
          permissions: typeof e.permissions === 'string' ? JSON.parse(e.permissions) : (e.permissions || [])
        }));
        setEmployees(mapped);
      }
    } catch (e) {
      console.log('Supabase employees read skipped');
    }

    // 6. Configs (shipping, design, admin)
    try {
      const { data: dbShipping } = await supabase.from('shipping_config').select('*').eq('id', 'primary').maybeSingle();
      if (dbShipping) {
        setShippingConfig({
          freeShippingThreshold: Number(dbShipping.free_shipping_threshold || 499),
          defaultFlatRate: Number(dbShipping.default_flat_rate || dbShipping.local_delivery_cost || 79),
          expressRate: Number(dbShipping.express_rate || dbShipping.express_delivery_cost || 149),
          carriers: typeof dbShipping.carriers === 'string' ? JSON.parse(dbShipping.carriers) : (dbShipping.carriers || INITIAL_SHIPPING_CONFIG.carriers),
          enviosApiKey: dbShipping.envios_api_key || dbShipping.envios_com_api_key || INITIAL_SHIPPING_CONFIG.enviosApiKey,
          enviosOriginZip: dbShipping.envios_origin_zip || dbShipping.default_origin_postal_code || '06600',
          useLiveEnviosApi: Boolean(dbShipping.use_live_envios_api ?? dbShipping.envios_com_sandbox_mode)
        });
      }
    } catch (e) {}

    try {
      const { data: dbDesign } = await supabase.from('store_design').select('*').eq('id', 'primary').maybeSingle();
      if (dbDesign) {
        setStoreDesign({
          storeName: dbDesign.store_name || INITIAL_STORE_DESIGN.storeName,
          logoText: dbDesign.logo_text || INITIAL_STORE_DESIGN.logoText,
          logoSubtext: dbDesign.logo_subtext || INITIAL_STORE_DESIGN.logoSubtext,
          logoUrl: dbDesign.logo_url || INITIAL_STORE_DESIGN.logoUrl,
          storeAddress: dbDesign.store_address || INITIAL_STORE_DESIGN.storeAddress,
          primaryColor: dbDesign.primary_color || '#9E0D0D',
          accentColor: dbDesign.accent_color || '#E05A1B',
          announcementBarText: dbDesign.announcement_bar_text || dbDesign.top_announcement_text || INITIAL_STORE_DESIGN.announcementBarText,
          announcementBarActive: Boolean(dbDesign.announcement_bar_active ?? dbDesign.top_announcement_active),
          heroSliders: typeof dbDesign.hero_sliders === 'string' ? JSON.parse(dbDesign.hero_sliders) : (dbDesign.hero_sliders || INITIAL_STORE_DESIGN.heroSliders),
          promotionalFlyers: typeof dbDesign.promotional_flyers === 'string' ? JSON.parse(dbDesign.promotional_flyers) : (dbDesign.promotional_flyers || INITIAL_STORE_DESIGN.promotionalFlyers)
        });
      }
    } catch (e) {}

    try {
      const { data: dbAdmin } = await supabase.from('admin_profile').select('*').eq('id', 'primary').maybeSingle();
      if (dbAdmin) {
        setAdminProfile({
          name: dbAdmin.name || INITIAL_ADMIN_PROFILE.name,
          email: dbAdmin.email || INITIAL_ADMIN_PROFILE.email,
          phone: dbAdmin.phone || INITIAL_ADMIN_PROFILE.phone,
          roleTitle: dbAdmin.role_title || dbAdmin.role || INITIAL_ADMIN_PROFILE.roleTitle,
          storeName: dbAdmin.store_name || INITIAL_ADMIN_PROFILE.storeName,
          avatarUrl: dbAdmin.avatar_url || INITIAL_ADMIN_PROFILE.avatarUrl,
          createdAt: dbAdmin.created_at || INITIAL_ADMIN_PROFILE.createdAt
        });
      }
    } catch (e) {}

    // 7. Size Guide Templates
    try {
      const { data: dbTemplates, error: tplErr } = await supabase.from('size_guide_templates').select('*');
      if (!tplErr && dbTemplates && dbTemplates.length > 0) {
        const mapped: SizeGuideTemplate[] = dbTemplates.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category || 'General',
          unit: t.unit || 'cm',
          columns: typeof t.columns === 'string' ? JSON.parse(t.columns) : (t.columns || []),
          rows: typeof t.rows === 'string' ? JSON.parse(t.rows) : (t.rows || []),
          imageUrl: t.image_url || t.imageUrl || '',
          instructions: t.instructions || '',
          isDefault: Boolean(t.is_default),
          createdAt: t.created_at || t.createdAt
        }));
        setSizeGuideTemplates(mapped);
      }
    } catch (e) {
      console.log('Supabase size_guide_templates read skipped');
    }
  }, []);

  const reloadFromSupabase = async () => {
    await loadAllFromSupabase();
    showToast('🔄 Datos actualizados en vivo desde Supabase');
  };

  useEffect(() => {
    loadAllFromSupabase();

    // Supabase Realtime Channel Subscription
    const channel = supabase
      .channel('schema_live_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        payload => {
          if (payload.eventType === 'INSERT') {
            const o = payload.new as any;
            const mappedOrder: Order = {
              id: o.id,
              orderNumber: o.order_number,
              customerName: o.customer_name || '',
              customerEmail: o.customer_email || '',
              customerPhone: o.customer_phone || '',
              shippingAddress: typeof o.shipping_address === 'string' ? JSON.parse(o.shipping_address) : (o.shipping_address || {}),
              items: typeof o.items === 'string' ? JSON.parse(o.items) : (o.items || []),
              subtotal: Number(o.subtotal || 0),
              shippingCost: Number(o.shipping_cost || 0),
              discountAmount: Number(o.discount_amount || 0),
              total: Number(o.total || 0),
              status: o.status,
              paymentMethod: o.payment_method || '',
              shippingProvider: o.shipping_provider || '',
              trackingNumber: o.tracking_number || '',
              createdAt: o.created_at,
              estimatedDelivery: o.estimated_delivery || '',
              statusHistory: typeof o.status_history === 'string' ? JSON.parse(o.status_history) : (o.status_history || [])
            };
            setOrders(prev => {
              if (prev.some(x => x.id === mappedOrder.id)) return prev;
              return [mappedOrder, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const o = payload.new as any;
            setOrders(prev =>
              prev.map(x =>
                x.id === o.id
                  ? {
                      ...x,
                      status: o.status,
                      shippingProvider: o.shipping_provider || x.shippingProvider,
                      trackingNumber: o.tracking_number || x.trackingNumber,
                      statusHistory: typeof o.status_history === 'string' ? JSON.parse(o.status_history) : (o.status_history || x.statusHistory)
                    }
                  : x
              )
            );
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'products' },
        payload => {
          if (payload.eventType === 'INSERT') {
            const p = payload.new as any;
            const mappedProd: Product = {
              id: p.id,
              name: p.name,
              productType: p.product_type || 'sencillo',
              category: p.category,
              subcategory: p.subcategory || 'General',
              price: Number(p.price),
              originalPrice: p.original_price ? Number(p.original_price) : undefined,
              isOffer: Boolean(p.is_offer),
              offerPrice: p.offer_price ? Number(p.offer_price) : undefined,
              discountPercentage: p.discount_percentage ? Number(p.discount_percentage) : 0,
              stock: Number(p.stock),
              sku: p.sku || '',
              images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
              sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
              colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors || [],
              colorImages: typeof p.color_images === 'string' ? JSON.parse(p.color_images) : p.color_images || {},
              variantStock: typeof p.variant_stock === 'string' ? JSON.parse(p.variant_stock) : (Array.isArray(p.variant_stock) ? p.variant_stock : []),
              sizeGuide: typeof p.size_guide === 'string' ? JSON.parse(p.size_guide) : (p.size_guide || undefined),
              sizeGuideTemplateId: p.size_guide_template_id || undefined,
              description: p.description || '',
              tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [],
              isFeatured: Boolean(p.is_featured),
              isPublished: p.is_published !== false,
              youtubeUrl: p.youtube_url || '',
              dateAdded: p.date_added
            };
            setProducts(prev => {
              if (prev.some(x => x.id === mappedProd.id)) {
                return prev.map(x => (x.id === mappedProd.id ? mappedProd : x));
              }
              return [mappedProd, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const p = payload.new as any;
            setProducts(prev =>
              prev.map(x =>
                x.id === p.id
                  ? {
                      ...x,
                      name: p.name,
                      price: Number(p.price),
                      stock: Number(p.stock),
                      isPublished: p.is_published !== false,
                      isOffer: Boolean(p.is_offer),
                      offerPrice: p.offer_price ? Number(p.offer_price) : undefined
                    }
                  : x
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const p = payload.old as any;
            if (p && p.id) {
              setProducts(prev => prev.filter(x => x.id !== p.id));
            }
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'customers' },
        payload => {
          if (payload.eventType === 'INSERT') {
            const c = payload.new as any;
            const mappedCust: Customer = {
              id: c.id,
              name: c.name,
              email: c.email,
              phone: c.phone || '',
              registeredAt: c.registered_at || c.registered_date || new Date().toISOString().split('T')[0],
              totalOrders: Number(c.total_orders || 0),
              totalSpent: Number(c.total_spent || 0),
              favoriteStore: c.favorite_store || 'Armario Virtual',
              status: (c.status === 'activo' || c.status === 'suspendido' || c.status === 'inactivo') ? c.status : 'activo',
              addresses: typeof c.addresses === 'string' ? JSON.parse(c.addresses) : (c.addresses || []),
              wishlistProductIds: typeof c.wishlist_product_ids === 'string' ? JSON.parse(c.wishlist_product_ids) : (c.wishlist_product_ids || []),
              avatarUrl: c.avatar_url || ''
            };
            setCustomersList(prev => {
              if (prev.some(x => x.id === mappedCust.id)) {
                return prev.map(x => (x.id === mappedCust.id ? mappedCust : x));
              }
              return [mappedCust, ...prev];
            });
          } else if (payload.eventType === 'UPDATE') {
            const c = payload.new as any;
            setCustomersList(prev =>
              prev.map(x =>
                x.id === c.id
                  ? {
                      ...x,
                      name: c.name || x.name,
                      phone: c.phone || x.phone,
                      status: c.status || x.status,
                      totalOrders: Number(c.total_orders ?? x.totalOrders),
                      totalSpent: Number(c.total_spent ?? x.totalSpent)
                    }
                  : x
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const c = payload.old as any;
            if (c && c.id) {
              setCustomersList(prev => prev.filter(x => x.id !== c.id));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadAllFromSupabase]);

  // Size Guide Templates Sync & CRUD Operations
  const syncSizeGuideTemplateToSupabase = async (tpl: SizeGuideTemplate) => {
    try {
      const { error } = await supabase.from('size_guide_templates').upsert({
        id: tpl.id,
        name: tpl.name,
        category: tpl.category || 'General',
        unit: tpl.unit || 'cm',
        columns: tpl.columns || [],
        rows: tpl.rows || [],
        image_url: tpl.imageUrl || '',
        instructions: tpl.instructions || '',
        is_default: Boolean(tpl.isDefault),
        created_at: tpl.createdAt || new Date().toISOString().split('T')[0]
      });
      if (error) {
        console.warn('Supabase size_guide_template upsert error:', error.message);
        if (error.code === '42501' || error.message.toLowerCase().includes('policy')) {
          showToast('⚠️ Supabase RLS: Ejecuta el script SQL para guardar tablas de medidas');
        }
      }
    } catch (e: any) {
      console.warn('Supabase size_guide_template upsert exception:', e);
    }
  };

  const deleteSizeGuideTemplateFromSupabase = async (id: string) => {
    try {
      const { error } = await supabase.from('size_guide_templates').delete().eq('id', id);
      if (error) console.warn('Supabase size_guide_template delete error:', error.message);
    } catch (e: any) {
      console.warn('Supabase size_guide_template delete exception:', e);
    }
  };

  const addSizeGuideTemplate = (tplData: Omit<SizeGuideTemplate, 'id' | 'createdAt'>) => {
    const newTpl: SizeGuideTemplate = {
      ...tplData,
      id: `tpl-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSizeGuideTemplates(prev => [newTpl, ...prev]);
    syncSizeGuideTemplateToSupabase(newTpl);
    showToast(`📏 Plantilla "${newTpl.name}" creada exitosamente`);
  };

  const updateSizeGuideTemplate = (id: string, tplData: Partial<SizeGuideTemplate>) => {
    setSizeGuideTemplates(prev => {
      const updated = prev.map(t => (t.id === id ? { ...t, ...tplData } : t));
      const target = updated.find(t => t.id === id);
      if (target) syncSizeGuideTemplateToSupabase(target);
      return updated;
    });
    showToast('Plantilla de medidas actualizada');
  };

  const deleteSizeGuideTemplate = (id: string) => {
    setSizeGuideTemplates(prev => prev.filter(t => t.id !== id));
    deleteSizeGuideTemplateFromSupabase(id);
    showToast('Plantilla de medidas eliminada');
  };

  const duplicateSizeGuideTemplate = (id: string) => {
    const original = sizeGuideTemplates.find(t => t.id === id);
    if (!original) return;
    const duplicated: SizeGuideTemplate = {
      ...original,
      id: `tpl-${Date.now()}`,
      name: `${original.name} (Copia)`,
      isDefault: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSizeGuideTemplates(prev => [duplicated, ...prev]);
    syncSizeGuideTemplateToSupabase(duplicated);
    showToast(`📋 Plantilla duplicada: "${duplicated.name}"`);
  };

  const restoreDefaultSizeGuideTemplates = () => {
    setSizeGuideTemplates(INITIAL_SIZE_GUIDE_TEMPLATES);
    INITIAL_SIZE_GUIDE_TEMPLATES.forEach(tpl => syncSizeGuideTemplateToSupabase(tpl));
    showToast('🔄 Plantillas de medidas restauradas a valores predeterminados');
  };

  const syncCategoryToSupabase = async (cat: CategoryItem) => {
    try {
      const fullPayload = {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description || '',
        icon_name: cat.iconName || 'Tag',
        subcategories: cat.subcategories || []
      };
      
      let { error } = await supabase.from('categories').upsert(fullPayload);
      
      // Si la tabla no tiene la columna subcategories, reintentar con las columnas base
      if (error && (error.code === '42703' || error.message.toLowerCase().includes('column') || error.message.toLowerCase().includes('subcategories'))) {
        console.warn('Supabase categories: reintentando sin columna subcategories...');
        const basePayload = {
          id: cat.id,
          name: cat.name,
          slug: cat.slug,
          description: cat.description || '',
          icon_name: cat.iconName || 'Tag'
        };
        const fallbackRes = await supabase.from('categories').upsert(basePayload);
        error = fallbackRes.error;
      }

      if (error) {
        console.warn('Supabase category upsert error:', error.message);
        if (error.code === '42501' || error.message.toLowerCase().includes('policy')) {
          showToast('⚠️ Supabase RLS: Ejecuta el script SQL en Supabase para permitir guardar categorías');
        } else {
          showToast(`⚠️ Error al guardar categoría en Supabase: ${error.message}`);
        }
      } else {
        console.log('✅ Categoría guardada en Supabase con éxito:', cat.name);
      }
    } catch (e: any) {
      console.warn('Supabase category upsert exception:', e);
    }
  };

  const deleteCategoryFromSupabase = async (id: string) => {
    try {
      const { error } = await supabase.from('categories').delete().eq('id', id);
      if (error) console.warn('Supabase category delete error:', error.message);
    } catch (e: any) {
      console.warn('Supabase category delete exception:', e);
    }
  };

  const addCategory = (catData: Omit<CategoryItem, 'id'>) => {
    const newCat: CategoryItem = {
      ...catData,
      id: `cat-${Date.now()}`
    };
    setCategories(prev => [...prev, newCat]);
    syncCategoryToSupabase(newCat);
    showToast(`🏷️ Categoría "${newCat.name}" agregada`);
  };

  const updateCategory = (id: string, catData: Partial<CategoryItem>) => {
    setCategories(prev => {
      const updated = prev.map(c => (c.id === id ? { ...c, ...catData } : c));
      const target = updated.find(c => c.id === id);
      if (target) syncCategoryToSupabase(target);
      return updated;
    });
    showToast('Categoría actualizada');
  };

  const deleteCategory = (id: string) => {
    setCategories(prev => prev.filter(c => c.id !== id));
    deleteCategoryFromSupabase(id);
    showToast('Categoría eliminada');
  };

  const addSubcategory = (categoryId: string, subData: Omit<SubcategoryItem, 'id'>) => {
    const newSub: SubcategoryItem = {
      ...subData,
      id: `sub-${Date.now()}`
    };
    setCategories(prev => {
      const updated = prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, subcategories: [...c.subcategories, newSub] };
        }
        return c;
      });
      const target = updated.find(c => c.id === categoryId);
      if (target) syncCategoryToSupabase(target);
      return updated;
    });
    showToast(`Subcategoría "${newSub.name}" agregada`);
  };

  const deleteSubcategory = (categoryId: string, subcategoryId: string) => {
    setCategories(prev => {
      const updated = prev.map(c => {
        if (c.id === categoryId) {
          return { ...c, subcategories: c.subcategories.filter(s => s.id !== subcategoryId) };
        }
        return c;
      });
      const target = updated.find(c => c.id === categoryId);
      if (target) syncCategoryToSupabase(target);
      return updated;
    });
    showToast('Subcategoría eliminada');
  };

  // Sync helpers for other entities
  const syncAdminProfileToSupabase = async (p: AdminProfile) => {
    try {
      const { error } = await supabase.from('admin_profile').upsert({
        id: 'primary',
        name: p.name,
        email: p.email,
        phone: p.phone,
        role: p.roleTitle,
        store_name: p.storeName,
        avatar_url: p.avatarUrl || ''
      });
      if (error) console.warn('Supabase admin_profile sync:', error.message);
    } catch (e) {
      console.warn('Supabase admin_profile sync exception:', e);
    }
  };

  const syncEmployeeToSupabase = async (emp: Employee) => {
    try {
      const { error } = await supabase.from('employees').upsert({
        id: emp.id,
        name: emp.name,
        email: emp.email,
        username: emp.username || emp.email.split('@')[0],
        password: emp.password || 'password123',
        role: emp.role,
        status: emp.status || 'activo',
        created_at: emp.createdAt || new Date().toISOString().split('T')[0],
        last_access: emp.lastAccess || 'Recientemente',
        avatar_url: emp.avatarUrl || '',
        permissions: emp.permissions || []
      });
      if (error) console.warn('Supabase employee sync:', error.message);
    } catch (e) {
      console.warn('Supabase employee sync exception:', e);
    }
  };

  const deleteEmployeeFromSupabase = async (id: string) => {
    try {
      await supabase.from('employees').delete().eq('id', id);
    } catch (e) {}
  };

  const syncCustomerToSupabase = async (c: Customer) => {
    try {
      const fullPayload = {
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '',
        registered_at: c.registeredAt || new Date().toISOString().split('T')[0],
        registered_date: c.registeredAt || new Date().toISOString().split('T')[0],
        total_orders: Number(c.totalOrders || 0),
        total_spent: Number(c.totalSpent || 0),
        favorite_store: c.favoriteStore || '',
        status: c.status || 'activo',
        addresses: c.addresses || [],
        wishlist_product_ids: c.wishlistProductIds || [],
        avatar_url: c.avatarUrl || ''
      };

      let { error } = await supabase.from('customers').upsert(fullPayload);

      // Fallback si la tabla no tiene algunas columnas opcionales
      if (error && (error.code === '42703' || error.message.toLowerCase().includes('column'))) {
        const basicPayload = {
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          status: c.status || 'activo'
        };
        const retryRes = await supabase.from('customers').upsert(basicPayload);
        error = retryRes.error;
      }

      if (error) {
        console.warn('Supabase customer sync error:', error.message);
        if (error.code === '42501' || error.message.toLowerCase().includes('policy')) {
          showToast('⚠️ Supabase RLS: Ejecuta el script SQL en Supabase para permitir guardar clientes');
        } else {
          showToast(`⚠️ Error al guardar cliente en Supabase: ${error.message}`);
        }
      } else {
        console.log('✅ Cliente sincronizado con Supabase:', c.email);
      }
    } catch (e: any) {
      console.warn('Supabase customer sync exception:', e);
    }
  };

  const deleteCustomerFromSupabase = async (id: string) => {
    try {
      await supabase.from('customers').delete().eq('id', id);
    } catch (e) {}
  };

  const syncOrderToSupabase = async (ord: Order) => {
    try {
      const { error } = await supabase.from('orders').upsert({
        id: ord.id,
        order_number: ord.orderNumber,
        customer_name: ord.customerName || '',
        customer_email: ord.customerEmail || '',
        customer_phone: ord.customerPhone || '',
        shipping_address: ord.shippingAddress || {},
        items: ord.items || [],
        subtotal: Number(ord.subtotal || 0),
        shipping_cost: Number(ord.shippingCost || 0),
        discount_amount: Number(ord.discountAmount || 0),
        total: Number(ord.total || 0),
        status: ord.status,
        payment_method: ord.paymentMethod || '',
        shipping_provider: ord.shippingProvider || '',
        tracking_number: ord.trackingNumber || '',
        created_at: ord.createdAt || new Date().toISOString(),
        estimated_delivery: ord.estimatedDelivery || '',
        status_history: ord.statusHistory || []
      });
      if (error) {
        console.warn('Supabase order sync error:', error.message);
      }
    } catch (e) {}
  };

  const syncShippingConfigToSupabase = async (cfg: ShippingConfig) => {
    try {
      await supabase.from('shipping_config').upsert({
        id: 'primary',
        free_shipping_threshold: Number(cfg.freeShippingThreshold || 0),
        default_flat_rate: Number(cfg.defaultFlatRate || 79),
        express_rate: Number(cfg.expressRate || 149),
        carriers: cfg.carriers || [],
        envios_api_key: cfg.enviosApiKey || '',
        envios_origin_zip: cfg.enviosOriginZip || '06600',
        use_live_envios_api: Boolean(cfg.useLiveEnviosApi)
      });
    } catch (e) {}
  };

  const syncStoreDesignToSupabase = async (d: StoreDesignConfig) => {
    try {
      await supabase.from('store_design').upsert({
        id: 'primary',
        store_name: d.storeName,
        logo_text: d.logoText,
        logo_subtext: d.logoSubtext,
        logo_url: d.logoUrl || '',
        store_address: d.storeAddress || '',
        primary_color: d.primaryColor,
        accent_color: d.accentColor,
        announcement_bar_text: d.announcementBarText,
        announcement_bar_active: Boolean(d.announcementBarActive),
        hero_sliders: d.heroSliders || [],
        promotional_flyers: d.promotionalFlyers || []
      });
    } catch (e) {}
  };

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem(LS_ADMIN_PROFILE);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...INITIAL_ADMIN_PROFILE,
          ...parsed,
          fiscal: {
            ...INITIAL_ADMIN_PROFILE.fiscal,
            ...(parsed.fiscal || {})
          }
        };
      } catch (e) {}
    }
    return INITIAL_ADMIN_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(LS_ADMIN_PROFILE, JSON.stringify(adminProfile));
  }, [adminProfile]);

  const updateAdminProfile = (data: Partial<AdminProfile>) => {
    setAdminProfile(prev => {
      const next: AdminProfile = {
        ...prev,
        ...data,
        fiscal: data.fiscal
          ? { ...(prev.fiscal || INITIAL_ADMIN_PROFILE.fiscal!), ...data.fiscal }
          : prev.fiscal
      };
      syncAdminProfileToSupabase(next);
      return next;
    });
    showToast('👤 Perfil y configuración fiscal actualizados');
  };

  // Employees State
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(LS_EMPLOYEES);
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  useEffect(() => {
    localStorage.setItem(LS_EMPLOYEES, JSON.stringify(employees));
  }, [employees]);

  const addEmployee = (empData: Omit<Employee, 'id'>) => {
    const newEmp: Employee = {
      ...empData,
      id: `emp-${Date.now()}`
    };
    setEmployees(prev => [newEmp, ...prev]);
    syncEmployeeToSupabase(newEmp);
    showToast(`👨‍💼 Empleado "${newEmp.name}" registrado`);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => {
      const updated = prev.map(e => (e.id === id ? { ...e, ...data } : e));
      const target = updated.find(e => e.id === id);
      if (target) syncEmployeeToSupabase(target);
      return updated;
    });
    showToast('Empleado actualizado');
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextStatus: 'activo' | 'suspendido' = e.status === 'activo' ? 'suspendido' : 'activo';
          showToast(
            nextStatus === 'suspendido'
              ? `🚫 Acceso suspendido para ${e.name}`
              : `✅ Acceso activado para ${e.name}`
          );
          const updated: Employee = { ...e, status: nextStatus };
          syncEmployeeToSupabase(updated);
          return updated;
        }
        return e;
      })
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
    deleteEmployeeFromSupabase(id);
    showToast('Empleado eliminado');
  };

  // Customers List State
  const [customersList, setCustomersList] = useState<Customer[]>(() => {
    const saved = localStorage.getItem(LS_CUSTOMERS_LIST);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS_LIST;
  });

  useEffect(() => {
    localStorage.setItem(LS_CUSTOMERS_LIST, JSON.stringify(customersList));
  }, [customersList]);

  const addCustomerAccount = (data: Omit<Customer, 'id'>) => {
    const newCust: Customer = {
      ...data,
      id: `cust-${Date.now()}`
    };
    setCustomersList(prev => [newCust, ...prev]);
    syncCustomerToSupabase(newCust);
    showToast(`👤 Cliente "${newCust.name}" registrado`);
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomersList(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus: 'activo' | 'suspendido' = (c.status || 'activo') === 'activo' ? 'suspendido' : 'activo';
          showToast(
            nextStatus === 'suspendido'
              ? `🚫 Cuenta suspendida para ${c.name}`
              : `✅ Cuenta activada para ${c.name}`
          );
          const updated: Customer = { ...c, status: nextStatus };
          syncCustomerToSupabase(updated);
          return updated;
        }
        return c;
      })
    );
  };

  const deleteCustomerAccount = (id: string) => {
    setCustomersList(prev => prev.filter(c => c.id !== id));
    deleteCustomerFromSupabase(id);
    showToast('Usuario cliente eliminado');
  };

  // Main state with localStorage lazy init
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LS_PRODUCTS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(p => !['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8'].includes(p.id));
        }
      } catch (e) {}
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LS_ORDERS);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(o => !['ord-8801', 'ord-8802', 'ord-8803'].includes(o.id));
        }
      } catch (e) {}
    }
    return INITIAL_ORDERS;
  });

  const [customer, setCustomer] = useState<Customer>(() => {
    const saved = localStorage.getItem(LS_CUSTOMER);
    return saved ? JSON.parse(saved) : INITIAL_CUSTOMER;
  });

  const [shippingConfig, setShippingConfig] = useState<ShippingConfig>(() => {
    const saved = localStorage.getItem(LS_SHIPPING);
    return saved ? JSON.parse(saved) : INITIAL_SHIPPING_CONFIG;
  });

  const [storeDesign, setStoreDesign] = useState<StoreDesignConfig>(() => {
    const saved = localStorage.getItem(LS_DESIGN);
    if (saved && saved.includes('#9E0D0D')) {
      return JSON.parse(saved);
    }
    return INITIAL_STORE_DESIGN;
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem(LS_CART);
    return saved ? JSON.parse(saved) : [];
  });

  const [cartOpen, setCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Safe localStorage Syncing
  useEffect(() => {
    try {
      localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
    } catch (e) {
      console.warn('No se pudo guardar productos en localStorage por límite de cuota:', e);
    }
  }, [products]);

  // Sync products with Supabase
  const syncProductToSupabase = async (p: Product) => {
    try {
      const fullPayload = {
        id: p.id,
        name: p.name,
        product_type: p.productType || 'sencillo',
        category: p.category,
        subcategory: p.subcategory || 'General',
        price: Number(p.price) || 0,
        original_price: p.originalPrice ? Number(p.originalPrice) : null,
        is_offer: Boolean(p.isOffer),
        offer_price: p.offerPrice ? Number(p.offerPrice) : null,
        discount_percentage: Number(p.discountPercentage) || 0,
        stock: Number(p.stock) || 0,
        sku: p.sku || `SKU-${p.id}`,
        images: p.images || [],
        sizes: p.sizes || [],
        colors: p.colors || [],
        color_images: p.colorImages || {},
        variant_stock: p.variantStock || [],
        size_guide: p.sizeGuide || null,
        description: p.description || '',
        tags: p.tags || [],
        is_featured: Boolean(p.isFeatured),
        is_published: p.isPublished !== false,
        date_added: p.dateAdded || new Date().toISOString().split('T')[0]
      };

      let { error } = await supabase.from('products').upsert(fullPayload);

      // Si falla por columnas adicionales faltantes, reintentar con las columnas estándar
      if (error && (error.code === '42703' || error.message.toLowerCase().includes('column'))) {
        console.warn('Supabase products: reintentando con esquema estándar sin columnas extendidas...');
        const standardPayload = {
          id: p.id,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory || 'General',
          price: Number(p.price) || 0,
          original_price: p.originalPrice ? Number(p.originalPrice) : null,
          is_offer: Boolean(p.isOffer),
          offer_price: p.offerPrice ? Number(p.offerPrice) : null,
          discount_percentage: Number(p.discountPercentage) || 0,
          stock: Number(p.stock) || 0,
          sku: p.sku || `SKU-${p.id}`,
          images: p.images || [],
          sizes: p.sizes || [],
          colors: p.colors || [],
          description: p.description || '',
          tags: p.tags || [],
          is_featured: Boolean(p.isFeatured),
          date_added: p.dateAdded || new Date().toISOString().split('T')[0]
        };
        const retryRes = await supabase.from('products').upsert(standardPayload);
        error = retryRes.error;
      }

      if (error) {
        console.warn('Supabase product upsert error:', error.message);
        if (error.code === '42501' || error.message.toLowerCase().includes('policy')) {
          showToast('⚠️ Supabase RLS: Ejecuta el script SQL en Supabase para permitir guardar productos');
        } else {
          showToast(`⚠️ Error al guardar producto en Supabase: ${error.message}`);
        }
      } else {
        console.log('✅ Producto guardado en Supabase:', p.name);
      }
    } catch (e: any) {
      console.warn('Supabase product upsert notice:', e);
    }
  };

  const deleteProductFromSupabase = async (id: string) => {
    try {
      const { error } = await supabase.from('products').delete().eq('id', id);
      if (error) console.warn('Supabase product delete error:', error.message);
    } catch (e) {
      console.warn('Supabase product delete notice:', e);
    }
  };

  // Seed All Data to Supabase (1-Click Sync)
  const seedAllDataToSupabase = async () => {
    const details: Record<string, { success: boolean; count?: number; error?: string }> = {};
    let hasError = false;

    // 1. Categories
    try {
      const catPayload = categories.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        icon_name: c.iconName || 'Tag',
        subcategories: c.subcategories || []
      }));
      let { error: catErr } = await supabase.from('categories').upsert(catPayload);
      if (catErr && (catErr.code === '42703' || catErr.message.toLowerCase().includes('column'))) {
        const baseCatPayload = categories.map(c => ({
          id: c.id,
          name: c.name,
          slug: c.slug,
          description: c.description || '',
          icon_name: c.iconName || 'Tag'
        }));
        const retryCat = await supabase.from('categories').upsert(baseCatPayload);
        catErr = retryCat.error;
      }
      if (catErr) {
        hasError = true;
        details['categories'] = { success: false, error: catErr.message };
      } else {
        details['categories'] = { success: true, count: catPayload.length };
      }
    } catch (e: any) {
      hasError = true;
      details['categories'] = { success: false, error: e.message || String(e) };
    }

    // 2. Products
    try {
      const prodPayload = products.map(p => ({
        id: p.id,
        name: p.name,
        product_type: p.productType || 'sencillo',
        category: p.category,
        subcategory: p.subcategory || 'General',
        price: Number(p.price) || 0,
        original_price: p.originalPrice ? Number(p.originalPrice) : null,
        is_offer: Boolean(p.isOffer),
        offer_price: p.offerPrice ? Number(p.offerPrice) : null,
        discount_percentage: Number(p.discountPercentage) || 0,
        stock: Number(p.stock) || 0,
        sku: p.sku || `SKU-${p.id}`,
        images: p.images || [],
        sizes: p.sizes || [],
        colors: p.colors || [],
        color_images: p.colorImages || {},
        variant_stock: p.variantStock || [],
        size_guide: p.sizeGuide || null,
        description: p.description || '',
        tags: p.tags || [],
        is_featured: Boolean(p.isFeatured),
        is_published: p.isPublished !== false,
        date_added: p.dateAdded || new Date().toISOString().split('T')[0]
      }));
      let { error: prodErr } = await supabase.from('products').upsert(prodPayload);
      if (prodErr && (prodErr.code === '42703' || prodErr.message.toLowerCase().includes('column'))) {
        const stdProdPayload = products.map(p => ({
          id: p.id,
          name: p.name,
          category: p.category,
          subcategory: p.subcategory || 'General',
          price: Number(p.price) || 0,
          original_price: p.originalPrice ? Number(p.originalPrice) : null,
          is_offer: Boolean(p.isOffer),
          offer_price: p.offerPrice ? Number(p.offerPrice) : null,
          discount_percentage: Number(p.discountPercentage) || 0,
          stock: Number(p.stock) || 0,
          sku: p.sku || `SKU-${p.id}`,
          images: p.images || [],
          sizes: p.sizes || [],
          colors: p.colors || [],
          description: p.description || '',
          tags: p.tags || [],
          is_featured: Boolean(p.isFeatured),
          date_added: p.dateAdded || new Date().toISOString().split('T')[0]
        }));
        const retryProd = await supabase.from('products').upsert(stdProdPayload);
        prodErr = retryProd.error;
      }
      if (prodErr) {
        hasError = true;
        details['products'] = { success: false, error: prodErr.message };
      } else {
        details['products'] = { success: true, count: prodPayload.length };
      }
    } catch (e: any) {
      hasError = true;
      details['products'] = { success: false, error: e.message || String(e) };
    }

    // 3. Orders
    try {
      if (orders.length > 0) {
        const orderPayload = orders.map(ord => ({
          id: ord.id,
          order_number: ord.orderNumber,
          customer_name: ord.customerName || '',
          customer_email: ord.customerEmail || '',
          customer_phone: ord.customerPhone || '',
          shipping_address: ord.shippingAddress || {},
          items: ord.items || [],
          subtotal: Number(ord.subtotal || 0),
          shipping_cost: Number(ord.shippingCost || 0),
          discount_amount: Number(ord.discountAmount || 0),
          total: Number(ord.total || 0),
          status: ord.status,
          payment_method: ord.paymentMethod || '',
          shipping_provider: ord.shippingProvider || '',
          tracking_number: ord.trackingNumber || '',
          created_at: ord.createdAt || new Date().toISOString(),
          estimated_delivery: ord.estimatedDelivery || '',
          status_history: ord.statusHistory || []
        }));
        const { error: ordErr } = await supabase.from('orders').upsert(orderPayload);
        if (ordErr) {
          hasError = true;
          details['orders'] = { success: false, error: ordErr.message };
        } else {
          details['orders'] = { success: true, count: orderPayload.length };
        }
      }
    } catch (e: any) {
      details['orders'] = { success: false, error: e.message || String(e) };
    }

    // 4. Customers
    try {
      if (customersList.length > 0) {
        const custPayload = customersList.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email,
          phone: c.phone || '',
          registered_at: c.registeredAt || new Date().toISOString().split('T')[0],
          total_orders: Number(c.totalOrders || 0),
          total_spent: Number(c.totalSpent || 0),
          favorite_store: c.favoriteStore || '',
          status: c.status || 'activo',
          addresses: c.addresses || [],
          wishlist_product_ids: c.wishlistProductIds || [],
          avatar_url: c.avatarUrl || ''
        }));
        const { error: custErr } = await supabase.from('customers').upsert(custPayload);
        if (custErr) {
          hasError = true;
          details['customers'] = { success: false, error: custErr.message };
        } else {
          details['customers'] = { success: true, count: custPayload.length };
        }
      }
    } catch (e: any) {
      details['customers'] = { success: false, error: e.message || String(e) };
    }

    // 5. Employees
    try {
      if (employees.length > 0) {
        const empPayload = employees.map(emp => ({
          id: emp.id,
          name: emp.name,
          email: emp.email,
          username: emp.username || emp.email.split('@')[0],
          password: emp.password || 'password123',
          role: emp.role,
          status: emp.status || 'activo',
          created_at: emp.createdAt || new Date().toISOString().split('T')[0],
          last_access: emp.lastAccess || 'Recientemente',
          avatar_url: emp.avatarUrl || '',
          permissions: emp.permissions || []
        }));
        const { error: empErr } = await supabase.from('employees').upsert(empPayload);
        if (empErr) {
          hasError = true;
          details['employees'] = { success: false, error: empErr.message };
        } else {
          details['employees'] = { success: true, count: empPayload.length };
        }
      }
    } catch (e: any) {
      details['employees'] = { success: false, error: e.message || String(e) };
    }

    // 6. Size Guide Templates
    try {
      if (sizeGuideTemplates.length > 0) {
        const tplPayload = sizeGuideTemplates.map(t => ({
          id: t.id,
          name: t.name,
          category: t.category || 'General',
          unit: t.unit || 'cm',
          columns: t.columns || [],
          rows: t.rows || [],
          image_url: t.imageUrl || '',
          instructions: t.instructions || '',
          is_default: Boolean(t.isDefault),
          created_at: t.createdAt || new Date().toISOString().split('T')[0]
        }));
        const { error: tplErr } = await supabase.from('size_guide_templates').upsert(tplPayload);
        if (tplErr) {
          hasError = true;
          details['size_guide_templates'] = { success: false, error: tplErr.message };
        } else {
          details['size_guide_templates'] = { success: true, count: tplPayload.length };
        }
      }
    } catch (e: any) {
      details['size_guide_templates'] = { success: false, error: e.message || String(e) };
    }

    // 7. Configs
    try {
      await syncShippingConfigToSupabase(shippingConfig);
      await syncStoreDesignToSupabase(storeDesign);
      await syncAdminProfileToSupabase(adminProfile);
      details['configs'] = { success: true, count: 3 };
    } catch (e: any) {
      details['configs'] = { success: false, error: e.message };
    }

    if (hasError) {
      return {
        success: false,
        message: 'Algunas tablas tuvieron error al subir. Revisa si las políticas RLS están bloqueando la escritura en Supabase.',
        details
      };
    }

    return {
      success: true,
      message: `¡Sincronización completada! ${products.length} productos, ${categories.length} categorías y ${sizeGuideTemplates.length} tablas de medidas subidas a Supabase.`,
      details
    };
  };

  useEffect(() => {
    try {
      localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
    } catch (e) {
      console.warn('Error saving orders to localStorage:', e);
    }
  }, [orders]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_CUSTOMER, JSON.stringify(customer));
    } catch (e) {
      console.warn('Error saving customer to localStorage:', e);
    }
  }, [customer]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_SHIPPING, JSON.stringify(shippingConfig));
    } catch (e) {
      console.warn('Error saving shipping config to localStorage:', e);
    }
  }, [shippingConfig]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_DESIGN, JSON.stringify(storeDesign));
    } catch (e) {
      console.warn('Error saving store design to localStorage:', e);
    }
  }, [storeDesign]);

  useEffect(() => {
    try {
      localStorage.setItem(LS_CART, JSON.stringify(cart));
    } catch (e) {
      console.warn('Error saving cart to localStorage:', e);
    }
  }, [cart]);

  // Customer Authentication & Registration
  const registerCustomer = async (data: {
    name: string;
    email: string;
    phone?: string;
    password?: string;
    address?: Omit<ShippingAddress, 'id'>;
  }): Promise<{ success: boolean; error?: string; customer?: Customer }> => {
    const cleanEmail = (data.email || '').trim().toLowerCase();
    const cleanName = (data.name || '').trim();

    if (!cleanEmail || !cleanName) {
      return { success: false, error: 'Por favor ingresa tu nombre completo y correo electrónico.' };
    }

    // Check if customer already exists in local list or Supabase
    let existing = customersList.find(c => c.email.toLowerCase() === cleanEmail);

    if (!existing) {
      try {
        const { data: dbCust } = await supabase.from('customers').select('*').eq('email', cleanEmail).maybeSingle();
        if (dbCust) {
          existing = {
            id: dbCust.id,
            name: dbCust.name,
            email: dbCust.email,
            phone: dbCust.phone || data.phone || '',
            avatarUrl: dbCust.avatar_url || '',
            favoriteStore: dbCust.favorite_store || 'Armario Virtual',
            wishlistProductIds: typeof dbCust.wishlist_product_ids === 'string' ? JSON.parse(dbCust.wishlist_product_ids) : (dbCust.wishlist_product_ids || []),
            registeredAt: dbCust.registered_at || new Date().toISOString().split('T')[0],
            status: dbCust.status || 'activo',
            totalOrders: Number(dbCust.total_orders || 0),
            totalSpent: Number(dbCust.total_spent || 0),
            addresses: typeof dbCust.addresses === 'string' ? JSON.parse(dbCust.addresses) : (dbCust.addresses || [])
          };
        }
      } catch (e) {}
    }

    if (existing) {
      setCustomer(existing);
      setIsCustomerLoggedIn(true);
      showToast(`👋 ¡Hola de nuevo, ${existing.name}! Sesión iniciada.`);
      return { success: true, customer: existing };
    }

    const newAddresses: ShippingAddress[] = data.address ? [{
      ...data.address,
      id: `addr-${Date.now()}`,
      recipientName: cleanName,
      isDefault: true
    }] : [];

    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: cleanName,
      email: cleanEmail,
      phone: data.phone || '',
      password: data.password || '',
      avatarUrl: '',
      favoriteStore: 'Armario Virtual',
      wishlistProductIds: [],
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'activo',
      totalOrders: 0,
      totalSpent: 0,
      addresses: newAddresses
    };

    setCustomer(newCust);
    setIsCustomerLoggedIn(true);
    setCustomersList(prev => [newCust, ...prev.filter(c => c.email.toLowerCase() !== cleanEmail)]);
    
    // Sync to Supabase
    await syncCustomerToSupabase(newCust);
    showToast(`🎉 ¡Cuenta creada con éxito! Bienvenido(a), ${newCust.name}`);
    return { success: true, customer: newCust };
  };

  const customerLogin = async (email?: string, password?: string): Promise<{ success: boolean; error?: string }> => {
    if (!email || !email.trim()) {
      return { success: false, error: 'Ingresa tu correo electrónico.' };
    }
    const cleanEmail = email.trim().toLowerCase();

    // 1. Search in local state
    let found = customersList.find(c => c.email.toLowerCase() === cleanEmail);

    // 2. Search in Supabase
    if (!found) {
      try {
        const { data: dbCust, error } = await supabase.from('customers').select('*').eq('email', cleanEmail).maybeSingle();
        if (!error && dbCust) {
          found = {
            id: dbCust.id,
            name: dbCust.name,
            email: dbCust.email,
            phone: dbCust.phone || '',
            avatarUrl: dbCust.avatar_url || '',
            favoriteStore: dbCust.favorite_store || 'Armario Virtual',
            wishlistProductIds: typeof dbCust.wishlist_product_ids === 'string' ? JSON.parse(dbCust.wishlist_product_ids) : (dbCust.wishlist_product_ids || []),
            registeredAt: dbCust.registered_at || new Date().toISOString().split('T')[0],
            status: dbCust.status || 'activo',
            totalOrders: Number(dbCust.total_orders || 0),
            totalSpent: Number(dbCust.total_spent || 0),
            addresses: typeof dbCust.addresses === 'string' ? JSON.parse(dbCust.addresses) : (dbCust.addresses || [])
          };
          setCustomersList(prev => [found!, ...prev]);
        }
      } catch (e) {
        console.warn('Error querying customer in Supabase:', e);
      }
    }

    if (found) {
      if (found.status === 'suspendido') {
        return { success: false, error: 'Esta cuenta se encuentra temporalmente suspendida. Contacta a soporte.' };
      }
      setCustomer(found);
      setIsCustomerLoggedIn(true);
      showToast(`🔑 ¡Hola de nuevo, ${found.name}!`);
      return { success: true };
    }

    // Auto-create customer account on the fly if not existing
    const generatedName = cleanEmail.split('@')[0].replace(/[._-]/g, ' ').toUpperCase();
    const newCust: Customer = {
      id: `cust-${Date.now()}`,
      name: generatedName,
      email: cleanEmail,
      phone: '',
      password: password || '',
      avatarUrl: '',
      favoriteStore: 'Armario Virtual',
      wishlistProductIds: [],
      registeredAt: new Date().toISOString().split('T')[0],
      status: 'activo',
      totalOrders: 0,
      totalSpent: 0,
      addresses: []
    };

    setCustomer(newCust);
    setIsCustomerLoggedIn(true);
    setCustomersList(prev => [newCust, ...prev]);
    await syncCustomerToSupabase(newCust);
    showToast(`✨ ¡Bienvenido(a) a Armario Virtual!`);
    return { success: true };
  };

  const customerLogout = () => {
    setIsCustomerLoggedIn(false);
    setCustomer(INITIAL_CUSTOMER);
    localStorage.removeItem(LS_CUSTOMER);
    localStorage.removeItem(LS_AUTH_CUSTOMER);
    showToast('Sesión de cliente cerrada');
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Cart operations
  const addToCart = (product: Product, size?: string, color?: string, qty: number = 1) => {
    const chosenSize = size || (product.sizes.length > 0 ? product.sizes[0] : 'Única');
    const chosenColor = color || (product.colors.length > 0 ? product.colors[0].name : 'Estándar');

    setCart(prev => {
      const existingIdx = prev.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === chosenSize &&
          item.selectedColor === chosenColor
      );

      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      } else {
        return [...prev, { product, quantity: qty, selectedSize: chosenSize, selectedColor: chosenColor }];
      }
    });

    showToast(`🛒 Agregado al carrito: ${product.name}`);
  };

  const updateCartQuantity = (index: number, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(index);
      return;
    }
    setCart(prev => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  const removeFromCart = (index: number) => {
    setCart(prev => prev.filter((_, i) => i !== index));
    showToast('Producto eliminado del carrito');
  };

  const clearCart = () => {
    setCart([]);
  };

  // Wishlist
  const toggleWishlist = (productId: string) => {
    setCustomer(prev => {
      const exists = prev.wishlistProductIds.includes(productId);
      const newWishlist = exists
        ? prev.wishlistProductIds.filter(id => id !== productId)
        : [...prev.wishlistProductIds, productId];

      if (!exists) {
        showToast('❤️ Agregado a tus favoritos');
      } else {
        showToast('Eliminado de tus favoritos');
      }

      return { ...prev, wishlistProductIds: newWishlist };
    });
  };

  const isWishlisted = (productId: string) => {
    return customer.wishlistProductIds.includes(productId);
  };

  // Checkout & Customer
  const placeOrder = (
    address: ShippingAddress,
    paymentMethod: string,
    carrierName: string,
    shippingCost: number
  ): Order => {
    const subtotal = cart.reduce((acc, item) => acc + getProductEffectivePrice(item.product) * item.quantity, 0);
    const orderNum = `SUB-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomTracking = `${carrierName.slice(0, 3).toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}-MX`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: orderNum,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      shippingAddress: address,
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        productImage: getProductColorImage(item.product, item.selectedColor),
        price: getProductEffectivePrice(item.product),
        quantity: item.quantity,
        size: item.selectedSize,
        color: item.selectedColor
      })),
      subtotal,
      shippingCost,
      discountAmount: 0,
      total: subtotal + shippingCost,
      status: 'pendiente',
      paymentMethod,
      shippingProvider: carrierName,
      trackingNumber: randomTracking,
      createdAt: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }),
      estimatedDelivery: '3 a 5 días hábiles',
      statusHistory: [
        {
          status: 'pendiente',
          timestamp: new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }),
          note: 'Pedido registrado correctamente en el sistema de Ropa en Línea'
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    syncOrderToSupabase(newOrder);

    // Update product stock and variant stock
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(c => c.product.id === p.id);
        if (cartItem) {
          let updatedProd: Product;
          if (p.variantStock && p.variantStock.length > 0) {
            const updatedVariants = p.variantStock.map(v => {
              const matchSize = !v.size || v.size === cartItem.selectedSize;
              const matchColor = !v.color || v.color === cartItem.selectedColor;
              if (matchSize && matchColor) {
                return { ...v, stock: Math.max(0, v.stock - cartItem.quantity) };
              }
              return v;
            });
            const newTotalStock = updatedVariants.reduce((sum, v) => sum + Number(v.stock || 0), 0);
            updatedProd = { ...p, stock: newTotalStock, variantStock: updatedVariants };
          } else {
            const updatedStock = Math.max(0, p.stock - cartItem.quantity);
            updatedProd = { ...p, stock: updatedStock };
          }
          syncProductToSupabase(updatedProd);
          return updatedProd;
        }
        return p;
      });
    });

    clearCart();
    setCartOpen(false);

    // Update customer stats & sync
    if (customer.email) {
      const updatedCust: Customer = {
        ...customer,
        totalOrders: (customer.totalOrders || 0) + 1,
        totalSpent: (customer.totalSpent || 0) + newOrder.total,
        addresses: customer.addresses.length === 0 ? [address] : customer.addresses
      };
      setCustomer(updatedCust);
      syncCustomerToSupabase(updatedCust);

      setCustomersList(prev =>
        prev.map(c => {
          if (c.email.toLowerCase() === customer.email.toLowerCase() || c.id === customer.id) {
            const upd: Customer = {
              ...c,
              totalOrders: (c.totalOrders || 0) + 1,
              totalSpent: (c.totalSpent || 0) + newOrder.total
            };
            syncCustomerToSupabase(upd);
            return upd;
          }
          return c;
        })
      );
    }

    showToast(`🎉 ¡Pedido #${orderNum} realizado con éxito!`);
    return newOrder;
  };

  const addCustomerAddress = (newAddr: Omit<ShippingAddress, 'id'>): ShippingAddress => {
    const fullAddress: ShippingAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setCustomer(prev => {
      const next = {
        ...prev,
        addresses: [...prev.addresses, fullAddress]
      };
      syncCustomerToSupabase(next);
      return next;
    });
    showToast('Dirección agregada a tu perfil');
    return fullAddress;
  };

  const updateCustomerProfile = (name: string, email: string, phone: string, favoriteStore: string) => {
    setCustomer(prev => {
      const next = {
        ...prev,
        name,
        email,
        phone,
        favoriteStore
      };
      syncCustomerToSupabase(next);
      return next;
    });
    showToast('Perfil actualizado correctamente');
  };

  // Admin Product Operations
  const addProduct = async (prodData: Omit<Product, 'id' | 'dateAdded'> | Product) => {
    const newProd: Product = {
      ...prodData,
      id: (prodData as any).id || `prod-${Date.now()}`,
      dateAdded: (prodData as any).dateAdded || new Date().toISOString().split('T')[0]
    };
    setProducts(prev => {
      const exists = prev.some(p => p.id === newProd.id);
      if (exists) {
        return prev.map(p => (p.id === newProd.id ? newProd : p));
      }
      return [newProd, ...prev];
    });
    await syncProductToSupabase(newProd);
    showToast(`✅ Producto "${newProd.name}" registrado en inventario y Supabase`);
  };

  const updateProduct = async (id: string, updated: Partial<Product>) => {
    let target: Product | undefined;
    setProducts(prev => {
      const nextProds = prev.map(p => {
        if (p.id === id) {
          target = { ...p, ...updated };
          return target;
        }
        return p;
      });
      return nextProds;
    });
    if (target) {
      await syncProductToSupabase(target);
    }
    showToast('Producto actualizado en catálogo y Supabase');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    deleteProductFromSupabase(id);
    showToast('Producto eliminado del catálogo');
  };

  const clearSampleProducts = async () => {
    const sampleIds = ['prod-1', 'prod-2', 'prod-3', 'prod-4', 'prod-5', 'prod-6', 'prod-7', 'prod-8'];
    setProducts(prev => {
      const remaining = prev.filter(p => !sampleIds.includes(p.id));
      try {
        localStorage.setItem(LS_PRODUCTS, JSON.stringify(remaining));
      } catch (e) {}
      return remaining;
    });

    try {
      await supabase.from('products').delete().in('id', sampleIds);
      console.log('🗑️ Productos muestra eliminados de Supabase');
    } catch (e) {
      console.warn('Error eliminando muestras en Supabase:', e);
    }
    showToast('🗑️ Productos de muestra eliminados de la tienda y Supabase');
  };

  const clearAllProducts = async () => {
    setProducts([]);
    setCart([]);
    try {
      localStorage.setItem(LS_PRODUCTS, JSON.stringify([]));
      localStorage.setItem(LS_CART, JSON.stringify([]));
    } catch (e) {}

    try {
      await supabase.from('products').delete().neq('id', '_dummy_none_');
      console.log('🗑️ Catálogo completo eliminado de Supabase');
    } catch (e) {
      console.warn('Error vaciando catálogo en Supabase:', e);
    }
    showToast('🗑️ Catálogo vaciado por completo (Tienda y Supabase)');
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, stock: newStock } : p));
      const target = next.find(p => p.id === id);
      if (target) syncProductToSupabase(target);
      return next;
    });
    showToast('Stock actualizado');
  };

  // Admin Order Operations
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev => {
      const next = prev.map(ord => {
        if (ord.id === orderId) {
          const timestamp = new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
          const newHistory = [
            ...ord.statusHistory,
            {
              status: newStatus,
              timestamp,
              note: note || `Estado actualizado a ${newStatus}`
            }
          ];
          const updatedOrd = {
            ...ord,
            status: newStatus,
            statusHistory: newHistory
          };
          syncOrderToSupabase(updatedOrd);
          return updatedOrd;
        }
        return ord;
      });
      return next;
    });
    showToast(`Pedido #${orderId} modificado a ${newStatus.toUpperCase()}`);
  };

  const assignOrderTracking = (orderId: string, provider: string, trackingNum: string) => {
    setOrders(prev => {
      const next = prev.map(ord => {
        if (ord.id === orderId) {
          const updatedOrd: Order = {
            ...ord,
            shippingProvider: provider,
            trackingNumber: trackingNum,
            status: ord.status === 'pendiente' ? 'enviado' : ord.status
          };
          syncOrderToSupabase(updatedOrd);
          return updatedOrd;
        }
        return ord;
      });
      return next;
    });
    showToast('Guía de rastreo asignada al pedido');
  };

  // Admin Shipping Operations
  const updateShippingConfig = (config: Partial<ShippingConfig>) => {
    setShippingConfig(prev => {
      const next = { ...prev, ...config };
      syncShippingConfigToSupabase(next);
      return next;
    });
    showToast('Configuración de envíos guardada');
  };

  const toggleCarrierActive = (carrierId: string) => {
    setShippingConfig(prev => {
      const next = {
        ...prev,
        carriers: prev.carriers.map(c => (c.id === carrierId ? { ...c, active: !c.active } : c))
      };
      syncShippingConfigToSupabase(next);
      return next;
    });
    showToast('Estado del proveedor de envío modificado');
  };

  // Admin Design Operations
  const updateStoreDesign = (design: Partial<StoreDesignConfig>) => {
    setStoreDesign(prev => {
      const next = { ...prev, ...design };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('🎨 Diseño de tienda actualizado en tiempo real');
  };

  const addHeroSlider = (slider: Omit<StoreDesignConfig['heroSliders'][0], 'id'>) => {
    const newSlide = { ...slider, id: `slide-${Date.now()}` };
    setStoreDesign(prev => {
      const next = {
        ...prev,
        heroSliders: [...prev.heroSliders, newSlide]
      };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('Nuevo banner slider publicado en portada');
  };

  const updateHeroSlider = (id: string, slider: Partial<StoreDesignConfig['heroSliders'][0]>) => {
    setStoreDesign(prev => {
      const next = {
        ...prev,
        heroSliders: prev.heroSliders.map(s => (s.id === id ? { ...s, ...slider } : s))
      };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('Banner slider actualizado');
  };

  const deleteHeroSlider = (id: string) => {
    setStoreDesign(prev => {
      const next = {
        ...prev,
        heroSliders: prev.heroSliders.filter(s => s.id !== id)
      };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('Banner eliminado');
  };

  const addPromoFlyer = (flyer: Omit<StoreDesignConfig['promotionalFlyers'][0], 'id'>) => {
    const newFlyer = { ...flyer, id: `flyer-${Date.now()}` };
    setStoreDesign(prev => {
      const next = {
        ...prev,
        promotionalFlyers: [...prev.promotionalFlyers, newFlyer]
      };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('Nuevo flyer promocional agregado a portada');
  };

  const updatePromoFlyer = (id: string, flyer: Partial<StoreDesignConfig['promotionalFlyers'][0]>) => {
    setStoreDesign(prev => {
      const next = {
        ...prev,
        promotionalFlyers: prev.promotionalFlyers.map(f => (f.id === id ? { ...f, ...flyer } : f))
      };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('Flyer actualizado');
  };

  const deletePromoFlyer = (id: string) => {
    setStoreDesign(prev => {
      const next = {
        ...prev,
        promotionalFlyers: prev.promotionalFlyers.filter(f => f.id !== id)
      };
      syncStoreDesignToSupabase(next);
      return next;
    });
    showToast('Flyer eliminado');
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomer(INITIAL_CUSTOMER);
    setShippingConfig(INITIAL_SHIPPING_CONFIG);
    setStoreDesign(INITIAL_STORE_DESIGN);
    setCategories(INITIAL_CATEGORIES);
    setSizeGuideTemplates(INITIAL_SIZE_GUIDE_TEMPLATES);
    setAdminProfile(INITIAL_ADMIN_PROFILE);
    setEmployees(INITIAL_EMPLOYEES);
    setCustomersList(INITIAL_CUSTOMERS_LIST);
    setCart([]);
    localStorage.clear();
    showToast('🔄 Datos reestablecidos a valores originales');
  };

  return (
    <StoreContext.Provider
      value={{
        activeRole,
        setActiveRole,
        sidebarOpen,
        setSidebarOpen,
        adminTab,
        setAdminTab,
        customerTab,
        setCustomerTab,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        searchQuery,
        setSearchQuery,
        isCustomerLoggedIn,
        isAdminLoggedIn,
        customerLogin,
        registerCustomer,
        customerLogout,
        adminLogin,
        adminLogout,
        adminProfile,
        updateAdminProfile,
        sizeGuideTemplates,
        addSizeGuideTemplate,
        updateSizeGuideTemplate,
        deleteSizeGuideTemplate,
        duplicateSizeGuideTemplate,
        restoreDefaultSizeGuideTemplates,
        categories,
        addCategory,
        updateCategory,
        deleteCategory,
        addSubcategory,
        deleteSubcategory,
        employees,
        addEmployee,
        updateEmployee,
        toggleEmployeeStatus,
        deleteEmployee,
        customersList,
        addCustomerAccount,
        toggleCustomerStatus,
        deleteCustomerAccount,
        products,
        orders,
        customer,
        shippingConfig,
        storeDesign,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
        isWishlisted,
        placeOrder,
        addCustomerAddress,
        updateCustomerProfile,
        addProduct,
        updateProduct,
        deleteProduct,
        clearSampleProducts,
        clearAllProducts,
        updateStock,
        updateOrderStatus,
        assignOrderTracking,
        updateShippingConfig,
        toggleCarrierActive,
        updateStoreDesign,
        addHeroSlider,
        updateHeroSlider,
        deleteHeroSlider,
        addPromoFlyer,
        updatePromoFlyer,
        deletePromoFlyer,
        toastMessage,
        showToast,
        seedAllDataToSupabase,
        reloadFromSupabase,
        resetToDefaultData
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

