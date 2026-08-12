import { Product, Order, Customer, ShippingConfig, StoreDesignConfig, CategoryItem, Employee, AdminProfile } from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-mujer',
    name: 'Mujer',
    slug: 'mujer',
    iconName: 'User',
    description: 'Ropa, blusas, vestidos, abrigos y calzado femenino.',
    active: true,
    subcategories: [
      { id: 'sub-m-1', name: 'Abrigos y Chamarras', slug: 'Abrigos y Chamarras', active: true },
      { id: 'sub-m-2', name: 'Vestidos y Faldas', slug: 'Vestidos', active: true },
      { id: 'sub-m-3', name: 'Blusas y Tops', slug: 'Blusas', active: true },
      { id: 'sub-m-4', name: 'Accesorios y Bolsos', slug: 'Accesorios y Bolsos', active: true }
    ]
  },
  {
    id: 'cat-hombre',
    name: 'Hombre',
    slug: 'hombre',
    iconName: 'UserCheck',
    description: 'Moda masculina, jeans, camisetas, camisas y trajes.',
    active: true,
    subcategories: [
      { id: 'sub-h-1', name: 'Pantalones y Jeans', slug: 'Pantalones y Jeans', active: true },
      { id: 'sub-h-2', name: 'Sacos y Trajes', slug: 'Sacos y Trajes', active: true },
      { id: 'sub-h-3', name: 'Playera y Polos', slug: 'Playeras', active: true },
      { id: 'sub-h-4', name: 'Sudadera y Chamarras', slug: 'Chamarras', active: true }
    ]
  },
  {
    id: 'cat-ninos',
    name: 'Niños & Bebés',
    slug: 'ninos',
    iconName: 'Smile',
    description: 'Ropa infantil cómoda, alegre e ideal para la escuela y juegos.',
    active: true,
    subcategories: [
      { id: 'sub-n-1', name: 'Moda Infantil', slug: 'Moda Infantil', active: true },
      { id: 'sub-n-2', name: 'Calzado Infantil', slug: 'Calzado Niños', active: true },
      { id: 'sub-n-3', name: 'Pijamas y Ropa Interior', slug: 'Pijamas', active: true }
    ]
  },
  {
    id: 'cat-calzado',
    name: 'Calzado',
    slug: 'calzado',
    iconName: 'Footprints',
    description: 'Tenis urbanos, botas, zapatos formales y sandalias.',
    active: true,
    subcategories: [
      { id: 'sub-z-1', name: 'Tenis Casuales', slug: 'Tenis Casuales', active: true },
      { id: 'sub-z-2', name: 'Zapatos de Vestir', slug: 'Zapatos Vestir', active: true },
      { id: 'sub-z-3', name: 'Botas y Botines', slug: 'Botas', active: true }
    ]
  },
  {
    id: 'cat-belleza',
    name: 'Belleza & Cuidado',
    slug: 'belleza',
    iconName: 'Sparkles',
    description: 'Cosméticos, cosmética facial, perfumes y cuidado personal.',
    active: true,
    subcategories: [
      { id: 'sub-b-1', name: 'Cuidado Facial', slug: 'Cuidado Facial', active: true },
      { id: 'sub-b-2', name: 'Perfumería', slug: 'Perfumería', active: true },
      { id: 'sub-b-3', name: 'Maquillaje', slug: 'Maquillaje', active: true }
    ]
  },
  {
    id: 'cat-hogar',
    name: 'Hogar & Decoración',
    slug: 'hogar',
    iconName: 'Home',
    description: 'Blancos, edredones, sábanas, toallas y accesorios.',
    active: true,
    subcategories: [
      { id: 'sub-hg-1', name: 'Blancos y Cama', slug: 'Blancos y Cama', active: true },
      { id: 'sub-hg-2', name: 'Baño y Cortinas', slug: 'Baño', active: true },
      { id: 'sub-hg-3', name: 'Decoración y Cortinas', slug: 'Decoración', active: true }
    ]
  },
  {
    id: 'cat-ofertas',
    name: 'Gran Barata & Ofertas',
    slug: 'ofertas',
    iconName: 'Tag',
    description: 'Descuentos directo de liquidación y ofertas imperdibles.',
    active: true,
    subcategories: [
      { id: 'sub-o-1', name: 'Liquidación Total', slug: 'Liquidación', active: true },
      { id: 'sub-o-2', name: 'Últimas Tallas', slug: 'Últimas Tallas', active: true }
    ]
  }
];

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
  name: 'Adrian Mancilla Morga',
  email: 'softwareai569@gmail.com',
  phone: '55 9876 5432',
  roleTitle: 'Director General & Administrador Principal',
  storeName: 'Armario Virtual / Ropa en Línea',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  createdAt: '2026-01-15'
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-101',
    name: 'Roberto Gómez Bolaños',
    email: 'roberto.gomez@armariovirtual.com',
    username: 'roberto.gomez',
    password: 'password123',
    role: 'Gerente de Tienda & Almacén',
    status: 'activo',
    permissions: ['metricas', 'productos', 'categorias', 'ventas', 'envio'],
    createdAt: '2026-02-10',
    lastAccess: 'Hace 10 minutos',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80'
  },
  {
    id: 'emp-102',
    name: 'Sofía Castro Morales',
    email: 'sofia.castro@armariovirtual.com',
    username: 'sofia.castro',
    password: 'password123',
    role: 'Encargada de Inventario y Categorías',
    status: 'activo',
    permissions: ['productos', 'categorias'],
    createdAt: '2026-03-01',
    lastAccess: 'Ayer, 18:30',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80'
  },
  {
    id: 'emp-103',
    name: 'Javier Hernández Balcázar',
    email: 'javier.hernandez@armariovirtual.com',
    username: 'javier.h',
    password: 'password123',
    role: 'Soporte, Pedidos y Guías de Envío',
    status: 'suspendido',
    permissions: ['ventas', 'envio'],
    createdAt: '2026-04-12',
    lastAccess: 'Hace 5 días',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'
  }
];

