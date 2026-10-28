// Componente Scoreboard: Placar 8-bit com pontuação, combos, modo e tempo
import React from 'react';
import { BestScore, Difficulty, GameMode } from '../types/game';
import { DIFFICULTY_CONFIGS } from '../data/cards';
import { formatTime } from '../utils/storage';

interface ScoreboardProps {
  moves: number;
  matches: number;
  totalPairs: number;
  timeSeconds: number;
  score: number;
  combo: number;
  difficulty: Difficulty;
  gameMode: GameMode;
  bestScore?: BestScore;
  isMuted: boolean;
  onToggleSound: () => void;
  onRestart: () => void;
  onChangeDifficulty: () => void;
  onOpenPokedex?: () => void;
}

export const Scoreboard: React.FC<ScoreboardProps> = ({
  moves,
  matches,
  totalPairs,
  timeSeconds,
  score,
  combo,
  difficulty,
  gameMode,
  bestScore,
  isMuted,
  onToggleSound,
  onRestart,
  onChangeDifficulty,
  onOpenPokedex,
}) => {
  const currentDiffConfig = DIFFICULTY_CONFIGS[difficulty];
  const isTimeAttack = gameMode === 'timeAttack';
  const isTimeLow = isTimeAttack && timeSeconds <= 10;

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] rounded-none p-2.5 sm:p-3 flex flex-col gap-2">
      {/* Barra Superior: Nível, Modo e Recorde */}
      <div className="flex items-center justify-between text-[8px] sm:text-[9px] border-b-2 border-[#1F1D2B] pb-2">
        <button
          type="button"
          onClick={onChangeDifficulty}
          className="min-h-[44px] px-2.5 py-1.5 bg-[#3B5BA9] text-[#F8F8F0] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-bold uppercase transition-transform cursor-pointer rounded-none flex flex-col items-start justify-center touch-manipulation"
        >
          <span>NÍVEL: {currentDiffConfig.label}</span>
          <span className="text-[7px] text-[#F2C230]">
            {isTimeAttack ? '⚡ TIME ATTACK' : gameMode === 'memoryFlash' ? '👁️ FLASH' : 'MODO CLÁSSICO'}
          </span>
        </button>

        <div className="text-right text-[8px] sm:text-[9px] text-[#1F1D2B] leading-tight">
          <div className="text-[#3B5BA9] font-bold">RECORDE</div>
          {bestScore ? (
            <div className="font-bold text-[#D63C3C]">
              {bestScore.score} PTS • {bestScore.moves}J
            </div>
          ) : (
            <div className="text-[#1F1D2B]/60">NENHUM</div>
          )}
        </div>
      </div>

      {/* Faixa de Pontuação e Combos */}
      <div className="flex items-center justify-between bg-[#1F1D2B] text-[#F8F8F0] px-2.5 py-1 text-[8px] sm:text-[9px] font-bold">
        <div className="flex items-center gap-1.5">
          <span className="text-[#F2C230]">SCORE:</span>
          <span>{score}</span>
        </div>

        {combo > 1 ? (
          <div className="animate-pulse flex items-center gap-1 text-[#F2C230]">
            <span>COMBO</span>
            <span className="bg-[#D63C3C] text-[#F8F8F0] px-1 py-0.2 rounded-none text-[8px]">
              {combo}x
            </span>
          </div>
        ) : (
          <span className="text-[#F8F8F0]/50 text-[7px] uppercase">SEM COMBO</span>
        )}
      </div>

      {/* Linha Principal de Métricas */}
      <div className="flex items-center justify-between gap-1.5">
        {/* Jogadas */}
        <div className="flex flex-col items-center flex-1 bg-[#E6E1D6] p-1 border-2 border-[#1F1D2B]">
          <span className="text-[6.5px] sm:text-[7.5px] uppercase font-bold text-[#1F1D2B]">
            JOGADAS
          </span>
          <span className="text-sm sm:text-base font-bold text-[#1F1D2B] mt-0.5">
            {moves}
          </span>
        </div>

        {/* Pares */}
        <div className="flex flex-col items-center flex-1 bg-[#E6E1D6] p-1 border-2 border-[#1F1D2B]">
          <span className="text-[6.5px] sm:text-[7.5px] uppercase font-bold text-[#1F1D2B]">
            PARES
          </span>
          <span className="text-sm sm:text-base font-bold text-[#3B5BA9] mt-0.5">
            {matches}/{totalPairs}
          </span>
        </div>

        {/* Tempo (com destaque se estiver acabando no modo Time Attack) */}
        <div
          className={`
            flex flex-col items-center flex-1 p-1 border-2 border-[#1F1D2B] transition-colors
            ${isTimeLow ? 'bg-[#D63C3C] text-[#F8F8F0] animate-pulse' : 'bg-[#E6E1D6] text-[#1F1D2B]'}
          `}
        >
          <span className="text-[6.5px] sm:text-[7.5px] uppercase font-bold">
            {isTimeAttack ? 'TEMPO REST.' : 'TEMPO'}
          </span>
          <span
            className={`
              text-sm sm:text-base font-bold mt-0.5
              ${isTimeLow ? 'text-[#F8F8F0]' : 'text-[#D63C3C]'}
            `}
          >
            {formatTime(timeSeconds)}
          </span>
        </div>

        {/* Botão Som On/Off */}
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={isMuted ? 'Ativar som' : 'Desativar som'}
          title={isMuted ? 'Ativar som' : 'Desativar som'}
          className="min-w-[42px] min-h-[42px] p-1.5 bg-[#E6E1D6] text-[#1F1D2B] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer rounded-none touch-manipulation shrink-0 text-xs font-bold"
        >
          <span aria-hidden="true">{isMuted ? '🔇' : '🔊'}</span>
        </button>

        {/* Botão Pokédex rápida */}
        {onOpenPokedex && (
          <button
            type="button"
            onClick={onOpenPokedex}
            aria-label="Ver Pokédex"
            title="Ver Pokédex"
            className="min-w-[42px] min-h-[42px] p-1.5 bg-[#E6E1D6] text-[#1F1D2B] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer rounded-none touch-manipulation shrink-0 text-xs font-bold"
          >
            <span aria-hidden="true">📖</span>
          </button>
        )}

        {/* Botão Reiniciar Partida */}
        <button
          type="button"
          onClick={onRestart}
          aria-label="Reiniciar partida"
          title="Reiniciar partida"
          className="min-w-[42px] min-h-[42px] p-1.5 bg-[#F2C230] text-[#1F1D2B] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none flex items-center justify-center cursor-pointer rounded-none touch-manipulation shrink-0 text-base font-bold"
        >
          <span aria-hidden="true">↺</span>
        </button>
      </div>
    </div>
  );
};
