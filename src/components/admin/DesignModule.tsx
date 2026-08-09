import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Palette, Image as ImageIcon, Sparkles, Plus, Trash2, Edit2, Sliders, Layout, Check } from 'lucide-react';
import { Category } from '../../types';

export const DesignModule: React.FC = () => {
  const {
    storeDesign,
    updateStoreDesign,
    addHeroSlider,
    updateHeroSlider,
    deleteHeroSlider,
    addPromoFlyer,
    updatePromoFlyer,
    deletePromoFlyer
  } = useStore();

  const [announcementText, setAnnouncementText] = useState(storeDesign.announcementBarText);
  const [logoText, setLogoText] = useState(storeDesign.logoText);
  const [logoSubtext, setLogoSubtext] = useState(storeDesign.logoSubtext);
  const [logoUrl, setLogoUrl] = useState(storeDesign.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(storeDesign.primaryColor);

  // Modal forms
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [newSlide, setNewSlide] = useState({
    title: 'GRAN BARATA DE OTOÑO',
    subtitle: 'Aprovecha hasta 50% de descuento en prendas seleccionadas.',
    badge: 'OFERTA ESPECIAL',
    buttonText: 'Ver Colección',
    categoryTarget: 'ofertas' as Category,
    imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
    bgGradient: 'from-purple-900/90 via-purple-800/80 to-pink-900/70',
    active: true
  });

  const [showFlyerModal, setShowFlyerModal] = useState(false);
  const [newFlyer, setNewFlyer] = useState({
    title: 'Especial Ropa Deportiva',
    subtitle: 'Conjuntos y tenis con la máxima tecnología.',
    discountBadge: '30% OFF',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80',
    categoryTarget: 'calzado' as Category,
    gridSpan: 'single' as const,
    active: true
  });

  const handleSaveBrandDesign = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreDesign({
      announcementBarText: announcementText,
      logoText,
      logoSubtext,
      logoUrl,
      primaryColor
    });
  };

  const handleCreateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    addHeroSlider(newSlide);
    setShowSlideModal(false);
  };

  const handleCreateFlyer = (e: React.FormEvent) => {
    e.preventDefault();
    addPromoFlyer(newFlyer);
    setShowFlyerModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h3 className="text-xl font-black text-gray-900 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-700" />
          Módulo de Diseño y Personalización Gráfica
        </h3>
        <p className="text-xs text-gray-500">
          Modifica el logo, colores de marca, banners principales del slider y los flyers promocionales de tu tienda en tiempo real.
        </p>
      </div>

      {/* 1. Brand Logo & Announcement Bar Settings */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Layout className="w-4 h-4 text-purple-700" />
          Identidad Visual, Logo y Encabezado
        </h4>

        <form onSubmit={handleSaveBrandDesign} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Texto Principal del Logo</label>
              <input
                type="text"
                value={logoText}
                onChange={e => setLogoText(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl font-serif text-lg font-bold text-purple-900"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Slogan o Subtexto del Logo</label>
              <input
                type="text"
                value={logoSubtext}
                onChange={e => setLogoSubtext(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl font-bold uppercase tracking-widest text-pink-600"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">URL de Imagen de Logo (Opcional - reemplaza texto)</label>
            <input
              type="text"
              placeholder="https://ejemplo.com/logo-ropaenlinea.png"
              value={logoUrl}
              onChange={e => setLogoUrl(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl"
            />
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Texto de la Barra Superior de Promociones</label>
            <input
              type="text"
              value={announcementText}
              onChange={e => setAnnouncementText(e.target.value)}
              className="w-full p-2.5 border border-gray-200 rounded-xl font-medium"
              required
            />
          </div>

          {/* Color palette preset */}
          <div>
            <label className="block font-bold text-gray-700 mb-2">Color Institucional Principal</label>
            <div className="flex items-center gap-3">
              {[
                { name: 'Rojo Carmesí Armario Virtual', hex: '#9E0D0D' },
                { name: 'Naranja Terracota', hex: '#E05A1B' },
                { name: 'Azul Mezclilla Denim', hex: '#2B4360' },
                { name: 'Madera Roble Claro', hex: '#C49A6C' }
              ].map(c => (
                <button
                  type="button"
                  key={c.hex}
                  onClick={() => setPrimaryColor(c.hex)}
                  style={{ backgroundColor: c.hex }}
                  className={`w-8 h-8 rounded-full border-2 transition-transform shadow-sm relative ${
                    primaryColor === c.hex ? 'ring-2 ring-purple-600 ring-offset-2 scale-110' : 'border-gray-300'
                  }`}
                  title={c.name}
                >
                  {primaryColor === c.hex && <Check className="w-4 h-4 text-white absolute inset-0 m-auto" />}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-purple-600 hover:bg-purple-700 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Guardar Cambios de Identidad
          </button>
        </form>
      </div>

      {/* 2. Hero Slider Banner Manager */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-700" />
              Banners del Slider Principal ({storeDesign.heroSliders.length})
            </h4>
            <p className="text-xs text-gray-500">Administra los anuncios deslizables de la portada</p>
          </div>
          <button
            onClick={() => setShowSlideModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Banner Slide</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storeDesign.heroSliders.map((slide, idx) => (
            <div key={slide.id} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm bg-gray-900 text-white flex flex-col justify-between h-48">
              <img src={slide.imageUrl} alt={slide.title} className="absolute inset-0 w-full h-full object-cover opacity-40" />
              <div className="relative z-10 p-4">
                <span className="bg-yellow-400 text-purple-950 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {slide.badge || 'PROMO'}
                </span>
                <h5 className="font-extrabold text-base mt-2">{slide.title}</h5>
                <p className="text-xs text-purple-100 line-clamp-1">{slide.subtitle}</p>
              </div>

              <div className="relative z-10 p-3 bg-slate-900/80 backdrop-blur-xs flex items-center justify-between border-t border-white/10">
                <span className="text-[11px] text-yellow-300 font-bold">Botón: "{slide.buttonText}"</span>
                <button
                  onClick={() => deleteHeroSlider(slide.id)}
                  className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg"
                  title="Eliminar Banner"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Promotional Flyers Manager */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-purple-700" />
              Flyers y Banners Promocionales ({storeDesign.promotionalFlyers.length})
            </h4>
            <p className="text-xs text-gray-500">Administra las tarjetas promocionales secundarias</p>
          </div>
          <button
            onClick={() => setShowFlyerModal(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Flyer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storeDesign.promotionalFlyers.map(flyer => (
            <div key={flyer.id} className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-48 bg-gray-900 text-white flex flex-col justify-between p-3">
              <img src={flyer.imageUrl} alt={flyer.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="relative z-10">
                <span className="bg-pink-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {flyer.discountBadge}
                </span>
                <h5 className="font-extrabold text-sm mt-1">{flyer.title}</h5>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-[10px] text-gray-300 capitalize">Depto: {flyer.categoryTarget}</span>
                <button
                  onClick={() => deletePromoFlyer(flyer.id)}
                  className="p-1 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Slide Modal */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4">Publicar Nuevo Banner Slider</h3>
            <form onSubmit={handleCreateSlide} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Título del Anuncio"
                value={newSlide.title}
                onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="Subtítulo o Descripción"
                value={newSlide.subtitle}
                onChange={e => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="Insignia / Badge"
                  value={newSlide.badge}
                  onChange={e => setNewSlide({ ...newSlide, badge: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                />
                <input
                  type="text"
                  placeholder="Texto del Botón CTA"
                  value={newSlide.buttonText}
                  onChange={e => setNewSlide({ ...newSlide, buttonText: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="URL de Imagen de Fondo"
                value={newSlide.imageUrl}
                onChange={e => setNewSlide({ ...newSlide, imageUrl: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <div>
                <label className="block font-bold text-gray-700 mb-1">Categoría Destino</label>
                <select
                  value={newSlide.categoryTarget}
                  onChange={e => setNewSlide({ ...newSlide, categoryTarget: e.target.value as Category })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="ofertas">Ofertas / Barata</option>
                  <option value="mujer">Moda Mujer</option>
                  <option value="hombre">Moda Hombre</option>
                  <option value="ninos">Niños</option>
                  <option value="calzado">Calzado</option>
                  <option value="hogar">Hogar</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl">
                  Publicar Banner
                </button>
                <button
                  type="button"
                  onClick={() => setShowSlideModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Flyer Modal */}
      {showFlyerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-100">
            <h3 className="text-lg font-black text-gray-900 mb-4">Agregar Flyer Promocional</h3>
            <form onSubmit={handleCreateFlyer} className="space-y-3 text-xs">
              <input
                type="text"
                placeholder="Título del Flyer"
                value={newFlyer.title}
                onChange={e => setNewFlyer({ ...newFlyer, title: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="Etiqueta de Descuento (ej: 40% OFF)"
                value={newFlyer.discountBadge}
                onChange={e => setNewFlyer({ ...newFlyer, discountBadge: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <input
                type="text"
                placeholder="URL de Imagen"
                value={newFlyer.imageUrl}
                onChange={e => setNewFlyer({ ...newFlyer, imageUrl: e.target.value })}
                className="w-full p-2.5 border rounded-xl"
                required
              />
              <div>
                <label className="block font-bold text-gray-700 mb-1">Categoría Destino</label>
                <select
                  value={newFlyer.categoryTarget}
                  onChange={e => setNewFlyer({ ...newFlyer, categoryTarget: e.target.value as Category })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="ofertas">Ofertas</option>
                  <option value="mujer">Moda Mujer</option>
                  <option value="hombre">Moda Hombre</option>
                  <option value="ninos">Niños</option>
                  <option value="calzado">Calzado</option>
                  <option value="hogar">Hogar</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-purple-600 text-white font-bold py-3 rounded-xl">
                  Guardar Flyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowFlyerModal(false)}
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
