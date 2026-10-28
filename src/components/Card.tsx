// Componente Card: Estética 8-bit com suporte a etiquetas elementais e efeitos de acerto
import React, { memo, useState } from 'react';
import { CardItem } from '../types/game';
import { TYPE_INFO } from '../data/cards';
import { Language, DICTIONARY } from '../utils/i18n';

interface CardProps {
  card: CardItem;
  index: number;
  language?: Language;
  onClick: (card: CardItem) => void;
  disabled?: boolean;
}

export const Card = memo(function Card({ card, index, language = 'pt', onClick, disabled = false }: CardProps) {
  const isFaceUp = card.isFlipped || card.isMatched;
  const [imageError, setImageError] = useState<boolean>(false);
  const typeVisual = TYPE_INFO[card.type];
  const t = DICTIONARY[language];
  const translatedTypeName = t.types[card.type] ?? typeVisual?.name ?? card.type;

  // Acessibilidade completa para leitores de tela
  const getAriaLabel = () => {
    if (card.isMatched) {
      return `Carta ${index + 1}: ${card.name}, tipo ${typeVisual?.name ?? card.type}. Par capturado.`;
    }
    if (card.isFlipped) {
      return `Carta ${index + 1}: ${card.name}, tipo ${typeVisual?.name ?? card.type}. Revelada.`;
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
        ${card.isWrong ? 'animate-card-shake' : ''}
        ${card.isJustMatched ? 'animate-card-pop' : ''}
        ${!isFaceUp && !disabled ? 'hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5' : ''}
        ${card.isMatched ? 'translate-x-0.5 translate-y-0.5' : ''}
        ${disabled && !isFaceUp ? 'cursor-not-allowed opacity-80' : ''}
      `}
    >
      {/* Container interno 3D com virada acelerada por hardware */}
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
            FACE FRONTAL (Sprite Pixel Art + Etiqueta Elemental)
            Cartas encontradas recebem realce dourado
            ============================================================== */}
        <div
          className={`
            card-face card-face-front rounded-none p-1
            flex flex-col items-center justify-between
            border-4 border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B]
            ${card.isMatched ? 'bg-[#F2C230]' : 'bg-[#F8F8F0]'}
          `}
        >
          {/* Tag de Tipo Elemental 8-bit no topo da carta */}
          <div className="w-full flex items-center justify-between px-0.5 pt-0.5">
            {card.isWildcard ? (
              <span className="text-[6px] sm:text-[7px] font-bold px-1 py-0.2 bg-[#7D3B7D] text-[#F8F8F0] border border-[#1F1D2B] uppercase leading-tight truncate animate-pulse">
                ✨ {t.wildcard}
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: typeVisual?.bgColor ?? '#1F1D2B',
                  color: typeVisual?.textColor ?? '#F8F8F0',
                }}
                className="text-[6px] sm:text-[7px] font-bold px-1 py-0.2 border border-[#1F1D2B] uppercase leading-tight truncate"
              >
                {typeVisual?.badge} {translatedTypeName}
              </span>
            )}

            {card.isMatched && (
              <span className="text-[8px] font-bold text-[#D63C3C]" title="Capturado!">
                ★
              </span>
            )}
          </div>

          {/* Sprite com tamanho em múltiplo inteiro (64px) e interpolação pixelated */}
          {!imageError ? (
            <img
              src={card.spriteUrl}
              alt={card.name}
              width={64}
              height={64}
              style={{ imageRendering: 'pixelated' }}
              className="w-12 h-12 sm:w-14 sm:h-14 object-contain select-none [image-rendering:pixelated]"
              loading="eager"
              decoding="async"
              draggable={false}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-12 h-12 flex items-center justify-center text-center p-1 bg-[#E6E1D6] border-2 border-[#1F1D2B] text-[7px] font-bold uppercase text-[#1F1D2B]">
              {card.name}
            </div>
          )}

          {/* Nome do Pokémon em fonte 8-bit */}
          <span className="text-[7.5px] sm:text-[8.5px] font-bold text-center truncate max-w-full px-0.5 uppercase text-[#1F1D2B] pb-0.5">
            {card.name}
          </span>
        </div>
      </div>
    </button>
  );
});
