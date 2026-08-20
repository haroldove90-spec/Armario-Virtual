import React, { useState, useEffect } from 'react';
import { Product, Category, CategoryItem, SizeGuide, SizeGuideRow } from '../../types';
import { useStore } from '../../context/StoreContext';
import { uploadImage } from '../../lib/imageUploader';
import { SizeGuideModal } from '../store/SizeGuideModal';
import {
  ArrowLeft,
  Check,
  X,
  Upload,
  Plus,
  Trash2,
  Image as ImageIcon,
  Video,
  Ruler,
  Eye,
  Sparkles,
  Tag,
  Percent,
  Layers,
  Palette,
  Loader2,
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Save,
  ExternalLink
} from 'lucide-react';

interface ProductFormPageProps {
  editingProduct: Product | null;
  categories: CategoryItem[];
  onSave: (product: Product, closeAfterSave?: boolean) => void;
  onCancel: () => void;
  onQuickAddCategory: (name: string, slug: string, desc: string, subs: string) => void;
}

const CLOTHING_SIZES_PRESETS = ['XS', 'CH', 'M', 'G', 'XG', '2XG', '3XG'];
const NUMERIC_SIZES_PRESETS = ['22', '24', '26', '28', '30', '32', '34', '36', '38', '40'];
const SHOE_SIZES_PRESETS = ['22.5', '23', '23.5', '24', '24.5', '25', '25.5', '26', '26.5', '27', '27.5', '28', '29'];

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

