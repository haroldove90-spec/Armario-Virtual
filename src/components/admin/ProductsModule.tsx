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
  ExternalLink,
  AlertTriangle,
  X,
  Sparkles,
  Database,
  UploadCloud,
  Copy
} from 'lucide-react';

export const ProductsModule: React.FC = () => {
  const {
    products,
    addProduct,
    duplicateProduct,
    updateProduct,
    deleteProduct,
    clearSampleProducts,
    clearAllProducts,
    categories,
    addCategory,
    seedAllDataToSupabase,
    reloadFromSupabase
  } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('todas');
  const [statusFilter, setStatusFilter] = useState<'todos' | 'publicados' | 'borradores'>('todos');
  const [viewMode, setViewMode] = useState<'list' | 'form'>('list');
  const [editingProd, setEditingProd] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showCleanModal, setShowCleanModal] = useState<boolean>(false);
  const [isCleaning, setIsCleaning] = useState<boolean>(false);
  const [isSyncingSupabase, setIsSyncingSupabase] = useState<boolean>(false);
  const [isReloadingSupabase, setIsReloadingSupabase] = useState<boolean>(false);

  const handleSyncToSupabase = async () => {
    setIsSyncingSupabase(true);
    try {
      await seedAllDataToSupabase();
      showToast('☁️ Catálogo completo sincronizado con Supabase');
    } catch (e: any) {
      showToast(`⚠️ Error al sincronizar: ${e.message || e}`);
    } finally {
      setIsSyncingSupabase(false);
    }
  };

  const handleReloadFromSupabase = async () => {
    setIsReloadingSupabase(true);
    try {
      await reloadFromSupabase();
      showToast('🔄 Datos recargados desde Supabase');
    } catch (e: any) {
      showToast(`⚠️ Error al recargar: ${e.message || e}`);
    } finally {
      setIsReloadingSupabase(false);
    }
  };

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

  const handleTogglePublish = async (p: Product) => {
    const newStatus = p.isPublished === false ? true : false;
    await updateProduct(p.id, { ...p, isPublished: newStatus });
    if (newStatus) {
      showToast(`🚀 Producto "${p.name}" PUBLICADO en la tienda.`);
    } else {
      showToast(`🔒 Producto "${p.name}" cambiado a BORRADOR (oculto en tienda).`);
    }
  };

  const handleSaveProduct = async (productData: Product, closeAfterSave: boolean = true) => {
    const isExisting = Boolean(editingProd) || products.some(p => p.id === productData.id);
    if (isExisting) {
      await updateProduct(productData.id, productData);
      if (productData.isPublished === false) {
        showToast(`📝 Producto "${productData.name}" guardado como BORRADOR (No publicado).`);
      } else {
        showToast(`✅ Cambios publicados para "${productData.name}".`);
      }
      setEditingProd(productData);
    } else {
      await addProduct(productData);
      if (productData.isPublished === false) {
        showToast(`📝 Producto "${productData.name}" registrado como BORRADOR (No publicado).`);
      } else {
        showToast(`🎉 Producto "${productData.name}" registrado y PUBLICADO en la tienda.`);
      }
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

  const getCategoryDisplayName = (catValue: string | undefined): string => {
    if (!catValue) return 'General';
    const clean = catValue.trim().toLowerCase();
    const found = categories.find(
      c =>
        c.slug.toLowerCase() === clean ||
        c.id.toLowerCase() === clean ||
        c.name.toLowerCase() === clean
    );
    return found ? found.name : catValue;
  };

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      (p.subcategory && p.subcategory.toLowerCase().includes(search.toLowerCase())) ||
      getCategoryDisplayName(p.category).toLowerCase().includes(search.toLowerCase());

    const activeCatObj = categories.find(
      c => c.slug === selectedCat || c.id === selectedCat || c.name.toLowerCase() === selectedCat.toLowerCase()
    );

    const matchesCat =
      selectedCat === 'todas' ||
      p.category.toLowerCase() === selectedCat.toLowerCase() ||
      (activeCatObj && (
        p.category.toLowerCase() === activeCatObj.slug.toLowerCase() ||
        p.category.toLowerCase() === activeCatObj.id.toLowerCase() ||
        p.category.toLowerCase() === activeCatObj.name.toLowerCase()
      ));

    const matchesStatus =
      statusFilter === 'todos' ||
      (statusFilter === 'publicados' && p.isPublished !== false) ||
      (statusFilter === 'borradores' && p.isPublished === false);

    return matchesSearch && matchesCat && matchesStatus;
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
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
        <div>
          <div className="flex items-center gap-3">
            <span className="p-2 bg-red-50 text-[#9E0D0D] rounded-xl">
              <Package className="w-5 h-5" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black text-gray-900">
                  Catálogo e Inventario de Productos ({products.length})
                </h3>
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <Database className="w-3 h-3 text-emerald-600" />
                  Supabase Conectado
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-0.5">
                Gestión avanzada de artículos, variantes de tallas/colores y tablas de medidas personalizadas.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleReloadFromSupabase}
            disabled={isReloadingSupabase}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Recargar inventario directamente desde la base de datos de Supabase"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isReloadingSupabase ? 'animate-spin text-[#9E0D0D]' : ''}`} />
            <span>{isReloadingSupabase ? 'Recargando...' : 'Recargar de Supabase'}</span>
          </button>

          <button
            onClick={handleSyncToSupabase}
            disabled={isSyncingSupabase || products.length === 0}
            className="bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 text-xs font-bold px-3.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Subir todos los productos y categorías actuales a la base de datos de Supabase"
          >
            <UploadCloud className={`w-4 h-4 ${isSyncingSupabase ? 'animate-bounce text-emerald-600' : ''}`} />
            <span>{isSyncingSupabase ? 'Sincronizando...' : 'Subir a Supabase'}</span>
          </button>

          {products.length > 0 && (
            <button
              onClick={() => setShowCleanModal(true)}
              className="bg-red-50 hover:bg-red-100 text-[#9E0D0D] border border-red-200 text-xs font-extrabold px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
              title="Borrar productos de muestra o vaciar inventario"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}

          <button
            onClick={handleStartCreate}
            className="bg-[#9E0D0D] hover:bg-red-900 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Registrar Nuevo Producto</span>
          </button>
        </div>
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

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'todos' | 'publicados' | 'borradores')}
            className="w-full sm:w-auto px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 focus:border-[#9E0D0D] outline-hidden cursor-pointer"
          >
            <option value="todos">Todos los estados</option>
            <option value="publicados">🟢 Solo Publicados (En tienda)</option>
            <option value="borradores">🟡 Solo Borradores (Ocultos)</option>
          </select>

          {/* Category Filter */}
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
                <th className="p-4">Estado / Tienda</th>
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
                  <td colSpan={8} className="p-12 text-center">
                    <div className="max-w-md mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-200">
                        <Package className="w-6 h-6" />
                      </div>
                      <h5 className="font-black text-slate-800 text-sm">
                        {products.length === 0
                          ? 'No hay productos registrados en el inventario actual'
                          : 'No se encontraron productos coincidentes con los filtros seleccionados'}
                      </h5>
                      <p className="text-xs text-slate-500">
                        {products.length === 0
                          ? 'Comienza agregando tu primer producto manualmente con imágenes, variantes y medidas.'
                          : 'Intenta cambiar los filtros de búsqueda, categoría o estado para ver tus artículos.'}
                      </p>
                      {products.length === 0 && (
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                          <button
                            onClick={handleStartCreate}
                            className="px-5 py-2.5 bg-[#9E0D0D] hover:bg-red-900 text-white rounded-xl text-xs font-black shadow-md transition-all cursor-pointer flex items-center gap-2"
                          >
                            <Plus className="w-4 h-4" />
                            <span>Crear Producto</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filtered.map(p => {
                  const isVariable =
                    p.productType === 'variable' ||
                    (p.sizes && p.sizes.length > 0) ||
                    (p.colors && p.colors.length > 0);
                  const hasSizeGuide = p.sizeGuide?.enabled && p.sizeGuide?.rows && p.sizeGuide.rows.length > 0;
                  const isPub = p.isPublished !== false;

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
                          <p className="text-[11px] text-gray-500 line-clamp-1">
                            {getCategoryDisplayName(p.category)} {p.subcategory && p.subcategory !== 'General' ? `• ${p.subcategory}` : ''}
                          </p>
                        </div>
                      </td>

                      {/* Estado de Publicación */}
                      <td className="p-4">
                        {isPub ? (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-[10px] font-black px-2.5 py-1 rounded-full border border-emerald-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                              Publicado
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(p)}
                              className="text-[10px] text-gray-400 hover:text-amber-700 underline font-bold transition-colors cursor-pointer"
                              title="Pausar y cambiar a borrador"
                            >
                              Ocultar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-900 text-[10px] font-black px-2.5 py-1 rounded-full border border-amber-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                              Borrador
                            </span>
                            <button
                              type="button"
                              onClick={() => handleTogglePublish(p)}
                              className="text-[10px] text-[#9E0D0D] hover:underline font-extrabold bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-0.5 rounded-lg transition-colors cursor-pointer"
                              title="Publicar en la tienda ahora"
                            >
                              Publicar
                            </button>
                          </div>
                        )}
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
                          {getCategoryDisplayName(p.category)}
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
                          onClick={async () => {
                            const copy = await duplicateProduct(p.id);
                            if (copy) {
                              showToast(`📋 Copia creada de "${p.name}". Abrir para editar.`);
                            }
                          }}
                          className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-600 hover:text-white text-blue-700 rounded-xl font-bold transition-all inline-flex items-center gap-1 cursor-pointer border border-blue-200 hover:border-blue-600"
                          title="Duplicar Producto y Fotos (Crea un borrador idéntico)"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          <span>Duplicar</span>
                        </button>
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

      {/* Clean Catalog / Sample Products Modal */}
      {showCleanModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5 animate-scaleUp">
            <div className="flex items-start justify-between gap-3 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-100 text-[#9E0D0D] rounded-2xl">
                  <Trash2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-black text-slate-900 text-base">Limpiar Catálogo de Productos</h4>
                  <p className="text-xs text-slate-500">¿Qué artículos deseas eliminar de la tienda y de Supabase?</p>
                </div>
              </div>
              <button
                onClick={() => setShowCleanModal(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-4 bg-red-50 rounded-2xl border border-red-200 space-y-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-black text-red-950 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-[#9E0D0D]" />
                    Vaciar Catálogo Completo (Empezar desde 0)
                  </h5>
                </div>
                <p className="text-red-800 leading-relaxed text-[11px]">
                  Elimina <strong>TODOS</strong> los productos registrados (tanto en la memoria de la tienda como en la base de datos de Supabase) dejando el inventario completamente en blanco.
                </p>
                <button
                  onClick={async () => {
                    if (window.confirm('⚠️ ¿Confirmas que deseas vaciar TODOS los productos del inventario y de Supabase? Esta acción no se puede deshacer.')) {
                      setIsCleaning(true);
                      await clearAllProducts();
                      setIsCleaning(false);
                      setShowCleanModal(false);
                    }
                  }}
                  disabled={isCleaning}
                  className="w-full mt-2 bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold py-2.5 px-4 rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isCleaning ? 'Vaciando...' : 'Vaciar Catálogo Completo (0 Productos)'}</span>
                </button>
              </div>
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setShowCleanModal(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
