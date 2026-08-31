import { Product, Order, Customer, ShippingConfig, StoreDesignConfig, CategoryItem, Employee, AdminProfile, SizeGuideTemplate } from '../types';

export const INITIAL_SIZE_GUIDE_TEMPLATES: SizeGuideTemplate[] = [
  {
    id: 'tpl-playeras-unisex',
    name: 'Playeras, Tops & Polos (Hombre / Unisex)',
    category: 'Hombre',
    unit: 'cm',
    columns: ['Pecho / Busto', 'Cintura', 'Largo Torso', 'Manga'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    instructions: 'Coloca una prenda similar sobre una superficie plana. Mide el pecho de sisa a sisa y el largo desde el cuello hasta el dobladillo inferior.',
    isDefault: true,
    createdAt: '2026-01-10',
    rows: [
      {
        size: 'CH / S',
        measurements: { 'Pecho / Busto': '88 - 94 cm', 'Cintura': '74 - 79 cm', 'Largo Torso': '68 cm', 'Manga': '20 cm' },
        measurementsInches: { 'Pecho / Busto': '35 - 37 in', 'Cintura': '29 - 31 in', 'Largo Torso': '26.8 in', 'Manga': '7.9 in' }
      },
      {
        size: 'MD / M',
        measurements: { 'Pecho / Busto': '96 - 102 cm', 'Cintura': '81 - 86 cm', 'Largo Torso': '71 cm', 'Manga': '21 cm' },
        measurementsInches: { 'Pecho / Busto': '38 - 40 in', 'Cintura': '32 - 34 in', 'Largo Torso': '28.0 in', 'Manga': '8.3 in' }
      },
      {
        size: 'GD / L',
        measurements: { 'Pecho / Busto': '104 - 110 cm', 'Cintura': '89 - 94 cm', 'Largo Torso': '74 cm', 'Manga': '22 cm' },
        measurementsInches: { 'Pecho / Busto': '41 - 43 in', 'Cintura': '35 - 37 in', 'Largo Torso': '29.1 in', 'Manga': '8.7 in' }
      },
      {
        size: 'XGD / XL',
        measurements: { 'Pecho / Busto': '112 - 118 cm', 'Cintura': '97 - 102 cm', 'Largo Torso': '77 cm', 'Manga': '23 cm' },
        measurementsInches: { 'Pecho / Busto': '44 - 46 in', 'Cintura': '38 - 40 in', 'Largo Torso': '30.3 in', 'Manga': '9.1 in' }
      },
      {
        size: '2XGD / 2XL',
        measurements: { 'Pecho / Busto': '120 - 128 cm', 'Cintura': '105 - 112 cm', 'Largo Torso': '80 cm', 'Manga': '24 cm' },
        measurementsInches: { 'Pecho / Busto': '47 - 50 in', 'Cintura': '41 - 44 in', 'Largo Torso': '31.5 in', 'Manga': '9.4 in' }
      }
    ]
  },
  {
    id: 'tpl-vestidos-blusas-mujer',
    name: 'Vestidos, Blusas & Tops (Dama / Mujer)',
    category: 'Mujer',
    unit: 'cm',
    columns: ['Busto', 'Cintura', 'Cadera', 'Largo Total'],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    instructions: 'Mide el contorno del busto en la parte más amplia, la cintura en la parte más estrecha y la cadera con los pies juntos.',
    isDefault: true,
    createdAt: '2026-01-12',
    rows: [
      {
        size: 'XS (Extra Chica)',
        measurements: { 'Busto': '82 - 86 cm', 'Cintura': '62 - 66 cm', 'Cadera': '88 - 92 cm', 'Largo Total': '85 cm' },
        measurementsInches: { 'Busto': '32 - 34 in', 'Cintura': '24 - 26 in', 'Cadera': '35 - 36 in', 'Largo Total': '33.5 in' }
      },
      {
        size: 'S (Chica)',
        measurements: { 'Busto': '87 - 91 cm', 'Cintura': '67 - 71 cm', 'Cadera': '93 - 97 cm', 'Largo Total': '87 cm' },
        measurementsInches: { 'Busto': '34 - 36 in', 'Cintura': '26 - 28 in', 'Cadera': '37 - 38 in', 'Largo Total': '34.2 in' }
      },
      {
        size: 'M (Mediana)',
        measurements: { 'Busto': '92 - 96 cm', 'Cintura': '72 - 76 cm', 'Cadera': '98 - 102 cm', 'Largo Total': '89 cm' },
        measurementsInches: { 'Busto': '36 - 38 in', 'Cintura': '28 - 30 in', 'Cadera': '39 - 40 in', 'Largo Total': '35.0 in' }
      },
      {
        size: 'L (Grande)',
        measurements: { 'Busto': '97 - 102 cm', 'Cintura': '77 - 82 cm', 'Cadera': '103 - 108 cm', 'Largo Total': '91 cm' },
        measurementsInches: { 'Busto': '38 - 40 in', 'Cintura': '30 - 32 in', 'Cadera': '41 - 43 in', 'Largo Total': '35.8 in' }
      },
      {
        size: 'XL (Extra Grande)',
        measurements: { 'Busto': '103 - 109 cm', 'Cintura': '83 - 89 cm', 'Cadera': '109 - 115 cm', 'Largo Total': '93 cm' },
        measurementsInches: { 'Busto': '41 - 43 in', 'Cintura': '33 - 35 in', 'Cadera': '43 - 45 in', 'Largo Total': '36.6 in' }
      }
    ]
  },
  {
    id: 'tpl-pantalones-jeans',
    name: 'Pantalones, Jeans & Shorts (Hombre / Mujer)',
    category: 'Hombre',
    unit: 'cm',
    columns: ['Cintura', 'Cadera', 'Tiro', 'Largo Entrepierna'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    instructions: 'Coloca la cinta métrica en tu cintura natural donde normalmente usas el pantalón. Mantén la cinta cómoda pero firme.',
    isDefault: true,
    createdAt: '2026-01-15',
    rows: [
      {
        size: '28 / CH',
        measurements: { 'Cintura': '71 - 74 cm', 'Cadera': '88 - 92 cm', 'Tiro': '24 cm', 'Largo Entrepierna': '76 cm' },
        measurementsInches: { 'Cintura': '28 - 29 in', 'Cadera': '35 - 36 in', 'Tiro': '9.4 in', 'Largo Entrepierna': '30.0 in' }
      },
      {
        size: '30 / MD',
        measurements: { 'Cintura': '76 - 79 cm', 'Cadera': '93 - 97 cm', 'Tiro': '25 cm', 'Largo Entrepierna': '78 cm' },
        measurementsInches: { 'Cintura': '30 - 31 in', 'Cadera': '37 - 38 in', 'Tiro': '9.8 in', 'Largo Entrepierna': '30.7 in' }
      },
      {
        size: '32 / GD',
        measurements: { 'Cintura': '81 - 84 cm', 'Cadera': '98 - 102 cm', 'Tiro': '26 cm', 'Largo Entrepierna': '80 cm' },
        measurementsInches: { 'Cintura': '32 - 33 in', 'Cadera': '39 - 40 in', 'Tiro': '10.2 in', 'Largo Entrepierna': '31.5 in' }
      },
      {
        size: '34 / XG',
        measurements: { 'Cintura': '86 - 89 cm', 'Cadera': '103 - 107 cm', 'Tiro': '27 cm', 'Largo Entrepierna': '82 cm' },
        measurementsInches: { 'Cintura': '34 - 35 in', 'Cadera': '41 - 42 in', 'Tiro': '10.6 in', 'Largo Entrepierna': '32.3 in' }
      },
      {
        size: '36 / 2XG',
        measurements: { 'Cintura': '91 - 95 cm', 'Cadera': '108 - 112 cm', 'Tiro': '28 cm', 'Largo Entrepierna': '83 cm' },
        measurementsInches: { 'Cintura': '36 - 37 in', 'Cadera': '43 - 44 in', 'Tiro': '11.0 in', 'Largo Entrepierna': '32.7 in' }
      }
    ]
  },
  {
    id: 'tpl-chamarras-abrigos',
    name: 'Chamarras, Abrigos & Sudaderas Acolchadas',
    category: 'Mujer',
    unit: 'cm',
    columns: ['Pecho / Busto', 'Hombros', 'Largo Prenda', 'Largo Manga'],
    imageUrl: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
    instructions: 'Las medidas consideran el grosor del tejido para permitir el uso confortable sobre prendas interiores.',
    isDefault: true,
    createdAt: '2026-01-18',
    rows: [
      {
        size: 'CH / S',
        measurements: { 'Pecho / Busto': '96 - 102 cm', 'Hombros': '44 cm', 'Largo Prenda': '67 cm', 'Largo Manga': '63 cm' },
        measurementsInches: { 'Pecho / Busto': '38 - 40 in', 'Hombros': '17.3 in', 'Largo Prenda': '26.4 in', 'Largo Manga': '24.8 in' }
      },
      {
        size: 'MD / M',
        measurements: { 'Pecho / Busto': '103 - 108 cm', 'Hombros': '46 cm', 'Largo Prenda': '69 cm', 'Largo Manga': '65 cm' },
        measurementsInches: { 'Pecho / Busto': '41 - 43 in', 'Hombros': '18.1 in', 'Largo Prenda': '27.2 in', 'Largo Manga': '25.6 in' }
      },
      {
        size: 'GD / L',
        measurements: { 'Pecho / Busto': '109 - 115 cm', 'Hombros': '48 cm', 'Largo Prenda': '71 cm', 'Largo Manga': '67 cm' },
        measurementsInches: { 'Pecho / Busto': '43 - 45 in', 'Hombros': '18.9 in', 'Largo Prenda': '28.0 in', 'Largo Manga': '26.4 in' }
      },
      {
        size: 'XGD / XL',
        measurements: { 'Pecho / Busto': '116 - 123 cm', 'Hombros': '50 cm', 'Largo Prenda': '73 cm', 'Largo Manga': '69 cm' },
        measurementsInches: { 'Pecho / Busto': '46 - 48 in', 'Hombros': '19.7 in', 'Largo Prenda': '28.7 in', 'Largo Manga': '27.2 in' }
      }
    ]
  },
  {
    id: 'tpl-calzado-tenis',
    name: 'Calzado, Tenis & Botas (MX / US / EUR)',
    category: 'Calzado',
    unit: 'cm',
    columns: ['Talla MX (cm)', 'Talla US Hombre', 'Talla US Mujer', 'Talla EUR'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    instructions: 'Apoya el talón contra la pared descalzo o con calcetín y mide hasta la punta del dedo más largo en centímetros.',
    isDefault: true,
    createdAt: '2026-01-20',
    rows: [
      {
        size: '23.0 MX',
        measurements: { 'Talla MX (cm)': '23.0 cm', 'Talla US Hombre': '5.0 US', 'Talla US Mujer': '6.0 US', 'Talla EUR': '36.5 EUR' },
        measurementsInches: { 'Talla MX (cm)': '9.0 in', 'Talla US Hombre': '5.0 US', 'Talla US Mujer': '6.0 US', 'Talla EUR': '36.5 EUR' }
      },
      {
        size: '24.0 MX',
        measurements: { 'Talla MX (cm)': '24.0 cm', 'Talla US Hombre': '6.0 US', 'Talla US Mujer': '7.0 US', 'Talla EUR': '38.0 EUR' },
        measurementsInches: { 'Talla MX (cm)': '9.4 in', 'Talla US Hombre': '6.0 US', 'Talla US Mujer': '7.0 US', 'Talla EUR': '38.0 EUR' }
      },
      {
        size: '25.0 MX',
        measurements: { 'Talla MX (cm)': '25.0 cm', 'Talla US Hombre': '7.0 US', 'Talla US Mujer': '8.0 US', 'Talla EUR': '39.5 EUR' },
        measurementsInches: { 'Talla MX (cm)': '9.8 in', 'Talla US Hombre': '7.0 US', 'Talla US Mujer': '8.0 US', 'Talla EUR': '39.5 EUR' }
      },
      {
        size: '26.0 MX',
        measurements: { 'Talla MX (cm)': '26.0 cm', 'Talla US Hombre': '8.0 US', 'Talla US Mujer': '9.0 US', 'Talla EUR': '41.0 EUR' },
        measurementsInches: { 'Talla MX (cm)': '10.2 in', 'Talla US Hombre': '8.0 US', 'Talla US Mujer': '9.0 US', 'Talla EUR': '41.0 EUR' }
      },
      {
        size: '27.0 MX',
        measurements: { 'Talla MX (cm)': '27.0 cm', 'Talla US Hombre': '9.0 US', 'Talla US Mujer': '10.0 US', 'Talla EUR': '42.5 EUR' },
        measurementsInches: { 'Talla MX (cm)': '10.6 in', 'Talla US Hombre': '9.0 US', 'Talla US Mujer': '10.0 US', 'Talla EUR': '42.5 EUR' }
      },
      {
        size: '28.0 MX',
        measurements: { 'Talla MX (cm)': '28.0 cm', 'Talla US Hombre': '10.0 US', 'Talla US Mujer': '11.0 US', 'Talla EUR': '44.0 EUR' },
        measurementsInches: { 'Talla MX (cm)': '11.0 in', 'Talla US Hombre': '10.0 US', 'Talla US Mujer': '11.0 US', 'Talla EUR': '44.0 EUR' }
      }
    ]
  }
];

export const INITIAL_CATEGORIES: CategoryItem[] = [];

export const INITIAL_ADMIN_PROFILE: AdminProfile = {
  name: 'Adrian Mancilla Morga',
  email: 'softwareai569@gmail.com',
  phone: '55 9876 5432',
  roleTitle: 'Director General & Administrador Principal',
  storeName: 'Armario Virtual / Ropa en Línea',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&q=80',
  createdAt: '2026-01-15',
  fiscal: {
    rfc: 'MOMA850614HN1',
    razonSocial: 'ADRIAN MANCILLA MORGA (ARMARIO VIRTUAL)',
    regimenFiscal: '612 - Personas Físicas con Actividades Empresariales y Profesionales',
    codigoPostalFiscal: '54090',
    lugarExpedicion: 'Tlalnepantla de Baz, Estado de México',
    pacProvider: 'facturapi',
    pacApiKey: '',
    pacEnvironment: 'sandbox',
    csdCerFileName: '',
    csdKeyFileName: '',
    csdPassword: '',
    csdStatus: 'not_configured',
    timbresDisponibles: 50,
    connectionStatus: 'untested',
    connectionMessage: 'Listo para conectar con PAC (Facturapi / Finkok / SW Smarter)'
  }
};

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-admin-armario',
    name: 'Armario Virtual Admin',
    email: 'armario_virtual@armariovirtual.com',
    username: 'armario_virtual',
    password: 'ArmarioVirtual#2026!Key',
    role: 'Administrador General',
    status: 'activo',
    permissions: ['metricas', 'productos', 'categorias', 'ventas', 'clientes', 'empleados', 'diseno', 'guias_tallas', 'envio', 'ajustes'],
    createdAt: '2026-08-26',
    lastAccess: 'En línea',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80'
  },
  {
    id: 'emp-admin-harold',
    name: 'Harold Anguiano Morales',
    email: 'haroldo90@hotmail.com',
    username: 'haroldo90',
    password: 'Chevropar#1970',
    role: 'Administrador General',
    status: 'activo',
    permissions: ['metricas', 'productos', 'categorias', 'ventas', 'clientes', 'empleados', 'diseno', 'guias_tallas', 'envio', 'ajustes'],
    createdAt: '2026-08-25',
    lastAccess: 'En línea',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80'
  },
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

export const INITIAL_CUSTOMERS_LIST: Customer[] = [];

export const INITIAL_PRODUCTS: Product[] = [];

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
  logoUrl: 'https://cgnieenzvgimdpoihipu.supabase.co/storage/v1/object/public/logo/armariovirtualogo.jpeg',
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
  id: '',
  name: 'Invitado',
  email: '',
  phone: '',
  avatarUrl: '',
  favoriteStore: 'Armario Virtual',
  wishlistProductIds: [],
  registeredAt: '2026-08-19',
  addresses: []
};

export const INITIAL_ORDERS: Order[] = [];
