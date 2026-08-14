import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { SizeGuideTemplate, SizeGuideRow } from '../../types';
import { SizeGuideModal } from '../store/SizeGuideModal';
import {
  Ruler,
  Plus,
  Trash2,
  Edit2,
  Copy,
  Eye,
  Check,
  X,
  Sparkles,
  Search,
  RotateCcw,
  Image as ImageIcon,
  HelpCircle,
  Tag,
  ArrowRight,
  Layers,
  CheckCircle2,
  SlidersHorizontal,
  Table as TableIcon
} from 'lucide-react';

const PRESET_TEMPLATES = [
  {
    name: 'Playeras & Polos',
    category: 'Hombre',
    columns: ['Pecho / Busto', 'Cintura', 'Largo Torso', 'Manga'],
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80',
    instructions: 'Coloca una playera sobre una superficie plana. Mide de sisa a sisa y de cuello a dobladillo inferior.',
    sizes: ['CH / S', 'MD / M', 'GD / L', 'XGD / XL', '2XGD / 2XL']
  },
  {
    name: 'Vestidos & Blusas',
    category: 'Mujer',
    columns: ['Busto', 'Cintura', 'Cadera', 'Largo Total'],
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80',
    instructions: 'Mide el contorno de busto en la parte más amplia, la cintura en la más estrecha y la cadera con pies juntos.',
    sizes: ['XS', 'S', 'M', 'L', 'XL']
  },
  {
    name: 'Pantalones & Jeans',
    category: 'Hombre',
    columns: ['Cintura', 'Cadera', 'Tiro', 'Largo Entrepierna'],
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    instructions: 'Mide la cintura donde habitualmente usas el pantalón y el largo desde la entrepierna hasta el tobillo.',
    sizes: ['28 / CH', '30 / MD', '32 / GD', '34 / XG', '36 / 2XG']
  },
  {
    name: 'Calzado & Tenis',
    category: 'Calzado',
    columns: ['Talla MX (cm)', 'Talla US Hombre', 'Talla US Mujer', 'Talla EUR'],
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    instructions: 'Apoya el talón contra la pared y mide en línea recta hasta la punta del dedo más largo en centímetros.',
    sizes: ['23.0 MX', '24.0 MX', '25.0 MX', '26.0 MX', '27.0 MX', '28.0 MX']
  }
];

