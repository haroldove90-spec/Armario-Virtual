import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ArrowUpRight, Tag } from 'lucide-react';

export const PromoFlyers: React.FC = () => {
  const { storeDesign, setSelectedCategory } = useStore();
  const flyers = storeDesign.promotionalFlyers.filter(f => f.active);

  if (!flyers || flyers.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 mt-6 sm:mt-8 font-sans overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2 uppercase">
            <Tag className="w-4 sm:w-5 h-4 sm:h-5 text-[#9E0D0D] shrink-0" />
            <span>Promociones y Flyers Destacados</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">Aprovecha nuestras ofertas exclusivas en departamentos</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        {flyers.map(flyer => (
          <div
            key={flyer.id}
            onClick={() => setSelectedCategory(flyer.categoryTarget)}
            className="group relative h-60 sm:h-72 rounded-xl overflow-hidden shadow-xs cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-md border border-slate-200 bg-slate-900 w-full"
          >
            {/* Background Image */}
            <img
              src={flyer.imageUrl}
              alt={flyer.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-[#9E0D0D]/40 to-transparent" />

            {/* Top Discount Badge */}
            {flyer.discountBadge && (
              <div className="absolute top-3 left-3 bg-pink-500 text-white font-black text-[9px] sm:text-[10px] px-2 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-md tracking-widest uppercase">
                {flyer.discountBadge}
              </div>
            )}

            {/* Bottom Info */}
            <div className="absolute bottom-0 inset-x-0 p-4 sm:p-5 text-white flex flex-col justify-end">
              <h3 className="text-sm sm:text-base font-extrabold leading-snug group-hover:text-pink-300 transition-colors uppercase">
                {flyer.title}
              </h3>
              <p className="text-xs text-purple-100 mt-1 line-clamp-2">{flyer.subtitle}</p>

              <div className="mt-2.5 sm:mt-3 inline-flex items-center gap-1 text-xs font-bold text-pink-400 group-hover:translate-x-1 transition-transform uppercase tracking-wider">
                <span>Ver Departamento</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
