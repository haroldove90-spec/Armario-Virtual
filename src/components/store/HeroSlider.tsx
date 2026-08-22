import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { ChevronLeft, ChevronRight, Sparkles, ArrowRight } from 'lucide-react';

export const HeroSlider: React.FC = () => {
  const { storeDesign, setSelectedCategory } = useStore();
  const sliders = storeDesign.heroSliders.filter(s => s.active);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % sliders.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [sliders.length]);

  if (!sliders || sliders.length === 0) return null;

  const current = sliders[currentIndex] || sliders[0];

  const handlePrev = () => {
    setCurrentIndex(prev => (prev === 0 ? sliders.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % sliders.length);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 mt-2 sm:mt-4 font-sans overflow-hidden">
      <div className="relative h-[280px] sm:h-[400px] lg:h-[440px] rounded-2xl overflow-hidden shadow-md group border border-slate-200 bg-slate-900 w-full">
        {/* Background Image */}
        <img
          src={current.imageUrl}
          alt={current.title}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 transform scale-105"
        />

        {/* Gradient Overlay with Carmine Red tone */}
        <div className={`absolute inset-0 bg-gradient-to-r ${current.bgGradient || 'from-[#500606]/95 via-[#9E0D0D]/85 to-slate-950/70'}`} />

        {/* Banner Content */}
        <div className="relative z-10 h-full max-w-2xl flex flex-col justify-center px-4 sm:px-12 text-white">
          {current.badge && (
            <div className="inline-flex items-center gap-1.5 bg-[#E05A1B] text-white text-[9px] sm:text-[10px] font-black px-2.5 py-0.5 sm:py-1 rounded shadow-md uppercase tracking-widest w-fit mb-2 sm:mb-3">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 shrink-0" />
              <span className="truncate">{current.badge}</span>
            </div>
          )}

          <h1 className="text-xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight mb-2 sm:mb-3 uppercase break-words">
            {current.title}
          </h1>

          <p className="text-xs sm:text-sm text-red-100 mb-4 sm:mb-6 max-w-lg leading-relaxed font-medium line-clamp-3">
            {current.subtitle}
          </p>

          <div>
            <button
              onClick={() => setSelectedCategory(current.categoryTarget)}
              className="inline-flex items-center gap-1.5 sm:gap-2 bg-white text-slate-900 hover:bg-red-50 font-black text-xs uppercase tracking-wider px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <span>{current.buttonText || 'Comprar Ahora'}</span>
              <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-[#9E0D0D]" />
            </button>
          </div>
        </div>

        {/* Controls */}
        {sliders.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronLeft className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 backdrop-blur-md text-white p-2 sm:p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            >
              <ChevronRight className="w-5 sm:w-6 h-5 sm:h-6" />
            </button>

            {/* Pagination Dots */}
            <div className="absolute bottom-3 sm:bottom-4 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 sm:gap-2">
              {sliders.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-2 sm:h-2.5 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex ? 'w-6 sm:w-8 bg-yellow-400' : 'w-2 sm:w-2.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
