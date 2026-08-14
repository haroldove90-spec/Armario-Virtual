import React, { useState } from 'react';
import { Product, SizeGuide, SizeGuideTemplate } from '../../types';
import { useStore } from '../../context/StoreContext';
import { Ruler, X, Info, Check, Sparkles, ChevronRight, HelpCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: Product | null;
  template?: SizeGuideTemplate | null;
  selectedSize?: string;
  onSelectSize?: (size: string) => void;
}

export const DEFAULT_SIZE_GUIDE_IMAGE_TOPS = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80';
export const DEFAULT_SIZE_GUIDE_IMAGE_BOTTOMS = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80';
export const DEFAULT_SIZE_GUIDE_IMAGE_SHOES = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80';

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({
  isOpen,
  onClose,
  product,
  template,
  selectedSize,
  onSelectSize
}) => {
  const [unit, setUnit] = useState<'cm' | 'in'>('cm');
  const { sizeGuideTemplates } = useStore();

  if (!isOpen) return null;

  // Resolve template if provided or if product references a templateId
  const effectiveTemplate =
    template ||
    (product?.sizeGuideTemplateId
      ? sizeGuideTemplates.find(t => t.id === product.sizeGuideTemplateId)
      : product?.sizeGuide?.templateId
      ? sizeGuideTemplates.find(t => t.id === product.sizeGuide?.templateId)
      : null);

  // Resolve size guide data from template, product, or fallback
  const guide: SizeGuide = effectiveTemplate
    ? {
        enabled: true,
        title: effectiveTemplate.name,
        imageUrl: effectiveTemplate.imageUrl,
        instructions: effectiveTemplate.instructions,
        columns: effectiveTemplate.columns,
        rows: effectiveTemplate.rows,
        templateId: effectiveTemplate.id
      }
    : product?.sizeGuide && product.sizeGuide.rows && product.sizeGuide.rows.length > 0
    ? product.sizeGuide
    : {
        enabled: true,
        title: product ? `Guía de Tallas & Medidas - ${product.name}` : 'Tabla de Medidas',
        imageUrl: product?.images?.[0] || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg',
        instructions: 'Usa una cinta métrica flexible. Mantén la cinta nivelada sobre el cuerpo sin apretar en exceso.',
        columns: ['Pecho / Busto', 'Cintura', 'Cadera', 'Largo'],
        rows: (product?.sizes && product.sizes.length > 0 ? product.sizes : ['CH / S', 'MD / M', 'GD / L', 'XGD / XL']).map((s, idx) => {
          const base = 88 + idx * 6;
          return {
            size: s,
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
        })
      };

  const guideImage = guide.imageUrl || product?.images?.[0] || 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/75 backdrop-blur-sm animate-fade-in">
      <div
        className="bg-white rounded-3xl shadow-2xl border border-gray-100 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-in"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#9E0D0D] rounded-2xl text-white shadow-xs">
              <Ruler className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded-full inline-block mb-0.5">
                Tabla de Medidas Oficial
              </span>
              <h3 className="text-base sm:text-lg font-black text-white truncate max-w-xs sm:max-w-md">
                {guide.title || `Guía de Tallas: ${product.name}`}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Unit Switcher */}
            <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700 text-xs font-bold">
              <button
                type="button"
                onClick={() => setUnit('cm')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  unit === 'cm'
                    ? 'bg-[#9E0D0D] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                CM (cm)
              </button>
              <button
                type="button"
                onClick={() => setUnit('in')}
                className={`px-3 py-1 rounded-lg transition-all ${
                  unit === 'in'
                    ? 'bg-[#9E0D0D] text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                IN (pulgadas)
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all cursor-pointer"
              title="Cerrar ventana"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Instructions banner */}
          <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">Consejo de ajuste: </span>
              {guide.instructions ||
                'Para un ajuste regular, selecciona la talla correspondiente a tus medidas exactas. Si prefieres un ajuste más holgado, te recomendamos elegir una talla más.'}
            </div>
          </div>

          {/* 2-Column Layout: Image on Left, Table on Right (as in reference image) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Left Column: Image Assigned by Admin with measurement guides */}
            <div className="md:col-span-5 flex flex-col items-center">
              <div className="relative w-full rounded-2xl overflow-hidden border border-gray-200 bg-gray-50 shadow-sm group">
                <img
                  src={guideImage}
                  alt="Guía de medición corporal del producto"
                  className="w-full h-72 sm:h-80 object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://aouvpbvjrsbtufhrmwaj.supabase.co/storage/v1/object/public/banner/playera01.jpg';
                  }}
                />
                <div className="absolute top-3 left-3 bg-slate-900/80 text-white backdrop-blur-xs text-[10px] font-bold px-2.5 py-1 rounded-lg">
                  Foto de Referencia
                </div>
              </div>

              {/* Measurement tips */}
              <div className="w-full mt-3 bg-slate-50 border border-slate-200 rounded-2xl p-3 text-[11px] text-slate-600 space-y-1.5">
                <p className="font-bold text-slate-900 flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#9E0D0D]" /> ¿Cómo tomar tus medidas?
                </p>
                <ul className="space-y-1 list-disc pl-4 text-slate-600">
                  <li><strong>Pecho / Busto:</strong> Mide el contorno en la parte más ancha.</li>
                  <li><strong>Cintura:</strong> Mide la parte más angosta del torso (arriba del ombligo).</li>
                  <li><strong>Cadera:</strong> Mide el contorno con los pies juntos en el punto más prominente.</li>
                </ul>
              </div>
            </div>

            {/* Right Column: Measurements Table */}
            <div className="md:col-span-7 flex flex-col">
              <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-xs bg-white">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 border-b border-gray-200 uppercase text-[10px] font-extrabold tracking-wider">
                        <th className="py-3 px-3.5 border-r border-gray-200">Talla</th>
                        {guide.columns.map((col) => (
                          <th key={col} className="py-3 px-3 border-r border-gray-200 last:border-r-0 text-center">
                            {col}
                          </th>
                        ))}
                        {onSelectSize && <th className="py-3 px-2 text-center">Acción</th>}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {guide.rows.map((row, idx) => {
                        const isMatch = selectedSize && (row.size.toLowerCase() === selectedSize.toLowerCase() || row.size.includes(selectedSize));

                        return (
                          <tr
                            key={idx}
                            className={`transition-colors ${
                              isMatch
                                ? 'bg-amber-50/80 font-bold border-l-4 border-l-[#9E0D0D]'
                                : 'hover:bg-slate-50 text-gray-700'
                            }`}
                          >
                            <td className="py-3 px-3.5 font-black text-slate-900 border-r border-gray-100 whitespace-nowrap">
                              <span className="flex items-center gap-1.5">
                                {row.size}
                                {isMatch && (
                                  <span className="text-[9px] bg-[#9E0D0D] text-white px-1.5 py-0.2 rounded font-mono">
                                    Tu talla
                                  </span>
                                )}
                              </span>
                            </td>

                            {guide.columns.map((col) => {
                              const val = unit === 'in'
                                ? (row.measurementsInches?.[col] || row.measurements[col] || '-')
                                : (row.measurements[col] || '-');

                              return (
                                <td
                                  key={col}
                                  className="py-3 px-3 border-r border-gray-100 last:border-r-0 text-center font-medium whitespace-nowrap text-slate-800"
                                >
                                  {val}
                                </td>
                              );
                            })}

                            {onSelectSize && (
                              <td className="py-2 px-2 text-center">
                                <button
                                  type="button"
                                  onClick={() => {
                                    onSelectSize(row.size.split('/')[0].trim());
                                    onClose();
                                  }}
                                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                                    isMatch
                                      ? 'bg-emerald-600 text-white'
                                      : 'bg-slate-100 hover:bg-[#9E0D0D] hover:text-white text-slate-700'
                                  }`}
                                >
                                  {isMatch ? 'Elegida' : 'Elegir'}
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Bottom helper info */}
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="flex items-center gap-1.5 font-medium">
                  <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
                  Medidas expresadas en <strong className="text-slate-800">{unit.toUpperCase()}</strong>
                </span>
                <span className="text-[11px] text-slate-400">
                  Tolerancia estándar +/- 1 a 2 cm
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            ¿Tienes dudas con tu talla? Contáctanos por WhatsApp para asesoría personalizada.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
          >
            Entendido, cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
