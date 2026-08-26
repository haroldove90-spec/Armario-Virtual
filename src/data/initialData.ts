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
    email: 'harold.anguiano@armariovirtual.com',
    username: 'harold.anguiano',
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

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-chivas-24',
    name: 'Jersey Chivas 24/25 - Visita',
    productType: 'variable',
    category: 'hombre',
    subcategory: 'Playeras',
    price: 500,
    originalPrice: 650,
    isOffer: false,
    offerPrice: 500,
    discountPercentage: 0,
    stock: 17,
    sku: 'JER-CHIV-001',
    images: [
      'https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['CH / S', 'MD / M', 'GD / L', 'XGD / XL'],
    colors: [
      { name: 'Blanco / Rojo', hex: '#FFFFFF' }
    ],
    variantStock: [
      { id: 'v-chiv-1', size: 'CH / S', stock: 4, sku: 'JER-CHIV-S' },
      { id: 'v-chiv-2', size: 'MD / M', stock: 6, sku: 'JER-CHIV-M' },
      { id: 'v-chiv-3', size: 'GD / L', stock: 4, sku: 'JER-CHIV-L' },
      { id: 'v-chiv-4', size: 'XGD / XL', stock: 3, sku: 'JER-CHIV-XL' }
    ],
    sizeGuideTemplateId: 'tpl-playeras-unisex',
    description: 'Jersey oficial Chivas Guadalajara temporada 24/25 versión aficionado. Confeccionado en tela transpirable de secado rápido, escudo bordado en alta definición y patrocinadores sublimados.',
    tags: ['futbol', 'chivas', 'jersey', 'deportes', 'hombre'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-20'
  },
  {
    id: 'prod-barca-25',
    name: 'Jersey Barcelona 25/26 - Local',
    productType: 'variable',
    category: 'hombre',
    subcategory: 'Playeras',
    price: 500,
    originalPrice: 700,
    isOffer: false,
    offerPrice: 500,
    discountPercentage: 0,
    stock: 20,
    sku: 'JER-FCB-002',
    images: [
      'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['CH / S', 'MD / M', 'GD / L', 'XGD / XL'],
    colors: [
      { name: 'Azulgrana', hex: '#1E3A8A' }
    ],
    variantStock: [
      { id: 'v-fcb-1', size: 'CH / S', stock: 5, sku: 'JER-FCB-S' },
      { id: 'v-fcb-2', size: 'MD / M', stock: 7, sku: 'JER-FCB-M' },
      { id: 'v-fcb-3', size: 'GD / L', stock: 5, sku: 'JER-FCB-L' },
      { id: 'v-fcb-4', size: 'XGD / XL', stock: 3, sku: 'JER-FCB-XL' }
    ],
    sizeGuideTemplateId: 'tpl-playeras-unisex',
    description: 'Jersey edición especial Barcelona 25/26 de local. Corte ergonómico con paneles de ventilación lateral y tejido Dri-FIT ultra fresco.',
    tags: ['futbol', 'barcelona', 'jersey', 'europa', 'hombre'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-21'
  },
  {
    id: 'prod-alemania-26',
    name: 'Jersey Alemania "Mundial" 26 - Local',
    productType: 'variable',
    category: 'hombre',
    subcategory: 'Playeras',
    price: 500,
    originalPrice: 750,
    isOffer: false,
    offerPrice: 500,
    discountPercentage: 0,
    stock: 32,
    sku: 'JER-GER-003',
    images: [
      'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1577210897949-1f56f943502f?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['CH / S', 'MD / M', 'GD / L', 'XGD / XL', '2XGD / 2XL'],
    colors: [
      { name: 'Blanco / Negro', hex: '#111827' }
    ],
    variantStock: [
      { id: 'v-ger-1', size: 'CH / S', stock: 6, sku: 'JER-GER-S' },
      { id: 'v-ger-2', size: 'MD / M', stock: 10, sku: 'JER-GER-M' },
      { id: 'v-ger-3', size: 'GD / L', stock: 8, sku: 'JER-GER-L' },
      { id: 'v-ger-4', size: 'XGD / XL', stock: 5, sku: 'JER-GER-XL' },
      { id: 'v-ger-5', size: '2XGD / 2XL', stock: 3, sku: 'JER-GER-2XL' }
    ],
    sizeGuideTemplateId: 'tpl-playeras-unisex',
    description: 'Camiseta selección alemana Mundial 2026 con diseño retro en hombros. Cuello elástico acanalado y escudo nacional termofijado de alta resistencia.',
    tags: ['futbol', 'alemania', 'mundial', 'jersey', 'hombre'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-22'
  },
  {
    id: 'prod-playera-basica',
    name: 'Playera Básica Slim Fit Algodón Peinado',
    productType: 'variable',
    category: 'hombre',
    subcategory: 'Pantalones y Jeans',
    price: 399,
    originalPrice: 599,
    isOffer: true,
    offerPrice: 399,
    discountPercentage: 33,
    stock: 19,
    sku: 'PL-SLIM-004',
    images: [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['CH / S', 'MD / M', 'GD / L', 'XGD / XL'],
    colors: [
      { name: 'Negro Azabache', hex: '#09090B' },
      { name: 'Blanco Óptico', hex: '#FFFFFF' },
      { name: 'Gris Jaspe', hex: '#64748B' }
    ],
    variantStock: [
      { id: 'v-pl-1', size: 'CH / S', color: 'Negro Azabache', stock: 5, sku: 'PL-SLIM-BK-S' },
      { id: 'v-pl-2', size: 'MD / M', color: 'Negro Azabache', stock: 6, sku: 'PL-SLIM-BK-M' },
      { id: 'v-pl-3', size: 'GD / L', color: 'Negro Azabache', stock: 5, sku: 'PL-SLIM-BK-L' },
      { id: 'v-pl-4', size: 'XGD / XL', color: 'Negro Azabache', stock: 3, sku: 'PL-SLIM-BK-XL' }
    ],
    sizeGuideTemplateId: 'tpl-playeras-unisex',
    description: 'Playera esencial confeccionada en 100% algodón peinado de 180g. Suave al tacto, pre-encogida y con cuello que no pierde su forma tras las lavadas.',
    tags: ['playera', 'basicos', 'hombre', 'algodon', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-18'
  },
  {
    id: 'prod-vestido-midi',
    name: 'Vestido Midi Floral Primavera',
    productType: 'variable',
    category: 'mujer',
    subcategory: 'Vestidos',
    price: 649,
    originalPrice: 899,
    isOffer: true,
    offerPrice: 649,
    discountPercentage: 28,
    stock: 24,
    sku: 'VEST-FLOR-005',
    images: [
      'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['XS (Extra Chica)', 'S (Chica)', 'M (Mediana)', 'L (Grande)'],
    colors: [
      { name: 'Floral Rosa', hex: '#F472B6' },
      { name: 'Azul Cielo', hex: '#38BDF8' }
    ],
    variantStock: [
      { id: 'v-vest-1', size: 'S (Chica)', stock: 8, sku: 'VEST-S' },
      { id: 'v-vest-2', size: 'M (Mediana)', stock: 10, sku: 'VEST-M' },
      { id: 'v-vest-3', size: 'L (Grande)', stock: 6, sku: 'VEST-L' }
    ],
    sizeGuideTemplateId: 'tpl-vestidos-blusas-mujer',
    description: 'Vestido midi con estampado floral fresco y favorecedor escote en V. Cintura elástica con lazo ajustable y falda con vuelo ligero.',
    tags: ['vestido', 'mujer', 'primavera', 'moda', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-19'
  },
  {
    id: 'prod-chamarra-puffer',
    name: 'Chamarra Puffer Térmica Ultraligera',
    productType: 'variable',
    category: 'mujer',
    subcategory: 'Abrigos y Chamarras',
    price: 899,
    originalPrice: 1299,
    isOffer: true,
    offerPrice: 899,
    discountPercentage: 30,
    stock: 15,
    sku: 'CHAM-PUFF-006',
    images: [
      'https://images.unsplash.com/photo-1548883354-7622d03aca27?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['CH / S', 'MD / M', 'GD / L'],
    colors: [
      { name: 'Negro Mate', hex: '#18181B' },
      { name: 'Beige Arena', hex: '#D6D3D1' }
    ],
    variantStock: [
      { id: 'v-puff-1', size: 'CH / S', stock: 5, sku: 'PUFF-S' },
      { id: 'v-puff-2', size: 'MD / M', stock: 6, sku: 'PUFF-M' },
      { id: 'v-puff-3', size: 'GD / L', stock: 4, sku: 'PUFF-L' }
    ],
    sizeGuideTemplateId: 'tpl-chamarras-abrigos',
    description: 'Chamarra acolchada repelente al agua con relleno térmico hipoalergénico. Incluye bolsa de viaje compacta para guardarla fácilmente.',
    tags: ['invierno', 'chamarra', 'mujer', 'abrigo', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-15'
  },
  {
    id: 'prod-jeans-slim-hombre',
    name: 'Jeans Slim Fit Denim Premium Stretch',
    productType: 'variable',
    category: 'hombre',
    subcategory: 'Pantalones y Jeans',
    price: 549,
    originalPrice: 799,
    isOffer: true,
    offerPrice: 549,
    discountPercentage: 31,
    stock: 28,
    sku: 'JNS-SLIM-007',
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['28 / CH', '30 / MD', '32 / GD', '34 / XG', '36 / 2XG'],
    colors: [
      { name: 'Azul Índigo', hex: '#1D4ED8' },
      { name: 'Negro Deslavado', hex: '#374151' }
    ],
    variantStock: [
      { id: 'v-jns-1', size: '30 / MD', stock: 8, sku: 'JNS-30' },
      { id: 'v-jns-2', size: '32 / GD', stock: 10, sku: 'JNS-32' },
      { id: 'v-jns-3', size: '34 / XG', stock: 6, sku: 'JNS-34' },
      { id: 'v-jns-4', size: '36 / 2XG', stock: 4, sku: 'JNS-36' }
    ],
    sizeGuideTemplateId: 'tpl-pantalones-jeans',
    description: 'Pantalón vaquero de mezclilla con 2% elastano para máxima libertad de movimiento. Lavado stone wash con remaches reforzados en bolsillos.',
    tags: ['jeans', 'pantalones', 'hombre', 'mezclilla', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-16'
  },
  {
    id: 'prod-tenis-urban-retro',
    name: 'Tenis Casuales Urban Retro High',
    productType: 'variable',
    category: 'calzado',
    subcategory: 'Tenis Casuales',
    price: 799,
    originalPrice: 1199,
    isOffer: true,
    offerPrice: 799,
    discountPercentage: 33,
    stock: 22,
    sku: 'CALZ-TEN-008',
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['24.0 MX', '25.0 MX', '26.0 MX', '27.0 MX', '28.0 MX'],
    colors: [
      { name: 'Rojo / Blanco', hex: '#DC2626' },
      { name: 'Negro Clásico', hex: '#18181B' }
    ],
    variantStock: [
      { id: 'v-ten-1', size: '25.0 MX', stock: 4, sku: 'TEN-25' },
      { id: 'v-ten-2', size: '26.0 MX', stock: 6, sku: 'TEN-26' },
      { id: 'v-ten-3', size: '27.0 MX', stock: 7, sku: 'TEN-27' },
      { id: 'v-ten-4', size: '28.0 MX', stock: 5, sku: 'TEN-28' }
    ],
    sizeGuideTemplateId: 'tpl-calzado-tenis',
    description: 'Sneakers urbanos con suela de goma antiderrapante y plantilla memory foam acolchada. Diseño vanguardista para el día a día.',
    tags: ['tenis', 'calzado', 'sneakers', 'streetwear', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-17'
  },
  {
    id: 'prod-blusa-saten',
    name: 'Blusa de Satén Manga Larga Elegante',
    productType: 'variable',
    category: 'mujer',
    subcategory: 'Blusas',
    price: 429,
    originalPrice: 599,
    isOffer: false,
    offerPrice: 429,
    discountPercentage: 0,
    stock: 18,
    sku: 'BLUS-SAT-009',
    images: [
      'https://images.unsplash.com/photo-1551803091-e20673f15770?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['S (Chica)', 'M (Mediana)', 'L (Grande)'],
    colors: [
      { name: 'Champagne', hex: '#FDE68A' },
      { name: 'Verde Esmeralda', hex: '#047857' }
    ],
    variantStock: [
      { id: 'v-bls-1', size: 'S (Chica)', stock: 5, sku: 'BLS-S' },
      { id: 'v-bls-2', size: 'M (Mediana)', stock: 8, sku: 'BLS-M' },
      { id: 'v-bls-3', size: 'L (Grande)', stock: 5, sku: 'BLS-L' }
    ],
    sizeGuideTemplateId: 'tpl-vestidos-blusas-mujer',
    description: 'Blusa sedosa con acabado brillante sutil y botones forrados. Ideal para atuendos de oficina o salidas nocturnas.',
    tags: ['blusa', 'mujer', 'elegante', 'saten'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-14'
  },
  {
    id: 'prod-conjunto-infantil',
    name: 'Conjunto Deportivo Niños Explorer 2 Piezas',
    productType: 'variable',
    category: 'ninos',
    subcategory: 'Moda Infantil',
    price: 389,
    originalPrice: 499,
    isOffer: true,
    offerPrice: 389,
    discountPercentage: 22,
    stock: 35,
    sku: 'NIN-CONJ-010',
    images: [
      'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1503944547408-b6559a2283ce?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['4 años', '6 años', '8 años', '10 años', '12 años'],
    colors: [
      { name: 'Azul Marino / Naranja', hex: '#1E3A8A' }
    ],
    variantStock: [
      { id: 'v-nin-1', size: '4 años', stock: 7, sku: 'NIN-4' },
      { id: 'v-nin-2', size: '6 años', stock: 8, sku: 'NIN-6' },
      { id: 'v-nin-3', size: '8 años', stock: 10, sku: 'NIN-8' },
      { id: 'v-nin-4', size: '10 años', stock: 6, sku: 'NIN-10' },
      { id: 'v-nin-5', size: '12 años', stock: 4, sku: 'NIN-12' }
    ],
    description: 'Conjunto de sudadera con capucha y pantalón jogger con pretina elástica. Tela afelpada térmica y resistente a rozaduras.',
    tags: ['ninos', 'infantil', 'deportes', 'conjunto', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-15'
  },
  {
    id: 'prod-edredon-king',
    name: 'Edredón Nórdico Microfibra Soft Touch',
    productType: 'variable',
    category: 'hogar',
    subcategory: 'Blancos y Cama',
    price: 899,
    originalPrice: 1299,
    isOffer: true,
    offerPrice: 899,
    discountPercentage: 30,
    stock: 12,
    sku: 'HOG-EDR-011',
    images: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['Matrimonial', 'Queen', 'King Size'],
    colors: [
      { name: 'Gris Perla', hex: '#94A3B8' },
      { name: 'Blanco Puro', hex: '#F8FAFC' }
    ],
    variantStock: [
      { id: 'v-edr-1', size: 'Matrimonial', stock: 4, sku: 'EDR-MAT' },
      { id: 'v-edr-2', size: 'Queen', stock: 5, sku: 'EDR-QN' },
      { id: 'v-edr-3', size: 'King Size', stock: 3, sku: 'EDR-KG' }
    ],
    description: 'Edredón ultra suave acolchado tipo plumón de ganso sintético con capitonado anti-desplazamiento. Lavable a máquina.',
    tags: ['hogar', 'cama', 'edredon', 'blancos', 'oferta'],
    isFeatured: false,
    isPublished: true,
    dateAdded: '2026-08-10'
  },
  {
    id: 'prod-suero-facial',
    name: 'Serum Facial Ácido Hialurónico & Niacinamida',
    productType: 'variable',
    category: 'belleza',
    subcategory: 'Cuidado Facial',
    price: 349,
    originalPrice: 499,
    isOffer: true,
    offerPrice: 349,
    discountPercentage: 30,
    stock: 40,
    sku: 'BEL-SER-012',
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['30 ml', '50 ml'],
    colors: [
      { name: 'Fórmula Cristal', hex: '#E0F2FE' }
    ],
    variantStock: [
      { id: 'v-ser-1', size: '30 ml', stock: 25, sku: 'SER-30' },
      { id: 'v-ser-2', size: '50 ml', stock: 15, sku: 'SER-50' }
    ],
    description: 'Tratamiento facial intensivo libre de parabenos y aceites minerales. Hidrata a profundidad y unifica el tono de la piel.',
    tags: ['belleza', 'skincare', 'serum', 'facial', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-11'
  },
  {
    id: 'prod-botas-piel-caballero',
    name: 'Botas Casuales de Piel Genuina Nubuck',
    productType: 'variable',
    category: 'calzado',
    subcategory: 'Botas',
    price: 1199,
    originalPrice: 1699,
    isOffer: true,
    offerPrice: 1199,
    discountPercentage: 29,
    stock: 14,
    sku: 'CALZ-BOT-013',
    images: [
      'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['25.5 MX', '26.5 MX', '27.5 MX', '28.5 MX'],
    colors: [
      { name: 'Miel / Café', hex: '#78350F' },
      { name: 'Negro', hex: '#18181B' }
    ],
    variantStock: [
      { id: 'v-bot-1', size: '26.5 MX', stock: 5, sku: 'BOT-265' },
      { id: 'v-bot-2', size: '27.5 MX', stock: 5, sku: 'BOT-275' },
      { id: 'v-bot-3', size: '28.5 MX', stock: 4, sku: 'BOT-285' }
    ],
    sizeGuideTemplateId: 'tpl-calzado-tenis',
    description: 'Botas de estilo montañero urbano en corte 100% vacuno nubuck. Forro transpirable y suela cosida de máxima durabilidad.',
    tags: ['botas', 'calzado', 'piel', 'hombre', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-12'
  },
  {
    id: 'prod-sudadera-hoodie-unisex',
    name: 'Sudadera Hoodie Oversize Con Gorro',
    productType: 'variable',
    category: 'hombre',
    subcategory: 'Chamarras',
    price: 499,
    originalPrice: 699,
    isOffer: true,
    offerPrice: 499,
    discountPercentage: 28,
    stock: 26,
    sku: 'SUD-HOOD-014',
    images: [
      'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=800&auto=format&fit=crop&q=80'
    ],
    sizes: ['CH / S', 'MD / M', 'GD / L', 'XGD / XL'],
    colors: [
      { name: 'Negro Lavado', hex: '#27272A' },
      { name: 'Terracota', hex: '#C2410C' },
      { name: 'Verde Olivo', hex: '#3F6212' }
    ],
    variantStock: [
      { id: 'v-sud-1', size: 'CH / S', stock: 6, sku: 'SUD-S' },
      { id: 'v-sud-2', size: 'MD / M', stock: 10, sku: 'SUD-M' },
      { id: 'v-sud-3', size: 'GD / L', stock: 6, sku: 'SUD-L' },
      { id: 'v-sud-4', size: 'XGD / XL', stock: 4, sku: 'SUD-XL' }
    ],
    sizeGuideTemplateId: 'tpl-chamarras-abrigos',
    description: 'Sudadera premium estilo streetwear con bolsillo canguro frontal y gorro con jaretas ajustables. Interior cepillado extra cálido.',
    tags: ['sudadera', 'hoodie', 'streetwear', 'unisex', 'oferta'],
    isFeatured: true,
    isPublished: true,
    dateAdded: '2026-08-13'
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
