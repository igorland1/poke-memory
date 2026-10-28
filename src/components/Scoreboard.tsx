// Componente Scoreboard: Placar 8-bit com botões táteis >=48px e ícones retrô puros (sem lucide-react)
import React from 'react';
import { BestScore, Difficulty } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../data/cards';
import { formatTime } from '../utils/storage';

interface ScoreboardProps {
  moves: number;
  matches: number;
  totalPairs: number;
  timeSeconds: number;
  difficulty: Difficulty;
  bestScore?: BestScore;
  onRestart: () => void;
  onChangeDifficulty: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  moves,
  matches,
  totalPairs,
  timeSeconds,
  difficulty,
  bestScore,
  onRestart,
  onChangeDifficulty,
}) => {
  const currentDiffConfig = DIFFICULTY_CONFIGS[difficulty];

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] rounded-none p-3 flex flex-col gap-2.5">
      {/* Barra Superior: Nível e Recorde */}
      <div className="flex items-center justify-between text-[9px] border-b-2 border-[#1F1D2B] pb-2">
        <button
          type="button"
          onClick={onChangeDifficulty}
          className="min-h-[48px] px-3 py-2 bg-[#3B5BA9] text-[#F8F8F0] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-bold uppercase transition-transform cursor-pointer rounded-none flex items-center justify-center touch-manipulation"
        >
          <span>NÍVEL: {currentDiffConfig.label}</span>
        </button>

        <div className="text-right text-[8px] sm:text-[9px] text-[#1F1D2B] leading-tight">
          <div className="text-[#3B5BA9] font-bold">RECORDE</div>
          {bestScore ? (
            <div className="font-bold text-[#D63C3C]">
              {bestScore.moves}J • {formatTime(bestScore.timeSeconds)}
            </div>
          ) : (
            <div className="text-[#1F1D2B]/60">NENHUM</div>
          )}
        </div>
      </div>

      {/* Linha Principal de Métricas */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Jogadas */}
        <div className="flex flex-col items-center flex-1 bg-[#E6E1D6] p-1.5 border-2 border-[#1F1D2B]">
          <span className="text-[7px] sm:text-[8px] uppercase font-bold text-[#1F1D2B]">
            JOGADAS
          </span>
          <span className="text-base sm:text-lg font-bold text-[#1F1D2B] mt-0.5">
            {moves}
          </span>
        </div>

        {/* Pares */}
        <div className="flex flex-col items-center flex-1 bg-[#E6E1D6] p-1.5 border-2 border-[#1F1D2B]">
          <span className="text-[7px] sm:text-[8px] uppercase font-bold text-[#1F1D2B]">
            PARES
          </span>
          <span className="text-base sm:text-lg font-bold text-[#3B5BA9] mt-0.5">
            {matches}/{totalPairs}
          </span>
        </div>

        {/* Tempo */}
        <div className="flex flex-col items-center flex-1 bg-[#E6E1D6] p-1.5 border-2 border-[#1F1D2B]">
          <span className="text-[7px] sm:text-[8px] uppercase font-bold text-[#1F1D2B]">
            TEMPO
          </span>
          <span className="text-base sm:text-lg font-bold text-[#D63C3C] mt-0.5">
            {formatTime(timeSeconds)}
          </span>
        </div>

        {/* Botão Reiniciar Partida (Touch mínimo 48x48px com ícone retrô puro) */}
        <button
          type="button"
          onClick={onRestart}
          aria-label="Reiniciar partida"
          title="Reiniciar partida"
          className="min-w-[48px] min-h-[48px] p-2 bg-[#F2C230] text-[#1F1D2B] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer rounded-none touch-manipulation shrink-0 text-base font-bold"
        >
          <span aria-hidden="true">↺</span>
        </button>
      </div>
    </div>
  );
};
