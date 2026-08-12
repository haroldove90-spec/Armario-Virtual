import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Category } from '../../types';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  Tag,
  Percent,
  AlertCircle,
  Video,
  Upload,
  Image as ImageIcon,
  Check,
  X,
  Layers,
  Sparkles,
  Sliders,
  Palette,
  CheckCircle2
} from 'lucide-react';

const CLOTHING_SIZES_PRESETS = ['XS', 'CH', 'M', 'G', 'XG', '2XG', '3XG'];
const NUMERIC_SIZES_PRESETS = ['22', '23', '24', '25', '26', '27', '28', '29', '30', '32', '34', '36'];

const PRESET_COLORS = [
  { name: 'Negro', hex: '#1A1A1A' },
  { name: 'Blanco', hex: '#FFFFFF' },
  { name: 'Rojo Carmesí', hex: '#9E0D0D' },
  { name: 'Azul Marino', hex: '#1E3A8A' },
  { name: 'Azul Mezclilla', hex: '#2563EB' },
  { name: 'Verde Olivo', hex: '#3F6212' },
  { name: 'Rosa Fiusha', hex: '#EC4899' },
  { name: 'Beige / Arena', hex: '#D97706' },
  { name: 'Gris Jaspe', hex: '#6B7280' },
  { name: 'Morado', hex: '#7E22CE' },
  { name: 'Amarillo', hex: '#EAB308' },
  { name: 'Café', hex: '#78350F' }
];

