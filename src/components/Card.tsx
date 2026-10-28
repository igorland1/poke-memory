// Componente Card: Estética 8-bit com bordas 4px, cantos retos, sombras duras e paleta estrita
import React, { useState } from 'react';
import { CardItem } from '../types/game';

interface CardProps {
  card: CardItem;
  index: number;
  onClick: (card: CardItem) => void;
  disabled?: boolean;
}

export const Card: React.FC<CardProps> = ({ card, index, onClick, disabled = false }) => {
  const isFaceUp = card.isFlipped || card.isMatched;
  const [imageError, setImageError] = useState<boolean>(false);

  // Acessibilidade completa para leitores de tela
  const getAriaLabel = () => {
    if (card.isMatched) {
      return `Carta ${index + 1}: ${card.name}. Par capturado.`;
    }
    if (card.isFlipped) {
      return `Carta ${index + 1}: ${card.name}. Revelada.`;
    }
    return `Carta ${index + 1}: oculta. Pressione Espaço ou Enter para virar.`;
  };

  return (
    <button
      type="button"
      onClick={() => onClick(card)}
      disabled={disabled || isFaceUp}
      aria-label={getAriaLabel()}
      aria-pressed={isFaceUp}
      className={`
        card-perspective relative aspect-square w-full select-none
        touch-manipulation cursor-pointer transition-transform duration-100
        rounded-none
        focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2C230]
        focus-visible:ring-offset-2 focus-visible:ring-offset-[#E6E1D6]
        ${!isFaceUp && !disabled ? 'hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5' : ''}
        ${card.isMatched ? 'translate-x-0.5 translate-y-0.5' : ''}
        ${disabled && !isFaceUp ? 'cursor-not-allowed opacity-80' : ''}
      `}
    >
      {/* Container interno 3D com virada em steps() */}
      <div
        className={`
          card-inner rounded-none
          ${isFaceUp ? 'is-flipped' : ''}
        `}
      >
        {/* ==============================================================
            FACE TRASEIRA (Verso com Pokébola 8-bit em CSS Puro)
            ============================================================== */}
        <div
          className="
            card-face card-face-back rounded-none p-1
            flex flex-col items-center justify-center
            bg-[#1F1D2B] border-4 border-[#1F1D2B]
            shadow-[3px_3px_0px_0px_#1F1D2B]
          "
        >
          {/* Pokébola clássica em CSS com paleta estrita */}
          <div
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-4 border-[#1F1D2B] relative overflow-hidden bg-[#F8F8F0]"
            aria-hidden="true"
          >
            {/* Metade superior vermelha #D63C3C */}
            <div className="absolute top-0 inset-x-0 h-1/2 bg-[#D63C3C]" />

            {/* Metade inferior branca #F8F8F0 */}
            <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[#F8F8F0]" />

            {/* Faixa central tinta #1F1D2B */}
            <div className="w-full h-1 sm:h-1.5 bg-[#1F1D2B] absolute top-1/2 -translate-y-1/2 z-10" />

            {/* Botão central */}
            <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#F8F8F0] border-2 sm:border-3 border-[#1F1D2B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
              <div className="w-1 h-1 rounded-full bg-[#1F1D2B]" />
            </div>
          </div>

          <span className="text-[7px] sm:text-[8px] uppercase tracking-wider text-[#F2C230] mt-1 font-mono">
            POKÉMON
          </span>
        </div>

        {/* ==============================================================
            FACE FRONTAL (Sprite Pixel Art)
            Cartas encontradas recebem fundo amarelo #F2C230
            ============================================================== */}
        <div
          className={`
            card-face card-face-front rounded-none p-1
            flex flex-col items-center justify-center
            border-4 border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B]
            ${card.isMatched ? 'bg-[#F2C230]' : 'bg-[#F8F8F0]'}
          `}
        >
          {/* Sprite com tamanho em múltiplo inteiro (64px) e interpolação pixelated */}
          {!imageError ? (
            <img
              src={card.spriteUrl}
              alt={card.name}
              width={64}
              height={64}
              style={{ imageRendering: 'pixelated' }}
              className="w-14 h-14 sm:w-16 sm:h-16 object-contain select-none [image-rendering:pixelated]"
              loading="lazy"
              draggable={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-14 h-14 flex items-center justify-center text-center p-1 bg-[#E6E1D6] border-2 border-[#1F1D2B] text-[8px] font-bold uppercase text-[#1F1D2B]">
              {card.name}
            </div>
          )}

          {/* Nome do Pokémon em fonte 8-bit */}
          <span className="text-[8px] sm:text-[9px] font-bold text-center truncate max-w-full px-0.5 uppercase text-[#1F1D2B]">
            {card.name}
          </span>
        </div>
      </div>
    </button>
  );
};
