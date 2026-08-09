import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, Category } from '../../types';
import { Package, Plus, Search, Edit2, Trash2, Tag, Percent, AlertCircle } from 'lucide-react';

export const ProductsModule: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, updateStock } = useStore();

  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('todas');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProd, setEditingProd] = useState<Product | null>(null);

  // Add/Edit Form State
  const [formData, setFormData] = useState({
    name: '',
    category: 'mujer' as Category,
    subcategory: 'Moda Femenina',
    price: 399,
    originalPrice: 599,
    discountPercentage: 33,
    stock: 20,
    sku: `REL-${Math.floor(1000 + Math.random() * 9000)}`,
    imageUrl: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=800&q=80',
    sizesStr: 'CH, M, G, XG',
    colorName: 'Rojo Carmesí',
    colorHex: '#9E0D0D',
    description: 'Prenda confeccionada con telas de alta calidad para máxima durabilidad y confort.'
  });

  const filtered = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCat === 'todas' || p.category === selectedCat;
    return matchesSearch && matchesCat;
  });

  const handleSubmitProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const sizesArray = formData.sizesStr.split(',').map(s => s.trim()).filter(Boolean);

    if (editingProd) {
      updateProduct(editingProd.id, {
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercentage: Number(formData.discountPercentage),
        stock: Number(formData.stock),
        sku: formData.sku,
        images: [formData.imageUrl],
        sizes: sizesArray,
        colors: [{ name: formData.colorName, hex: formData.colorHex }],
        description: formData.description
      });
      setEditingProd(null);
    } else {
      addProduct({
        name: formData.name,
        category: formData.category,
        subcategory: formData.subcategory,
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice),
        discountPercentage: Number(formData.discountPercentage),
        stock: Number(formData.stock),
        sku: formData.sku,
        images: [formData.imageUrl],
        sizes: sizesArray,
        colors: [{ name: formData.colorName, hex: formData.colorHex }],
        description: formData.description,
        tags: ['Catálogo General']
      });
    }

    setShowAddModal(false);
  };

  const handleStartEdit = (p: Product) => {
    setEditingProd(p);
    setFormData({
      name: p.name,
      category: p.category,
      subcategory: p.subcategory,
      price: p.price,
      originalPrice: p.originalPrice || p.price,
      discountPercentage: p.discountPercentage || 0,
      stock: p.stock,
      sku: p.sku,
      imageUrl: p.images[0] || '',
      sizesStr: p.sizes.join(', '),
      colorName: p.colors[0]?.name || 'Estándar',
      colorHex: p.colors[0]?.hex || '#000000',
      description: p.description
    });
    setShowAddModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
            <Package className="w-5 h-5 text-purple-700" />
            Catálogo e Inventario de Productos ({products.length})
          </h3>
          <p className="text-xs text-gray-500">Registra y administra las prendas y existencias de tu tienda</p>
        </div>

        <button
          onClick={() => {
            setEditingProd(null);
            setShowAddModal(true);
          }}
          className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-5 py-3 rounded-xl shadow-md flex items-center gap-2"
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
            className="w-full bg-white pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-xs outline-hidden focus:border-purple-600"
          />
        </div>

        <select
          value={selectedCat}
          onChange={e => setSelectedCat(e.target.value)}
          className="bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-800"
        >
          <option value="todas">Todos los Departamentos</option>
          <option value="mujer">Moda Mujer</option>
          <option value="hombre">Moda Hombre</option>
          <option value="ninos">Niños y Bebés</option>
          <option value="calzado">Calzado</option>
          <option value="hogar">Hogar</option>
          <option value="ofertas">Ofertas / Gran Barata</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="p-4">Producto</th>
                <th className="p-4">SKU / Depto</th>
                <th className="p-4">Precio</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Tallas</th>
                <th className="p-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 font-medium">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-purple-50/30 transition-colors">
                  <td className="p-4 flex items-center gap-3">
                    <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-xl border border-gray-200" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-xs">{p.name}</h4>
                      <p className="text-[11px] text-gray-500 line-clamp-1">{p.subcategory}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="font-mono text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-[10px]">{p.sku}</span>
                    <span className="block text-[10px] text-purple-700 font-bold uppercase mt-0.5">{p.category}</span>
                  </td>
                  <td className="p-4">
                    <span className="font-black text-purple-900 text-sm">${p.price.toFixed(2)}</span>
                    {p.originalPrice && (
                      <span className="block text-[10px] text-gray-400 line-through">${p.originalPrice.toFixed(2)}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className={`font-black text-xs px-2.5 py-1 rounded-full ${
                        p.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {p.stock} pzas
                      </span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[11px] text-gray-600 font-medium">{p.sizes.join(', ')}</span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="p-2 text-purple-700 hover:bg-purple-100 rounded-lg transition-colors"
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
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4">
              {editingProd ? 'Editar Producto' : 'Registrar Nuevo Producto'}
            </h3>

            <form onSubmit={handleSubmitProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Nombre del Producto</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Departamento</label>
                  <select
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value as Category })}
                    className="w-full p-2.5 border rounded-xl"
                  >
                    <option value="mujer">Moda Mujer</option>
                    <option value="hombre">Moda Hombre</option>
                    <option value="ninos">Niños y Bebés</option>
                    <option value="calzado">Calzado</option>
                    <option value="hogar">Hogar</option>
                    <option value="ofertas">Ofertas</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Subcategoría</label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={e => setFormData({ ...formData, subcategory: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Precio Oferta ($)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Precio Lista ($)</label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={e => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock (pzas)</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={e => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">URL de Imagen</label>
                <input
                  type="text"
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Tallas Disponibles (separadas por coma)</label>
                <input
                  type="text"
                  placeholder="CH, M, G, XG"
                  value={formData.sizesStr}
                  onChange={e => setFormData({ ...formData, sizesStr: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Descripción</label>
                <textarea
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-2.5 border rounded-xl h-20"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl">
                  {editingProd ? 'Guardar Cambios' : 'Registrar Producto'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl"
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
