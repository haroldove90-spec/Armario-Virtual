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
  Sparkles
} from 'lucide-react';

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
    sizesStr: 'CH, M, G, XG',
    colorName: 'Estándar',
    colorHex: '#9E0D0D',
    youtubeUrl: '',
    description: 'Prenda confeccionada con materiales de alta calidad para máxima comodidad.'
  });

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'todas' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

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
    const sizesArray = formData.sizesStr.split(',').map(s => s.trim()).filter(Boolean);
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
        stock: Number(formData.stock),
        sku: formData.sku,
        images: finalImages,
        sizes: sizesArray,
        colors: [{ name: formData.colorName, hex: formData.colorHex }],
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
        stock: Number(formData.stock),
        sku: formData.sku,
        images: finalImages,
        sizes: sizesArray,
        colors: [{ name: formData.colorName, hex: formData.colorHex }],
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

    setFormData({
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
      sizesStr: p.sizes.join(', '),
      colorName: p.colors[0]?.name || 'Estándar',
      colorHex: p.colors[0]?.hex || '#9E0D0D',
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
            Control de stock libre y automático, precios en oferta, fotos secundarias y videos de YouTube.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingProd(null);
            setFormData({
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
              sizesStr: 'CH, M, G, XG',
              colorName: 'Estándar',
              colorHex: '#9E0D0D',
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
                <th className="p-4">SKU / Categ</th>
                <th className="p-4">Precio & Oferta</th>
                <th className="p-4">Stock Automático</th>
                <th className="p-4">Video YT</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map(p => (
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
              ))}
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
              {/* Product Title */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Producto *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Chamarra Acolchada con Gorro Abrigadora"
                  className="w-full p-2.5 border rounded-xl"
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
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full p-2.5 bg-white border rounded-xl font-bold text-gray-800"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.slug}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-800 mb-1">Subcategoría *</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="Ej: Abrigos y Chamarras"
                    className="w-full p-2.5 bg-white border rounded-xl"
                    required
                  />
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

              {/* Sizes & Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Tallas (separadas por coma)</label>
                  <input
                    type="text"
                    placeholder="CH, M, G, XG, 28, 30, 32"
                    value={formData.sizesStr}
                    onChange={e => setFormData({ ...formData, sizesStr: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">SKU de Producto</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={e => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full p-2.5 border rounded-xl font-mono"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold text-gray-700 mb-1">Descripción del Producto</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl h-20 text-xs"
                />
              </div>

              <div className="flex gap-2 pt-3 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md transition-all"
                >
                  {editingProd ? 'Guardar Cambios' : 'Registrar Producto'}
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
