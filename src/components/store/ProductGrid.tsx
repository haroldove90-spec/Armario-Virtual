import React, { useState, useMemo } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ProductCard } from './ProductCard';
import { ProductQuickView } from './ProductQuickView';
import { SlidersHorizontal, ArrowUpDown, Sparkles, FilterX } from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { products, selectedCategory, setSelectedCategory, searchQuery, setSearchQuery } = useStore();
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [sortBy, setSortBy] = useState<'destacados' | 'precio-asc' | 'precio-desc' | 'descuento'>('destacados');
  const [priceFilter, setPriceFilter] = useState<number>(2000);

  const filteredProducts = useMemo(() => {
    return products
      .filter(p => {
        const matchesCategory = selectedCategory === 'todas' || p.category === selectedCategory;
        const matchesSearch =
          !searchQuery ||
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.subcategory.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesPrice = p.price <= priceFilter;
        const matchesStock = p.stock > 0;

        return matchesCategory && matchesSearch && matchesPrice && matchesStock;
      })
      .sort((a, b) => {
        if (sortBy === 'precio-asc') return a.price - b.price;
        if (sortBy === 'precio-desc') return b.price - a.price;
        if (sortBy === 'descuento') return (b.discountPercentage || 0) - (a.discountPercentage || 0);
        return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
      });
  }, [products, selectedCategory, searchQuery, priceFilter, sortBy]);

  const categoryLabels: Record<string, string> = {
    todas: 'Catálogo General de Ropa',
    ofertas: 'Gran Barata & Ofertas Exclusivas ⚡',
    mujer: 'Colección Moda Mujer',
    hombre: 'Colección Moda Hombre',
    ninos: 'Moda Infantil y Bebés',
    calzado: 'Calzado & Tenis',
    hogar: 'Artículos para el Hogar y Blancos'
  };

  return (
    <section className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 py-4 sm:py-8 font-sans">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 pb-4 sm:pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-[#9E0D0D] uppercase tracking-widest mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#E05A1B]" />
            <span>Catálogo Tienda en Línea</span>
          </div>
          <h2 className="text-xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            {categoryLabels[selectedCategory] || 'Productos Destacados'}
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
              max={2000}
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
          {(selectedCategory !== 'todas' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory('todas');
                setSearchQuery('');
                setPriceFilter(2000);
              }}
              className="flex items-center gap-1 text-xs font-bold text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-2.5 py-1.5 rounded-xl border border-pink-200 transition-colors uppercase tracking-wider"
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
            <ProductCard key={prod.id} product={prod} onQuickView={p => setQuickViewProduct(p)} />
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
              setPriceFilter(2000);
            }}
            className="mt-4 bg-purple-600 text-white font-bold text-xs px-5 py-2.5 rounded-full hover:bg-purple-700 transition-colors"
          >
            Ver todos los productos
          </button>
        </div>
      )}

      {/* Quick View Modal */}
      <ProductQuickView product={quickViewProduct} onClose={() => setQuickViewProduct(null)} />
    </section>
  );
};
