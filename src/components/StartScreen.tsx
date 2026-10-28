// Componente StartScreen: Seleção de Geração, Modo de Jogo e Dificuldade com i18n
import React from 'react';
import { Difficulty, GameMode, Generation, BestScoresRecord } from '../types/game';
import { DIFFICULTY_CONFIGS, GENERATION_CONFIGS } from '../data/cards';
import { formatTime, getScoreKey } from '../utils/storage';
import { Language, DICTIONARY } from '../utils/i18n';

interface StartScreenProps {
  selectedDifficulty: Difficulty;
  onSelectDifficulty: (difficulty: Difficulty) => void;
  selectedMode: GameMode;
  onSelectMode: (mode: GameMode) => void;
  selectedGeneration: Generation;
  onSelectGeneration: (gen: Generation) => void;
  onStartGame: () => void;
  onOpenPokedex: () => void;
  bestScores: BestScoresRecord;
  capturedCount: number;
  language: Language;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  selectedMode,
  onSelectMode,
  selectedGeneration,
  onSelectGeneration,
  onStartGame,
  onOpenPokedex,
  bestScores,
  capturedCount,
  language,
}) => {
  const t = DICTIONARY[language];
  const generations: Generation[] = ['kanto', 'johto', 'hoenn'];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];

  const currentRecordKey = getScoreKey(selectedMode, selectedGeneration, selectedDifficulty);
  const currentRecord = bestScores[currentRecordKey];

  const diffLabels: Record<Difficulty, { label: string; desc: string }> = {
    easy: { label: t.diffEasy, desc: t.diffEasyDesc },
    medium: { label: t.diffMedium, desc: t.diffMediumDesc },
    hard: { label: t.diffHard, desc: t.diffHardDesc },
  };

  return (
    <div className="w-full max-w-sm sm:max-w-md mx-auto bg-[#F8F8F0] p-3.5 sm:p-5 border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] rounded-none flex flex-col gap-3 sm:gap-4 text-center">
      {/* 1. Seleção de Geração (Kanto, Johto, Hoenn) */}
      <div>
        <div className="text-[8px] font-bold uppercase text-[#1F1D2B]/70 mb-1.5 flex items-center justify-center gap-1">
          <span>{t.regionLabel}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {generations.map((genKey) => {
            const gen = GENERATION_CONFIGS[genKey];
            const isSelected = selectedGeneration === genKey;
            return (
              <button
                key={genKey}
                type="button"
                onClick={() => onSelectGeneration(genKey)}
                className={`
                  min-h-[44px] py-1.5 px-1 border-2 border-[#1F1D2B] font-bold text-[9px] uppercase cursor-pointer transition-transform rounded-none touch-manipulation
                  flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? 'bg-[#D63C3C] text-[#F8F8F0] shadow-[2px_2px_0px_0px_#1F1D2B] translate-x-0.5 translate-y-0.5'
                      : 'bg-[#E6E1D6] text-[#1F1D2B] hover:bg-[#F8F8F0]'
                  }
                `}
              >
                <span>{gen.label}</span>
                <span className="text-[7px] opacity-80">{gen.region}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Modo de Jogo */}
      <div>
        <div className="text-[8px] font-bold uppercase text-[#1F1D2B]/70 mb-1.5 flex items-center justify-center gap-1">
          <span>{t.gameModeLabel}</span>
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => onSelectMode('classic')}
            className={`
              min-h-[46px] p-1.5 border-2 border-[#1F1D2B] font-bold text-[8.5px] uppercase cursor-pointer rounded-none touch-manipulation flex flex-col items-center justify-center
              ${
                selectedMode === 'classic'
                  ? 'bg-[#3B5BA9] text-[#F8F8F0] shadow-[2px_2px_0px_0px_#1F1D2B] translate-x-0.5 translate-y-0.5'
                  : 'bg-[#E6E1D6] text-[#1F1D2B] hover:bg-[#F8F8F0]'
              }
            `}
          >
            <span>{t.classicMode}</span>
            <span className="text-[6.5px] opacity-85 mt-0.5">{t.classicDesc}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('timeAttack')}
            className={`
              min-h-[46px] p-1.5 border-2 border-[#1F1D2B] font-bold text-[8.5px] uppercase cursor-pointer rounded-none touch-manipulation flex flex-col items-center justify-center
              ${
                selectedMode === 'timeAttack'
                  ? 'bg-[#F2C230] text-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] translate-x-0.5 translate-y-0.5'
                  : 'bg-[#E6E1D6] text-[#1F1D2B] hover:bg-[#F8F8F0]'
              }
            `}
          >
            <div className="flex items-center gap-0.5">
              <span>{t.timeAttackMode}</span>
              <span className="text-[7px]">⚡</span>
            </div>
            <span className="text-[6.5px] opacity-85 mt-0.5">{t.timeAttackDesc}</span>
          </button>

          <button
            type="button"
            onClick={() => onSelectMode('memoryFlash')}
            className={`
              min-h-[46px] p-1.5 border-2 border-[#1F1D2B] font-bold text-[8.5px] uppercase cursor-pointer rounded-none touch-manipulation flex flex-col items-center justify-center
              ${
                selectedMode === 'memoryFlash'
                  ? 'bg-[#D63C3C] text-[#F8F8F0] shadow-[2px_2px_0px_0px_#1F1D2B] translate-x-0.5 translate-y-0.5'
                  : 'bg-[#E6E1D6] text-[#1F1D2B] hover:bg-[#F8F8F0]'
              }
            `}
          >
            <div className="flex items-center gap-0.5">
              <span>{t.memoryFlashMode}</span>
              <span className="text-[7px]">👁️</span>
            </div>
            <span className="text-[6.5px] opacity-85 mt-0.5">{t.memoryFlashDesc}</span>
          </button>
        </div>
      </div>

      {/* 3. Seleção de Dificuldade */}
      <div>
        <div className="text-[8px] font-bold uppercase text-[#1F1D2B]/70 mb-1.5 flex items-center justify-center gap-1">
          <span>{t.difficultyLabel}</span>
        </div>
        <div className="flex flex-col gap-2">
          {difficulties.map((diffKey) => {
            const config = DIFFICULTY_CONFIGS[diffKey];
            const isSelected = selectedDifficulty === diffKey;
            const diffTranslation = diffLabels[diffKey];

            return (
              <button
                key={diffKey}
                type="button"
                onClick={() => onSelectDifficulty(diffKey)}
                className={`
                  w-full min-h-[44px] p-2.5 text-left border-3 transition-transform cursor-pointer touch-manipulation rounded-none
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
                      {diffTranslation.label}
                    </span>
                    <span className="text-[7px] uppercase font-bold px-1.5 py-0.5 bg-[#1F1D2B] text-[#F8F8F0]">
                      {config.pairsCount} {t.pairsCount}
                    </span>
                    {selectedMode === 'timeAttack' && (
                      <span className="text-[7px] uppercase font-bold px-1 py-0.5 bg-[#D63C3C] text-[#F8F8F0]">
                        {config.timeLimitSeconds}s
                      </span>
                    )}
                  </div>
                  <span className="text-[7px] sm:text-[8px] text-[#1F1D2B]/70 mt-0.5 uppercase">
                    {diffTranslation.desc}
                  </span>
                </div>

                <div
                  className={`
                    w-5 h-5 border-2 border-[#1F1D2B] flex items-center justify-center shrink-0 rounded-none
                    ${isSelected ? 'bg-[#D63C3C] text-[#F8F8F0]' : 'bg-[#F8F8F0]'}
                  `}
                >
                  {isSelected && <span className="text-[9px] font-bold">▶</span>}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Recorde */}
      <div className="p-2 bg-[#E6E1D6] border-2 border-[#1F1D2B] text-[8px] flex items-center justify-between">
        <span className="font-bold text-[#3B5BA9] uppercase">{t.currentRecord}</span>
        {currentRecord ? (
          <span className="font-bold text-[#D63C3C]">
            {currentRecord.score} PTS • {currentRecord.moves}J • {formatTime(currentRecord.timeSeconds)}
          </span>
        ) : (
          <span className="text-[#1F1D2B]/50 font-bold uppercase">{t.noRecord}</span>
        )}
      </div>

      {/* Botão Começar Jogo */}
      <button
        type="button"
        onClick={onStartGame}
        className="w-full min-h-[48px] px-4 py-3 bg-[#D63C3C] text-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-bold text-xs uppercase flex items-center justify-center gap-2 cursor-pointer transition-transform rounded-none touch-manipulation"
      >
        <span aria-hidden="true">▶</span>
        {t.startGame}
      </button>

      {/* Botão Abrir Pokédex Retrô */}
      <button
        type="button"
        onClick={onOpenPokedex}
        className="w-full min-h-[44px] px-3 py-2.5 bg-[#3B5BA9] text-[#F8F8F0] border-3 border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none font-bold text-[9px] uppercase flex items-center justify-between cursor-pointer rounded-none touch-manipulation"
      >
        <div className="flex items-center gap-1.5">
          <span aria-hidden="true">📖</span>
          <span>{t.openPokedex}</span>
        </div>
        <span className="bg-[#1F1D2B] text-[#F2C230] px-1.5 py-0.5 text-[7.5px]">
          {capturedCount} / 60
        </span>
      </button>
    </div>
  );
};
