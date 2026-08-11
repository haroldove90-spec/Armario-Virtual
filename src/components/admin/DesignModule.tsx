import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Palette, Image as ImageIcon, Sparkles, Plus, Trash2, Edit2, Sliders, Layout, Check, Upload, AlertCircle } from 'lucide-react';
import { Category } from '../../types';

export const DesignModule: React.FC = () => {
  const {
    storeDesign,
    updateStoreDesign,
    addHeroSlider,
    updateHeroSlider,
    deleteHeroSlider,
    addPromoFlyer,
    deletePromoFlyer
  } = useStore();

  const [announcementText, setAnnouncementText] = useState(storeDesign.announcementBarText);
  const [logoText, setLogoText] = useState(storeDesign.logoText);
  const [logoSubtext, setLogoSubtext] = useState(storeDesign.logoSubtext);
  const [logoUrl, setLogoUrl] = useState(storeDesign.logoUrl || '');
  const [primaryColor, setPrimaryColor] = useState(storeDesign.primaryColor);

  // Slide modal state
  const [showSlideModal, setShowSlideModal] = useState(false);
  const [editingSlideId, setEditingSlideId] = useState<string | null>(null);
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

  // Flyer modal state
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

  const handleSlideImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setNewSlide(prev => ({ ...prev, imageUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFlyerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = event => {
        if (event.target?.result) {
          setNewFlyer(prev => ({ ...prev, imageUrl: event.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreateOrUpdateSlide = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSlideId) {
      updateHeroSlider(editingSlideId, newSlide);
    } else {
      if (storeDesign.heroSliders.length >= 5) {
        alert('Límite máximo alcanzado: Solo puedes tener hasta 5 banners en el Slider.');
        return;
      }
      addHeroSlider(newSlide);
    }
    setShowSlideModal(false);
    setEditingSlideId(null);
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
          <Palette className="w-5 h-5 text-[#9E0D0D]" />
          Módulo de Diseño y Personalización Gráfica
        </h3>
        <p className="text-xs text-gray-500">
          Modifica el logo, colores de marca, banners del slider con carga de archivos y flyers promocionales.
        </p>
      </div>

      {/* 1. Brand Logo & Announcement Bar Settings */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
          <Layout className="w-4 h-4 text-[#9E0D0D]" />
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
                className="w-full p-2.5 border border-gray-200 rounded-xl font-serif text-lg font-bold text-[#9E0D0D]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Slogan o Subtexto del Logo</label>
              <input
                type="text"
                value={logoSubtext}
                onChange={e => setLogoSubtext(e.target.value)}
                className="w-full p-2.5 border border-gray-200 rounded-xl font-bold uppercase tracking-widest text-[#E05A1B]"
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Imagen de Logo de Tienda</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="URL de imagen de logo..."
                value={logoUrl}
                onChange={e => setLogoUrl(e.target.value)}
                className="flex-1 p-2.5 border border-gray-200 rounded-xl"
              />
              <label className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer text-xs shrink-0 flex items-center gap-1.5">
                <Upload className="w-3.5 h-3.5" />
                Subir Logo
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = ev => {
                        if (ev.target?.result) setLogoUrl(ev.target.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
              </label>
            </div>
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
                    primaryColor === c.hex ? 'ring-2 ring-red-600 ring-offset-2 scale-110' : 'border-gray-300'
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
            className="bg-[#9E0D0D] hover:bg-red-900 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-md transition-all"
          >
            Guardar Cambios de Identidad
          </button>
        </form>
      </div>

      {/* 2. Hero Slider Banner Manager (Max 5 Banners with Direct Image Upload) */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h4 className="text-sm font-black text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#9E0D0D]" />
              Banners del Slider Principal ({storeDesign.heroSliders.length}/5)
            </h4>
            <p className="text-xs text-gray-500">
              Sube tus imágenes directamente a la base de datos. Máximo 5 banners activos.
            </p>
          </div>

          {storeDesign.heroSliders.length < 5 && (
            <button
              onClick={() => {
                setEditingSlideId(null);
                setNewSlide({
                  title: 'NUEVA COLECCIÓN EXCLUSIVA',
                  subtitle: 'Lo último en tendencias de temporada con entregas a todo México.',
                  badge: 'EDICIÓN ESPECIAL',
                  buttonText: 'Ver Ahora',
                  categoryTarget: 'mujer',
                  imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1600&q=80',
                  bgGradient: 'from-purple-900/90 via-purple-800/80 to-pink-900/70',
                  active: true
                });
                setShowSlideModal(true);
              }}
              className="bg-[#9E0D0D] hover:bg-red-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl flex items-center gap-1.5 shadow-xs transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar Banner (Cargar Archivo)</span>
            </button>
          )}
        </div>

        {/* Recommended Banner Image Size Specs Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 text-xs text-amber-900 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <p className="font-bold uppercase tracking-wide">📐 Medidas Recomendadas para Banners del Slider:</p>
            <p className="text-[11px] text-amber-800 mt-0.5">
              • <strong>Dimensiones ideales:</strong> 1600 x 500 píxeles (Relación de aspecto 16:5 o 3:1).
              <br />• <strong>Formato recomendado:</strong> JPG, PNG o WebP, peso máximo de 5 MB por imagen.
            </p>
          </div>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {storeDesign.heroSliders.map((slide, idx) => (
            <div
              key={slide.id}
              className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-md bg-gray-900 text-white flex flex-col justify-between h-52 group"
            >
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
              />
              <div className="relative z-10 p-4 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent">
                <span className="bg-yellow-400 text-purple-950 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase">
                  {slide.badge || 'PROMO'}
                </span>
                <h5 className="font-extrabold text-base mt-2 line-clamp-1">{slide.title}</h5>
                <p className="text-xs text-purple-100 line-clamp-1">{slide.subtitle}</p>
              </div>

              <div className="relative z-10 p-3 bg-slate-900/90 backdrop-blur-xs flex items-center justify-between border-t border-white/10 text-xs">
                <span className="text-[11px] text-yellow-300 font-bold">CTA: "{slide.buttonText}"</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingSlideId(slide.id);
                      setNewSlide({
                        title: slide.title,
                        subtitle: slide.subtitle,
                        badge: slide.badge,
                        buttonText: slide.buttonText,
                        categoryTarget: slide.categoryTarget,
                        imageUrl: slide.imageUrl,
                        bgGradient: slide.bgGradient,
                        active: slide.active
                      });
                      setShowSlideModal(true);
                    }}
                    className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white font-bold text-[10px] flex items-center gap-1"
                    title="Editar o Cambiar Foto"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>Remplazar</span>
                  </button>
                  <button
                    onClick={() => deleteHeroSlider(slide.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg"
                    title="Eliminar Banner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
              <ImageIcon className="w-4 h-4 text-[#9E0D0D]" />
              Flyers y Tarjetas Promocionales ({storeDesign.promotionalFlyers.length})
            </h4>
            <p className="text-xs text-gray-500">Administra las tarjetas promocionales secundarias</p>
          </div>
          <button
            onClick={() => setShowFlyerModal(true)}
            className="bg-[#9E0D0D] hover:bg-red-900 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Flyer</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {storeDesign.promotionalFlyers.map(flyer => (
            <div
              key={flyer.id}
              className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-sm h-48 bg-gray-900 text-white flex flex-col justify-between p-3"
            >
              <img src={flyer.imageUrl} alt={flyer.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
              <div className="relative z-10">
                <span className="bg-[#E05A1B] text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                  {flyer.discountBadge}
                </span>
                <h5 className="font-extrabold text-sm mt-1">{flyer.title}</h5>
              </div>

              <div className="relative z-10 flex items-center justify-between pt-2 border-t border-white/20">
                <span className="text-[10px] text-gray-300 capitalize">Depto: {flyer.categoryTarget}</span>
                <button onClick={() => deletePromoFlyer(flyer.id)} className="p-1 text-red-400 hover:text-red-300">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add / Edit Slide Modal with File Upload */}
      {showSlideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-100 space-y-4">
            <h3 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#9E0D0D]" />
              {editingSlideId ? 'Remplazar / Editar Banner' : 'Publicar Nuevo Banner Slider'}
            </h3>

            <form onSubmit={handleCreateOrUpdateSlide} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Título Principal del Banner</label>
                <input
                  type="text"
                  placeholder="Ej: GRAN BARATA DE OTOÑO"
                  value={newSlide.title}
                  onChange={e => setNewSlide({ ...newSlide, title: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtítulo o Descripción corta</label>
                <input
                  type="text"
                  placeholder="Ej: Aprovecha hasta 50% de descuento..."
                  value={newSlide.subtitle}
                  onChange={e => setNewSlide({ ...newSlide, subtitle: e.target.value })}
                  className="w-full p-2.5 border rounded-xl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Insignia / Badge</label>
                  <input
                    type="text"
                    placeholder="OFERTA ESPECIAL"
                    value={newSlide.badge}
                    onChange={e => setNewSlide({ ...newSlide, badge: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Texto del Botón CTA</label>
                  <input
                    type="text"
                    placeholder="Ver Colección"
                    value={newSlide.buttonText}
                    onChange={e => setNewSlide({ ...newSlide, buttonText: e.target.value })}
                    className="w-full p-2.5 border rounded-xl"
                    required
                  />
                </div>
              </div>

              {/* Slider Image Upload & Recommended Dimensions */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-2">
                <label className="block font-bold text-gray-800">
                  Subir Fotografía de Banner (Se guarda en BD) *
                </label>
                <p className="text-[10px] text-amber-800 bg-amber-50 p-2 rounded-lg font-medium border border-amber-200">
                  📐 <strong>Medida sugerida:</strong> 1600 x 500 px (Proporción 16:5).
                </p>

                {newSlide.imageUrl && (
                  <div className="relative h-28 rounded-xl overflow-hidden border border-gray-300 bg-gray-900">
                    <img src={newSlide.imageUrl} alt="Preview" className="w-full h-full object-cover opacity-80" />
                  </div>
                )}

                <div className="flex gap-2">
                  <label className="flex-1 bg-[#9E0D0D] hover:bg-red-900 text-white font-bold py-2.5 text-center rounded-xl cursor-pointer text-xs flex items-center justify-center gap-2">
                    <Upload className="w-4 h-4" />
                    Seleccionar Archivo de Imagen
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleSlideImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Categoría Destino</label>
                <select
                  value={newSlide.categoryTarget}
                  onChange={e => setNewSlide({ ...newSlide, categoryTarget: e.target.value as Category })}
                  className="w-full p-2.5 border rounded-xl"
                >
                  <option value="ofertas">Ofertas / Gran Barata</option>
                  <option value="mujer">Moda Mujer</option>
                  <option value="hombre">Moda Hombre</option>
                  <option value="ninos">Niños</option>
                  <option value="calzado">Calzado</option>
                  <option value="hogar">Hogar</option>
                </select>
              </div>

              <div className="flex gap-2 pt-3">
                <button type="submit" className="flex-1 bg-[#9E0D0D] text-white font-bold py-3.5 rounded-2xl uppercase">
                  {editingSlideId ? 'Guardar Cambios' : 'Publicar Banner'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSlideModal(false)}
                  className="px-4 py-3.5 bg-gray-200 text-gray-700 font-bold rounded-2xl uppercase"
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

              <div className="bg-gray-50 p-3 rounded-2xl border border-gray-200 space-y-2">
                <label className="block font-bold text-gray-700">Subir Imagen del Flyer</label>
                <label className="block bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 text-center rounded-xl cursor-pointer">
                  Subir Archivo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFlyerImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

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
                <button type="submit" className="flex-1 bg-[#9E0D0D] text-white font-bold py-3 rounded-xl uppercase">
                  Guardar Flyer
                </button>
                <button
                  type="button"
                  onClick={() => setShowFlyerModal(false)}
                  className="px-4 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl uppercase"
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
