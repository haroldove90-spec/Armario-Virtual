import React, { createContext, useContext, useState, useEffect } from 'react';
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
  AdminProfile
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
  INITIAL_CUSTOMERS_LIST
} from '../data/initialData';
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
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Authentication & Access
  isCustomerLoggedIn: boolean;
  isAdminLoggedIn: boolean;
  customerLogin: (email?: string, password?: string) => boolean;
  customerLogout: () => void;
  adminLogin: (email?: string, password?: string) => boolean;
  adminLogout: () => void;

  // Admin Profile
  adminProfile: AdminProfile;
  updateAdminProfile: (profile: Partial<AdminProfile>) => void;

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
  addCustomerAddress: (address: Omit<ShippingAddress, 'id'>) => void;
  updateCustomerProfile: (name: string, email: string, phone: string, favoriteStore: string) => void;

  // Admin Product Operations
  addProduct: (product: Omit<Product, 'id' | 'dateAdded'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
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

  const [selectedCategory, setSelectedCategory] = useState<Category | 'todas'>('todas');
  const [searchQuery, setSearchQuery] = useState<string>('');

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

  const customerLogin = (email?: string, password?: string): boolean => {
    setIsCustomerLoggedIn(true);
    showToast('🔑 Sesión de Cliente iniciada correctamente');
    return true;
  };

  const customerLogout = () => {
    setIsCustomerLoggedIn(false);
    showToast('Sesión de cliente cerrada');
  };

  const adminLogin = (email?: string, password?: string): boolean => {
    setIsAdminLoggedIn(true);
    showToast('🛡️ Sesión de Administrador iniciada correctamente');
    return true;
  };

  const adminLogout = () => {
    setIsAdminLoggedIn(false);
    showToast('Sesión de administrador cerrada');
  };

  // Categories State
  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem(LS_CATEGORIES);
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(LS_CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  // Load categories from Supabase if table exists
  useEffect(() => {
    async function loadCategoriesFromSupabase() {
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
        console.log('Supabase categories read skipped, using local data');
      }
    }
    loadCategoriesFromSupabase();
  }, []);

  const syncCategoryToSupabase = async (cat: CategoryItem) => {
    try {
      await supabase.from('categories').upsert({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon_name: cat.iconName || 'Tag',
        subcategories: cat.subcategories
      });
    } catch (e) {
      console.log('Supabase category upsert error:', e);
    }
  };

  const deleteCategoryFromSupabase = async (id: string) => {
    try {
      await supabase.from('categories').delete().eq('id', id);
    } catch (e) {
      console.log('Supabase category delete error:', e);
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

  // Admin Profile State
  const [adminProfile, setAdminProfile] = useState<AdminProfile>(() => {
    const saved = localStorage.getItem(LS_ADMIN_PROFILE);
    return saved ? JSON.parse(saved) : INITIAL_ADMIN_PROFILE;
  });

  useEffect(() => {
    localStorage.setItem(LS_ADMIN_PROFILE, JSON.stringify(adminProfile));
  }, [adminProfile]);

  const updateAdminProfile = (data: Partial<AdminProfile>) => {
    setAdminProfile(prev => ({ ...prev, ...data }));
    showToast('👤 Perfil de administrador actualizado');
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
    showToast(`👨‍💼 Empleado "${newEmp.name}" registrado`);
  };

  const updateEmployee = (id: string, data: Partial<Employee>) => {
    setEmployees(prev => prev.map(e => (e.id === id ? { ...e, ...data } : e)));
    showToast('Empleado actualizado');
  };

  const toggleEmployeeStatus = (id: string) => {
    setEmployees(prev =>
      prev.map(e => {
        if (e.id === id) {
          const nextStatus = e.status === 'activo' ? 'suspendido' : 'activo';
          showToast(
            nextStatus === 'suspendido'
              ? `🚫 Acceso suspendido para ${e.name}`
              : `✅ Acceso activado para ${e.name}`
          );
          return { ...e, status: nextStatus };
        }
        return e;
      })
    );
  };

  const deleteEmployee = (id: string) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
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
    showToast(`👤 Cliente "${newCust.name}" registrado`);
  };

  const toggleCustomerStatus = (id: string) => {
    setCustomersList(prev =>
      prev.map(c => {
        if (c.id === id) {
          const nextStatus = (c.status || 'activo') === 'activo' ? 'suspendido' : 'activo';
          showToast(
            nextStatus === 'suspendido'
              ? `🚫 Cuenta suspendida para ${c.name}`
              : `✅ Cuenta activada para ${c.name}`
          );
          return { ...c, status: nextStatus };
        }
        return c;
      })
    );
  };

  const deleteCustomerAccount = (id: string) => {
    setCustomersList(prev => prev.filter(c => c.id !== id));
    showToast('Usuario cliente eliminado');
  };

  // Main state with localStorage lazy init
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem(LS_PRODUCTS);
    if (saved && !saved.includes('unsplash.com')) {
      return JSON.parse(saved);
    }
    return INITIAL_PRODUCTS;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem(LS_ORDERS);
    return saved ? JSON.parse(saved) : INITIAL_ORDERS;
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

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(LS_PRODUCTS, JSON.stringify(products));
  }, [products]);

  // Load products from Supabase if table exists
  useEffect(() => {
    async function loadFromSupabase() {
      try {
        const { data: dbProducts, error } = await supabase.from('products').select('*');
        if (!error && dbProducts && dbProducts.length > 0) {
          const mapped: Product[] = dbProducts.map(p => ({
            id: p.id,
            name: p.name,
            productType: p.product_type || 'variable',
            category: p.category,
            subcategory: p.subcategory,
            price: Number(p.price),
            originalPrice: p.original_price ? Number(p.original_price) : undefined,
            discountPercentage: p.discount_percentage,
            stock: p.stock,
            sku: p.sku,
            images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images || [],
            sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes || [],
            colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : p.colors || [],
            variantStock: typeof p.variant_stock === 'string' ? JSON.parse(p.variant_stock) : (Array.isArray(p.variant_stock) ? p.variant_stock : []),
            description: p.description || '',
            tags: typeof p.tags === 'string' ? JSON.parse(p.tags) : p.tags || [],
            isFeatured: p.is_featured,
            dateAdded: p.date_added
          }));
          setProducts(mapped);
        }
      } catch (e) {
        console.log('Supabase read skipped, using local data');
      }
    }
    loadFromSupabase();
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_ORDERS, JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem(LS_CUSTOMER, JSON.stringify(customer));
  }, [customer]);

  useEffect(() => {
    localStorage.setItem(LS_SHIPPING, JSON.stringify(shippingConfig));
  }, [shippingConfig]);

  useEffect(() => {
    localStorage.setItem(LS_DESIGN, JSON.stringify(storeDesign));
  }, [storeDesign]);

  useEffect(() => {
    localStorage.setItem(LS_CART, JSON.stringify(cart));
  }, [cart]);

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
    const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
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
        productImage: item.product.images[0] || 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
        price: item.product.price,
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

    // Update product stock and variant stock
    setProducts(prevProducts => {
      return prevProducts.map(p => {
        const cartItem = cart.find(c => c.product.id === p.id);
        if (cartItem) {
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
            return { ...p, stock: newTotalStock, variantStock: updatedVariants };
          } else {
            const updatedStock = Math.max(0, p.stock - cartItem.quantity);
            return { ...p, stock: updatedStock };
          }
        }
        return p;
      });
    });

    clearCart();
    setCartOpen(false);
    showToast(`🎉 ¡Pedido #${orderNum} realizado con éxito!`);
    return newOrder;
  };

  const addCustomerAddress = (newAddr: Omit<ShippingAddress, 'id'>) => {
    const fullAddress: ShippingAddress = {
      ...newAddr,
      id: `addr-${Date.now()}`
    };
    setCustomer(prev => ({
      ...prev,
      addresses: [...prev.addresses, fullAddress]
    }));
    showToast('Dirección agregada a tu perfil');
  };

  const updateCustomerProfile = (name: string, email: string, phone: string, favoriteStore: string) => {
    setCustomer(prev => ({
      ...prev,
      name,
      email,
      phone,
      favoriteStore
    }));
    showToast('Perfil actualizado correctamente');
  };

  // Admin Product Operations
  const addProduct = (prodData: Omit<Product, 'id' | 'dateAdded'>) => {
    const newProd: Product = {
      ...prodData,
      id: `prod-${Date.now()}`,
      dateAdded: new Date().toISOString().split('T')[0]
    };
    setProducts(prev => [newProd, ...prev]);
    showToast(`✅ Producto "${newProd.name}" registrado en inventario`);
  };

  const updateProduct = (id: string, updated: Partial<Product>) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, ...updated } : p)));
    showToast('Producto actualizado en catálogo');
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
    showToast('Producto eliminado del catálogo');
  };

  const updateStock = (id: string, newStock: number) => {
    setProducts(prev => prev.map(p => (p.id === id ? { ...p, stock: newStock } : p)));
    showToast('Stock actualizado');
  };

  // Admin Order Operations
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus, note?: string) => {
    setOrders(prev =>
      prev.map(ord => {
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
          return {
            ...ord,
            status: newStatus,
            statusHistory: newHistory
          };
        }
        return ord;
      })
    );
    showToast(`Pedido #${orderId} modificado a ${newStatus.toUpperCase()}`);
  };

  const assignOrderTracking = (orderId: string, provider: string, trackingNum: string) => {
    setOrders(prev =>
      prev.map(ord => {
        if (ord.id === orderId) {
          return {
            ...ord,
            shippingProvider: provider,
            trackingNumber: trackingNum,
            status: ord.status === 'pendiente' ? 'enviado' : ord.status
          };
        }
        return ord;
      })
    );
    showToast('Guía de rastreo asignada al pedido');
  };

  // Admin Shipping Operations
  const updateShippingConfig = (config: Partial<ShippingConfig>) => {
    setShippingConfig(prev => ({ ...prev, ...config }));
    showToast('Configuración de envíos guardada');
  };

  const toggleCarrierActive = (carrierId: string) => {
    setShippingConfig(prev => ({
      ...prev,
      carriers: prev.carriers.map(c => (c.id === carrierId ? { ...c, active: !c.active } : c))
    }));
    showToast('Estado del proveedor de envío modificado');
  };

  // Admin Design Operations
  const updateStoreDesign = (design: Partial<StoreDesignConfig>) => {
    setStoreDesign(prev => ({ ...prev, ...design }));
    showToast('🎨 Diseño de tienda actualizado en tiempo real');
  };

  const addHeroSlider = (slider: Omit<StoreDesignConfig['heroSliders'][0], 'id'>) => {
    const newSlide = { ...slider, id: `slide-${Date.now()}` };
    setStoreDesign(prev => ({
      ...prev,
      heroSliders: [...prev.heroSliders, newSlide]
    }));
    showToast('Nuevo banner slider publicado en portada');
  };

  const updateHeroSlider = (id: string, slider: Partial<StoreDesignConfig['heroSliders'][0]>) => {
    setStoreDesign(prev => ({
      ...prev,
      heroSliders: prev.heroSliders.map(s => (s.id === id ? { ...s, ...slider } : s))
    }));
    showToast('Banner slider actualizado');
  };

  const deleteHeroSlider = (id: string) => {
    setStoreDesign(prev => ({
      ...prev,
      heroSliders: prev.heroSliders.filter(s => s.id !== id)
    }));
    showToast('Banner eliminado');
  };

  const addPromoFlyer = (flyer: Omit<StoreDesignConfig['promotionalFlyers'][0], 'id'>) => {
    const newFlyer = { ...flyer, id: `flyer-${Date.now()}` };
    setStoreDesign(prev => ({
      ...prev,
      promotionalFlyers: [...prev.promotionalFlyers, newFlyer]
    }));
    showToast('Nuevo flyer promocional agregado a portada');
  };

  const updatePromoFlyer = (id: string, flyer: Partial<StoreDesignConfig['promotionalFlyers'][0]>) => {
    setStoreDesign(prev => ({
      ...prev,
      promotionalFlyers: prev.promotionalFlyers.map(f => (f.id === id ? { ...f, ...flyer } : f))
    }));
    showToast('Flyer actualizado');
  };

  const deletePromoFlyer = (id: string) => {
    setStoreDesign(prev => ({
      ...prev,
      promotionalFlyers: prev.promotionalFlyers.filter(f => f.id !== id)
    }));
    showToast('Flyer eliminado');
  };

  const resetToDefaultData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    setCustomer(INITIAL_CUSTOMER);
    setShippingConfig(INITIAL_SHIPPING_CONFIG);
    setStoreDesign(INITIAL_STORE_DESIGN);
    setCategories(INITIAL_CATEGORIES);
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
        searchQuery,
        setSearchQuery,
        isCustomerLoggedIn,
        isAdminLoggedIn,
        customerLogin,
        customerLogout,
        adminLogin,
        adminLogout,
        adminProfile,
        updateAdminProfile,
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