export const SizeGuidesModule: React.FC = () => {
  const {
    sizeGuideTemplates,
    addSizeGuideTemplate,
    updateSizeGuideTemplate,
    deleteSizeGuideTemplate,
    duplicateSizeGuideTemplate,
    restoreDefaultSizeGuideTemplates,
    products
  } = useStore();

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');

  // Modal / Drawer state
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingTemplateId, setEditingTemplateId] = useState<string | null>(null);

  // Customer Preview Modal state
  const [previewTemplate, setPreviewTemplate] = useState<SizeGuideTemplate | null>(null);

  // Editor Form States
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('Hombre');
  const [formUnit, setFormUnit] = useState<'cm' | 'in'>('cm');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formInstructions, setFormInstructions] = useState('');
  const [formColumns, setFormColumns] = useState<string[]>(['Pecho / Busto', 'Cintura', 'Cadera', 'Largo']);
  const [formRows, setFormRows] = useState<SizeGuideRow[]>([
    { size: 'CH / S', measurements: { 'Pecho / Busto': '88-94 cm', 'Cintura': '74-79 cm', 'Cadera': '92-96 cm', 'Largo': '68 cm' } },
    { size: 'MD / M', measurements: { 'Pecho / Busto': '96-102 cm', 'Cintura': '81-86 cm', 'Cadera': '98-102 cm', 'Largo': '71 cm' } },
    { size: 'GD / L', measurements: { 'Pecho / Busto': '104-110 cm', 'Cintura': '89-94 cm', 'Cadera': '104-108 cm', 'Largo': '74 cm' } }
  ]);
  const [newColumnName, setNewColumnName] = useState('');
  const [newRowSize, setNewRowSize] = useState('');

  // Count products using each template
  const getProductCountForTemplate = (templateId: string) => {
    return products.filter(p => p.sizeGuideTemplateId === templateId || p.sizeGuide?.templateId === templateId).length;
  };

  // Open Editor for Creating
  const handleOpenCreate = () => {
    setEditingTemplateId(null);
    setFormName('');
    setFormCategory('Hombre');
    setFormUnit('cm');
    setFormImageUrl('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80');
    setFormInstructions('Coloca la prenda extendida sobre una superficie plana y mide con una cinta métrica flexible sin estirar.');
    setFormColumns(['Pecho / Busto', 'Cintura', 'Largo Torso', 'Manga']);
    setFormRows([
      { size: 'CH / S', measurements: { 'Pecho / Busto': '88 - 94 cm', 'Cintura': '74 - 79 cm', 'Largo Torso': '68 cm', 'Manga': '20 cm' } },
      { size: 'MD / M', measurements: { 'Pecho / Busto': '96 - 102 cm', 'Cintura': '81 - 86 cm', 'Largo Torso': '71 cm', 'Manga': '21 cm' } },
      { size: 'GD / L', measurements: { 'Pecho / Busto': '104 - 110 cm', 'Cintura': '89 - 94 cm', 'Largo Torso': '74 cm', 'Manga': '22 cm' } },
      { size: 'XGD / XL', measurements: { 'Pecho / Busto': '112 - 118 cm', 'Cintura': '97 - 102 cm', 'Largo Torso': '77 cm', 'Manga': '23 cm' } }
    ]);
    setIsEditorOpen(true);
  };

  // Open Editor for Editing
  const handleOpenEdit = (template: SizeGuideTemplate) => {
    setEditingTemplateId(template.id);
    setFormName(template.name);
    setFormCategory(template.category || 'Hombre');
    setFormUnit(template.unit || 'cm');
    setFormImageUrl(template.imageUrl || '');
    setFormInstructions(template.instructions || '');
    setFormColumns(template.columns || ['Pecho', 'Cintura', 'Largo']);
    setFormRows(JSON.parse(JSON.stringify(template.rows || [])));
    setIsEditorOpen(true);
  };

  // Load Preset
  const handleLoadPreset = (preset: typeof PRESET_TEMPLATES[0]) => {
    setFormName(preset.name);
    setFormCategory(preset.category);
    setFormImageUrl(preset.imageUrl);
    setFormInstructions(preset.instructions);
    setFormColumns(preset.columns);
    setFormRows(
      preset.sizes.map((s, idx) => {
        const measurements: Record<string, string> = {};
        preset.columns.forEach((col, cIdx) => {
          measurements[col] = `${85 + idx * 6 + cIdx * 4} cm`;
        });
        return {
          size: s,
          measurements
        };
      })
    );
  };

  // Column Actions
  const handleAddColumn = () => {
    if (!newColumnName.trim()) return;
    const col = newColumnName.trim();
    if (formColumns.includes(col)) return;

    setFormColumns(prev => [...prev, col]);
    setFormRows(prev =>
      prev.map(row => ({
        ...row,
        measurements: {
          ...row.measurements,
          [col]: '-'
        }
      }))
    );
    setNewColumnName('');
  };

  const handleRemoveColumn = (colToRemove: string) => {
    if (formColumns.length <= 1) return;
    setFormColumns(prev => prev.filter(c => c !== colToRemove));
    setFormRows(prev =>
      prev.map(row => {
        const next = { ...row.measurements };
        delete next[colToRemove];
        return { ...row, measurements: next };
      })
    );
  };

  // Row Actions
  const handleAddRow = () => {
    const sizeLabel = newRowSize.trim() || `Talla ${formRows.length + 1}`;
    const initialMeas: Record<string, string> = {};
    formColumns.forEach(c => {
      initialMeas[c] = '-';
    });
    setFormRows(prev => [...prev, { size: sizeLabel, measurements: initialMeas }]);
    setNewRowSize('');
  };

  const handleRemoveRow = (index: number) => {
    setFormRows(prev => prev.filter((_, i) => i !== index));
  };

  const handleCellChange = (rowIndex: number, colName: string, value: string) => {
    setFormRows(prev => {
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        measurements: {
          ...next[rowIndex].measurements,
          [colName]: value
        }
      };
      return next;
    });
  };

  const handleSizeNameChange = (rowIndex: number, newSizeName: string) => {
    setFormRows(prev => {
      const next = [...prev];
      next[rowIndex] = {
        ...next[rowIndex],
        size: newSizeName
      };
      return next;
    });
  };

  // Handle local image upload as dataURL
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setFormImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Save Template
  const handleSaveTemplate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    if (editingTemplateId) {
      updateSizeGuideTemplate(editingTemplateId, {
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        imageUrl: formImageUrl.trim(),
        instructions: formInstructions.trim(),
        columns: formColumns,
        rows: formRows
      });
    } else {
      addSizeGuideTemplate({
        name: formName.trim(),
        category: formCategory,
        unit: formUnit,
        imageUrl: formImageUrl.trim(),
        instructions: formInstructions.trim(),
        columns: formColumns,
        rows: formRows,
        isDefault: false
      });
    }

    setIsEditorOpen(false);
  };

  // Filter templates
  const categoriesList = ['Todas', 'Hombre', 'Mujer', 'Niños', 'Calzado', 'Unisex', 'General'];
  const filteredTemplates = sizeGuideTemplates.filter(t => {
    const matchSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (t.instructions && t.instructions.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchCat = selectedCategory === 'Todas' || t.category?.toLowerCase() === selectedCategory.toLowerCase();
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-red-600/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/30 rounded-full text-red-400 text-xs font-black uppercase tracking-wider">
              <Ruler className="w-3.5 h-3.5" />
              Módulo de Plantillas de Tallas
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Tablas de Medidas & Guías de Tallas
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Crea y administra plantillas reutilizables por tipo de prenda (Playeras, Jeans, Vestidos, Calzado). 
              Al registrar un nuevo producto en tu tienda, podrás <strong>vincular cualquiera de estas plantillas con un solo clic</strong> sin tener que rediseñar la tabla cada vez.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-5 py-3 bg-[#9E0D0D] hover:bg-[#800a0a] text-white rounded-2xl font-bold shadow-lg hover:shadow-red-900/30 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Plus className="w-5 h-5" />
              Nueva Tabla de Medidas
            </button>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('¿Deseas restaurar las 5 plantillas predeterminadas de medidas (Playeras, Vestidos, Jeans, Chamarras, Calzado)?')) {
                  restoreDefaultSizeGuideTemplates();
                }
              }}
              title="Restaurar plantillas sugeridas"
              className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl font-medium border border-slate-700 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              Restaurar Base
            </button>
          </div>
        </div>

        {/* Quick Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 font-medium">Plantillas Registradas</div>
            <div className="text-xl font-black text-white mt-0.5">{sizeGuideTemplates.length} tablas</div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 font-medium">Productos Vinculados</div>
            <div className="text-xl font-black text-amber-400 mt-0.5">
              {products.filter(p => p.sizeGuide?.enabled || p.sizeGuideTemplateId).length} productos
            </div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 font-medium">Categorías Cubiertas</div>
            <div className="text-xl font-black text-emerald-400 mt-0.5">
              {new Set(sizeGuideTemplates.map(t => t.category)).size} categorías
            </div>
          </div>
          <div className="bg-slate-800/60 backdrop-blur-xs p-3 rounded-xl border border-slate-700/50">
            <div className="text-slate-400 font-medium">Unidades Soportadas</div>
            <div className="text-xl font-black text-sky-400 mt-0.5">CM y Pulgadas (IN)</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          {categoriesList.map(cat => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Buscar plantilla o medida..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Templates Grid */}
      {filteredTemplates.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-dashed border-slate-300 space-y-4">
          <div className="w-16 h-16 bg-red-50 text-[#9E0D0D] rounded-full flex items-center justify-center mx-auto">
            <Ruler className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No se encontraron tablas de medidas</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              {searchTerm
                ? 'No hay plantillas que coincidan con tu búsqueda. Prueba con otro término o limpia los filtros.'
                : 'Aún no tienes tablas de medidas en esta categoría. Crea una nueva plantilla o restaura las bases.'}
            </p>
          </div>
          <div className="flex justify-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleOpenCreate}
              className="px-4 py-2.5 bg-[#9E0D0D] text-white text-xs font-bold rounded-xl shadow-xs hover:bg-[#800a0a]"
            >
              + Crear Nueva Plantilla
            </button>
            <button
              type="button"
              onClick={restoreDefaultSizeGuideTemplates}
              className="px-4 py-2.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl hover:bg-slate-200"
            >
              Restaurar Sugeridas
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredTemplates.map(template => {
            const productUsage = getProductCountForTemplate(template.id);
            return (
              <div
                key={template.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Card Top Banner */}
                <div className="p-5 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/70">
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-red-50 border border-red-100 rounded-2xl text-[#9E0D0D] shrink-0">
                      <Ruler className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-900 text-white">
                          {template.category || 'General'}
                        </span>
                        {productUsage > 0 ? (
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {productUsage} {productUsage === 1 ? 'producto vinculado' : 'productos vinculados'}
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-500">
                            Sin productos vinculados
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-[#9E0D0D] transition-colors">
                        {template.name}
                      </h3>
                    </div>
                  </div>

                  {/* Actions Dropdown / Quick Buttons */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(template)}
                      title="Previsualizar como cliente"
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(template)}
                      title="Editar plantilla"
                      className="p-2 text-slate-500 hover:text-[#9E0D0D] hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => duplicateSizeGuideTemplate(template.id)}
                      title="Duplicar plantilla"
                      className="p-2 text-slate-500 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-slate-200 transition-all cursor-pointer"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`¿Estás seguro de eliminar la tabla de medidas "${template.name}"?`)) {
                          deleteSizeGuideTemplate(template.id);
                        }
                      }}
                      title="Eliminar plantilla"
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Card Content & Mini Table Preview */}
                <div className="p-5 flex-1 space-y-4">
                  {/* Silhouette and Instructions row */}
                  <div className="flex items-start gap-3 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                    {template.imageUrl ? (
                      <img
                        src={template.imageUrl}
                        alt={template.name}
                        className="w-14 h-14 object-cover rounded-xl border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400 shrink-0">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                    <div className="text-xs text-slate-600 space-y-1 overflow-hidden">
                      <div className="font-bold text-slate-800 flex items-center gap-1">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                        Instrucciones al Cliente
                      </div>
                      <p className="line-clamp-2 leading-relaxed text-slate-500">
                        {template.instructions || 'Mide con cinta métrica flexible sobre una superficie plana.'}
                      </p>
                    </div>
                  </div>

                  {/* Measurement Columns Summary */}
                  <div className="space-y-1.5">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                      <span>Columnas ({template.columns.length})</span>
                      <span>{template.rows.length} Tallas</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {template.columns.map((col, idx) => (
                        <span
                          key={idx}
                          className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold"
                        >
                          {col}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Mini Table Preview */}
                  <div className="border border-slate-200 rounded-2xl overflow-hidden text-xs">
                    <div className="max-h-36 overflow-y-auto scrollbar-thin">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-slate-900 text-white sticky top-0 text-[11px]">
                          <tr>
                            <th className="py-2 px-3 font-bold">Talla</th>
                            {template.columns.slice(0, 3).map((col, idx) => (
                              <th key={idx} className="py-2 px-3 font-bold truncate">
                                {col}
                              </th>
                            ))}
                            {template.columns.length > 3 && (
                              <th className="py-2 px-2 font-bold text-slate-400">+{template.columns.length - 3}</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                          {template.rows.slice(0, 4).map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-slate-50">
                              <td className="py-2 px-3 font-black text-slate-900 whitespace-nowrap">
                                {row.size}
                              </td>
                              {template.columns.slice(0, 3).map((col, cIdx) => (
                                <td key={cIdx} className="py-2 px-3 text-slate-600 whitespace-nowrap font-mono text-[11px]">
                                  {row.measurements[col] || '-'}
                                </td>
                              ))}
                              {template.columns.length > 3 && (
                                <td className="py-2 px-2 text-slate-400 font-mono text-[11px]">...</td>
                              )}
                            </tr>
                          ))}
                          {template.rows.length > 4 && (
                            <tr>
                              <td colSpan={template.columns.length + 1} className="py-1.5 px-3 text-center text-slate-400 text-[10px] bg-slate-50 italic">
                                + {template.rows.length - 4} tallas adicionales registradas
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3 text-xs">
                  <span className="text-slate-400 text-[11px]">
                    Creada: {template.createdAt || 'Estándar'}
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPreviewTemplate(template)}
                      className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl border border-slate-200 transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-slate-500" />
                      Vista Cliente
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(template)}
                      className="px-3.5 py-1.5 bg-slate-900 hover:bg-[#9E0D0D] text-white font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                      Editar
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Visual Editor Modal / Drawer */}
      {isEditorOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[94vh] flex flex-col overflow-hidden animate-scaleIn">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-[#9E0D0D] rounded-2xl text-white shadow-xs">
                  <Ruler className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingTemplateId ? 'Editar Tabla de Medidas' : 'Nueva Tabla de Medidas'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Configura las medidas y guías que se mostrarán al vincular esta plantilla con productos.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Presets Bar */}
            <div className="bg-slate-100 p-3 border-b border-slate-200 flex items-center gap-2 overflow-x-auto text-xs">
              <span className="font-bold text-slate-500 flex items-center gap-1 shrink-0 px-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Cargar Preajuste Rápido:
              </span>
              {PRESET_TEMPLATES.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleLoadPreset(preset)}
                  className="px-3 py-1 bg-white hover:bg-slate-900 hover:text-white text-slate-700 rounded-lg font-semibold border border-slate-200 transition-all shrink-0 cursor-pointer"
                >
                  {preset.name}
                </button>
              ))}
            </div>

            {/* Modal Body / Form */}
            <form onSubmit={handleSaveTemplate} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 scrollbar-thin">
              {/* Basic Details Section */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">
                    Nombre de la Tabla / Plantilla <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={e => setFormName(e.target.value)}
                    placeholder="Ej. Playeras & Tops Unisex, Jeans Slim Fit, Vestidos de Gala..."
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Categoría</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
                  >
                    <option value="Hombre">Hombre</option>
                    <option value="Mujer">Mujer</option>
                    <option value="Niños">Niños</option>
                    <option value="Calzado">Calzado</option>
                    <option value="Unisex">Unisex</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              {/* Silhouette Image and Measuring Instructions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
                    <span>Imagen Ilustrativa / Silueta de Medición</span>
                    <span className="text-[10px] text-slate-400 font-normal">URL o Cargar</span>
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formImageUrl}
                      onChange={e => setFormImageUrl(e.target.value)}
                      placeholder="https://ejemplo.com/silueta-medidas.jpg"
                      className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
                    />
                    <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 cursor-pointer flex items-center gap-1 shrink-0">
                      <ImageIcon className="w-3.5 h-3.5" />
                      Subir
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  {formImageUrl && (
                    <div className="mt-2 flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
                      <img
                        src={formImageUrl}
                        alt="Previsualización"
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200"
                        onError={() => setFormImageUrl('')}
                      />
                      <span className="text-[11px] text-slate-500 truncate flex-1">
                        Imagen cargada correctamente
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormImageUrl('')}
                        className="text-xs text-red-500 hover:underline px-1"
                      >
                        Quitar
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    Instrucciones & Consejos de Medición para el Cliente
                  </label>
                  <textarea
                    rows={3}
                    value={formInstructions}
                    onChange={e => setFormInstructions(e.target.value)}
                    placeholder="Instrucciones sobre cómo tomar las medidas (ej. Mide el contorno de pecho con cinta métrica flexible, extiende la prenda sobre una mesa...)"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
                  />
                </div>
              </div>

              {/* Columns Editor */}
              <div className="space-y-3 p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <TableIcon className="w-4 h-4 text-[#9E0D0D]" />
                      Columnas de Medición
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Define los puntos de medición (ej. Pecho, Cintura, Cadera, Largo, Manga).
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newColumnName}
                      onChange={e => setNewColumnName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddColumn();
                        }
                      }}
                      placeholder="Nueva columna (ej. Manga)..."
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
                    />
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-[#9E0D0D] text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Agregar
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  {formColumns.map(col => (
                    <div
                      key={col}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-2xs text-xs font-bold text-slate-800"
                    >
                      <span>{col}</span>
                      {formColumns.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveColumn(col)}
                          className="text-slate-400 hover:text-red-500 transition-colors ml-1"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Rows / Sizes Table Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      Valores de Medición por Talla ({formRows.length} Tallas)
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      Ingresa los rangos o medidas exactas para cada talla (ej. "88 - 94 cm", "70 cm").
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newRowSize}
                      onChange={e => setNewRowSize(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRow();
                        }
                      }}
                      placeholder="Nombre de talla (ej. 3XL)..."
                      className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#9E0D0D]"
                    />
                    <button
                      type="button"
                      onClick={handleAddRow}
                      className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      + Talla
                    </button>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-2xl overflow-x-auto shadow-2xs">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead className="bg-slate-900 text-white">
                      <tr>
                        <th className="py-2.5 px-3 font-bold w-36">Talla / Identificador</th>
                        {formColumns.map((col, idx) => (
                          <th key={idx} className="py-2.5 px-3 font-bold min-w-[130px]">
                            {col}
                          </th>
                        ))}
                        <th className="py-2.5 px-3 font-bold text-center w-16">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {formRows.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/70">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={row.size}
                              onChange={e => handleSizeNameChange(rIdx, e.target.value)}
                              className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-black text-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9E0D0D]"
                            />
                          </td>
                          {formColumns.map((col, cIdx) => (
                            <td key={cIdx} className="py-2 px-3">
                              <input
                                type="text"
                                value={row.measurements[col] || ''}
                                onChange={e => handleCellChange(rIdx, col, e.target.value)}
                                placeholder="ej. 88 - 94 cm"
                                className="w-full px-2 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 font-mono focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#9E0D0D]"
                              />
                            </td>
                          ))}
                          <td className="py-2 px-3 text-center">
                            {formRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveRow(rIdx)}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                title="Eliminar talla"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setIsEditorOpen(false)}
                className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl text-xs font-bold border border-slate-200 transition-all cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={handleSaveTemplate}
                className="px-6 py-2.5 bg-[#9E0D0D] hover:bg-[#800a0a] text-white rounded-xl text-xs font-bold shadow-md hover:shadow-red-900/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                {editingTemplateId ? 'Guardar Cambios' : 'Registrar Plantilla'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Customer Modal Preview */}
      {previewTemplate && (
        <SizeGuideModal
          isOpen={true}
          onClose={() => setPreviewTemplate(null)}
          template={previewTemplate}
        />
      )}
    </div>
  );
};
