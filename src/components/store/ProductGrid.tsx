import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductQuickView } from './ProductQuickView';
import { SlidersHorizontal, ArrowUpDown, Sparkles, FilterX, Search } from 'lucide-react';

const normalizeText = (str: string) =>
  (str || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery, categories } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'descuento'>('destacados');
  const [priceFilter, setPriceFilter] = useState<number>(10000);

  const activeCategoryObj = useMemo(() => {
    return categories.find(c => c.slug === selectedCategory || c.id === selectedCategory || normalizeText(c.name) === normalizeText(selectedCategory));
  }, [categories, selectedCategory]);

  const maxAvailablePrice = useMemo(() => {
    if (!products || products.length === 0) return 10000;
    return Math.max(...products.map(p => p.price || 0), 10000);
  }, [products]);

  const filteredProducts = useMemo(() => {
    const rawQuery = searchQuery.trim();
    const queryNorm = normalizeText(rawQuery);
    const queryWords = queryNorm.split(/\s+/).filter(Boolean);

    return products
      .filter(p => {
        // 1. Category Matching: Ignore category restriction if user is actively searching
        const matchesCategory =
          Boolean(queryNorm) ||
          selectedCategory === 'todas' ||
          p.category === selectedCategory ||
          normalizeText(p.category) === normalizeText(selectedCategory) ||
          (activeCategoryObj && (p.category === activeCategoryObj.slug || normalizeText(p.category) === normalizeText(activeCategoryObj.name)));

        // 2. Comprehensive Search Matching across Name, Desc, Category, Subcategory, SKU, Tags, Sizes, Colors
        let matchesSearch = true;
        if (queryWords.length > 0) {
          const nameNorm = normalizeText(p.name);
          const descNorm = normalizeText(p.description);
          const catNorm = normalizeText(p.category);
          const subNorm = normalizeText(p.subcategory);
          const skuNorm = p.sku ? normalizeText(p.sku) : '';
          const tagsNorm = p.tags ? p.tags.map(t => normalizeText(t)) : [];
          const sizesNorm = p.sizes ? p.sizes.map(s => normalizeText(s)) : [];
          const colorsNorm = p.colors
            ? p.colors.map(c => (typeof c === 'string' ? normalizeText(c) : normalizeText(c.name)))
            : [];

          matchesSearch = queryWords.every(word =>
            nameNorm.includes(word) ||
            descNorm.includes(word) ||
            catNorm.includes(word) ||
            subNorm.includes(word) ||
            skuNorm.includes(word) ||
            tagsNorm.some(t => t.includes(word)) ||
            sizesNorm.some(s => s.includes(word)) ||
            colorsNorm.some(c => c.includes(word))
          );
        }

        // 3. Price & Stock & Publication Filters
        const matchesPrice = p.price <= priceFilter;
        const matchesStock = p.stock > 0;
        const isPublished = p.isPublished !== false;

        return matchesCategory && matchesSearch && matchesPrice && matchesStock && isPublished;
      })
      .sort((a, b) => {
        if (sortBy === 'precio-asc') return a.price - b.price;
        if (sortBy === 'precio-desc') return b.price - a.price;
        if (sortBy === 'descuento') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy, activeCategoryObj]);

  const categoryTitle = useMemo(() => {
    if (searchQuery.trim()) return `Resultados para: "${searchQuery.trim()}"`;
    if (selectedCategory === 'todas') return 'Catálogo General de Ropa';
    if (selectedCategory === 'ofertas') return 'Gran Barata & Ofertas Exclusivas ⚡';
    if (activeCategoryObj) return `Colección ${activeCategoryObj.name}`;
    return `Categoría: ${selectedCategory}`;
  }, [selectedCategory, searchQuery, activeCategoryObj]);

  return (
    <section id="catalogo" className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 font-sans">
      {/* Search active notice */}
      {searchQuery.trim() && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
          <div className="flex items-center gap-2 text-xs font-bold text-[#9E0D0D]">
            <Search className="w-4 h-4 text-[#E05A1B]" />
            <span>Buscando en todo el catálogo: "{searchQuery.trim()}"</span>
            <span className="bg-[#9E0D0D] text-white px-2 py-0.5 rounded-full text-[10px]">
              {filteredProducts.length} encontrados
            </span>
          </div>
          <button
            onClick={() => setSearchQuery('')}
            className="text-xs font-black text-slate-600 hover:text-[#9E0D0D] underline cursor-pointer"
          >
            Limpiar búsqueda y ver todo
          </button>
        </div>
      )}

      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[#9E0D0D] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E05A1B]" />
            <span>Catálogo Tienda en Línea</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {categoryTitle}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 font-medium">
            Mostrando {filteredProducts.length} productos disponibles en inventario
          </p>
        </div>

        {/* Filter Controls & Sort */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Max Price Range */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <span className="text-slate-500 font-bold uppercase text-[10px]">Hasta:</span>
            <input
              type="range"
              min={200}
              max={maxAvailablePrice}
              step={50}
              value={priceFilter}
              onChange={e => setPriceFilter(Number(e.target.value))}
              className="w-20 sm:w-24 accent-[#9E0D0D]"
            />
            <span className="font-extrabold text-[#9E0D0D] font-mono text-xs">${priceFilter}</span>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-transparent font-bold text-slate-800 outline-hidden cursor-pointer"
            >
              <option value="destacados">Destacados</option>
              <option value="precio-asc">Menor Precio</option>
              <option value="precio-desc">Mayor Precio</option>
              <option value="descuento">Mayor Descuento</option>
            </select>
          </div>

          {/* Clear Filters button if search/category active */}
          {(selectedCategory !== 'todas' || searchQuery || priceFilter < maxAvailablePrice) && (
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                setPriceFilter(maxAvailablePrice);
              }}
              className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-xl border border-pink-200 transition-colors uppercase tracking-wider cursor-pointer"
            >
              <FilterX className="w-3.5 h-3.5" />
              <span>Limpiar</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid: 2 columns on mobile, 2 on sm, 3 on lg, 4 on xl */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-6 mt-4 sm:mt-6">
          {filteredProducts.map(prod => (
            <ProductCard key={prod.id} product={prod} onQuickView={() => {}} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-3xl border border-dashed border-gray-300 mt-6">
          <FilterX className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-800">No encontramos productos con estos criterios</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-md mx-auto">
            Intenta cambiar el término de búsqueda o selecciona otra categoría en el menú de departamentos.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('todas');
              setSearchQuery('');
              setPriceFilter(maxAvailablePrice);
            }}
            className="mt-4 bg-[#9E0D0D] text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-red-900 transition-colors shadow-xs cursor-pointer"
          >
            Ver todos los productos
          </button>
        </div>
      )}
    </section>
  );
};
