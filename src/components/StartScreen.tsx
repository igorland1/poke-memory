// Componente StartScreen: Tela inicial 8-bit com botões >=48px e sem dependências externas
import React from 'react';
import { Difficulty, BestScoresRecord } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../data/cards';
import { formatTime } from '../utils/storage';

interface StartScreenProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  onStartGame: () => void;
  bestScores: BestScoresRecord;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  onStartGame,
  bestScores,
}) => {
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#F8F8F0] p-4 sm:p-5 border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] rounded-none flex flex-col gap-4 text-center">
      {/* Apresentação Temática */}
      <div>
        {/* Pokébola 8-bit decorativa em CSS */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-full border-4 border-[#1F1D2B] relative overflow-hidden bg-[#F8F8F0] shadow-[2px_2px_0px_0px_#1F1D2B]">
          <div className="absolute top-0 inset-x-0 h-1/2 bg-[#D63C3C]" />
          <div className="absolute bottom-0 inset-x-0 h-1/2 bg-[#F8F8F0]" />
          <div className="w-full h-1.5 bg-[#1F1D2B] absolute top-1/2 -translate-y-1/2 z-10" />
          <div className="w-4 h-4 rounded-full bg-[#F8F8F0] border-2 border-[#1F1D2B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-[#1F1D2B]" />
          </div>
        </div>

        <h2 className="text-base sm:text-lg font-bold text-[#1F1D2B] tracking-tight uppercase">
          ESCOLHA O NÍVEL
        </h2>
        <p className="text-[8px] sm:text-[9px] text-[#1F1D2B]/80 mt-1 uppercase">
          Encontre todos os pares Pokémon
        </p>
      </div>

      {/* Seleção de Níveis com botões táteis (>=48px de altura) */}
      <div className="flex flex-col gap-2.5">
        {difficulties.map((diffKey) => {
          const config = DIFFICULTY_CONFIGS[diffKey];
          const isSelected = selectedDifficulty === diffKey;
          const best = bestScores[diffKey];

          return (
            <button
              key={diffKey}
              type="button"
              onClick={() => onSelectDifficulty(diffKey)}
              className={`
                w-full min-h-[48px] p-3 text-left border-4 transition-transform cursor-pointer touch-manipulation rounded-none
                flex items-center justify-between gap-2
                ${
                  isSelected
                    ? 'bg-[#F2C230] border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B] translate-x-0.5 translate-y-0.5'
                    : 'bg-[#E6E1D6] border-[#1F1D2B] hover:bg-[#F8F8F0]'
                }
              `}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[10px] sm:text-xs text-[#1F1D2B] uppercase">
                    {config.label}
                  </span>
                  <span className="text-[7px] uppercase font-bold px-1.5 py-0.5 bg-[#1F1D2B] text-[#F8F8F0]">
                    {config.pairsCount} PARES
                  </span>
                </div>
                <span className="text-[8px] text-[#1F1D2B]/70 mt-1 uppercase">
                  {config.description}
                </span>

                {/* Recorde */}
                <div className="mt-1 text-[7px] sm:text-[8px] font-bold">
                  {best ? (
                    <span className="text-[#3B5BA9]">
                      RECORDE: {best.moves}J • {formatTime(best.timeSeconds)}
                    </span>
                  ) : (
                    <span className="text-[#1F1D2B]/50">SEM RECORDE</span>
                  )}
                </div>
              </div>

              {/* Indicador de Seleção 8-bit */}
              <div
                className={`
                  w-6 h-6 border-2 border-[#1F1D2B] flex items-center justify-center shrink-0 rounded-none
                  ${isSelected ? 'bg-[#D63C3C] text-[#F8F8F0]' : 'bg-[#F8F8F0]'}
                `}
              >
                {isSelected && <span className="text-[10px] font-bold">▶</span>}
              </div>
            </button>
          );
        })}
      </div>

      {/* Botão Começar Jogo (mínimo 48px de altura) com ícone retrô puro */}
      <button
        type="button"
        onClick={onStartGame}
        className="w-full min-h-[48px] px-4 py-3 bg-[#D63C3C] text-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-transform rounded-none touch-manipulation"
      >
        <span aria-hidden="true">▶</span>
        COMEÇAR JOGO
      </button>
    </div>
  );
};
