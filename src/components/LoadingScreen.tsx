// Componente LoadingScreen: Exibe estado de carregamento 8-bit com Pokébola animada
import React from 'react';
import { Language, DICTIONARY } from '../utils/i18n';

interface LoadingScreenProps {
  language?: Language;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ language = 'pt' }) => {
  const t = DICTIONARY[language];
  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-sm sm:max-w-md mx-auto aspect-square bg-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] flex flex-col items-center justify-center p-6 text-center select-none"
    >
      {/* Pokébola em CSS puro animada */}
      <div
        className="w-14 h-14 rounded-full border-4 border-[#1F1D2B] relative overflow-hidden bg-[#F8F8F0] shadow-[3px_3px_0px_0px_#1F1D2B] mb-4 animate-bounce"
        aria-hidden="true"
      >
        {/* Metade superior vermelha */}
        <div className="absolute top-0 inset-x-0 h-1/2 bg-[#D63C3C]" />
        {/* Metade inferior branca */}
        <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[#F8F8F0]" />
        {/* Linha preta central */}
        <div className="w-full h-1.5 bg-[#1F1D2B] absolute top-1/2 -translate-y-1/2 z-10" />
        {/* Botão central */}
        <div className="w-4 h-4 rounded-full bg-[#F8F8F0] border-3 border-[#1F1D2B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
          <div className="w-1 h-1 rounded-full bg-[#1F1D2B]" />
        </div>
      </div>

      {/* Texto de Carregamento 8-bit */}
      <h2 className="text-xs sm:text-sm font-bold text-[#1F1D2B] tracking-tight uppercase flex items-center justify-center gap-1">
        {t.loading}<span className="animate-pulse">...</span>
      </h2>

      <p className="text-[8px] sm:text-[9px] text-[#3B5BA9] font-bold mt-2 uppercase">
        {t.preparingSprites}
      </p>

      {/* Barra de carregamento pixelada retrô */}
      <div className="w-36 h-3 bg-[#E6E1D6] border-2 border-[#1F1D2B] mt-4 p-0.5 overflow-hidden">
        <div className="h-full bg-[#F2C230] animate-pulse w-full" />
      </div>
    </div>
  );
};
