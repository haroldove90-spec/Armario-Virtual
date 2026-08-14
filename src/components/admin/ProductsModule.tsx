import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductFormPage } from './ProductFormPage';
import {
  Package,
  Plus,
  Search,
  Edit2,
  Trash2,
  AlertCircle,
  Video,
  Sliders,
  Ruler,
  CheckCircle2,
  Eye,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export const ProductsModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, categories, addCategory } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('todas');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingProd(null);
    setViewMode('form');
  };

  const handleStartEdit = (p: Product) => {
    setEditingProd(p);
    setViewMode('form');
  };

  const handleSaveProduct = async (productData: Product, closeAfterSave: boolean = true) => {
    const isExisting = Boolean(editingProd) || products.some(p => p.id === productData.id);
    if (isExisting) {
      await updateProduct(productData.id, productData);
      showToast(`✅ Cambios guardados para "${productData.name}".`);
      setEditingProd(productData);
    } else {
      await addProduct(productData);
      showToast(`🎉 Producto "${productData.name}" guardado exitosamente.`);
      setEditingProd(productData);
    }
    if (closeAfterSave) {
      setViewMode('list');
      setEditingProd(null);
    }
  };

  const handleCancelForm = () => {
    setViewMode('list');
    setEditingProd(null);
  };

  const handleQuickAddCategory = async (name: string, slug: string, desc: string, subs: string) => {
    const finalSlug = (slug || name).toLowerCase().replace(/\s+/g, '-');
    const subList = subs
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
      .map((s, idx) => ({
        id: `sub-${Date.now()}-${idx}`,
        name: s,
        slug: s,
        active: true
      }));

    await addCategory({
      name,
      slug: finalSlug,
      iconName: 'Package',
      description: desc || `Productos de la categoría ${name}`,
      active: true,
      subcategories: subList.length > 0 ? subList : [{ id: `sub-${Date.now()}`, name: 'General', slug: 'General', active: true }]
    });
    showToast(`Categoría "${name}" agregada con éxito.`);
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(search.toLowerCase()));

    const matchesCat =
      selectedCat === 'todas' ||
      p.category === selectedCat ||
      p.category.toLowerCase() === selectedCat.toLowerCase();

    return matchesSearch && matchesCat;
  });

  const lowStockProducts = products.filter(p => p.stock <= 3);

  // If in Form mode, display the dedicated separate Product Registration/Editing Page
  if (viewMode === 'form') {
    return (
      <ProductFormPage
        editingProduct={editingProd}
        categories={categories}
        onSave={handleSaveProduct}
        onCancel={handleCancelForm}
        onQuickAddCategory={handleQuickAddCategory}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-2xl shadow-2xl border border-slate-700 flex items-center gap-3 text-xs font-bold animate-slide-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-red-50 text-[#9E0D0D] rounded-xl">
              <Package className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-xl font-black text-gray-900">
                Catálogo e Inventario de Productos ({products.length})
              </h3>
              <p className="text-xs text-gray-500">
                Gestión avanzada de artículos, variantes de tallas/colores y tablas de medidas personalizadas.
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={handleStartCreate}
          className="bg-[#9E0D0D] hover:bg-red-900 text-white text-xs font-extrabold px-5 py-3 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Registrar Nuevo Producto</span>
        </button>
      </div>

      {/* Low Stock Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-fade-in">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-amber-200 text-amber-900 rounded-xl mt-0.5">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-black text-amber-950 text-xs sm:text-sm">
                ¡Atención! {lowStockProducts.length} producto(s) con inventario bajo o agotado
              </h4>
              <p className="text-[11px] text-amber-800 mt-0.5">
                Los siguientes artículos tienen 3 o menos unidades disponibles en bodega:
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {lowStockProducts.map(lp => (
                  <span
                    key={lp.id}
                    className="inline-flex items-center gap-1 bg-white border border-amber-300 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-md"
                  >
                    {lp.name} ({lp.stock} pzas)
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-3 bg-white p-4 rounded-2xl border border-gray-200 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre de producto, SKU o subcategoría..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:bg-white focus:border-[#9E0D0D] outline-hidden transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={selectedCat}
            onChange={e => setSelectedCat(e.target.value)}
            className="w-full sm:w-auto px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:border-[#9E0D0D] outline-hidden cursor-pointer"
          >
            <option value="todas">Todos los departamentos</option>
            {categories.map(c => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4">Producto & Fotos</th>
                <th className="p-4">Tipo & Variantes</th>
                <th className="p-4">SKU / Categ</th>
                <th className="p-4">Precio & Oferta</th>
                <th className="p-4">Guía de Tallas</th>
                <th className="p-4">Stock</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-400 italic">
                    No se encontraron productos coincidentes con los filtros.
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isVariable =
                    p.productType === 'variable' ||
                    (p.sizes && p.sizes.length > 0) ||
                    (p.colors && p.colors.length > 0);
                  const hasSizeGuide = p.sizeGuide?.enabled && p.sizeGuide?.rows && p.sizeGuide.rows.length > 0;

                  return (
                    <tr key={p.id} className="hover:bg-red-50/20 transition-colors">
                      <td className="p-4 flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-gray-50">
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
                            <span className="font-black text-red-700 text-sm">
                              ${(p.offerPrice || p.price).toFixed(2)}
                            </span>
                            <span className="block text-[10px] text-gray-400 line-through">
                              ${(p.originalPrice || p.price).toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <div>
                            <span className="font-black text-gray-900 text-sm">${p.price.toFixed(2)}</span>
                            {p.originalPrice && p.originalPrice > p.price && (
                              <span className="block text-[10px] text-gray-400 line-through">
                                ${(p.originalPrice || p.price).toFixed(2)}
                              </span>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="p-4">
                        {hasSizeGuide ? (
                          <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black px-2 py-0.5 rounded-full border border-amber-200">
                            <Ruler className="w-3 h-3 text-amber-600" />
                            {p.sizeGuide?.rows?.length || 0} Tallas
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">No configurada</span>
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

                      <td className="p-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          onClick={() => handleStartEdit(p)}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-[#9E0D0D] hover:text-white text-slate-700 rounded-xl font-bold transition-all inline-flex items-center gap-1 cursor-pointer"
                          title="Editar Producto y Tabla de Medidas"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>Editar</span>
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`¿Estás seguro de eliminar el producto "${p.name}"?`)) {
                              deleteProduct(p.id);
                              showToast(`Producto "${p.name}" eliminado.`);
                            }
                          }}
                          className="p-1.5 text-red-500 hover:bg-red-100 rounded-xl transition-colors cursor-pointer"
                          title="Eliminar Producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