export const ProductsModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);

  // Quick inline category modal state
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatSlug, setQuickCatSlug] = useState('');
  const [quickCatDesc, setQuickCatDesc] = useState('');
  const [quickCatSubs, setQuickCatSubs] = useState('');

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    productType: 'variable' as 'sencillo' | 'variable',
    name: '',
    category: 'mujer' as Category,
    subcategory: 'General',
    price: 399,
    originalPrice: 599,
    isOffer: false,
    offerPrice: 299,
    discountPercentage: 33,
    stock: 20,
    sku: `REL-${Math.floor(1000 + Math.random() * 9000)}`,
    // Up to 5 images: index 0 = primary, 1..4 = secondary
    images: [
      'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg',
      '',
      '',
      '',
      ''
    ],
    selectedSizes: ['CH', 'M', 'G', 'XG'] as string[],
    selectedColors: [
      { name: 'Negro', hex: '#1A1A1A' },
      { name: 'Rojo Carmesí', hex: '#9E0D0D' }
    ] as { name: string; hex: string; imageUrl?: string }[],
    colorImages: {} as Record<string, string>,
    variantStockMap: {} as Record<string, number>,
    customSizeInput: '',
    customColorName: '',
    customColorHex: '#9E0D0D',
    youtubeUrl: '',
    description: 'Prenda confeccionada con materiales de alta calidad para máxima comodidad.'
  });

  const getCombinations = (sizes: string[], colors: { name: string; hex: string }[]) => {
    if (sizes.length > 0 && colors.length > 0) {
      return sizes.flatMap(s => colors.map(c => ({ size: s, color: c.name })));
    }
    if (sizes.length > 0) {
      return sizes.map(s => ({ size: s, color: undefined }));
    }
    if (colors.length > 0) {
      return colors.map(c => ({ size: undefined, color: c.name }));
    }
    return [];
  };

  const selectedCategoryObj = categories.find(
    c => c.slug === formData.category || c.id === formData.category || c.name.toLowerCase() === formData.category.toLowerCase()
  );

  const availableSubcategories = selectedCategoryObj?.subcategories || [];

  const handleColorImageUrlChange = (colorIndex: number, colorName: string, url: string) => {
    setFormData(prev => {
      const updatedColors = [...prev.selectedColors];
      updatedColors[colorIndex] = { ...updatedColors[colorIndex], imageUrl: url };
      const updatedMap = { ...prev.colorImages, [colorName]: url };
      return {
        ...prev,
        selectedColors: updatedColors,
        colorImages: updatedMap
      };
    });
  };

  const handleColorImageFileChange = (colorIndex: number, colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target?.result) {
        handleColorImageUrlChange(colorIndex, colorName, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'todas' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleToggleSize = (sizeName: string) => {
    setFormData(prev => {
      const exists = prev.selectedSizes.includes(sizeName);
      return {
        ...prev,
        selectedSizes: exists
          ? prev.selectedSizes.filter(s => s !== sizeName)
          : [...prev.selectedSizes, sizeName]
      };
    });
  };

  const handleAddCustomSize = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customSizeInput.trim()) return;
    const cleanSize = formData.customSizeInput.trim().toUpperCase();
    if (!formData.selectedSizes.includes(cleanSize)) {
      setFormData(prev => ({
        ...prev,
        selectedSizes: [...prev.selectedSizes, cleanSize],
        customSizeInput: ''
      }));
    } else {
      setFormData(prev => ({ ...prev, customSizeInput: '' }));
    }
  };

  const handleToggleColor = (colorObj: { name: string; hex: string }) => {
    setFormData(prev => {
      const exists = prev.selectedColors.some(
        c => c.name.toLowerCase() === colorObj.name.toLowerCase() || c.hex.toLowerCase() === colorObj.hex.toLowerCase()
      );
      return {
        ...prev,
        selectedColors: exists
          ? prev.selectedColors.filter(
              c => c.name.toLowerCase() !== colorObj.name.toLowerCase() && c.hex.toLowerCase() !== colorObj.hex.toLowerCase()
            )
          : [...prev.selectedColors, colorObj]
      };
    });
  };

  const handleAddCustomColor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customColorName.trim()) return;
    const newColor = {
      name: formData.customColorName.trim(),
      hex: formData.customColorHex || '#000000'
    };
    setFormData(prev => ({
      ...prev,
      selectedColors: [...prev.selectedColors, newColor],
      customColorName: ''
    }));
  };

  const handleRemoveColor = (index: number) => {
    setFormData(prev => ({
      ...prev,
      selectedColors: prev.selectedColors.filter((_, i) => i !== index)
    }));
  };

  const handleImageFileChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          const newImages = [...formData.images];
          newImages[index] = event.target.result as string;
          setFormData({ ...formData, images: newImages });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUrlChange = (index: number, val: string) => {
    const newImages = [...formData.images];
    newImages[index] = val;
    setFormData({ ...formData, images: newImages });
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...formData.images];
    newImages[index] = '';
    setFormData({ ...formData, images: newImages });
  };

  const handleQuickAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickCatName.trim()) return;

    const slug = quickCatSlug.trim() || quickCatName.toLowerCase().replace(/\s+/g, '-');
    const subcatsArray = quickCatSubs
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((subName, i) => ({
        id: `sub-q-${Date.now()}-${i}`,
        name: subName,
        slug: subName.toLowerCase().replace(/\s+/g, '-'),
        active: true
      }));

    addCategory({
      name: quickCatName,
      slug,
      iconName: 'Tag',
      description: quickCatDesc || `Categoría de ${quickCatName}`,
      active: true,
      subcategories: subcatsArray
    });

    // Auto-select this newly created category in product form
    setFormData(prev => ({
      ...prev,
      category: slug as Category,
      subcategory: subcatsArray[0]?.name || 'General'
    }));

    setQuickCatName('');
    setQuickCatSlug('');
    setQuickCatDesc('');
    setQuickCatSubs('');
    setShowQuickCategoryModal(false);
  };

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const finalSizes = formData.productType === 'sencillo' ? [] : formData.selectedSizes;
    const validImages = formData.images.filter(img => img.trim().length > 0);
    const finalImages = validImages.length > 0 ? validImages : ['https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'];

    // Calculate effective prices and discounts
    let finalPrice = Number(formData.price);
    let origPrice = Number(formData.originalPrice);
    let finalIsOffer = formData.isOffer;
    let offerPriceNum = Number(formData.offerPrice);

    if (finalIsOffer && offerPriceNum > 0) {
      finalPrice = offerPriceNum;
      if (!origPrice || origPrice <= offerPriceNum) {
        origPrice = Number(formData.price);
      }
    }

    const calculatedDiscount = origPrice > finalPrice ? Math.round(((origPrice - finalPrice) / origPrice) * 100) : 0;

    const finalColorImages: Record<string, string> = { ...formData.colorImages };
    const finalColors = formData.productType === 'sencillo'
      ? []
      : formData.selectedColors.map(c => {
          const url = c.imageUrl || formData.colorImages[c.name] || '';
          if (url) finalColorImages[c.name] = url;
          return { ...c, imageUrl: url || undefined };
        });

    // Build variant stock entries if variable product
    let finalVariantStock: any[] = [];
    let finalTotalStock = Number(formData.stock);

    if (formData.productType === 'variable') {
      const comb = getCombinations(finalSizes, finalColors);
      if (comb.length > 0) {
        finalVariantStock = comb.map((c, i) => {
          const key = `${c.size || 'ALL'}__${c.color || 'ALL'}`;
          const vStock = formData.variantStockMap[key] !== undefined ? Number(formData.variantStockMap[key]) : 5;
          return {
            id: `var-${Date.now()}-${i}`,
            size: c.size,
            color: c.color,
            stock: vStock
          };
        });
        finalTotalStock = finalVariantStock.reduce((sum, v) => sum + v.stock, 0);
      }
    }

    if (editingProd) {
      updateProduct(editingProd.id, {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: finalPrice,
        originalPrice: origPrice,
        isOffer: finalIsOffer,
        offerPrice: finalIsOffer ? offerPriceNum : undefined,
        discountPercentage: calculatedDiscount,
        stock: finalTotalStock,
        variantStock: finalVariantStock,
        sku: formData.sku,
        images: finalImages,
        sizes: finalSizes,
        colors: finalColors,
        colorImages: finalColorImages,
        productType: formData.productType,
        youtubeUrl: formData.youtubeUrl,
        description: formData.description
      });
      setEditingProd(null);
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: finalPrice,
        originalPrice: origPrice,
        isOffer: finalIsOffer,
        offerPrice: finalIsOffer ? offerPriceNum : undefined,
        discountPercentage: calculatedDiscount,
        stock: finalTotalStock,
        variantStock: finalVariantStock,
        sku: formData.sku,
        images: finalImages,
        sizes: finalSizes,
        colors: finalColors,
        colorImages: finalColorImages,
        productType: formData.productType,
        youtubeUrl: formData.youtubeUrl,
        description: formData.description,
        tags: [finalIsOffer ? 'Gran Barata' : 'Catálogo General']
      });
    }

    setShowAddModal(false);
  };

  const handleStartEdit = (p: Product) => {
    setEditingProd(p);
    const imgs = [...p.images];
    while (imgs.length < 5) {
      imgs.push('');
    }

    const vMap: Record<string, number> = {};
    if (p.variantStock && p.variantStock.length > 0) {
      p.variantStock.forEach(v => {
        const key = `${v.size || 'ALL'}__${v.color || 'ALL'}`;
        vMap[key] = v.stock;
      });
    } else {
      const comb = getCombinations(p.sizes || [], p.colors?.map(c => typeof c === 'string' ? { name: c, hex: '#000' } : c) || []);
      const perVar = comb.length > 0 ? Math.max(1, Math.floor(p.stock / comb.length)) : p.stock;
      comb.forEach(c => {
        const key = `${c.size || 'ALL'}__${c.color || 'ALL'}`;
        vMap[key] = perVar;
      });
    }

    const loadedColors = (p.colors || []).map(c => {
      const colObj = typeof c === 'string' ? { name: c, hex: '#000000' } : c;
      const url = colObj.imageUrl || (p.colorImages && p.colorImages[colObj.name]) || '';
      return { ...colObj, imageUrl: url };
    });

    const loadedColorMap: Record<string, string> = p.colorImages ? { ...p.colorImages } : {};
    loadedColors.forEach(c => {
      if (c.imageUrl) loadedColorMap[c.name] = c.imageUrl;
    });

    setFormData({
      productType: p.productType || (p.sizes.length > 0 || p.colors.length > 0 ? 'variable' : 'sencillo'),
      name: p.name,
      category: p.category,
      subcategory: p.subcategory || 'General',
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      isOffer: !!p.isOffer || (!!p.offerPrice && p.offerPrice < p.price),
      offerPrice: p.offerPrice || p.price,
      discountPercentage: p.discountPercentage || 0,
      stock: p.stock,
      sku: p.sku,
      images: imgs.slice(0, 5),
      selectedSizes: p.sizes || [],
      selectedColors: loadedColors,
      colorImages: loadedColorMap,
      variantStockMap: vMap,
      customSizeInput: '',
      customColorName: '',
      customColorHex: '#9E0D0D',
      youtubeUrl: p.youtubeUrl || '',
      description: p.description
    });
    setShowAddModal(true);
  };

  // Extract YouTube ID for live preview in form
  const getYouTubeEmbedUrl = (urlStr: string): string | null => {
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

  const lowStockProducts = products.filter(p => p.stock <= 3);

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-[#9E0D0D]" />
            Catálogo e Inventario de Productos ({products.length})
          </h3>
          <p className="text-xs text-gray-500">
            Soporte para productos sencillos y productos variables con selección rápida de tallas y colores.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProd(null);
            setFormData({
              productType: 'variable',
              name: '',
              category: categories[0]?.slug || 'mujer',
              subcategory: 'General',
              price: 399,
              originalPrice: 599,
              isOffer: false,
              offerPrice: 299,
              discountPercentage: 25,
              stock: 15,
              sku: `REL-${Math.floor(1000 + Math.random() * 9000)}`,
              images: [
                'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg',
                '',
                '',
                '',
                ''
              ],
              selectedSizes: ['CH', 'M', 'G', 'XG'],
              selectedColors: [
                { name: 'Negro', hex: '#1A1A1A' },
                { name: 'Rojo Carmesí', hex: '#9E0D0D' }
              ],
              variantStockMap: {},
              customSizeInput: '',
              customColorName: '',
              customColorHex: '#9E0D0D',
              youtubeUrl: '',
              description: 'Prenda confeccionada con materiales premium de máxima calidad.'
            });
            setShowAddModal(true);
          }}
          className="bg-[#9E0D0D] hover:bg-red-900 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Producto</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-amber-500 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-red-600 text-white px-2 py-0.5 rounded uppercase tracking-wider">
                  ⚠️ NOTIFICACIÓN AL ADMIN
                </span>
                <span className="text-xs font-bold text-amber-900 font-mono">
                  {lowStockProducts.length} producto{lowStockProducts.length > 1 ? 's' : ''} en stock crítico (≤ 3 prendas)
                </span>
              </div>
              <p className="text-xs text-amber-800 mt-1">
                Atención: Los siguientes productos han alcanzado el umbral de 3 o menos unidades. Haz clic en cualquiera para actualizar su inventario:
              </p>
              <div className="flex flex-wrap gap-2 mt-2">
                {lowStockProducts.map(lp => (
                  <button
                    key={lp.id}
                    onClick={() => handleStartEdit(lp)}
                    className="inline-flex items-center gap-1.5 bg-white border border-amber-300 px-2.5 py-1 rounded-lg text-xs font-bold text-amber-900 hover:bg-amber-100 transition-all shadow-2xs"
                  >
                    <span>{lp.name}</span>
                    <span className={`px-1.5 py-0.2 rounded font-black text-[10px] ${lp.stock === 0 ? 'bg-red-600 text-white' : 'bg-amber-600 text-white'}`}>
                      {lp.stock === 0 ? 'AGOTADO' : `${lp.stock} pzas`}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Buscar por nombre o SKU..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-hidden focus:border-[#9E0D0D]"
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-800"
        >
          <option value="todas">Todos los Departamentos</option>
          {categories.map(c => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4">Producto & Fotos</th>
                <th className="p-4">Tipo & Variantes</th>
                <th className="p-4">SKU / Categ</th>
                <th className="p-4">Precio & Oferta</th>
                <th className="p-4">Stock Automático</th>
                <th className="p-4">Video YT</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map(p => {
                const isVariable = p.productType === 'variable' || (p.sizes && p.sizes.length > 0) || (p.colors && p.colors.length > 0);
                return (
                  <tr key={p.id} className="hover:bg-red-50/20 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                        <img
                          src={p.images[0] || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'}
                          alt={p.name}
                          className="w-full h-full object-cover"
                        />
                        {p.images.length > 1 && (
                          <span className="absolute bottom-0 right-0 bg-slate-900 text-white text-[9px] font-black px-1 rounded-tl">
                            +{p.images.length - 1}
                          </span>
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-xs">{p.name}</h4>
                        <p className="text-[11px] text-gray-500 line-clamp-1">{p.subcategory || p.category}</p>
                      </div>
                    </td>

                    <td className="p-4">
                      {isVariable ? (
                        <div>
                          <span className="bg-purple-100 text-purple-800 text-[10px] font-black px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                            <Sliders className="w-3 h-3" />
                            Variable
                          </span>
                          <div className="mt-1 text-[10px] text-gray-500 flex flex-wrap gap-1">
                            {p.sizes && p.sizes.length > 0 && <span>{p.sizes.length} tallas</span>}
                            {p.sizes && p.sizes.length > 0 && p.colors && p.colors.length > 0 && <span>•</span>}
                            {p.colors && p.colors.length > 0 && <span>{p.colors.length} colores</span>}
                          </div>
                        </div>
                      ) : (
                        <span className="bg-gray-100 text-gray-700 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                          <Package className="w-3 h-3 text-gray-500" />
                          Sencillo
                        </span>
                      )}
                    </td>

                    <td className="p-4">
                      <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">
                        {p.sku}
                      </span>
                      <span className="block text-[10px] text-[#9E0D0D] font-bold uppercase mt-0.5">
                        {p.category}
                      </span>
                    </td>

                    <td className="p-4">
                      {p.isOffer || (p.offerPrice && p.offerPrice < p.price) ? (
                        <div>
                          <span className="bg-pink-600 text-white font-extrabold text-[9px] px-1.5 py-0.5 rounded uppercase mr-1">
                            ¡OFERTA!
                          </span>
                          <span className="font-black text-red-700 text-sm">${(p.offerPrice || p.price).toFixed(2)}</span>
                          <span className="block text-[10px] text-gray-400 line-through">
                            ${(p.originalPrice || p.price).toFixed(2)}
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="font-black text-gray-900 text-sm">${p.price.toFixed(2)}</span>
                          {p.originalPrice && p.originalPrice > p.price && (
                            <span className="block text-[10px] text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="p-4">
                      <span
                        className={`font-black text-xs px-2.5 py-1 rounded-full ${
                          p.stock <= 0
                            ? 'bg-red-100 text-red-800'
                            : p.stock <= 5
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {p.stock <= 0 ? 'AGOTADO (0)' : `${p.stock} pzas`}
                      </span>
                    </td>

                    <td className="p-4">
                      {p.youtubeUrl ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-red-100 text-red-700 px-2 py-1 rounded-lg font-bold">
                          <Video className="w-3 h-3" />
                          Con Video
                        </span>
                      ) : (
                        <span className="text-[10px] text-gray-400 italic">Sin video</span>
                      )}
                    </td>

                    <td className="p-4 text-right space-x-2">
                      <button
                        onClick={() => handleStartEdit(p)}
                        className="p-2 text-[#9E0D0D] hover:bg-red-100 rounded-lg transition-colors"
                        title="Editar Producto"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                        title="Eliminar Producto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-2xl w-full max-h-[92vh] overflow-y-auto shadow-2xl relative border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <Package className="w-5 h-5 text-[#9E0D0D]" />
                {editingProd ? 'Editar Producto' : 'Registrar Nuevo Producto'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitProduct} className="space-y-4 text-xs">
              {/* Product Type Selection: Sencillo vs Variable */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                <label className="block font-black text-gray-900 uppercase mb-2 flex items-center gap-1.5 text-xs">
                  <Sliders className="w-4 h-4 text-[#9E0D0D]" />
                  Tipo de Producto *
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, productType: 'sencillo' })}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.productType === 'sencillo'
                        ? 'bg-white border-[#9E0D0D] ring-2 ring-[#9E0D0D]/20 shadow-xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        formData.productType === 'sencillo' ? 'border-[#9E0D0D] bg-[#9E0D0D]' : 'border-gray-300'
                      }`}
                    >
                      {formData.productType === 'sencillo' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-gray-900 block text-xs">📦 Producto Sencillo</span>
                      <span className="text-[10px] text-gray-500">Un solo modelo o talle único. Sin variaciones adicionales.</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, productType: 'variable' })}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      formData.productType === 'variable'
                        ? 'bg-purple-50/60 border-purple-600 ring-2 ring-purple-600/20 shadow-xs'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                        formData.productType === 'variable' ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                      }`}
                    >
                      {formData.productType === 'variable' && <div className="w-1.5 h-1.5 bg-white rounded-full" />}
                    </div>
                    <div>
                      <span className="font-extrabold text-gray-900 block text-xs">🎨 Producto Variable</span>
                      <span className="text-[10px] text-gray-500">Permite seleccionar múltiples Tallas y/o Colores en la tienda.</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Product Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Chamarra Acolchada con Gorro Abrigadora"
                  className="w-full p-2.5 border rounded-xl font-medium"
                  required
                />
              </div>

              {/* Category & Subcategory + Quick Category Button */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-200">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-800">Categoría / Depto *</label>
                    <button
                      type="button"
                      onClick={() => setShowQuickCategoryModal(true)}
                      className="text-[10px] font-black text-[#9E0D0D] hover:underline flex items-center gap-0.5"
                    >
                      <Plus className="w-3 h-3" />
                      + Nueva Categoría
                    </button>
                  </div>

                  <select
                    value={formData.category}
                    onChange={e => {
                      const newCatSlug = e.target.value as Category;
                      const catObj = categories.find(
                        c => c.slug === newCatSlug || c.id === newCatSlug || c.name.toLowerCase() === newCatSlug.toLowerCase()
                      );
                      const firstSub = catObj?.subcategories?.[0]?.name || 'General';
                      setFormData(prev => ({
                        ...prev,
                        category: newCatSlug,
                        subcategory: firstSub
                      }));
                    }}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold text-gray-800 focus:border-[#9E0D0D] outline-hidden"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Subcategoría (Dinámica) *</label>
                  <select
                    value={formData.subcategory}
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold text-gray-800 focus:border-[#9E0D0D] outline-hidden"
                    required
                  >
                    {availableSubcategories.length > 0 ? (
                      availableSubcategories.map(sub => (
                        <option key={sub.id} value={sub.name}>
                          {sub.name}
                        </option>
                      ))
                    ) : (
                      <option value="General">General</option>
                    )}
                  </select>
                </div>
              </div>

              {/* Prices, Offer Toggle & Stock */}
              <div className="bg-red-50/50 p-3 rounded-2xl border border-red-100 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-black text-gray-900 text-xs uppercase flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-[#9E0D0D]" />
                    Precios, Oferta Especial y Stock Libre
                  </span>

                  {/* Toggle Offer Switch */}
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.isOffer}
                      onChange={e => setFormData({ ...formData, isOffer: e.target.checked })}
                      className="w-4 h-4 accent-[#9E0D0D] rounded cursor-pointer"
                    />
                    <span className="font-bold text-xs text-red-800">Activar Oferta Especial</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Precio Normal ($ MXN) *</label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border rounded-xl font-mono text-sm font-bold"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Precio de Oferta ($ MXN)</label>
                    <input
                      type="number"
                      step="0.01"
                      disabled={!formData.isOffer}
                      value={formData.offerPrice}
                      onChange={e => setFormData({ ...formData, offerPrice: Number(e.target.value) })}
                      className={`w-full p-2.5 border rounded-xl font-mono text-sm font-bold ${
                        formData.isOffer ? 'bg-white border-red-400 text-red-700' : 'bg-gray-100 text-gray-400'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Stock Libre (pzas) *</label>
                    <input
                      type="number"
                      value={formData.stock}
                      onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                      className="w-full p-2.5 bg-white border rounded-xl font-mono text-sm font-bold text-emerald-800"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Sizes & Colors Section (Active for Variable or Optional for Simple) */}
              {formData.productType === 'variable' && (
                <div className="space-y-4 bg-purple-50/40 p-4 rounded-2xl border border-purple-200">
                  <div className="flex items-center justify-between border-b border-purple-200/80 pb-2">
                    <h4 className="font-black text-purple-900 uppercase text-xs flex items-center gap-2">
                      <Sliders className="w-4 h-4 text-purple-700" />
                      Configuración de Variantes (Tallas y Colores)
                    </h4>
                    <span className="text-[10px] bg-purple-200 text-purple-800 font-bold px-2 py-0.5 rounded-full">
                      Opcionales o Combinables
                    </span>
                  </div>

                  {/* 1. SELECCIÓN DE TALLAS */}
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-purple-700" />
                        1. Seleccionar Tallas ({formData.selectedSizes.length} elegidas)
                      </label>
                      {formData.selectedSizes.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, selectedSizes: [] }))}
                          className="text-[10px] text-red-600 hover:underline font-bold"
                        >
                          Limpiar Tallas
                        </button>
                      )}
                    </div>

                    {/* Preset Size Chips - Clothing */}
                    <div>
                      <span className="text-[10px] text-gray-500 block mb-1 font-semibold">Tallas Ropa estándar:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {CLOTHING_SIZES_PRESETS.map(sz => {
                          const isSelected = formData.selectedSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleToggleSize(sz)}
                              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all border ${
                                isSelected
                                  ? 'bg-[#9E0D0D] text-white border-[#9E0D0D] shadow-xs'
                                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {sz} {isSelected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Preset Size Chips - Numeros / Calzado */}
                    <div className="pt-1">
                      <span className="text-[10px] text-gray-500 block mb-1 font-semibold">Tallas Números / Calzado:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {NUMERIC_SIZES_PRESETS.map(sz => {
                          const isSelected = formData.selectedSizes.includes(sz);
                          return (
                            <button
                              key={sz}
                              type="button"
                              onClick={() => handleToggleSize(sz)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                                isSelected
                                  ? 'bg-purple-700 text-white border-purple-700 shadow-xs'
                                  : 'bg-gray-100 text-gray-700 border-gray-200 hover:bg-gray-200'
                              }`}
                            >
                              {sz} {isSelected && '✓'}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Size Addition */}
                    <div className="flex gap-2 pt-1">
                      <input
                        type="text"
                        placeholder="Escribir otra talla personalizada (ej: 38, XXXL)..."
                        value={formData.customSizeInput}
                        onChange={e => setFormData({ ...formData, customSizeInput: e.target.value })}
                        className="flex-1 p-2 bg-gray-50 border rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={handleAddCustomSize}
                        className="px-3 py-2 bg-purple-700 text-white font-bold rounded-lg text-xs hover:bg-purple-800"
                      >
                        + Agregar Talla
                      </button>
                    </div>

                    {/* Selected Sizes Chips Badge View */}
                    {formData.selectedSizes.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[10px] font-bold text-gray-600 block mb-1">Tallas asignadas al producto:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.selectedSizes.map(sz => (
                            <span
                              key={sz}
                              className="inline-flex items-center gap-1 bg-purple-100 text-purple-900 border border-purple-200 px-2.5 py-1 rounded-md text-xs font-black"
                            >
                              {sz}
                              <button
                                type="button"
                                onClick={() => handleToggleSize(sz)}
                                className="text-purple-600 hover:text-red-600 font-bold ml-1"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2. SELECCIÓN DE COLORES */}
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-purple-100">
                    <div className="flex items-center justify-between">
                      <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-purple-700" />
                        2. Seleccionar Colores ({formData.selectedColors.length} elegidos)
                      </label>
                      {formData.selectedColors.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, selectedColors: [] }))}
                          className="text-[10px] text-red-600 hover:underline font-bold"
                        >
                          Limpiar Colores
                        </button>
                      )}
                    </div>

                    {/* Color Presets */}
                    <div className="flex flex-wrap gap-1.5">
                      {PRESET_COLORS.map(c => {
                        const isSelected = formData.selectedColors.some(
                          sc => sc.name.toLowerCase() === c.name.toLowerCase()
                        );
                        return (
                          <button
                            key={c.name}
                            type="button"
                            onClick={() => handleToggleColor(c)}
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border ${
                              isSelected
                                ? 'bg-purple-900 text-white border-purple-900 ring-2 ring-purple-400'
                                : 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100'
                            }`}
                          >
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-gray-300 shrink-0"
                              style={{ backgroundColor: c.hex }}
                            />
                            <span>{c.name}</span>
                            {isSelected && <span className="text-[10px] font-black">✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    {/* Custom Color Creator */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-1 items-center">
                      <input
                        type="text"
                        placeholder="Nombre de color personalizado (Ej: Palo de Rosa)..."
                        value={formData.customColorName}
                        onChange={e => setFormData({ ...formData, customColorName: e.target.value })}
                        className="flex-1 w-full p-2 bg-gray-50 border rounded-lg text-xs"
                      />
                      <div className="flex items-center gap-2 shrink-0">
                        <input
                          type="color"
                          value={formData.customColorHex}
                          onChange={e => setFormData({ ...formData, customColorHex: e.target.value })}
                          className="w-8 h-8 p-0.5 border rounded-lg cursor-pointer bg-white"
                          title="Seleccionar código Hex"
                        />
                        <button
                          type="button"
                          onClick={handleAddCustomColor}
                          className="px-3 py-2 bg-purple-700 text-white font-bold rounded-lg text-xs hover:bg-purple-800"
                        >
                          + Agregar Color
                        </button>
                      </div>
                    </div>

                    {/* Selected Colors Badge View */}
                    {formData.selectedColors.length > 0 && (
                      <div className="pt-2 border-t border-gray-100">
                        <span className="text-[10px] font-bold text-gray-600 block mb-1">Colores asignados al producto:</span>
                        <div className="flex flex-wrap gap-1.5">
                          {formData.selectedColors.map((col, idx) => (
                            <span
                              key={idx}
                              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-900 border border-gray-300 px-2.5 py-1 rounded-md text-xs font-bold"
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-gray-400 shrink-0"
                                style={{ backgroundColor: col.hex }}
                              />
                              <span>{col.name}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveColor(idx)}
                                className="text-gray-500 hover:text-red-600 font-bold ml-0.5"
                              >
                                ×
                              </button>
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 2.1 ASIGNACIÓN DE FOTOS POR VARIANTE DE COLOR */}
                  {formData.selectedColors.length > 0 && (
                    <div className="bg-purple-50/70 p-3.5 rounded-2xl border border-purple-200 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <label className="font-extrabold text-purple-950 text-xs uppercase flex items-center gap-1.5">
                          <ImageIcon className="w-4 h-4 text-purple-700" />
                          2.1 Asignación de Fotografías por Variante de Color
                        </label>
                        <span className="text-[10px] text-purple-900 bg-purple-100 font-extrabold px-2.5 py-0.5 rounded-full border border-purple-200">
                          Cambio Dinámico en Tienda
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        Asigna una foto exclusiva a cada color activado. Al seleccionar este color en la tienda, la imagen del producto cambiará automáticamente.
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {formData.selectedColors.map((col, idx) => {
                          const colImg = col.imageUrl || formData.colorImages[col.name] || '';
                          const validGalleryImgs = formData.images.filter(img => img.trim().length > 0);

                          return (
                            <div key={idx} className="bg-white p-3 rounded-xl border border-purple-200 flex flex-col justify-between space-y-2 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="w-4 h-4 rounded-full border border-gray-400 shadow-2xs shrink-0" style={{ backgroundColor: col.hex }} />
                                  <span className="font-bold text-gray-900 text-xs">{col.name}</span>
                                </div>
                                {colImg ? (
                                  <span className="text-[9px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                                    ✓ Foto Vinculada
                                  </span>
                                ) : (
                                  <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded">
                                    Sin Foto Específica
                                  </span>
                                )}
                              </div>

                              <div className="flex items-center gap-3 pt-1">
                                <div className="w-14 h-14 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shrink-0 flex items-center justify-center">
                                  {colImg ? (
                                    <img src={colImg} alt={col.name} className="w-full h-full object-cover" />
                                  ) : (
                                    <span className="text-[9px] text-gray-400 text-center px-1">Gral</span>
                                  )}
                                </div>

                                <div className="flex-1 space-y-1.5 text-[10px]">
                                  <label className="block bg-slate-800 hover:bg-slate-900 text-white font-bold py-1 px-2.5 text-center rounded cursor-pointer transition-colors shadow-2xs">
                                    Subir Foto para {col.name}
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={e => handleColorImageFileChange(idx, col.name, e)}
                                      className="hidden"
                                    />
                                  </label>

                                  {validGalleryImgs.length > 0 && (
                                    <select
                                      value={colImg}
                                      onChange={e => handleColorImageUrlChange(idx, col.name, e.target.value)}
                                      className="w-full p-1 border rounded bg-gray-50 text-[10px] font-bold text-gray-800 outline-hidden focus:border-purple-600"
                                    >
                                      <option value="">-- O Usar Foto de Galería --</option>
                                      {validGalleryImgs.map((img, i) => (
                                        <option key={i} value={img}>Foto {i + 1} de Galería</option>
                                      ))}
                                    </select>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* 3. STOCK INDIVIDUAL POR VARIANTE (TALLA Y COLOR) */}
                  {formData.productType === 'variable' &&
                    (formData.selectedSizes.length > 0 || formData.selectedColors.length > 0) && (
                      <div className="bg-amber-50/70 p-3.5 rounded-2xl border border-amber-200 space-y-3">
                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <label className="font-extrabold text-gray-900 text-xs uppercase flex items-center gap-1.5">
                            <Package className="w-4 h-4 text-[#9E0D0D]" />
                            3. Inventario Individual por Variante (Stock de cada Talla / Color)
                          </label>
                          <span className="text-xs font-black text-[#9E0D0D] bg-white border border-amber-300 px-3 py-1 rounded-xl shadow-2xs">
                            Total Calculado: {getCombinations(formData.selectedSizes, formData.selectedColors).reduce((acc, c) => {
                              const key = `${c.size || 'ALL'}__${c.color || 'ALL'}`;
                              return acc + (formData.variantStockMap[key] !== undefined ? Number(formData.variantStockMap[key]) : 5);
                            }, 0)} pzas
                          </span>
                        </div>
                        <p className="text-[11px] text-gray-600">
                          Define el inventario disponible de cada talla y/o color. Cuando un cliente compre una talla/color en la tienda, su inventario específico se actualizará de forma automática.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1">
                          {getCombinations(formData.selectedSizes, formData.selectedColors).map((c, idx) => {
                            const key = `${c.size || 'ALL'}__${c.color || 'ALL'}`;
                            const currentStock = formData.variantStockMap[key] !== undefined ? formData.variantStockMap[key] : 5;
                            return (
                              <div key={idx} className="bg-white p-2.5 rounded-xl border border-gray-200 flex items-center justify-between gap-2 shadow-2xs">
                                <div className="text-xs">
                                  <span className="font-bold text-gray-900 block">
                                    {c.size && `Talla: ${c.size}`} {c.size && c.color && ' / '} {c.color && `Color: ${c.color}`}
                                  </span>
                                  <span className={`text-[10px] font-bold ${currentStock <= 0 ? 'text-red-600' : currentStock <= 3 ? 'text-amber-600 font-black' : 'text-emerald-700'}`}>
                                    {currentStock <= 0 ? '❌ AGOTADO' : currentStock <= 3 ? '⚡ CRÍTICO' : '✓ En Stock'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[10px] text-gray-500 font-bold">Stock:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={currentStock}
                                    onChange={e => {
                                      const val = Math.max(0, parseInt(e.target.value) || 0);
                                      setFormData(prev => ({
                                        ...prev,
                                        variantStockMap: {
                                          ...prev.variantStockMap,
                                          [key]: val
                                        }
                                      }));
                                    }}
                                    className="w-16 p-1.5 border rounded-lg text-xs font-black text-center bg-gray-50 focus:border-[#9E0D0D] outline-hidden"
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                </div>
              )}

              {/* Product Photographs (Max 5: 1 Primary + 4 Secondary) */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-black text-gray-900 text-xs uppercase flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-[#9E0D0D]" />
                    Fotografías del Producto (Máximo 5 imágenes: 1 Principal + 4 Secundarias)
                  </label>
                  <span className="text-[10px] text-gray-500 font-mono">
                    {formData.images.filter(Boolean).length}/5 cargadas
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
                  {formData.images.map((imgUrl, index) => (
                    <div
                      key={index}
                      className="bg-white p-2 rounded-xl border border-gray-200 flex flex-col justify-between space-y-2 relative"
                    >
                      <span className="text-[9px] font-black uppercase text-gray-500">
                        {index === 0 ? '1. Principal' : `${index + 1}. Secundaria`}
                      </span>

                      {/* Image Preview */}
                      <div className="relative h-20 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                        {imgUrl ? (
                          <>
                            <img src={imgUrl} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleRemoveImage(index)}
                              className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 shadow-xs"
                              title="Borrar foto"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[10px] text-gray-400 text-center px-1">Sin foto</span>
                        )}
                      </div>

                      {/* File Upload Input */}
                      <div>
                        <label className="block bg-slate-800 hover:bg-slate-900 text-white text-[9px] font-bold py-1 text-center rounded cursor-pointer transition-colors">
                          Subir Archivo
                          <input
                            type="file"
                            accept="image/*"
                            onChange={e => handleImageFileChange(index, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* URL input fallback */}
                      <input
                        type="text"
                        placeholder="URL de foto..."
                        value={imgUrl}
                        onChange={e => handleImageUrlChange(index, e.target.value)}
                        className="w-full text-[10px] p-1 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* YouTube Video Embed Link */}
              <div className="bg-red-50/40 p-3 rounded-2xl border border-red-200 space-y-2">
                <label className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                  <Video className="w-4 h-4 text-red-600" />
                  Incrustar Link o ID de Video de YouTube (opcional)
                </label>
                <p className="text-[11px] text-gray-500">
                  Pega el enlace de YouTube (ej. https://www.youtube.com/watch?v=VIDEO_ID o ID corto). Se mostrará en la ficha técnica del producto.
                </p>
                <input
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={e => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono text-xs"
                />

                {formData.youtubeUrl && getYouTubeEmbedUrl(formData.youtubeUrl) && (
                  <div className="mt-2 rounded-xl overflow-hidden border border-red-200 aspect-video max-h-40 bg-black">
                    <iframe
                      src={getYouTubeEmbedUrl(formData.youtubeUrl)!}
                      title="Vista Previa YouTube"
                      className="w-full h-full"
                      allowFullScreen
                    />
                  </div>
                )}
              </div>

              {/* SKU & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">SKU de Producto *</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono text-xs"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Descripción corta</label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full p-2.5 border rounded-xl h-16 text-xs"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingProd ? 'Guardar Cambios' : 'Registrar Producto'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-5 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs uppercase"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Quick Category Modal from Product Form */}
      {showQuickCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9E0D0D]" />
                Agregar Nueva Categoría
              </h3>
              <button
                onClick={() => setShowQuickCategoryModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleQuickAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre de Categoría *</label>
                <input
                  type="text"
                  placeholder="Ej: Ropa Deportiva, Accesorios"
                  value={quickCatName}
                  onChange={e => setQuickCatName(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Identificador Slug (Opcional)</label>
                <input
                  type="text"
                  placeholder="ej: deportiva, accesorios"
                  value={quickCatSlug}
                  onChange={e => setQuickCatSlug(e.target.value)}
                  className="w-full p-2.5 border rounded-xl font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subcategorías (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="Ej: Playeras, Pants, Tenis, Gorras"
                  value={quickCatSubs}
                  onChange={e => setQuickCatSubs(e.target.value)}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  placeholder="Breve descripción de los productos..."
                  value={quickCatDesc}
                  onChange={e => setQuickCatDesc(e.target.value)}
                  className="w-full p-2.5 border rounded-xl h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-[#9E0D0D] hover:bg-red-900 text-white font-bold py-3 rounded-xl uppercase text-xs"
                >
                  Guardar Categoría
                </button>
                <button
                  type="button"
                  onClick={() => setShowQuickCategoryModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl text-xs uppercase"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
