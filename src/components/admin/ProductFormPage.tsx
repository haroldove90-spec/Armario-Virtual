import React, { useState, useEffect } from 'react';
import { Product, Category, CategoryItem, SizeGuide, SizeGuideRow } from '../../types';
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
  Save
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

// Presets for Size Guides
const SIZE_GUIDE_TEMPLATES = {
  tops: {
    title: 'Guía de Tallas para Playeras, Blusas & Tops',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    instructions: 'Mide alrededor de la parte más completa del pecho manteniendo la cinta métrica horizontal. Si estás entre dos tallas, elige la mayor.',
    columns: ['Pecho / Busto', 'Cintura', 'Cadera', 'Largo'],
    rows: [
      {
        size: 'CH / S',
        measurements: { 'Pecho / Busto': '88 - 92 cm', 'Cintura': '68 - 72 cm', 'Cadera': '92 - 96 cm', 'Largo': '65 cm' },
        measurementsInches: { 'Pecho / Busto': '34 - 36 in', 'Cintura': '26 - 28 in', 'Cadera': '36 - 38 in', 'Largo': '25.5 in' }
      },
      {
        size: 'MD / M',
        measurements: { 'Pecho / Busto': '93 - 97 cm', 'Cintura': '73 - 77 cm', 'Cadera': '97 - 101 cm', 'Largo': '67 cm' },
        measurementsInches: { 'Pecho / Busto': '36 - 38 in', 'Cintura': '28 - 30 in', 'Cadera': '38 - 40 in', 'Largo': '26.3 in' }
      },
      {
        size: 'GD / L',
        measurements: { 'Pecho / Busto': '98 - 103 cm', 'Cintura': '78 - 83 cm', 'Cadera': '102 - 107 cm', 'Largo': '69 cm' },
        measurementsInches: { 'Pecho / Busto': '38 - 40 in', 'Cintura': '30 - 32 in', 'Cadera': '40 - 42 in', 'Largo': '27.1 in' }
      },
      {
        size: 'XGD / XL',
        measurements: { 'Pecho / Busto': '104 - 110 cm', 'Cintura': '84 - 90 cm', 'Cadera': '108 - 114 cm', 'Largo': '71 cm' },
        measurementsInches: { 'Pecho / Busto': '41 - 43 in', 'Cintura': '33 - 35 in', 'Cadera': '42 - 45 in', 'Largo': '28.0 in' }
      }
    ]
  },
  bottoms: {
    title: 'Guía de Tallas para Pantalones & Jeans',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    instructions: 'Mide la circunferencia de tu cintura natural y la cadera en el punto más ancho con los pies juntos.',
    columns: ['Cintura', 'Cadera', 'Muslo', 'Largo Entrepierna'],
    rows: [
      {
        size: '28 / CH',
        measurements: { 'Cintura': '71 - 74 cm', 'Cadera': '89 - 92 cm', 'Muslo': '52 cm', 'Largo Entrepierna': '76 cm' },
        measurementsInches: { 'Cintura': '28 - 29 in', 'Cadera': '35 - 36 in', 'Muslo': '20.5 in', 'Largo Entrepierna': '30 in' }
      },
      {
        size: '30 / MD',
        measurements: { 'Cintura': '76 - 79 cm', 'Cadera': '94 - 97 cm', 'Muslo': '55 cm', 'Largo Entrepierna': '78 cm' },
        measurementsInches: { 'Cintura': '30 - 31 in', 'Cadera': '37 - 38 in', 'Muslo': '21.6 in', 'Largo Entrepierna': '30.7 in' }
      },
      {
        size: '32 / GD',
        measurements: { 'Cintura': '81 - 84 cm', 'Cadera': '99 - 102 cm', 'Muslo': '58 cm', 'Largo Entrepierna': '80 cm' },
        measurementsInches: { 'Cintura': '32 - 33 in', 'Cadera': '39 - 40 in', 'Muslo': '22.8 in', 'Largo Entrepierna': '31.5 in' }
      },
      {
        size: '34 / XG',
        measurements: { 'Cintura': '86 - 90 cm', 'Cadera': '104 - 108 cm', 'Muslo': '61 cm', 'Largo Entrepierna': '81 cm' },
        measurementsInches: { 'Cintura': '34 - 35 in', 'Cadera': '41 - 42 in', 'Muslo': '24.0 in', 'Largo Entrepierna': '31.8 in' }
      }
    ]
  },
  dresses: {
    title: 'Guía de Medidas para Vestidos & Enterizos',
    imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&auto=format&fit=crop&q=80',
    instructions: 'Coloca la cinta métrica en paralelo al suelo. Mide busto, cintura y cadera con ropa ligera para máxima precisión.',
    columns: ['Busto', 'Cintura', 'Cadera', 'Largo Vestido'],
    rows: [
      {
        size: 'CH / S (Talla 4-6)',
        measurements: { 'Busto': '84 - 88 cm', 'Cintura': '64 - 68 cm', 'Cadera': '90 - 94 cm', 'Largo Vestido': '88 cm' },
        measurementsInches: { 'Busto': '33 - 35 in', 'Cintura': '25 - 27 in', 'Cadera': '35 - 37 in', 'Largo Vestido': '34.6 in' }
      },
      {
        size: 'MD / M (Talla 8-10)',
        measurements: { 'Busto': '89 - 93 cm', 'Cintura': '69 - 73 cm', 'Cadera': '95 - 99 cm', 'Largo Vestido': '90 cm' },
        measurementsInches: { 'Busto': '35 - 37 in', 'Cintura': '27 - 29 in', 'Cadera': '37 - 39 in', 'Largo Vestido': '35.4 in' }
      },
      {
        size: 'GD / L (Talla 12-14)',
        measurements: { 'Busto': '94 - 100 cm', 'Cintura': '74 - 80 cm', 'Cadera': '100 - 106 cm', 'Largo Vestido': '92 cm' },
        measurementsInches: { 'Busto': '37 - 39 in', 'Cintura': '29 - 31 in', 'Cadera': '39 - 42 in', 'Largo Vestido': '36.2 in' }
      }
    ]
  },
  shoes: {
    title: 'Guía de Tallas para Calzado & Zapatos',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    instructions: 'Coloca tu pie sobre una hoja de papel, marca la punta del dedo más largo y el talón. Mide la distancia en centímetros.',
    columns: ['Largo del Pie (CM)', 'Talla México (MX)', 'Talla USA (US)', 'Talla Europa (EUR)'],
    rows: [
      {
        size: '23 MX',
        measurements: { 'Largo del Pie (CM)': '23.0 cm', 'Talla México (MX)': '23', 'Talla USA (US)': '6.0', 'Talla Europa (EUR)': '36.5' },
        measurementsInches: { 'Largo del Pie (CM)': '9.0 in', 'Talla México (MX)': '23', 'Talla USA (US)': '6.0', 'Talla Europa (EUR)': '36.5' }
      },
      {
        size: '24 MX',
        measurements: { 'Largo del Pie (CM)': '24.0 cm', 'Talla México (MX)': '24', 'Talla USA (US)': '7.0', 'Talla Europa (EUR)': '38.0' },
        measurementsInches: { 'Largo del Pie (CM)': '9.4 in', 'Talla México (MX)': '24', 'Talla USA (US)': '7.0', 'Talla Europa (EUR)': '38.0' }
      },
      {
        size: '25 MX',
        measurements: { 'Largo del Pie (CM)': '25.0 cm', 'Talla México (MX)': '25', 'Talla USA (US)': '8.0', 'Talla Europa (EUR)': '39.5' },
        measurementsInches: { 'Largo del Pie (CM)': '9.8 in', 'Talla México (MX)': '25', 'Talla USA (US)': '8.0', 'Talla Europa (EUR)': '39.5' }
      },
      {
        size: '26 MX',
        measurements: { 'Largo del Pie (CM)': '26.0 cm', 'Talla México (MX)': '26', 'Talla USA (US)': '9.0', 'Talla Europa (EUR)': '41.0' },
        measurementsInches: { 'Largo del Pie (CM)': '10.2 in', 'Talla México (MX)': '26', 'Talla USA (US)': '9.0', 'Talla Europa (EUR)': '41.0' }
      }
    ]
  }
};

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
  const [lastSavedTimestamp, setLastSavedTimestamp] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState<boolean>(false);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const [productType, setProductType] = useState<'sencillo' | 'variable'>(
    editingProduct?.productType || 'variable'
  );
  const [name, setName] = useState(editingProduct?.name || '');
  const [category, setCategory] = useState<Category>(
    editingProduct?.category || categories[0]?.slug || 'mujer'
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

  // Variants state
  const [selectedSizes, setSelectedSizes] = useState<string[]>(
    editingProduct?.sizes && editingProduct.sizes.length > 0
      ? editingProduct.sizes
      : ['CH', 'M', 'G', 'XG']
  );
  const [customSizeInput, setCustomSizeInput] = useState('');

  const [selectedColors, setSelectedColors] = useState<{ name: string; hex: string; imageUrl?: string }[]>(
    editingProduct?.colors && editingProduct.colors.length > 0
      ? editingProduct.colors
      : [
          { name: 'Negro', hex: '#1A1A1A' },
          { name: 'Rojo Carmesí', hex: '#9E0D0D' }
        ]
  );
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

  // Size Guide State
  const [sizeGuideEnabled, setSizeGuideEnabled] = useState<boolean>(
    editingProduct?.sizeGuide?.enabled ?? true
  );
  const [sizeGuideTitle, setSizeGuideTitle] = useState<string>(
    editingProduct?.sizeGuide?.title || `Guía de Medidas - ${editingProduct?.name || 'Prenda'}`
  );
  const [sizeGuideImage, setSizeGuideImage] = useState<string>(
    editingProduct?.sizeGuide?.imageUrl || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80'
  );
  const [sizeGuideInstructions, setSizeGuideInstructions] = useState<string>(
    editingProduct?.sizeGuide?.instructions ||
      'Usa una cinta métrica flexible. Mantén la cinta nivelada sobre el cuerpo sin apretar en exceso.'
  );
  const [sizeGuideColumns, setSizeGuideColumns] = useState<string[]>(
    editingProduct?.sizeGuide?.columns || ['Pecho / Busto', 'Cintura', 'Cadera', 'Largo']
  );
  const [sizeGuideRows, setSizeGuideRows] = useState<SizeGuideRow[]>(
    editingProduct?.sizeGuide?.rows && editingProduct.sizeGuide.rows.length > 0
      ? editingProduct.sizeGuide.rows
      : SIZE_GUIDE_TEMPLATES.tops.rows
  );
  const [newColumnInput, setNewColumnInput] = useState('');
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
    c => c.slug === category || c.id === category || c.name.toLowerCase() === category.toLowerCase()
  );
  const availableSubcategories = currentCategoryObj?.subcategories || [];

  // Update sizeGuideTitle if name changes and title was default
  useEffect(() => {
    if (name && (!sizeGuideTitle || sizeGuideTitle.startsWith('Guía de Medidas'))) {
      setSizeGuideTitle(`Guía de Medidas - ${name}`);
    }
  }, [name]);

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

  // Size Guide Handlers
  const handleApplyTemplate = (templateKey: keyof typeof SIZE_GUIDE_TEMPLATES) => {
    const tmpl = SIZE_GUIDE_TEMPLATES[templateKey];
    setSizeGuideTitle(tmpl.title);
    setSizeGuideImage(tmpl.imageUrl);
    setSizeGuideInstructions(tmpl.instructions);
    setSizeGuideColumns([...tmpl.columns]);
    setSizeGuideRows(JSON.parse(JSON.stringify(tmpl.rows)));
  };

  const handleUploadSizeGuideImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploadingImage(true);
    try {
      const file = files[0];
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        setSizeGuideImage(uploadedUrl);
      }
    } catch (err) {
      console.error('Error uploading size guide image:', err);
    } finally {
      setIsUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleAddColumn = () => {
    if (!newColumnInput.trim()) return;
    const colName = newColumnInput.trim();
    if (!sizeGuideColumns.includes(colName)) {
      setSizeGuideColumns(prev => [...prev, colName]);
    }
    setNewColumnInput('');
  };

  const handleRemoveColumn = (colName: string) => {
    if (sizeGuideColumns.length <= 1) {
      alert('Debes mantener al menos una columna de medidas.');
      return;
    }
    setSizeGuideColumns(prev => prev.filter(c => c !== colName));
  };

  const handleAddRow = () => {
    const newRow: SizeGuideRow = {
      size: `Talla ${sizeGuideRows.length + 1}`,
      measurements: {},
      measurementsInches: {}
    };
    sizeGuideColumns.forEach(c => {
      newRow.measurements[c] = '-';
      if (newRow.measurementsInches) newRow.measurementsInches[c] = '-';
    });
    setSizeGuideRows(prev => [...prev, newRow]);
  };

  const handleSyncRowsFromProductSizes = () => {
    if (selectedSizes.length === 0) {
      alert('Primero selecciona tallas en la sección de Tallas del producto.');
      return;
    }
    const updatedRows: SizeGuideRow[] = selectedSizes.map((sz, idx) => {
      const existing = sizeGuideRows.find(r => r.size.toLowerCase().includes(sz.toLowerCase()));
      if (existing) return existing;
      const base = 88 + idx * 6;
      return {
        size: sz,
        measurements: {
          'Pecho / Busto': `${base} - ${base + 5} cm`,
          'Cintura': `${base - 20} - ${base - 15} cm`,
          'Cadera': `${base + 4} - ${base + 8} cm`,
          'Largo': `${65 + idx * 2} cm`
        },
        measurementsInches: {
          'Pecho / Busto': `${Math.round(base / 2.54)} - ${Math.round((base + 5) / 2.54)} in`,
          'Cintura': `${Math.round((base - 20) / 2.54)} - ${Math.round((base - 15) / 2.54)} in`,
          'Cadera': `${Math.round((base + 4) / 2.54)} - ${Math.round((base + 8) / 2.54)} in`,
          'Largo': `${Math.round((65 + idx * 2) / 2.54)} in`
        }
      };
    });
    setSizeGuideRows(updatedRows);
  };

  const handleRemoveRow = (idx: number) => {
    if (sizeGuideRows.length <= 1) {
      alert('Debes mantener al menos una fila de medidas.');
      return;
    }
    setSizeGuideRows(prev => prev.filter((_, i) => i !== idx));
  };

  const handleUpdateRowValue = (rowIdx: number, colName: string, val: string, isInch = false) => {
    setSizeGuideRows(prev => {
      const copy = [...prev];
      const target = { ...copy[rowIdx] };
      if (isInch) {
        target.measurementsInches = { ...(target.measurementsInches || {}), [colName]: val };
      } else {
        target.measurements = { ...target.measurements, [colName]: val };
      }
      copy[rowIdx] = target;
      return copy;
    });
  };

  const handleUpdateRowSizeName = (rowIdx: number, sizeName: string) => {
    setSizeGuideRows(prev => {
      const copy = [...prev];
      copy[rowIdx] = { ...copy[rowIdx], size: sizeName };
      return copy;
    });
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

  // Helper to compile product object
  const buildProductData = (isPublishedFlag: boolean = true): Product => {
    // Build variant stock array
    const variantStockList = [];
    if (productType === 'variable') {
      for (const sz of selectedSizes.length > 0 ? selectedSizes : [undefined]) {
        for (const col of selectedColors.length > 0 ? selectedColors : [undefined]) {
          const key = `${sz || ''}_${col?.name || ''}`;
          const vStock = variantStockMap[key] !== undefined ? variantStockMap[key] : Math.max(1, Math.floor(stock / Math.max(1, (selectedSizes.length || 1) * (selectedColors.length || 1))));
          variantStockList.push({
            id: `vs-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            size: sz,
            color: col?.name,
            stock: vStock,
            sku: `${sku}-${sz || 'UNI'}-${col?.name?.slice(0, 3)?.toUpperCase() || 'DEF'}`
          });
        }
      }
    }

    const compiledSizeGuide: SizeGuide = {
      enabled: sizeGuideEnabled,
      title: sizeGuideTitle,
      imageUrl: sizeGuideImage,
      instructions: sizeGuideInstructions,
      columns: sizeGuideColumns,
      rows: sizeGuideRows
    };

    return {
      id: productId,
      productType,
      name: name.trim() || 'Nuevo Producto',
      category,
      subcategory,
      price: Number(price) || 0,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      isOffer: Boolean(isOffer),
      offerPrice: isOffer && offerPrice ? Number(offerPrice) : undefined,
      discountPercentage: isOffer ? discountPercentage : 0,
      stock: Number(stock) || 0,
      sku: sku.trim() || `SKU-${Date.now().toString().slice(-4)}`,
      images: images.length > 0 ? images : ['https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg'],
      sizes: productType === 'variable' ? selectedSizes : [],
      colors: productType === 'variable' ? selectedColors : [],
      colorImages: productType === 'variable' ? colorImages : {},
      variantStock: variantStockList,
      sizeGuide: compiledSizeGuide,
      description: description.trim(),
      tags: [category, subcategory, ...(selectedSizes || [])],
      isFeatured,
      isPublished: isPublishedFlag,
      youtubeUrl: youtubeUrl.trim(),
      dateAdded: editingProduct ? editingProduct.dateAdded : new Date().toISOString().split('T')[0]
    };
  };

  // Botón 1: Guardar Cambios en vivo (sin salir de la pantalla)
  const handleSaveProgress = async (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('Por favor ingresa al menos el Nombre del Producto para guardar cambios.');
      return;
    }
    setIsSavingDraft(true);
    try {
      const productObj = buildProductData(true);
      await onSave(productObj, false);
      const timeStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastSavedTimestamp(timeStr);
      setSaveSuccessNotice(`Guardado a las ${timeStr}`);
      setTimeout(() => setSaveSuccessNotice(null), 4000);
    } finally {
      setIsSavingDraft(false);
    }
  };

  // Botón 2: Guardar y Publicar (guarda, publica y regresa al catálogo)
  const handlePublishAndSave = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!name.trim()) {
      alert('El nombre del producto es obligatorio.');
      return;
    }
    if (images.length === 0) {
      alert('Debes incluir al menos una fotografía para el producto.');
      return;
    }
    const productObj = buildProductData(true);
    onSave(productObj, true);
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
    sizeGuide: {
      enabled: sizeGuideEnabled,
      title: sizeGuideTitle,
      imageUrl: sizeGuideImage,
      instructions: sizeGuideInstructions,
      columns: sizeGuideColumns,
      rows: sizeGuideRows
    }
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
                <label className="font-bold text-gray-800">Categoría / Departamento *</label>
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
                value={category}
                onChange={e => {
                  const newCatSlug = e.target.value as Category;
                  const catObj = categories.find(
                    c => c.slug === newCatSlug || c.id === newCatSlug || c.name.toLowerCase() === newCatSlug.toLowerCase()
                  );
                  const firstSub = catObj?.subcategories?.[0]?.name || 'General';
                  setCategory(newCatSlug);
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
              <label className="block font-bold text-gray-800 mb-1">Stock Libre Total (pzas) *</label>
              <input
                type="number"
                min="0"
                value={stock}
                onChange={e => setStock(Number(e.target.value))}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-xl font-black text-gray-900 text-sm focus:border-[#9E0D0D] outline-hidden"
                required
              />
              <p className="text-[10px] text-gray-400 mt-1">Unidades disponibles para venta</p>
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
                  1. Tallas Disponibles ({selectedSizes.length} elegidas)
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedSizes([])}
                  className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                >
                  Limpiar Tallas
                </button>
              </div>

              {/* Clothing Presets */}
              <div className="space-y-2">
                <p className="text-[11px] font-bold text-gray-600">Tallas Ropa Estándar:</p>
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
                            ? 'bg-[#9E0D0D] text-white shadow-xs scale-105'
                            : 'bg-white text-gray-700 border border-gray-300 hover:border-gray-400'
                        }`}
                      >
                        {sz}
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
                            ? 'bg-[#9E0D0D] text-white shadow-xs'
                            : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        {sz}
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
                      if (customSizeInput.trim() && !selectedSizes.includes(customSizeInput.trim())) {
                        setSelectedSizes(prev => [...prev, customSizeInput.trim()]);
                        setCustomSizeInput('');
                      }
                    }
                  }}
                  className="flex-1 p-2 bg-white border border-gray-300 rounded-xl text-xs font-bold"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (customSizeInput.trim() && !selectedSizes.includes(customSizeInput.trim())) {
                      setSelectedSizes(prev => [...prev, customSizeInput.trim()]);
                      setCustomSizeInput('');
                    }
                  }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  + Agregar Talla
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
                <button
                  type="button"
                  onClick={() => setSelectedColors([])}
                  className="text-[11px] text-red-600 hover:underline font-bold cursor-pointer"
                >
                  Limpiar Colores
                </button>
              </div>

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

        {/* SECTION 5: SIZE GUIDE & MEASUREMENTS TABLE (REQUERIMIENTO CLAVE) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-amber-300 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200 pb-4">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-200 px-2.5 py-0.5 rounded-full inline-block mb-1">
                Función Activada
              </span>
              <h3 className="text-base sm:text-lg font-black text-gray-900 flex items-center gap-2">
                <Ruler className="w-5 h-5 text-amber-600" />
                5. Tabla de Medidas & Guía de Tallas para el Cliente
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Configura la fotografía de referencia y la tabla de medidas exacta para que el comprador elija su talla con confianza.
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

              {sizeGuideEnabled && (
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
              {/* Quick Template Selector */}
              <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-amber-950 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    Cargar Plantilla Predefinida (1-Clic):
                  </span>
                  <span className="text-[11px] text-amber-800">Autocompleta columnas y medidas típicas</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('tops')}
                    className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-xs text-amber-950 text-left transition-colors cursor-pointer"
                  >
                    👚 Tops / Playeras
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('bottoms')}
                    className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-xs text-amber-950 text-left transition-colors cursor-pointer"
                  >
                    👖 Pantalones & Jeans
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('dresses')}
                    className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-xs text-amber-950 text-left transition-colors cursor-pointer"
                  >
                    👗 Vestidos & Monos
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyTemplate('shoes')}
                    className="p-2.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl font-bold text-xs text-amber-950 text-left transition-colors cursor-pointer"
                  >
                    👟 Calzado & Tenis
                  </button>
                </div>
              </div>

              {/* Title & Reference Photo Assigned by Admin */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
                {/* Reference Photo Container */}
                <div className="md:col-span-4 bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="font-black text-gray-900 text-xs">Foto / Silueta de Medición</label>
                    <span className="text-[10px] text-gray-400">Asignada por admin</span>
                  </div>

                  <div className="relative rounded-xl overflow-hidden border border-gray-300 aspect-3/4 bg-white flex items-center justify-center">
                    {sizeGuideImage ? (
                      <img
                        src={sizeGuideImage}
                        alt="Guía de medición de talla"
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <div className="text-center p-4 text-gray-400">
                        <Ruler className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <span className="text-xs">Sin foto asignada</span>
                      </div>
                    )}
                  </div>

                  {/* Photo Controls */}
                  <div className="space-y-2">
                    <label className="w-full bg-slate-900 hover:bg-black text-white font-bold py-2 px-3 rounded-xl text-xs text-center cursor-pointer flex items-center justify-center gap-1.5 transition-colors">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Subir Foto desde Equipo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadSizeGuideImage}
                        className="hidden"
                      />
                    </label>

                    <input
                      type="text"
                      placeholder="O pega URL de foto guía..."
                      value={sizeGuideImage}
                      onChange={e => setSizeGuideImage(e.target.value)}
                      className="w-full p-2 bg-white border border-gray-300 rounded-xl text-[11px]"
                    />
                  </div>
                </div>

                {/* Guide Title, Instructions & Columns Configuration */}
                <div className="md:col-span-8 space-y-4">
                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Título de la Guía de Tallas *</label>
                    <input
                      type="text"
                      value={sizeGuideTitle}
                      onChange={e => setSizeGuideTitle(e.target.value)}
                      placeholder="Ej: Guía de Tallas para Playeras & Chamarras"
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl font-bold text-xs"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-800 mb-1">Instrucciones / Consejos para el Cliente</label>
                    <textarea
                      value={sizeGuideInstructions}
                      onChange={e => setSizeGuideInstructions(e.target.value)}
                      rows={2}
                      placeholder="Ej: Usa una cinta métrica flexible. Mantén la cinta nivelada sobre el cuerpo..."
                      className="w-full p-2.5 bg-gray-50 border border-gray-300 rounded-xl text-xs"
                    />
                  </div>

                  {/* Columns Manager */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <label className="block font-black text-slate-900 text-xs">Columnas de Medidas:</label>
                    <div className="flex flex-wrap gap-1.5">
                      {sizeGuideColumns.map(col => (
                        <span
                          key={col}
                          className="inline-flex items-center gap-1.5 bg-white border border-slate-300 text-slate-800 font-bold px-2.5 py-1 rounded-lg text-xs"
                        >
                          {col}
                          <button
                            type="button"
                            onClick={() => handleRemoveColumn(col)}
                            className="text-gray-400 hover:text-red-600 p-0.5"
                            title="Eliminar columna"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Nueva columna (ej. Manga, Espalda, Tiro)..."
                        value={newColumnInput}
                        onChange={e => setNewColumnInput(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddColumn();
                          }
                        }}
                        className="flex-1 p-2 bg-white border border-gray-300 rounded-xl text-xs font-medium"
                      />
                      <button
                        type="button"
                        onClick={handleAddColumn}
                        className="px-3.5 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-bold text-xs cursor-pointer"
                      >
                        + Columna
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Measurements Table Designer */}
              <div className="space-y-3 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="font-black text-gray-900 text-xs flex items-center gap-1.5">
                      <Ruler className="w-4 h-4 text-amber-600" />
                      Tabla de Medidas Editable (Filas por Talla)
                    </h4>
                    <p className="text-[11px] text-gray-500">
                      Introduce los rangos en cm (y opcionalmente en pulgadas). El cliente podrá alternar entre CM e IN.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSyncRowsFromProductSizes}
                      className="bg-amber-100 hover:bg-amber-200 text-amber-950 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copia las tallas seleccionadas en el producto"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Sincronizar Tallas del Producto</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>+ Fila de Talla</span>
                    </button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 text-slate-800 border-b border-gray-200 uppercase text-[10px] font-extrabold">
                          <th className="py-2.5 px-3 border-r border-gray-200 min-w-[130px]">Talla / Etiqueta</th>
                          {sizeGuideColumns.map(col => (
                            <th key={col} className="py-2.5 px-3 border-r border-gray-200 min-w-[140px] text-center">
                              {col} (CM / IN)
                            </th>
                          ))}
                          <th className="py-2.5 px-2 text-center w-12">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {sizeGuideRows.map((row, rowIdx) => (
                          <tr key={rowIdx} className="hover:bg-slate-50">
                            <td className="p-2 border-r border-gray-100">
                              <input
                                type="text"
                                value={row.size}
                                onChange={e => handleUpdateRowSizeName(rowIdx, e.target.value)}
                                className="w-full p-1.5 bg-gray-50 border border-gray-300 rounded-lg font-black text-gray-900 text-xs"
                                placeholder="ej. CH / S"
                              />
                            </td>

                            {sizeGuideColumns.map(col => {
                              const valCm = row.measurements[col] || '';
                              const valIn = row.measurementsInches?.[col] || '';
                              return (
                                <td key={col} className="p-2 border-r border-gray-100">
                                  <div className="space-y-1">
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-bold text-gray-400 w-6">CM:</span>
                                      <input
                                        type="text"
                                        value={valCm}
                                        onChange={e => handleUpdateRowValue(rowIdx, col, e.target.value, false)}
                                        placeholder="88-92 cm"
                                        className="flex-1 p-1 bg-white border border-gray-200 rounded text-xs text-center font-medium"
                                      />
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <span className="text-[10px] font-bold text-gray-400 w-6">IN:</span>
                                      <input
                                        type="text"
                                        value={valIn}
                                        onChange={e => handleUpdateRowValue(rowIdx, col, e.target.value, true)}
                                        placeholder="34-36 in"
                                        className="flex-1 p-1 bg-white border border-gray-200 rounded text-[11px] text-center text-gray-500 font-medium"
                                      />
                                    </div>
                                  </div>
                                </td>
                              );
                            })}

                            <td className="p-2 text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(rowIdx)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded cursor-pointer"
                                title="Eliminar esta fila"
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
              </div>
            </div>
          ) : (
            <div className="text-center py-6 text-gray-400 italic bg-gray-50 rounded-2xl border border-dashed border-gray-300">
              Guía de tallas desactivada para este producto. Marca la casilla superior para activarla y personalizar sus medidas.
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
    </div>
  );
};