export const ProductFormPage: React.FC<ProductFormPageProps> = ({
  editingProduct,
  categories,
  onSave,
  onCancel,
  onQuickAddCategory
}) => {
  const [productId, setProductId] = useState<string>(
    editingProduct?.id || `prod-${Date.now()}`
  );
  const [isCurrentlyPublished, setIsCurrentlyPublished] = useState<boolean>(
    editingProduct ? (editingProduct.isPublished !== false) : true
  );
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [showDraftModal, setShowDraftModal] = useState<boolean>(false);

  // Helper to resolve category slug reliably from any input (slug, id, or name)
  const normalizeCategorySlug = (rawCategory: string | undefined, catList: CategoryItem[]): string => {
    if (!rawCategory) return catList[0]?.slug || 'mujer';
    const clean = rawCategory.trim().toLowerCase();
    const matched = catList.find(
      c => c.slug.toLowerCase() === clean || c.id.toLowerCase() === clean || c.name.toLowerCase() === clean
    );
    return matched ? matched.slug : rawCategory;
  };

  const [productType, setProductType] = useState<'sencillo' | 'variable'>(
    editingProduct?.productType || 'variable'
  );
  const [name, setName] = useState(editingProduct?.name || '');
  const [category, setCategory] = useState<Category>(() =>
    normalizeCategorySlug(editingProduct?.category, categories)
  );
  const [subcategory, setSubcategory] = useState(
    editingProduct?.subcategory || 'General'
  );
  const [price, setPrice] = useState<number>(editingProduct?.price || 399);
  const [originalPrice, setOriginalPrice] = useState<number | undefined>(
    editingProduct?.originalPrice || (editingProduct ? editingProduct.price : 599)
  );
  const [isOffer, setIsOffer] = useState<boolean>(editingProduct?.isOffer || false);
  const [offerPrice, setOfferPrice] = useState<number | undefined>(
    editingProduct?.offerPrice || 299
  );
  const [discountPercentage, setDiscountPercentage] = useState<number>(
    editingProduct?.discountPercentage || 25
  );
  const [stock, setStock] = useState<number>(editingProduct?.stock || 20);
  const [sku, setSku] = useState(
    editingProduct?.sku || `REL-${Math.floor(1000 + Math.random() * 9000)}`
  );
  const [description, setDescription] = useState(
    editingProduct?.description || 'Prenda confeccionada con materiales de máxima calidad.'
  );
  const [youtubeUrl, setYoutubeUrl] = useState(editingProduct?.youtubeUrl || '');
  const [isFeatured, setIsFeatured] = useState(editingProduct?.isFeatured || false);

  // Images state
  const [images, setImages] = useState<string[]>(
    editingProduct?.images && editingProduct.images.length > 0
      ? editingProduct.images
      : ['https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg']
  );
  const [newImageUrlInput, setNewImageUrlInput] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  // Variants state - strictly empty by default for new products (no pre-assigned phantom sizes)
  const [selectedSizes, setSelectedSizes] = useState<string[]>(() => {
    if (editingProduct?.sizes && Array.isArray(editingProduct.sizes)) {
      return editingProduct.sizes;
    }
    return [];
  });
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string; imageUrl?: string }[]>(() => {
    if (editingProduct?.colors && Array.isArray(editingProduct.colors)) {
      return editingProduct.colors.map(c => typeof c === 'string' ? { name: c, hex: '#1A1A1A' } : c);
    }
    return [];
  });
  const [customColorName, setCustomColorName] = useState('');
  const [customColorHex, setCustomColorHex] = useState('#9E0D0D');

  const [colorImages, setColorImages] = useState<Record<string, string[]>>(() => {
    if (!editingProduct?.colorImages) return {};
    const res: Record<string, string[]> = {};
    Object.entries(editingProduct.colorImages).forEach(([cName, val]) => {
      res[cName] = Array.isArray(val) ? val : [val];
    });
    return res;
  });

  const [variantStockMap, setVariantStockMap] = useState<Record<string, number>>(() => {
    if (!editingProduct?.variantStock) return {};
    const map: Record<string, number> = {};
    editingProduct.variantStock.forEach(v => {
      const key = `${v.size || ''}_${v.color || ''}`;
      map[key] = v.stock;
    });
    return map;
  });

  const [bulkStockInput, setBulkStockInput] = useState<number>(10);

  // Store Context for size guide templates & navigation
  const { sizeGuideTemplates, setAdminTab } = useStore();

  // Helper to calculate total variant stock dynamically
  const calculateTotalVariantStock = (): number => {
    if (productType !== 'variable') return Number(stock) || 0;
    if (selectedSizes.length === 0 && selectedColors.length === 0) return Number(stock) || 0;

    const sizesToIterate = selectedSizes.length > 0 ? selectedSizes : [''];
    const colorsToIterate = selectedColors.length > 0 ? selectedColors : [{ name: '' }];

    let sum = 0;
    for (const sz of sizesToIterate) {
      for (const col of colorsToIterate) {
        const key = `${sz}_${col.name}`;
        const val = variantStockMap[key];
        sum += val !== undefined ? Math.max(0, Number(val)) : 0;
      }
    }
    return sum;
  };

  // Auto-initialize default stock (e.g. 5) for newly selected sizes or colors
  useEffect(() => {
    if (productType === 'variable') {
      const sizesToIterate = selectedSizes.length > 0 ? selectedSizes : [''];
      const colorsToIterate = selectedColors.length > 0 ? selectedColors : [{ name: '' }];

      setVariantStockMap(prev => {
        let changed = false;
        const next = { ...prev };
        for (const sz of sizesToIterate) {
          for (const col of colorsToIterate) {
            const key = `${sz}_${col.name}`;
            if (next[key] === undefined) {
              next[key] = 5;
              changed = true;
            }
          }
        }
        return changed ? next : prev;
      });
    }
  }, [productType, selectedSizes, selectedColors]);

  // Bulk update stock across all size/color combinations
  const handleApplyBulkStock = (amount: number) => {
    const safeAmt = Math.max(0, Number(amount) || 0);
    const newMap: Record<string, number> = {};
    const sizesToIterate = selectedSizes.length > 0 ? selectedSizes : [''];
    const colorsToIterate = selectedColors.length > 0 ? selectedColors : [{ name: '' }];

    for (const sz of sizesToIterate) {
      for (const col of colorsToIterate) {
        const key = `${sz}_${col.name}`;
        newMap[key] = safeAmt;
      }
    }
    setVariantStockMap(newMap);
    setStock(safeAmt * sizesToIterate.length * colorsToIterate.length);
  };

  // Update a single variant stock
  const handleUpdateSingleVariantStock = (sizeName: string, colorName: string, val: number) => {
    const key = `${sizeName}_${colorName}`;
    const safeVal = Math.max(0, Number(val) || 0);
    setVariantStockMap(prev => ({
      ...prev,
      [key]: safeVal
    }));
  };

  // Increment / Decrement single variant stock
  const handleDeltaSingleVariantStock = (sizeName: string, colorName: string, delta: number) => {
    const key = `${sizeName}_${colorName}`;
    const current = variantStockMap[key] !== undefined ? Number(variantStockMap[key]) : 0;
    const nextVal = Math.max(0, current + delta);
    setVariantStockMap(prev => ({
      ...prev,
      [key]: nextVal
    }));
  };

  // Size Guide Selection State
  const [sizeGuideEnabled, setSizeGuideEnabled] = useState<boolean>(
    editingProduct?.sizeGuideTemplateId
      ? true
      : editingProduct?.sizeGuide?.enabled !== undefined
      ? editingProduct.sizeGuide.enabled
      : true
  );

  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(() => {
    if (editingProduct?.sizeGuideTemplateId) {
      return editingProduct.sizeGuideTemplateId;
    }
    if (editingProduct?.sizeGuide?.templateId) {
      return editingProduct.sizeGuide.templateId;
    }
    if (editingProduct?.category === 'calzado') {
      const match = sizeGuideTemplates.find(t => t.category === 'calzado');
      if (match) return match.id;
    } else if (editingProduct?.category === 'hombre') {
      const match = sizeGuideTemplates.find(t => t.category === 'hombre');
      if (match) return match.id;
    }
    return sizeGuideTemplates[0]?.id || 'template-tops';
  });

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  // Quick Category Modal
  const [showQuickCategoryModal, setShowQuickCategoryModal] = useState(false);
  const [quickCatName, setQuickCatName] = useState('');
  const [quickCatSlug, setQuickCatSlug] = useState('');
  const [quickCatDesc, setQuickCatDesc] = useState('');
  const [quickCatSubs, setQuickCatSubs] = useState('');

  // Auto calculate discount percentage
  useEffect(() => {
    const base = originalPrice || price;
    if (isOffer && offerPrice && offerPrice < base) {
      const disc = Math.round(((base - offerPrice) / base) * 100);
      setDiscountPercentage(disc);
    }
  }, [price, originalPrice, isOffer, offerPrice]);

  const currentCategoryObj = categories.find(
    c =>
      c.slug.toLowerCase() === (category || '').toLowerCase() ||
      c.id.toLowerCase() === (category || '').toLowerCase() ||
      c.name.toLowerCase() === (category || '').toLowerCase()
  );
  const effectiveCategorySlug = currentCategoryObj ? currentCategoryObj.slug : category;
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  // General Image handlers
  const handleAddGeneralImage = (url: string) => {
    if (!url.trim()) return;
    setImages(prev => [...prev, url.trim()]);
    setNewImageUrlInput('');
  };

  const handleRemoveGeneralImage = (index: number) => {
    if (images.length <= 1) {
      alert('Debes mantener al menos una imagen para el producto.');
      return;
    }
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadGeneralImageFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) {
          setImages(prev => [...prev, uploadedUrl]);
        }
      }
    } catch (err) {
      console.error('Error uploading general image:', err);
      alert('Hubo un error al subir la imagen.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // Color Photos handlers
  const handleAddColorImage = (colorName: string, url: string) => {
    if (!url.trim()) return;
    setColorImages(prev => ({
      ...prev,
      [colorName]: [...(prev[colorName] || []), url.trim()]
    }));
  };

  const handleRemoveColorImage = (colorName: string, imgIdx: number) => {
    setColorImages(prev => {
      const current = prev[colorName] || [];
      const updated = current.filter((_, idx) => idx !== imgIdx);
      const newMap = { ...prev };
      if (updated.length === 0) {
        delete newMap[colorName];
      } else {
        newMap[colorName] = updated;
      }
      return newMap;
    });
  };

  const handleUploadColorImageFile = async (colorName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const uploadedUrl = await uploadImage(file);
        if (uploadedUrl) {
          setColorImages(prev => ({
            ...prev,
            [colorName]: [...(prev[colorName] || []), uploadedUrl]
          }));
        }
      }
    } catch (err) {
      console.error('Error uploading color image:', err);
      alert('Error al subir la imagen para este color.');
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  // YouTube Helper
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

  // Currently selected template object
  const currentTemplate = sizeGuideTemplates.find(t => t.id === selectedTemplateId) || sizeGuideTemplates[0];

  // Helper to compile product object
  const buildProductData = (isPublishedFlag: boolean = true): Product => {
    // Build variant stock array
    const variantStockList = [];
    let computedTotalStock = 0;

    if (productType === 'variable') {
      const sizesToIterate = selectedSizes.length > 0 ? selectedSizes : [undefined];
      const colorsToIterate = selectedColors.length > 0 ? selectedColors : [undefined];

      for (const sz of sizesToIterate) {
        for (const col of colorsToIterate) {
          const key = `${sz || ''}_${col?.name || ''}`;
          const vStock = variantStockMap[key] !== undefined ? Math.max(0, Number(variantStockMap[key])) : 0;
          computedTotalStock += vStock;

          variantStockList.push({
            id: `vs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            size: sz,
            color: col?.name,
            stock: vStock,
            sku: `${sku}-${sz || 'UNI'}-${col?.name ? col.name.slice(0, 3).toUpperCase() : 'DEF'}`
          });
        }
      }
    }

    const finalStock = productType === 'variable' && (selectedSizes.length > 0 || selectedColors.length > 0)
      ? computedTotalStock
      : (Number(stock) || 0);

    return {
      id: productId,
      productType,
      name: name.trim() || 'Nuevo Producto',
      category: (currentCategoryObj ? currentCategoryObj.slug : category).trim(),
      subcategory: subcategory.trim() || 'General',
      price: Number(price) || 0,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      isOffer: Boolean(isOffer),
      offerPrice: isOffer && offerPrice ? Number(offerPrice) : undefined,
      discountPercentage: isOffer ? discountPercentage : 0,
      stock: finalStock,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      images: images.length > 0 ? images : ['https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'],
      sizes: (selectedSizes && selectedSizes.length > 0) ? selectedSizes : (productType === 'variable' ? selectedSizes : []),
      colors: productType === 'variable' ? selectedColors : [],
      colorImages: productType === 'variable' ? colorImages : {},
      variantStock: variantStockList,
      sizeGuideTemplateId: sizeGuideEnabled ? selectedTemplateId : undefined,
      sizeGuide: sizeGuideEnabled && currentTemplate ? {
        enabled: true,
        templateId: currentTemplate.id,
        title: currentTemplate.name,
        imageUrl: currentTemplate.imageUrl,
        instructions: currentTemplate.instructions,
        columns: currentTemplate.columns,
        rows: currentTemplate.rows
      } : {
        enabled: false
      },
      description: description.trim(),
      tags: [category, subcategory, ...(selectedSizes || [])],
      isFeatured,
      isPublished: isPublishedFlag,
      youtubeUrl: youtubeUrl.trim(),
      dateAdded: editingProduct ? editingProduct.dateAdded : new Date().toISOString().split('T')[0]
    };
  };

  // Botón 1: Guardar Cambios en vivo (guarda en la base de datos sin salir de la pantalla)
  const handleSaveProgress = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa al menos el Nombre del Producto para guardar cambios.');
      return;
    }
    setIsSavingDraft(true);
    try {
      const productObj = buildProductData(isCurrentlyPublished);
      await onSave(productObj, false);
      const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTimestamp(timeStr);
      setSaveSuccessNotice(isCurrentlyPublished ? `Guardado y Visible en Tienda (${timeStr})` : `Guardado como Borrador (${timeStr})`);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Botón 2: Guardar y Publicar (guarda, activa como publicado y regresa al catálogo)
  const handlePublishAndSave = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }
    if (images.length === 0) {
      alert('Debes incluir al menos una fotografía para el producto.');
      return;
    }
    setIsCurrentlyPublished(true);
    const productObj = buildProductData(true);
    await onSave(productObj, true);
  };

  // Publicar inmediatamente desde el modal de borrador
  const handleDirectPublish = async () => {
    setShowDraftModal(false);
    await handlePublishAndSave();
  };

  // Dummy product for size guide live preview
  const previewProduct: Product = {
    id: 'preview',
    name: name || 'Producto de Muestra',
    category,
    subcategory,
    price,
    stock,
    sku,
    images,
    sizes: selectedSizes,
    colors: selectedColors,
    description,
    tags: [],
    dateAdded: '2026-01-01',
    sizeGuideTemplateId: selectedTemplateId,
    sizeGuide: currentTemplate ? {
      enabled: sizeGuideEnabled,
      templateId: currentTemplate.id,
      title: currentTemplate.name,
      imageUrl: currentTemplate.imageUrl,
      instructions: currentTemplate.instructions,
      columns: currentTemplate.columns,
      rows: currentTemplate.rows
    } : undefined
  };

  return (
    <div className="space-y-6 pb-20 animate-fade-in max-w-7xl mx-auto">
      {/* Top Header Sticky Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-4 z-20 backdrop-blur-md bg-white/95">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold cursor-pointer"
            title="Regresar al catálogo sin guardar"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Volver al Catálogo</span>
          </button>
          <div className="h-6 w-px bg-gray-200" />
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#9E0D0D] bg-red-50 px-2.5 py-0.5 rounded-full inline-block">
              {editingProduct ? 'Modo Edición' : 'Nuevo Registro'}
            </span>
            <h2 className="text-lg sm:text-xl font-black text-gray-900 truncate max-w-xs sm:max-w-md md:max-w-lg">
              {editingProduct ? `Editar: ${editingProduct.name}` : 'Registrar Nuevo Producto en Catálogo'}
            </h2>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 self-end md:self-auto">
          {saveSuccessNotice && (
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-fade-in">
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              {saveSuccessNotice}
            </span>
          )}

          {sizeGuideEnabled && (
            <button
              type="button"
              onClick={() => setShowPreviewModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-3.5 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
              title="Previsualizar cómo verá el cliente la Guía de Tallas"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Guía de Tallas</span>
            </button>
          )}

          <button
            type="button"
            onClick={onCancel}
            className="px-3.5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
          >
            Cancelar
          </button>

          {/* Botón 1: Guardar Cambios (Guarda avance sin salir) */}
          <button
            type="button"
            onClick={handleSaveProgress}
            disabled={isSavingDraft || isUploadingImage}
            className="bg-slate-800 hover:bg-slate-900 active:scale-95 disabled:bg-slate-400 text-white text-xs font-black px-4 py-2.5 rounded-xl shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:cursor-not-allowed border border-slate-700"
            title="Guardar cambios en la base de datos y continuar editando"
          >
            {isSavingDraft ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Save className="w-4 h-4 text-emerald-400" />}
            <span>Guardar Cambios</span>
          </button>

          {/* Botón 2: Guardar y Publicar (Guarda, activa y regresa al catálogo) */}
          <button
            type="button"
            onClick={handlePublishAndSave}
            disabled={isSavingDraft || isUploadingImage}
            className="bg-[#9E0D0D] hover:bg-red-900 active:scale-95 disabled:bg-gray-400 text-white text-xs font-extrabold px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
            title="Guardar los cambios, publicar en la tienda y volver al catálogo"
          >
            {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            <span>{editingProduct ? 'Guardar y Publicar' : 'Publicar Producto'}</span>
          </button>
        </div>
      </div>

      {/* Estado del Producto: Banner de Borrador o Publicado */}
      {!isCurrentlyPublished ? (
        <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-3xl p-4 sm:p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fade-in">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-200 text-amber-900 rounded-2xl shrink-0 mt-0.5 shadow-2xs">
              <AlertCircle className="w-5 h-5 text-amber-900" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="bg-amber-200 text-amber-900 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-lg">
                  Estado: Modo Borrador (Oculto)
                </span>
                <span className="text-[11px] text-amber-700 font-bold">
                  (No se muestra en el catálogo al cliente)
                </span>
              </div>
              <p className="text-xs text-amber-950 font-medium mt-1 leading-relaxed">
                Haz clic en <strong>"Cambiar a Publicado"</strong> para que los clientes puedan ver y comprar esta prenda de inmediato.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCurrentlyPublished(true)}
            className="bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold text-xs px-5 py-3 rounded-2xl shadow-md shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-all w-full sm:w-auto"
          >
            <Check className="w-4 h-4" />
            <span>Cambiar a Publicado (Visible)</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 border-2 border-emerald-300 text-emerald-950 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div>
              <span className="font-extrabold text-emerald-900 text-xs sm:text-sm">
                ✓ Producto Activo y Publicado en la Tienda en Línea
              </span>
              <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                Al guardar, aparecerá automáticamente en el catálogo para todos los clientes visitantes.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsCurrentlyPublished(false)}
            className="px-3.5 py-2 bg-white hover:bg-amber-50 text-amber-800 border border-amber-300 rounded-xl font-bold text-[11px] transition-all cursor-pointer shrink-0"
            title="Cambiar a borrador para ocultarlo de la tienda temporalmente"
          >
            Pasar a Borrador (Ocultar)
          </button>
        </div>
      )}

      <form onSubmit={handlePublishAndSave} className="space-y-6 text-xs">
        {/* SECTION 1: Product Type & Basic Info */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-2 bg-red-50 text-[#9E0D0D] rounded-xl">📦</span>
              1. Tipo de Producto & Información Principal
            </h3>
            <span className="text-[11px] text-gray-400 font-medium">Campos obligatorios *</span>
          </div>

          {/* Product Type Selector */}
          <div>
            <label className="block font-bold text-gray-800 mb-2">Selecciona el Tipo de Producto *</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setProductType('sencillo')}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                  productType === 'sencillo'
                    ? 'bg-red-50/50 border-[#9E0D0D] shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                    productType === 'sencillo' ? 'border-[#9E0D0D] bg-[#9E0D0D]' : 'border-gray-300 bg-white'
                  }`}
                >
                  {productType === 'sencillo' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <span className="font-black text-gray-900 block text-xs sm:text-sm">📦 Producto Sencillo (Modelo Único)</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Un solo modelo o talle universal. Sin selección de tallas ni colores en la tienda.
                  </p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setProductType('variable')}
                className={`p-4 rounded-2xl border-2 text-left flex items-start gap-3 transition-all cursor-pointer ${
                  productType === 'variable'
                    ? 'bg-purple-50/60 border-purple-600 shadow-xs'
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 mt-0.5 shrink-0 flex items-center justify-center ${
                    productType === 'variable' ? 'border-purple-600 bg-purple-600' : 'border-gray-300 bg-white'
                  }`}
                >
                  {productType === 'variable' && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <span className="font-black text-gray-900 block text-xs sm:text-sm">🎨 Producto Variable (Tallas y/o Colores)</span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Permite a los clientes elegir su talla (CH, M, G, etc.) y/o su color favorito con fotos dedicadas.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block font-bold text-gray-800 mb-1">Nombre Comercial del Producto *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Chamarra Capitonada con Gorro Abrigadora Térmica"
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold text-sm text-gray-900 focus:bg-white focus:border-[#9E0D0D] outline-hidden transition-all"
              required
            />
          </div>

          {/* Category & Subcategory */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="font-bold text-gray-800 flex items-center gap-1.5">
                  <span>Categoría / Departamento *</span>
                  {currentCategoryObj && (
                    <span className="text-[10px] bg-red-100 text-[#9E0D0D] font-extrabold px-2 py-0.5 rounded-full">
                      ✓ {currentCategoryObj.name}
                    </span>
                  )}
                </label>
                <button
                  type="button"
                  onClick={() => setShowQuickCategoryModal(true)}
                  className="text-[11px] font-black text-[#9E0D0D] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Nueva Categoría
                </button>
              </div>

              <select
                value={effectiveCategorySlug}
                onChange={e => {
                  const newCatSlug = e.target.value as Category;
                  const catObj = categories.find(
                    c => c.slug.toLowerCase() === newCatSlug.toLowerCase() || c.id.toLowerCase() === newCatSlug.toLowerCase() || c.name.toLowerCase() === newCatSlug.toLowerCase()
                  );
                  const firstSub = catObj?.subcategories?.[0]?.name || 'General';
                  setCategory(catObj ? catObj.slug : newCatSlug);
                  setSubcategory(firstSub);
                }}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:border-[#9E0D0D] outline-hidden cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-800 mb-1.5">Subcategoría Específica *</label>
              <select
                value={subcategory}
                onChange={e => setSubcategory(e.target.value)}
                className="w-full p-3 bg-white border border-gray-300 rounded-xl font-bold text-gray-900 focus:border-[#9E0D0D] outline-hidden cursor-pointer"
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

          {/* SKU & Description */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block font-bold text-gray-800 mb-1">Código SKU / Referencia *</label>
              <input
                type="text"
                value={sku}
                onChange={e => setSku(e.target.value)}
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-mono font-bold text-gray-900 focus:bg-white focus:border-[#9E0D0D] outline-hidden"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-bold text-gray-800 mb-1">Descripción de la Prenda / Ficha Técnica</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
                placeholder="Composición, detalles de corte, cuidado de la prenda, ajuste..."
                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-medium text-gray-800 focus:bg-white focus:border-[#9E0D0D] outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* SECTION 2: Pricing, Offers & Inventory */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">🏷️</span>
              2. Precios, Promociones & Stock General
            </h3>
            <label className="flex items-center gap-2 bg-red-50 text-[#9E0D0D] border border-red-200 px-3 py-1.5 rounded-xl font-bold cursor-pointer">
              <input
                type="checkbox"
                checked={isOffer}
                onChange={e => setIsOffer(e.target.checked)}
                className="w-4 h-4 accent-[#9E0D0D] rounded cursor-pointer"
              />
              <span>🔥 Activar Precio de Oferta Especial</span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <label className="block font-bold text-gray-800 mb-1">Precio Regular ($ MXN) *</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={price}
                  onChange={e => setPrice(Number(e.target.value))}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-xl font-black text-gray-900 text-sm focus:border-[#9E0D0D] outline-hidden"
                  required
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Precio de venta estándar</p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <label className="block font-bold text-gray-800 mb-1">Precio Anterior / Tachado ($ MXN)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-gray-400">$</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={originalPrice || ''}
                  onChange={e => setOriginalPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Ej: 599"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-gray-300 rounded-xl font-bold text-gray-600 text-sm focus:border-[#9E0D0D] outline-hidden"
                />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Aparecerá con línea tachada</p>
            </div>

            <div className={`p-3.5 rounded-2xl border transition-all ${
              isOffer ? 'bg-amber-50/80 border-amber-300' : 'bg-gray-50 border-gray-200 opacity-60'
            }`}>
              <label className="block font-bold text-amber-900 mb-1">Precio de Oferta ($ MXN)</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 font-bold text-amber-600">$</span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  disabled={!isOffer}
                  value={offerPrice || ''}
                  onChange={e => setOfferPrice(e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="Ej: 299"
                  className="w-full pl-7 pr-3 py-2 bg-white border border-amber-300 rounded-xl font-black text-[#9E0D0D] text-sm focus:border-[#9E0D0D] outline-hidden disabled:bg-gray-100"
                />
              </div>
              {isOffer && discountPercentage > 0 && (
                <span className="inline-block mt-1 text-[10px] font-black text-white bg-[#9E0D0D] px-2 py-0.2 rounded-full">
                  -{discountPercentage}% Descuento
                </span>
              )}
            </div>

            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200">
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-gray-800">
                  {productType === 'variable' ? 'Stock Total Calculado *' : 'Stock General (pzas) *'}
                </label>
                {productType === 'variable' && (
                  <span className="text-[10px] bg-purple-100 text-purple-800 font-black px-2 py-0.5 rounded-md">
                    Suma por Tallas
                  </span>
                )}
              </div>
              <input
                type="number"
                min="0"
                value={productType === 'variable' ? calculateTotalVariantStock() : stock}
                onChange={e => setStock(Number(e.target.value))}
                readOnly={productType === 'variable'}
                className={`w-full px-3 py-2 border rounded-xl font-black text-sm outline-hidden ${
                  productType === 'variable'
                    ? 'bg-purple-50/50 border-purple-300 text-purple-950 cursor-not-allowed'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-[#9E0D0D]'
                }`}
                required
              />
              <p className="text-[10px] text-gray-500 mt-1">
                {productType === 'variable'
                  ? 'Calculado automáticamente de la suma de tallas (Sección 3).'
                  : 'Unidades disponibles para venta.'}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 3: Variants (Sizes & Colors) - Only for Variable Products */}
        {productType === 'variable' && (
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
                <span className="p-2 bg-purple-50 text-purple-700 rounded-xl">🎨</span>
                3. Configuración de Tallas, Colores y Stock por Variante
              </h3>
              <span className="text-[11px] text-purple-700 font-bold bg-purple-50 px-2.5 py-1 rounded-lg">
                {selectedSizes.length} tallas | {selectedColors.length} colores
              </span>
            </div>

            {/* Sizes Selection */}
            <div className="space-y-3 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Tag className="w-4 h-4 text-[#9E0D0D]" />
                  1. Tallas Disponibles ({selectedSizes.length} elegidas por Admin)
                </label>
                {selectedSizes.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSizes([]);
                      setVariantStockMap(prev => {
                        const next: Record<string, number> = {};
                        // Only keep color-only keys if any
                        selectedColors.forEach(c => {
                          if (prev[`_${c.name}`] !== undefined) next[`_${c.name}`] = prev[`_${c.name}`];
                        });
                        return next;
                      });
                    }}
                    className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Quitar Todas las Tallas
                  </button>
                )}
              </div>

              {/* Active Assigned Sizes Badges */}
              {selectedSizes.length > 0 ? (
                <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-1.5">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                    ✓ Tallas Asignadas al Producto ({selectedSizes.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedSizes.map(sz => (
                      <span
                        key={sz}
                        className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#9E0D0D] text-white rounded-lg text-xs font-black shadow-2xs animate-fade-in"
                      >
                        <span>{sz}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedSizes(prev => prev.filter(s => s !== sz));
                          }}
                          className="w-4 h-4 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-900 flex items-center justify-center text-[10px] font-black cursor-pointer transition-colors"
                          title={`Eliminar talla ${sz}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                  <span>⚠️</span>
                  <span>Sin tallas asignadas aún. Haz clic en las tallas abajo o escribe una personalizada para activarla.</span>
                </div>
              )}

              {/* Clothing Presets */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-600">Tallas Ropa Estándar (haz clic para agregar o quitar):</p>
                <div className="flex flex-wrap gap-2">
                  {CLOTHING_SIZES_PRESETS.map(sz => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSizes(prev => prev.filter(s => s !== sz));
                          } else {
                            setSelectedSizes(prev => [...prev, sz]);
                          }
                        }}
                        className={`px-3.5 py-2 rounded-xl font-black text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#9E0D0D] text-white shadow-xs scale-105 ring-2 ring-red-300'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {isSelected ? `✓ ${sz}` : sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Numeric / Shoe Presets */}
              <div className="space-y-2 pt-2 border-t border-slate-200">
                <p className="text-[11px] font-bold text-gray-600">Tallas Numéricas / Jeans / Calzado:</p>
                <div className="flex flex-wrap gap-1.5">
                  {NUMERIC_SIZES_PRESETS.map(sz => {
                    const isSelected = selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            setSelectedSizes(prev => prev.filter(s => s !== sz));
                          } else {
                            setSelectedSizes(prev => [...prev, sz]);
                          }
                        }}
                        className={`px-2.5 py-1.5 rounded-lg font-bold text-xs transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#9E0D0D] text-white shadow-xs ring-2 ring-red-300'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {isSelected ? `✓ ${sz}` : sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Size Input */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-200">
                <input
                  type="text"
                  placeholder="Agregar otra talla (ej. 4XG, 38, Unitalla)..."
                  value={customSizeInput}
                  onChange={e => setCustomSizeInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      const val = customSizeInput.trim().toUpperCase();
                      if (val && !selectedSizes.includes(val)) {
                        setSelectedSizes(prev => [...prev, val]);
                        setCustomSizeInput('');
                      }
                    }
                  }}
                  className="flex-1 p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    const val = customSizeInput.trim().toUpperCase();
                    if (val && !selectedSizes.includes(val)) {
                      setSelectedSizes(prev => [...prev, val]);
                      setCustomSizeInput('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  + Registrar Talla
                </button>
              </div>
            </div>

            {/* Colors Selection */}
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-900 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-[#9E0D0D]" />
                  2. Colores Disponibles ({selectedColors.length} elegidos)
                </label>
                {selectedColors.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setSelectedColors([])}
                    className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                  >
                    Quitar Todos los Colores
                  </button>
                )}
              </div>

              {/* Active Assigned Colors Badges */}
              {selectedColors.length > 0 && (
                <div className="bg-white p-3 rounded-xl border border-emerald-200 bg-emerald-50/20 space-y-1.5">
                  <p className="text-[10px] font-black text-emerald-800 uppercase tracking-wider">
                    ✓ Colores Asignados ({selectedColors.length}):
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedColors.map(col => (
                      <span
                        key={col.name}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg text-xs font-bold shadow-2xs animate-fade-in"
                      >
                        <span
                          className="w-3 h-3 rounded-full border border-white/50 shrink-0"
                          style={{ backgroundColor: col.hex }}
                        />
                        <span>{col.name}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedColors(prev => prev.filter(c => c.name !== col.name));
                          }}
                          className="w-4 h-4 rounded-full bg-white/20 hover:bg-white text-white hover:text-red-900 flex items-center justify-center text-[10px] font-black cursor-pointer transition-colors"
                          title={`Eliminar color ${col.name}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Preset Color Badges */}
              <div className="flex flex-wrap gap-2">
                {PRESET_COLORS.map(c => {
                  const isSelected = selectedColors.some(sc => sc.name === c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setSelectedColors(prev => prev.filter(sc => sc.name !== c.name));
                        } else {
                          setSelectedColors(prev => [...prev, { name: c.name, hex: c.hex }]);
                        }
                      }}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-white border-[#9E0D0D] shadow-xs ring-2 ring-[#9E0D0D]/20'
                          : 'bg-white/80 border-gray-200 hover:border-gray-400'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-gray-300 shadow-2xs shrink-0"
                        style={{ backgroundColor: c.hex }}
                      />
                      <span className="text-gray-800">{c.name}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#9E0D0D]" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom Color Creator */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={e => setCustomColorHex(e.target.value)}
                  className="w-9 h-9 p-0.5 rounded-xl border border-gray-300 cursor-pointer bg-white"
                  title="Elegir tono exacto"
                />
                <input
                  type="text"
                  placeholder="Nombre de color personalizado (ej. Palo de Rosa, Mostaza)..."
                  value={customColorName}
                  onChange={e => setCustomColorName(e.target.value)}
                  className="flex-1 min-w-[200px] p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customColorName.trim() && !selectedColors.some(sc => sc.name.toLowerCase() === customColorName.trim().toLowerCase())) {
                      setSelectedColors(prev => [...prev, { name: customColorName.trim(), hex: customColorHex }]);
                      setCustomColorName('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  + Agregar Color
                </button>
              </div>

              {/* Strict Photo Mapping by Color */}
              {selectedColors.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200 space-y-4">
                  <div>
                    <h4 className="font-extrabold text-gray-900 text-xs flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-purple-600" />
                      Asignación de Fotografías Exclusivas por Color
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Sube o pega la foto para cada color. Cuando el cliente seleccione el color en la tienda, verá únicamente estas fotos.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedColors.map(col => {
                      const colImgs = colorImages[col.name] || [];
                      return (
                        <div key={col.name} className="bg-white p-3.5 rounded-2xl border border-purple-100 shadow-2xs space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 rounded-full border border-gray-300 shrink-0" style={{ backgroundColor: col.hex }} />
                              <strong className="text-gray-900 font-black">{col.name}</strong>
                            </div>
                            <span className="text-[10px] text-purple-700 font-bold bg-purple-50 px-2 py-0.5 rounded-md">
                              {colImgs.length} foto(s)
                            </span>
                          </div>

                          {/* Previews */}
                          {colImgs.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                              {colImgs.map((imgUrl, imgIdx) => (
                                <div key={imgIdx} className="relative group w-16 h-16 rounded-xl overflow-hidden border border-gray-200 bg-gray-50">
                                  <img src={imgUrl} alt={`${col.name} ${imgIdx}`} className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveColorImage(col.name, imgIdx)}
                                    className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-[11px] text-gray-400 italic">Sin fotos específicas (usará foto principal).</p>
                          )}

                          {/* Upload/URL controls */}
                          <div className="flex items-center gap-2 pt-1">
                            <label className="bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold py-1.5 px-3 rounded-xl cursor-pointer flex items-center gap-1 shrink-0">
                              <Upload className="w-3 h-3" />
                              <span>Subir</span>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={e => handleUploadColorImageFile(col.name, e)}
                                className="hidden"
                              />
                            </label>
                            <input
                              type="text"
                              placeholder="O pega URL de foto..."
                              onKeyDown={e => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  const target = e.target as HTMLInputElement;
                                  if (target.value.trim()) {
                                    handleAddColorImage(col.name, target.value);
                                    target.value = '';
                                  }
                                }
                              }}
                              className="flex-1 p-1.5 bg-gray-50 border border-gray-200 rounded-xl text-[11px]"
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* 3.3 Stock Allocation Matrix per Size & Color */}
            <div className="space-y-4 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                <div>
                  <label className="font-extrabold text-gray-900 text-xs sm:text-sm flex items-center gap-1.5">
                    <span className="p-1.5 bg-[#9E0D0D] text-white rounded-lg text-xs font-black">📦</span>
                    3. Inventario & Stock Específico por Talla {selectedColors.length > 0 ? 'y Color' : ''}
                  </label>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    Asigna el número exacto de piezas en bodega para cada talla. Si una talla se agota (0 pzas), se bloqueará automáticamente en la tienda.
                  </p>
                </div>
                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-xs font-black bg-slate-900 text-white px-3 py-1 rounded-xl shadow-xs flex items-center gap-1.5">
                    <span>Total Inventario:</span>
                    <span className="text-amber-300 font-mono text-sm">{calculateTotalVariantStock()}</span>
                    <span>piezas</span>
                  </span>
                </div>
              </div>

              {/* Bulk Quick Action Bar */}
              <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[11px] font-bold text-gray-700">⚡ Asignación en Lote:</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="number"
                      min="0"
                      value={bulkStockInput}
                      onChange={e => setBulkStockInput(Math.max(0, Number(e.target.value)))}
                      className="w-16 p-1.5 bg-gray-50 border border-gray-300 rounded-lg text-xs font-bold text-center"
                    />
                    <button
                      type="button"
                      onClick={() => handleApplyBulkStock(bulkStockInput)}
                      className="bg-slate-900 hover:bg-black text-white font-bold text-[11px] px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                      title="Aplicar esta cantidad a todas las variantes de talla y color"
                    >
                      Aplicar a Todas
                    </button>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-gray-500 font-bold hidden sm:inline">Rápidos:</span>
                  <button
                    type="button"
                    onClick={() => handleApplyBulkStock(0)}
                    className="px-2 py-1 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    Agotar (0)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyBulkStock(5)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    5 pzas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyBulkStock(10)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    10 pzas
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyBulkStock(25)}
                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-[10px] font-bold cursor-pointer transition-colors"
                  >
                    25 pzas
                  </button>
                </div>
              </div>

              {/* Sizes / Variants Matrix */}
              {selectedSizes.length === 0 ? (
                <div className="p-6 text-center bg-white rounded-xl border border-dashed border-gray-300">
                  <p className="text-xs text-gray-500 font-medium">
                    ⚠️ Por favor selecciona al menos una talla arriba para configurar el stock de cada una.
                  </p>
                </div>
              ) : selectedColors.length > 0 ? (
                /* Grouped by Color */
                <div className="space-y-4">
                  {selectedColors.map(col => {
                    const colorTotalStock = selectedSizes.reduce((acc, sz) => {
                      const k = `${sz}_${col.name}`;
                      return acc + (variantStockMap[k] !== undefined ? Number(variantStockMap[k]) : 0);
                    }, 0);

                    return (
                      <div key={col.name} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-3">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs shrink-0"
                              style={{ backgroundColor: col.hex }}
                            />
                            <strong className="text-gray-900 font-black text-xs sm:text-sm">{col.name}</strong>
                          </div>
                          <span className="text-[11px] font-bold text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-lg">
                            Subtotal color: <strong className="text-gray-900 font-mono">{colorTotalStock}</strong> pzas
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                          {selectedSizes.map(sz => {
                            const key = `${sz}_${col.name}`;
                            const vStock = variantStockMap[key] !== undefined ? Number(variantStockMap[key]) : 0;
                            const isSoldOut = vStock <= 0;
                            const isLowStock = vStock > 0 && vStock <= 5;

                            return (
                              <div
                                key={key}
                                className={`p-3 rounded-xl border transition-all ${
                                  isSoldOut
                                    ? 'bg-red-50/40 border-red-200'
                                    : isLowStock
                                    ? 'bg-amber-50/40 border-amber-200'
                                    : 'bg-slate-50 border-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-black text-xs text-gray-900 bg-white border border-gray-300 px-2 py-0.5 rounded-md shadow-2xs">
                                    Talla {sz}
                                  </span>
                                  <span
                                    className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                      isSoldOut
                                        ? 'bg-red-600 text-white'
                                        : isLowStock
                                        ? 'bg-amber-500 text-white'
                                        : 'bg-emerald-600 text-white'
                                    }`}
                                  >
                                    {isSoldOut ? 'Agotado' : isLowStock ? 'Bajo Stock' : 'Disponible'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                  <button
                                    type="button"
                                    onClick={() => handleDeltaSingleVariantStock(sz, col.name, -1)}
                                    className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 border border-gray-300 font-bold text-gray-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                                  >
                                    -
                                  </button>
                                  <input
                                    type="number"
                                    min="0"
                                    value={vStock}
                                    onChange={e => handleUpdateSingleVariantStock(sz, col.name, Number(e.target.value))}
                                    className="flex-1 min-w-0 p-1.5 bg-white border border-gray-300 rounded-lg text-center font-black text-xs text-gray-900 focus:border-[#9E0D0D] outline-hidden shadow-2xs"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleDeltaSingleVariantStock(sz, col.name, 1)}
                                    className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 border border-gray-300 font-bold text-gray-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                                  >
                                    +
                                  </button>
                                </div>
                                <span className="block text-[9px] text-gray-400 font-mono mt-1 text-right">
                                  {sku}-{sz}-{col.name.slice(0, 3).toUpperCase()}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Only Sizes (No specific colors) */
                <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {selectedSizes.map(sz => {
                      const key = `${sz}_`;
                      const vStock = variantStockMap[key] !== undefined ? Number(variantStockMap[key]) : 0;
                      const isSoldOut = vStock <= 0;
                      const isLowStock = vStock > 0 && vStock <= 5;

                      return (
                        <div
                          key={key}
                          className={`p-3.5 rounded-xl border transition-all ${
                            isSoldOut
                              ? 'bg-red-50/40 border-red-200'
                              : isLowStock
                              ? 'bg-amber-50/40 border-amber-200'
                              : 'bg-slate-50 border-slate-200'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black text-sm text-gray-900 bg-white border border-gray-300 px-2.5 py-0.5 rounded-md shadow-2xs">
                              Talla {sz}
                            </span>
                            <span
                              className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                                isSoldOut
                                  ? 'bg-red-600 text-white'
                                  : isLowStock
                                  ? 'bg-amber-500 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              {isSoldOut ? 'Agotado' : isLowStock ? 'Bajo Stock' : 'Disponible'}
                            </span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleDeltaSingleVariantStock(sz, '', -1)}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 border border-gray-300 font-bold text-gray-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="0"
                              value={vStock}
                              onChange={e => handleUpdateSingleVariantStock(sz, '', Number(e.target.value))}
                              className="flex-1 min-w-0 p-1.5 bg-white border border-gray-300 rounded-lg text-center font-black text-xs text-gray-900 focus:border-[#9E0D0D] outline-hidden shadow-2xs"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeltaSingleVariantStock(sz, '', 1)}
                              className="w-8 h-8 rounded-lg bg-white hover:bg-gray-200 border border-gray-300 font-bold text-gray-700 flex items-center justify-center cursor-pointer transition-colors shadow-2xs"
                            >
                              +
                            </button>
                          </div>
                          <span className="block text-[9px] text-gray-400 font-mono mt-1 text-right">
                            {sku}-{sz}-UNI
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 4: General Image Gallery & YouTube Video */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-gray-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-sm sm:text-base font-black text-gray-900 flex items-center gap-2">
              <span className="p-2 bg-blue-50 text-blue-700 rounded-xl">📸</span>
              4. Galería General de Imágenes & Video YouTube
            </h3>
            <span className="text-[11px] text-gray-400 font-bold">{images.length} imágenes</span>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-3">
              {images.map((img, idx) => (
                <div key={idx} className="relative group w-24 h-24 rounded-2xl overflow-hidden border-2 border-gray-200 bg-gray-50 shadow-xs">
                  <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  <div className="absolute top-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                    {idx === 0 ? 'Principal' : `#${idx + 1}`}
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveGeneralImage(idx)}
                    className="absolute inset-0 bg-red-900/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2 border-t border-gray-100">
              <label className="w-full sm:w-auto bg-[#9E0D0D] hover:bg-red-900 text-white font-black py-2.5 px-4 rounded-xl text-xs cursor-pointer flex items-center justify-center gap-2 shadow-xs transition-colors shrink-0">
                <Upload className="w-4 h-4" />
                <span>Subir Fotos desde Computadora</span>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleUploadGeneralImageFile}
                  className="hidden"
                />
              </label>

              <div className="w-full flex items-center gap-2">
                <input
                  type="text"
                  placeholder="O pega URL de foto externa..."
                  value={newImageUrlInput}
                  onChange={e => setNewImageUrlInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddGeneralImage(newImageUrlInput);
                    }
                  }}
                  className="flex-1 p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium"
                />
                <button
                  type="button"
                  onClick={() => handleAddGeneralImage(newImageUrlInput)}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-4 rounded-xl text-xs cursor-pointer"
                >
                  + Agregar
                </button>
              </div>
            </div>
          </div>

          {/* YouTube Embed */}
          <div className="bg-red-50/50 p-4 rounded-2xl border border-red-200 space-y-2">
            <label className="font-bold text-gray-900 text-xs flex items-center gap-2">
              <Video className="w-4 h-4 text-red-600" />
              Incrustar Video de Demostración de YouTube (Opcional)
            </label>
            <input
              type="text"
              placeholder="https://www.youtube.com/watch?v=... o https://youtu.be/..."
              value={youtubeUrl}
              onChange={e => setYoutubeUrl(e.target.value)}
              className="w-full p-2.5 bg-white border border-gray-300 rounded-xl font-mono text-xs"
            />
            {youtubeUrl && getYouTubeEmbedUrl(youtubeUrl) && (
              <div className="mt-2 rounded-xl overflow-hidden border border-red-200 aspect-video max-h-48 bg-black">
                <iframe
                  src={getYouTubeEmbedUrl(youtubeUrl)!}
                  title="Vista Previa YouTube"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        </div>

        {/* SECTION 5: SIZE GUIDE TEMPLATE SELECTOR */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Plantillas Reutilizables
              </span>
              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                5. Tabla de Medidas & Guía de Tallas (Plantilla)
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Selecciona una tabla de medidas previamente registrada en el módulo <strong>"Tablas de Medidas"</strong>. Se vinculará y mostrará automáticamente a tus clientes.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 bg-amber-50 border-2 border-amber-400 px-4 py-2 rounded-2xl font-black text-xs text-amber-950 cursor-pointer shadow-xs">
                <input
                  type="checkbox"
                  checked={sizeGuideEnabled}
                  onChange={e => setSizeGuideEnabled(e.target.checked)}
                  className="w-4 h-4 accent-amber-600 rounded cursor-pointer"
                />
                <span>Habilitar Guía en este Producto</span>
              </label>

              {sizeGuideEnabled && currentTemplate && (
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="bg-amber-600 hover:bg-amber-700 text-white font-extrabold text-xs px-4 py-2 rounded-2xl shadow-xs flex items-center gap-1.5 cursor-pointer transition-all"
                >
                  <Eye className="w-4 h-4" />
                  <span>Previsualizar Modal</span>
                </button>
              )}
            </div>
          </div>

          {sizeGuideEnabled ? (
            <div className="space-y-6">
              {/* Template Selector dropdown & Quick Navigation */}
              <div className="bg-amber-50/70 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <label className="font-extrabold text-xs text-amber-950 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Selecciona la Plantilla de Medidas:
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('¿Deseas ir al módulo de Tablas de Medidas para crear o editar plantillas? Guarda tus cambios antes si es necesario.')) {
                        setAdminTab('tablas-medidas');
                      }
                    }}
                    className="text-xs font-bold text-amber-900 hover:text-amber-950 underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Ir al Administrador de Tablas de Medidas</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Dropdown Selector */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <select
                      value={selectedTemplateId}
                      onChange={e => setSelectedTemplateId(e.target.value)}
                      className="w-full p-3 bg-white border-2 border-amber-300 rounded-xl font-bold text-xs text-gray-900 shadow-xs focus:ring-2 focus:ring-amber-500 focus:border-amber-500 cursor-pointer"
                    >
                      {sizeGuideTemplates.map(tmpl => (
                        <option key={tmpl.id} value={tmpl.id}>
                          {tmpl.name} ({tmpl.category.toUpperCase()}) — {tmpl.rows.length} tallas ({tmpl.columns.join(', ')})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 h-full">
                      <span className="text-xs text-amber-800 font-medium">
                        {sizeGuideTemplates.length} plantilla(s) disponibles
                      </span>
                    </div>
                  </div>
                </div>

                {/* Visual Quick Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                  {sizeGuideTemplates.map(tmpl => {
                    const isSelected = tmpl.id === selectedTemplateId;
                    return (
                      <button
                        key={tmpl.id}
                        type="button"
                        onClick={() => setSelectedTemplateId(tmpl.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-600 text-white border-amber-700 shadow-sm ring-2 ring-amber-400'
                            : 'bg-white hover:bg-amber-100/80 text-gray-800 border-amber-200'
                        }`}
                      >
                        <div>
                          <span
                            className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full inline-block mb-1 ${
                              isSelected ? 'bg-amber-800 text-white' : 'bg-amber-100 text-amber-900'
                            }`}
                          >
                            {tmpl.category}
                          </span>
                          <h5 className="font-bold text-xs leading-tight line-clamp-2">{tmpl.name}</h5>
                        </div>
                        <span className={`text-[10px] mt-2 font-medium ${isSelected ? 'text-amber-100' : 'text-gray-500'}`}>
                          {tmpl.rows.length} tallas registradas
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Selected Template Live Preview Summary */}
              {currentTemplate && (
                <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
                        <Check className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-black text-sm text-gray-900">{currentTemplate.name}</h4>
                        <p className="text-[11px] text-gray-500">
                          Categoría: <span className="font-bold uppercase text-slate-700">{currentTemplate.category}</span> | {currentTemplate.columns.length} columnas de medida
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPreviewModal(true)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-black text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Ver cómo lo verá el cliente</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    {/* Reference Silhouette thumbnail */}
                    {currentTemplate.imageUrl && (
                      <div className="md:col-span-3 bg-white p-2 rounded-xl border border-gray-200 flex flex-col items-center">
                        <span className="text-[10px] font-bold text-gray-400 mb-1">Silueta de Medición</span>
                        <div className="w-full aspect-3/4 rounded-lg overflow-hidden bg-gray-50 flex items-center justify-center">
                          <img
                            src={currentTemplate.imageUrl}
                            alt={currentTemplate.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                    )}

                    {/* Instructions and Measurement Table Preview */}
                    <div className={`${currentTemplate.imageUrl ? 'md:col-span-9' : 'md:col-span-12'} space-y-3`}>
                      {currentTemplate.instructions && (
                        <div className="bg-white p-3 rounded-xl border border-gray-200 text-xs text-gray-600">
                          <strong className="text-gray-900 block mb-0.5">Consejos e instrucciones incluidas:</strong>
                          <p className="line-clamp-2 italic">{currentTemplate.instructions}</p>
                        </div>
                      )}

                      {/* Read-only Table preview */}
                      <div className="border border-gray-200 rounded-xl overflow-hidden shadow-2xs bg-white">
                        <div className="overflow-x-auto max-h-56">
                          <table className="w-full text-left text-xs border-collapse">
                            <thead className="bg-slate-100 text-slate-800 sticky top-0 uppercase text-[10px] font-extrabold border-b border-gray-200">
                              <tr>
                                <th className="py-2 px-3 border-r border-gray-200">Talla</th>
                                {currentTemplate.columns.map(col => (
                                  <th key={col} className="py-2 px-3 border-r border-gray-200 text-center">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {currentTemplate.rows.map((row, idx) => (
                                <tr key={idx} className="hover:bg-slate-50">
                                  <td className="py-2 px-3 font-bold text-gray-900 border-r border-gray-100 bg-slate-50/50">
                                    {row.size}
                                  </td>
                                  {currentTemplate.columns.map(col => (
                                    <td key={col} className="py-2 px-3 text-center text-gray-700 border-r border-gray-100">
                                      {row.measurements[col] || '-'}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              Guía de tallas desactivada para este producto. Marca la casilla superior para vincular una plantilla registrada.
            </div>
          )}
        </div>

        {/* Bottom Save Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 text-xs text-gray-500 w-full sm:w-auto">
            {lastSavedTimestamp ? (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-3.5 py-1.5 rounded-xl font-bold border border-emerald-200 shadow-2xs">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                Guardado en Supabase a las {lastSavedTimestamp}
              </span>
            ) : (
              <span className="text-gray-400 font-medium italic">
                * Puedes ir guardando cambios parciales con el botón "Guardar Cambios" sin cerrar el formulario.
              </span>
            )}
          </div>

          <div className="flex items-center flex-wrap gap-2.5 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="w-full sm:w-auto px-5 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-2xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
            >
              Cancelar
            </button>

            {/* Botón 1: Guardar Cambios (Guarda avance y permanece en pantalla) */}
            <button
              type="button"
              onClick={handleSaveProgress}
              disabled={isSavingDraft || isUploadingImage}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-900 active:scale-95 disabled:bg-slate-400 text-white font-extrabold px-6 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed border border-slate-700"
              title="Guardar cambios en la base de datos sin salir de esta pantalla"
            >
              {isSavingDraft ? <Loader2 className="w-4 h-4 animate-spin text-emerald-400" /> : <Save className="w-4 h-4 text-emerald-400" />}
              <span>Guardar Cambios</span>
            </button>

            {/* Botón 2: Guardar y Publicar (Guarda y regresa al catálogo) */}
            <button
              type="button"
              onClick={handlePublishAndSave}
              disabled={isSavingDraft || isUploadingImage}
              className="w-full sm:w-auto bg-[#9E0D0D] hover:bg-red-900 active:scale-95 disabled:bg-gray-400 text-white font-extrabold px-8 py-3.5 rounded-2xl text-xs uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:cursor-not-allowed"
              title="Publicar producto y volver al catálogo"
            >
              {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{editingProduct ? 'Guardar y Publicar' : 'Registrar y Publicar Producto'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Quick Category Modal */}
      {showQuickCategoryModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100 space-y-4">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-black text-gray-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#9E0D0D]" />
                Nueva Categoría
              </h3>
              <button
                onClick={() => setShowQuickCategoryModal(false)}
                className="p-1 text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
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
                  placeholder="Breve descripción..."
                  value={quickCatDesc}
                  onChange={e => setQuickCatDesc(e.target.value)}
                  className="w-full p-2.5 border rounded-xl h-16"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (quickCatName.trim()) {
                      onQuickAddCategory(quickCatName, quickCatSlug, quickCatDesc, quickCatSubs);
                      setShowQuickCategoryModal(false);
                      setQuickCatName('');
                      setQuickCatSlug('');
                      setQuickCatDesc('');
                      setQuickCatSubs('');
                    }
                  }}
                  className="flex-1 bg-[#9E0D0D] hover:bg-red-900 text-white font-bold py-3 rounded-xl uppercase text-xs cursor-pointer"
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
            </div>
          </div>
        </div>
      )}

      {/* Live Preview Modal for Size Guide */}
      {showPreviewModal && (
        <SizeGuideModal
          isOpen={showPreviewModal}
          onClose={() => setShowPreviewModal(false)}
          product={previewProduct}
          selectedSize={selectedSizes[0] || 'CH'}
        />
      )}

      {/* Modal Notificación de Borrador */}
      {showDraftModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-300 space-y-5 animate-scale-up">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center shrink-0 shadow-xs">
                <AlertCircle className="w-7 h-7" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-black uppercase text-amber-800 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-200">
                    Aviso del Sistema
                  </span>
                  <span className="text-[10px] text-gray-400 font-mono">
                    {lastSavedTimestamp || ''}
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black text-gray-900 leading-tight mt-1">
                  ¡Producto Guardado como Borrador!
                </h3>
              </div>
            </div>

            <div className="bg-amber-50/80 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-950 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-amber-900">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Estado: Guardado en Borrador (No Publicado)</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                Tus cambios se han registrado y sincronizado en la base de datos (Supabase), pero <strong>el producto aún NO está visible para los clientes</strong> en la tienda virtual.
              </p>
              <p className="text-gray-500 text-[11px]">
                Podrás seguir editándolo cuando quieras o publicarlo directamente con el botón <strong>"Publicar en Tienda Ahora"</strong>.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => setShowDraftModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition-all cursor-pointer text-center"
              >
                Seguir Editando
              </button>
              <button
                type="button"
                onClick={handleDirectPublish}
                className="flex-1 px-5 py-3 bg-[#9E0D0D] hover:bg-red-900 text-white font-black text-xs rounded-xl shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Publicar Ahora</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
