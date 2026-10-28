// Componente Board: Tabuleiro com borda grossa de 4px, cantos retos e sombra dura
import React from 'react';
import { CardItem } from '../types/game';
import { Card } from './Card';

interface BoardProps {
  cards: CardItem[];
  onCardClick: (card: CardItem) => void;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({ cards, onCardClick, disabled = false }) => {
  return (
    <section
      role="region"
      aria-label="Tabuleiro de cartas"
      className="w-full max-w-sm sm:max-w-md mx-auto bg-[#F8F8F0] p-2.5 sm:p-3 border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] rounded-none"
    >
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {cards.map((card, index) => (
          <Card
            key={card.id}
            card={card}
            index={index}
            onClick={onCardClick}
            disabled={disabled}
          />
        ))}
      </div>
    </section>
  );
};