export const INITIAL_CUSTOMERS_LIST: Customer[] = [
  {
    id: 'cust-101',
    name: 'María Fernanda López',
    email: 'maria.lopez@example.com',
    phone: '55 4321 9876',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    favoriteStore: 'Sucursal Perisur CDMX',
    wishlistProductIds: ['prod-1', 'prod-7'],
    registeredAt: '2026-03-14',
    status: 'activo',
    totalOrders: 3,
    totalSpent: 2450.00,
    addresses: [
      {
        id: 'addr-1',
        recipientName: 'María Fernanda López',
        street: 'Av. Insurgentes Sur',
        exteriorNumber: '2453',
        interiorNumber: 'Depto 402',
        neighborhood: 'Tlalpan Centro',
        city: 'Ciudad de México',
        state: 'CDMX',
        postalCode: '14000',
        phone: '55 4321 9876',
        isDefault: true
      }
    ]
  },
  {
    id: 'cust-102',
    name: 'Carlos Eduardo Ramírez',
    email: 'carlos.ramirez@example.com',
    phone: '55 1122 3344',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    favoriteStore: 'Polanco CDMX',
    wishlistProductIds: ['prod-3'],
    registeredAt: '2026-05-20',
    status: 'activo',
    totalOrders: 2,
    totalSpent: 1596.00,
    addresses: [
      {
        id: 'addr-carlos',
        recipientName: 'Carlos Eduardo Ramírez',
        street: 'Calle Benito Juárez',
        exteriorNumber: '88',
        neighborhood: 'Polanco',
        city: 'Miguel Hidalgo',
        state: 'CDMX',
        postalCode: '11560',
        phone: '55 1122 3344'
      }
    ]
  },
  {
    id: 'cust-103',
    name: 'Ana Sofía Mendoza',
    email: 'ana.mendoza@example.com',
    phone: '81 9988 7766',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    favoriteStore: 'Monterrey Valle',
    wishlistProductIds: ['prod-5'],
    registeredAt: '2026-06-10',
    status: 'activo',
    totalOrders: 1,
    totalSpent: 549.00,
    addresses: [
      {
        id: 'addr-ana',
        recipientName: 'Ana Sofía Mendoza',
        street: 'Av. Constitución',
        exteriorNumber: '400',
        neighborhood: 'Centro',
        city: 'Monterrey',
        state: 'Nuevo León',
        postalCode: '64000',
        phone: '81 9988 7766'
      }
    ]
  },
  {
    id: 'cust-104',
    name: 'Jorge Luis Morales',
    email: 'jorge.morales@example.com',
    phone: '33 1234 5678',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&q=80',
    favoriteStore: 'Guadalajara Andares',
    wishlistProductIds: [],
    registeredAt: '2026-07-01',
    status: 'inactivo',
    totalOrders: 0,
    totalSpent: 0,
    addresses: []
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Chamarra Capitonada con Gorro Acolchada',
    category: 'mujer',
    subcategory: 'Abrigos y Chamarras',
    price: 699,
    originalPrice: 1199,
    discountPercentage: 41,
    stock: 24,
    sku: 'REL-M-9021',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['CH', 'M', 'G', 'XG'],
    colors: [
      { name: 'Morado Elegante', hex: '#632488', imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg' },
      { name: 'Negro Azabache', hex: '#1a1a1a', imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80' },
      { name: 'Palo de Rosa', hex: '#e8b4b8', imageUrl: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80' }
    ],
    colorImages: {
      'Morado Elegante': 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg',
      'Negro Azabache': 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
      'Palo de Rosa': 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&q=80'
    },
    description: 'Chamarra capitonada acolchada de cuello alto con gorro desmontable y bolsas laterales con cierre. Ideal para protegerte del frío con estilo moderno y confort supremo.',
    tags: ['Gran Barata', 'Otoño e Invierno', 'Exclusivo en Línea'],
    isFeatured: true,
    dateAdded: '2026-07-01'
  },
  {
    id: 'prod-2',
    name: 'Vestido Casual Manga Larga Estampado Floral',
    category: 'mujer',
    subcategory: 'Vestidos',
    price: 499,
    originalPrice: 799,
    discountPercentage: 37,
    stock: 18,
    sku: 'SUB-M-8820',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['CH', 'M', 'G'],
    colors: [
      { name: 'Floral Azul', hex: '#1e3d59' },
      { name: 'Vino', hex: '#581845' }
    ],
    description: 'Elegante vestido corte A con manga larga suave y escote sutil. Perfecto para eventos casuales y de oficina. Tejido elástico y fresco.',
    tags: ['Moda Mujer', 'Tendencia', 'Novedad'],
    isFeatured: true,
    dateAdded: '2026-07-10'
  },
  {
    id: 'prod-3',
    name: 'Jeans Corte Slim Fit Mezclilla Stretch',
    category: 'hombre',
    subcategory: 'Pantalones y Jeans',
    price: 399,
    originalPrice: 649,
    discountPercentage: 38,
    stock: 35,
    sku: 'SUB-H-4410',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Azul Índigo', hex: '#203a43' },
      { name: 'Azul Claro Deslavado', hex: '#637373' },
      { name: 'Negro', hex: '#000000' }
    ],
    description: 'Pantalón de mezclilla corte slim stretch para hombre. Confeccionado con algodón suave de alta durabilidad y libertad de movimiento.',
    tags: ['Básicos Hombre', 'Gran Barata'],
    isFeatured: true,
    dateAdded: '2026-07-12'
  },
  {
    id: 'prod-4',
    name: 'Saco Formal de Vestir Corte Moderno',
    category: 'hombre',
    subcategory: 'Sacos y Trajes',
    price: 1199,
    originalPrice: 1899,
    discountPercentage: 36,
    stock: 12,
    sku: 'SUB-H-1022',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['38R', '40R', '42R'],
    colors: [
      { name: 'Azul Marino', hex: '#0a192f' },
      { name: 'Gris Oxford', hex: '#333333' }
    ],
    description: 'Saco vestir para caballero de estructura semi-armada. Incluye bolsas frontales con solapa e interior completamente forrado.',
    tags: ['Elegante', 'Moda Caballero'],
    isFeatured: false,
    dateAdded: '2026-06-25'
  },
  {
    id: 'prod-5',
    name: 'Tenis Urbanos Casuales Suela Ancha',
    category: 'calzado',
    subcategory: 'Tenis Casuales',
    price: 549,
    originalPrice: 899,
    discountPercentage: 38,
    stock: 40,
    sku: 'SUB-Z-5501',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['25 MX', '26 MX', '27 MX', '28 MX', '29 MX'],
    colors: [
      { name: 'Blanco Puro', hex: '#ffffff' },
      { name: 'Negro con Blanco', hex: '#111111' }
    ],
    description: 'Tenis estilo streetwear de suela antiderrapante de goma, ajuste por agujetas y plantilla confort acolchada para uso diario prolongado.',
    tags: ['Calzado', 'Envío Gratis', 'Top Ventas'],
    isFeatured: true,
    dateAdded: '2026-07-15'
  },
  {
    id: 'prod-6',
    name: 'Conjunto Infantil Deportivo Sudadera y Pants',
    category: 'ninos',
    subcategory: 'Moda Infantil',
    price: 349,
    originalPrice: 599,
    discountPercentage: 41,
    stock: 30,
    sku: 'SUB-N-3011',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['4 Años', '6 Años', '8 Años', '10 Años'],
    colors: [
      { name: 'Azul Rey', hex: '#0055ff' },
      { name: 'Amarillo Mostaza', hex: '#e6a100' }
    ],
    description: 'Conjunto deportivo de felpa súper suave para niñas y niños. Sudadera con gorro y pants con resorte ajustable en la cintura.',
    tags: ['Infantil', 'Gran Barata'],
    isFeatured: false,
    dateAdded: '2026-07-02'
  },
  {
    id: 'prod-7',
    name: 'Bolso de Mano Crossbody con Cadena Dorada',
    category: 'mujer',
    subcategory: 'Accesorios y Bolsos',
    price: 389,
    originalPrice: 699,
    discountPercentage: 44,
    stock: 15,
    sku: 'REL-ACC-091',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['Unitalla'],
    colors: [
      { name: 'Beige Neutro', hex: '#f5f5dc' },
      { name: 'Vino Tinto', hex: '#6b112d' }
    ],
    description: 'Bolso versátil estilo crossbody de piel sintética textura saffiano. Compartimentos organizadores internos y asa metálica dorada brillante.',
    tags: ['Accesorios', 'Exclusivo en Línea'],
    isFeatured: true,
    dateAdded: '2026-07-05'
  },
  {
    id: 'prod-8',
    name: 'Juego de Sábanas Microfibra Ultra Suave Matrimonial',
    category: 'hogar',
    subcategory: 'Blancos y Cama',
    price: 299,
    originalPrice: 499,
    discountPercentage: 40,
    stock: 50,
    sku: 'SUB-HOG-101',
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'
    ],
    sizes: ['Individual', 'Matrimonial', 'King Size'],
    colors: [
      { name: 'Gris Perla', hex: '#cccccc' },
      { name: 'Azul Cielo', hex: '#87ceeb' },
      { name: 'Blanco', hex: '#ffffff' }
    ],
    description: 'Juego de sábanas ultra transpirable que no genera pelusa ni se arruga. Incluye sabana de cajón, plana y 2 fundas para almohada.',
    tags: ['Hogar', 'Promoción'],
    isFeatured: false,
    dateAdded: '2026-06-20'
  }
];

export const INITIAL_SHIPPING_CONFIG: ShippingConfig = {
  freeShippingThreshold: 499,
  defaultFlatRate: 79,
  expressRate: 149,
  enviosApiKey: '9661a48692fa526939383a4598656bb525f82159e7026ebdfc30a3a1700bb7b8',
  enviosOriginZip: '06600',
  useLiveEnviosApi: true,
  carriers: [
    {
      id: 'carrier-1',
      name: 'Entrega Exprés Ropa en Línea (Propio)',
      code: 'REL-EXPRESS',
      estimatedDays: '1 - 2 días hábiles',
      cost: 79,
      active: true,
      iconName: 'Truck',
      trackingUrlTemplate: 'https://ropaenlinea.com.mx/rastreo?id={TRACKING}'
    },
    {
      id: 'carrier-2',
      name: 'Estafeta México',
      code: 'ESTAFETA',
      estimatedDays: '2 - 4 días hábiles',
      cost: 89,
      active: true,
      iconName: 'PackageCheck',
      trackingUrlTemplate: 'https://www.estafeta.com/Rastreo?id={TRACKING}'
    },
    {
      id: 'carrier-3',
      name: 'DHL Express',
      code: 'DHL',
      estimatedDays: '24 hrs garantizadas',
      cost: 149,
      active: true,
      iconName: 'Zap',
      trackingUrlTemplate: 'https://www.dhl.com/mx-es/home/tracking.html?tracking-id={TRACKING}'
    },
    {
      id: 'carrier-4',
      name: '99minutos Eco-Delivery',
      code: '99MIN',
      estimatedDays: 'Mismo día (CDMX/Área Metropolitana)',
      cost: 99,
      active: true,
      iconName: 'Clock',
      trackingUrlTemplate: 'https://tracking.99minutos.com/search/{TRACKING}'
    }
  ]
};

export const INITIAL_STORE_DESIGN: StoreDesignConfig = {
  storeName: 'Armario Virtual',
  logoText: 'ARMARIO VIRTUAL',
  logoSubtext: 'TU ESTILO LIBRE',
  logoUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/armariovirtual.jpeg',
  storeAddress: 'Los Reyes Iztacala, Tlalnepantla',
  announcementBarText: '⚡ ¡GRAN BARATA ARMARIO VIRTUAL! Hasta 50% de descuento en Moda y Calzado + Envío Gratis desde $499',
  announcementBarActive: true,
  primaryColor: '#9E0D0D', // Carmine Red / Rojo Carmesí (Pantone 200 C)
  accentColor: '#E05A1B',  // Warm Terracotta / Naranja Cálido (Pantone 1655 C)
  heroSliders: [
    {
      id: 'slide-1',
      title: 'GRAN BARATA DE TEMPORADA',
      subtitle: 'Hasta 50% de descuento directo en marcas seleccionadas de Moda Mujer y Caballero.',
      badge: 'OFERTA EXCLUSIVA WEB',
      buttonText: 'Ver Ofertas de Barata',
      categoryTarget: 'ofertas',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerprincipal.png',
      bgGradient: 'from-purple-900/90 via-purple-800/80 to-pink-900/70',
      active: true
    },
    {
      id: 'slide-2',
      title: 'MODA MUJER & TENDENCIAS',
      subtitle: 'Estrenos semanales en vestidos, chamarras y blusas con estilo irresistible.',
      badge: 'NUEVA COLECCIÓN',
      buttonText: 'Explorar Moda Mujer',
      categoryTarget: 'mujer',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerprincipal.png',
      bgGradient: 'from-pink-900/90 via-purple-900/80 to-indigo-900/70',
      active: true
    },
    {
      id: 'slide-3',
      title: 'CALZADO PARA TODA LA FAMILIA',
      subtitle: 'Tenis urbanos, botas, sandalias y zapatos formales desde $299.00 MXN.',
      badge: 'ENVÍO RÁPIDO',
      buttonText: 'Ver Calzado',
      categoryTarget: 'calzado',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerprincipal.png',
      bgGradient: 'from-blue-900/90 via-purple-900/80 to-slate-900/70',
      active: true
    }
  ],
  promotionalFlyers: [
    {
      id: 'flyer-1',
      title: 'Liquidación de Invierno',
      subtitle: 'Chamarras, suéteres y abrigos con descuentos irrepetibles.',
      discountBadge: 'HASTA 60% OFF',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico01.jpg',
      categoryTarget: 'ofertas',
      gridSpan: 'single',
      active: true
    },
    {
      id: 'flyer-2',
      title: 'Especial Jeans y Caballero',
      subtitle: 'Cortes Slim, Regular y Straight en marcas top.',
      discountBadge: '3x2 O 40% OFF',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico02.jpg',
      categoryTarget: 'hombre',
      gridSpan: 'single',
      active: true
    },
    {
      id: 'flyer-3',
      title: 'Infantil & Regreso a Clases',
      subtitle: 'Conjuntos resistentes, cómodos y divertidos.',
      discountBadge: 'DESDE $199.00',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico03.jpg',
      categoryTarget: 'ninos',
      gridSpan: 'single',
      active: true
    },
    {
      id: 'flyer-4',
      title: 'Renueva tu Hogar con Ropa en Línea',
      subtitle: 'Sábanas, edredones y accesorios de decoración.',
      discountBadge: 'PRECIOS BODEGA',
      imageUrl: 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/bannerchico04.jpg',
      categoryTarget: 'hogar',
      gridSpan: 'single',
      active: true
    }
  ]
};

export const INITIAL_CUSTOMER: Customer = {
  id: 'cust-101',
  name: 'María Fernanda López',
  email: 'maria.lopez@example.com',
  phone: '55 4321 9876',
  avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  favoriteStore: 'Sucursal Perisur CDMX',
  wishlistProductIds: ['prod-1', 'prod-7'],
  registeredAt: '2026-03-14',
  addresses: [
    {
      id: 'addr-1',
      recipientName: 'María Fernanda López',
      street: 'Av. Insurgentes Sur',
      exteriorNumber: '2453',
      interiorNumber: 'Depto 402',
      neighborhood: 'Tlalpan Centro',
      city: 'Ciudad de México',
      state: 'CDMX',
      postalCode: '14000',
      phone: '55 4321 9876',
      isDefault: true
    },
    {
      id: 'addr-2',
      recipientName: 'María Fernanda López (Oficina)',
      street: 'Av. Paseo de la Reforma',
      exteriorNumber: '180',
      interiorNumber: 'Piso 12',
      neighborhood: 'Juárez',
      city: 'Cuauhtémoc',
      state: 'CDMX',
      postalCode: '06600',
      phone: '55 9876 5432',
      isDefault: false
    }
  ]
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-8801',
    orderNumber: 'REL-2026-0941',
    customerName: 'María Fernanda López',
    customerEmail: 'maria.lopez@example.com',
    customerPhone: '55 4321 9876',
    shippingAddress: INITIAL_CUSTOMER.addresses[0],
    items: [
      {
        productId: 'prod-1',
        productName: 'Chamarra Capitonada con Gorro Acolchada',
        productImage: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
        price: 699,
        quantity: 1,
        size: 'M',
        color: 'Morado Elegante'
      },
      {
        productId: 'prod-7',
        productName: 'Bolso de Mano Crossbody con Cadena Dorada',
        productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&q=80',
        price: 389,
        quantity: 1,
        size: 'Unitalla',
        color: 'Beige Neutro'
      }
    ],
    subtotal: 1088,
    shippingCost: 0, // Free shipping > $499
    discountAmount: 100,
    total: 988,
    status: 'enviado',
    paymentMethod: 'Tarjeta de Crédito (Visa *** 4921)',
    shippingProvider: 'SubuEntrega Exprés (Propio)',
    trackingNumber: 'SUB-EX-889021-MX',
    createdAt: '2026-07-28 14:30',
    estimatedDelivery: '30 de Julio, 2026',
    statusHistory: [
      { status: 'pendiente', timestamp: '2026-07-28 14:30', note: 'Pago autorizado con éxito' },
      { status: 'en_preparacion', timestamp: '2026-07-28 16:00', note: 'Empacado en Almacén Perisur' },
      { status: 'enviado', timestamp: '2026-07-29 09:15', note: 'En tránsito con chofer SubuEntrega' }
    ]
  },
  {
    id: 'ord-8802',
    orderNumber: 'SUB-2026-0935',
    customerName: 'Carlos Eduardo Ramírez',
    customerEmail: 'carlos.ramirez@example.com',
    customerPhone: '55 1122 3344',
    shippingAddress: {
      id: 'addr-carlos',
      recipientName: 'Carlos Eduardo Ramírez',
      street: 'Calle Benito Juárez',
      exteriorNumber: '88',
      neighborhood: 'Polanco',
      city: 'Miguel Hidalgo',
      state: 'CDMX',
      postalCode: '11560',
      phone: '55 1122 3344'
    },
    items: [
      {
        productId: 'prod-3',
        productName: 'Jeans Corte Slim Fit Mezclilla Stretch',
        productImage: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&q=80',
        price: 399,
        quantity: 2,
        size: '32',
        color: 'Azul Índigo'
      }
    ],
    subtotal: 798,
    shippingCost: 0,
    discountAmount: 0,
    total: 798,
    status: 'entregado',
    paymentMethod: 'Mercado Pago / OXXO',
    shippingProvider: 'Estafeta México',
    trackingNumber: 'ESTA-992014-MX',
    createdAt: '2026-07-25 10:12',
    estimatedDelivery: '27 de Julio, 2026',
    statusHistory: [
      { status: 'pendiente', timestamp: '2026-07-25 10:12', note: 'Orden creada' },
      { status: 'en_preparacion', timestamp: '2026-07-25 12:00', note: 'Confirmado en almacén' },
      { status: 'enviado', timestamp: '2026-07-26 08:30', note: 'Guía Estafeta generada' },
      { status: 'entregado', timestamp: '2026-07-27 15:45', note: 'Entregado en domicilio' }
    ]
  },
  {
    id: 'ord-8803',
    orderNumber: 'SUB-2026-0945',
    customerName: 'Ana Sofía Mendoza',
    customerEmail: 'ana.mendoza@example.com',
    customerPhone: '81 9988 7766',
    shippingAddress: {
      id: 'addr-ana',
      recipientName: 'Ana Sofía Mendoza',
      street: 'Av. Constitución',
      exteriorNumber: '400',
      neighborhood: 'Centro',
      city: 'Monterrey',
      state: 'Nuevo León',
      postalCode: '64000',
      phone: '81 9988 7766'
    },
    items: [
      {
        productId: 'prod-5',
        productName: 'Tenis Urbanos Casuales Suela Ancha',
        productImage: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
        price: 549,
        quantity: 1,
        size: '26 MX',
        color: 'Blanco Puro'
      }
    ],
    subtotal: 549,
    shippingCost: 0,
    discountAmount: 0,
    total: 549,
    status: 'en_preparacion',
    paymentMethod: 'PayPal Express',
    shippingProvider: 'DHL Express',
    trackingNumber: 'DHL-302910-MX',
    createdAt: '2026-07-29 11:20',
    estimatedDelivery: '31 de Julio, 2026',
    statusHistory: [
      { status: 'pendiente', timestamp: '2026-07-29 11:20', note: 'Pago verificado' },
      { status: 'en_preparacion', timestamp: '2026-07-29 12:30', note: 'Procesando en centro de distribución' }
    ]
  }
];
