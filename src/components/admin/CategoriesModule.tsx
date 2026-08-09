import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { CategoryItem, SubcategoryItem } from '../../types';
import { Layers, Plus, Trash2, Edit2, Check, X, Tag, Sparkles, ChevronRight, FolderPlus } from 'lucide-react';

export const CategoriesModule: React.FC = () => {
  const { categories, addCategory, updateCategory, deleteCategory, addSubcategory, deleteSubcategory } = useStore();

  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // Form states for New / Edit Category
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // Form states for New Subcategory
  const [selectedCatForSub, setSelectedCatForSub] = useState<string | null>(null);
  const [subName, setSubName] = useState('');

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    const slug = catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-');
    addCategory({
      name: catName,
      slug,
      iconName: 'Tag',
      description: catDesc || `Categoría de ${catName}`,
      active: true,
      subcategories: []
    });

    setCatName('');
    setCatSlug('');
    setCatDesc('');
    setIsAddingCategory(false);
  };

  const handleUpdateCategory = (id: string) => {
    if (!catName.trim()) return;
    updateCategory(id, {
      name: catName,
      slug: catSlug.trim() || catName.toLowerCase().replace(/\s+/g, '-'),
      description: catDesc
    });
    setEditingCategoryId(null);
    setCatName('');
    setCatSlug('');
    setCatDesc('');
  };

  const handleAddSubcategorySubmit = (categoryId: string) => {
    if (!subName.trim()) return;
    addSubcategory(categoryId, {
      name: subName,
      slug: subName.trim(),
      active: true
    });
    setSubName('');
    setSelectedCatForSub(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#9E0D0D]" />
            Módulo de Categorías y Subcategorías
          </h3>
          <p className="text-xs text-slate-500">
            Administra las categorías principales de la tienda y sus subcategorías asociadas
          </p>
        </div>

        <button
          onClick={() => {
            setIsAddingCategory(!isAddingCategory);
            setEditingCategoryId(null);
            setCatName('');
            setCatSlug('');
            setCatDesc('');
          }}
          className="flex items-center gap-2 bg-[#9E0D0D] hover:bg-red-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4 text-[#E05A1B]" />
          <span>{isAddingCategory ? 'Cancelar Nueva' : 'Nueva Categoría'}</span>
        </button>
      </div>

      {/* Form: Add New Category */}
      {isAddingCategory && (
        <form onSubmit={handleCreateCategory} className="bg-white p-6 rounded-3xl border border-red-200 shadow-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h4 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#E05A1B]" />
              Crear Nueva Categoría
            </h4>
            <button type="button" onClick={() => setIsAddingCategory(false)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Nombre de Categoría *</label>
              <input
                type="text"
                value={catName}
                onChange={e => {
                  setCatName(e.target.value);
                  if (!catSlug) {
                    setCatSlug(e.target.value.toLowerCase().replace(/\s+/g, '-'));
                  }
                }}
                placeholder="Ej. Deportiva, Accesorios, Temporada"
                className="w-full p-3 border border-slate-200 rounded-xl font-bold text-slate-900 focus:border-[#9E0D0D] outline-hidden"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Identificador Slug (URL / ID)</label>
              <input
                type="text"
                value={catSlug}
                onChange={e => setCatSlug(e.target.value)}
                placeholder="deportiva"
                className="w-full p-3 border border-slate-200 rounded-xl font-mono text-slate-700 focus:border-[#9E0D0D] outline-hidden"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block font-bold text-slate-700 mb-1">Descripción Breve</label>
              <input
                type="text"
                value={catDesc}
                onChange={e => setCatDesc(e.target.value)}
                placeholder="Descripción para sugerencias de búsqueda e información"
                className="w-full p-3 border border-slate-200 rounded-xl text-slate-800 focus:border-[#9E0D0D] outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAddingCategory(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-[#9E0D0D] text-white font-extrabold text-xs rounded-xl shadow-md hover:bg-red-800"
            >
              Guardar Categoría
            </button>
          </div>
        </form>
      )}

      {/* List of Categories & Subcategories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(cat => {
          const isEditing = editingCategoryId === cat.id;

          return (
            <div
              key={cat.id}
              className="bg-white rounded-3xl border border-slate-200 shadow-xs hover:shadow-md transition-all p-6 flex flex-col justify-between space-y-4"
            >
              {/* Category Header / Edit mode */}
              <div>
                {isEditing ? (
                  <div className="space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      <input
                        type="text"
                        value={catName}
                        onChange={e => setCatName(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg font-bold text-slate-900"
                        placeholder="Nombre de categoría"
                      />
                      <input
                        type="text"
                        value={catDesc}
                        onChange={e => setCatDesc(e.target.value)}
                        className="p-2 border border-slate-300 rounded-lg text-slate-700"
                        placeholder="Descripción"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateCategory(cat.id)}
                        className="bg-emerald-600 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                      >
                        <Check className="w-3.5 h-3.5" /> Guardar
                      </button>
                      <button
                        onClick={() => setEditingCategoryId(null)}
                        className="bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-lg"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-3 bg-red-50 text-[#9E0D0D] rounded-2xl font-black border border-red-100">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-base text-slate-900 uppercase tracking-tight">{cat.name}</h4>
                          <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold">
                            slug: {cat.slug}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{cat.description}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => {
                          setEditingCategoryId(cat.id);
                          setCatName(cat.name);
                          setCatSlug(cat.slug);
                          setCatDesc(cat.description);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-all"
                        title="Editar Categoría"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`¿Eliminar categoría "${cat.name}"?`)) {
                            deleteCategory(cat.id);
                          }
                        }}
                        className="p-2 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all"
                        title="Eliminar Categoría"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Subcategories Section */}
              <div className="border-t border-slate-100 pt-3 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5 text-[#E05A1B]" />
                    Subcategorías ({cat.subcategories.length})
                  </span>

                  <button
                    onClick={() => {
                      if (selectedCatForSub === cat.id) {
                        setSelectedCatForSub(null);
                      } else {
                        setSelectedCatForSub(cat.id);
                        setSubName('');
                      }
                    }}
                    className="text-[11px] font-extrabold text-[#9E0D0D] hover:underline flex items-center gap-1"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    + Agregar Subcategoría
                  </button>
                </div>

                {/* Subcategory Inline Form */}
                {selectedCatForSub === cat.id && (
                  <div className="flex gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                    <input
                      type="text"
                      value={subName}
                      onChange={e => setSubName(e.target.value)}
                      placeholder="Nombre de subcategoría"
                      className="flex-1 p-2 bg-white border border-slate-300 rounded-lg text-slate-900 font-bold focus:border-[#9E0D0D] outline-hidden"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => handleAddSubcategorySubmit(cat.id)}
                      className="bg-[#9E0D0D] text-white font-bold px-3 py-2 rounded-lg hover:bg-red-800 shrink-0"
                    >
                      Agregar
                    </button>
                  </div>
                )}

                {/* Subcategory List Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {cat.subcategories.length === 0 ? (
                    <span className="text-[11px] text-slate-400 italic">Sin subcategorías registradas aún.</span>
                  ) : (
                    cat.subcategories.map(sub => (
                      <span
                        key={sub.id}
                        className="inline-flex items-center gap-1 bg-slate-100 text-slate-800 text-[11px] font-bold px-2.5 py-1 rounded-lg border border-slate-200"
                      >
                        <span>{sub.name}</span>
                        <button
                          onClick={() => deleteSubcategory(cat.id, sub.id)}
                          className="text-slate-400 hover:text-red-600 ml-0.5"
                          title="Eliminar subcategoría"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
