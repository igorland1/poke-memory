// Componente GameOver: Modal de Vitória ou Derrota com i18n e Compartilhamento
import React, { useEffect, useRef, useState } from 'react';
import { formatTime } from '../utils/storage';
import { GameMode } from '../types/game';
import { Language, DICTIONARY } from '../utils/i18n';

interface GameOverProps {
  isOpen: boolean;
  isWon: boolean;
  isTimeOut: boolean;
  moves: number;
  timeSeconds: number;
  score: number;
  maxCombo: number;
  gameMode: GameMode;
  isNewRecord: boolean;
  language: Language;
  onRestart: () => void;
  onChangeDifficulty: () => void;
  onOpenPokedex?: () => void;
}

const CONFETTI_PIECES = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  left: `${(i * 3.33 + Math.random() * 2).toFixed(1)}%`,
  delay: `${(Math.random() * 1.5).toFixed(2)}s`,
  duration: `${(2 + Math.random() * 2).toFixed(2)}s`,
  color: ['#D63C3C', '#F2C230', '#3B5BA9', '#1F1D2B', '#F8F8F0'][i % 5],
  size: i % 2 === 0 ? '8px' : '12px',
}));

export const GameOver: React.FC<GameOverProps> = ({
  isOpen,
  isWon,
  isTimeOut,
  moves,
  timeSeconds,
  score,
  maxCombo,
  gameMode,
  isNewRecord,
  language,
  onRestart,
  onChangeDifficulty,
  onOpenPokedex,
}) => {
  const t = DICTIONARY[language];
  const restartButtonRef = useRef<HTMLButtonElement | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      restartButtonRef.current?.focus();

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onRestart();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onRestart]);

  // Compartilhamento com Web Share API ou cópia para Clipboard
  const handleShare = async () => {
    const modeName =
      gameMode === 'timeAttack'
        ? `${t.timeAttackMode} ⚡`
        : gameMode === 'memoryFlash'
        ? `${t.memoryFlashMode} 👁️`
        : t.classicMode;

    const text = `${t.shareTitle}\n⚡ ${t.gameModeLabel}: ${modeName}\n⭐ ${t.score}: ${score} PTS\n🎯 ${t.moves}: ${moves} | ⏱️ ${t.time}: ${formatTime(timeSeconds)}\n🔥 ${t.maxCombo}: ${maxCombo > 1 ? `${maxCombo}x` : '1x'}\n\n${t.shareBeatRecord}`;

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Pixel Memory',
          text,
          url: window.location.href,
        });
        return;
      } catch {}
    }

    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      } catch (e) {
        console.warn('Falha ao copiar:', e);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="gameover-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D2B]/85 overflow-hidden"
    >
      {/* Confetes em caso de vitória */}
      {isWon &&
        CONFETTI_PIECES.map((piece) => (
          <span
            key={piece.id}
            className="pixel-confetti"
            style={{
              left: piece.left,
              animationDelay: piece.delay,
              animationDuration: piece.duration,
              backgroundColor: piece.color,
              width: piece.size,
              height: piece.size,
              border: '2px solid #1F1D2B',
            }}
            aria-hidden="true"
          />
        ))}

      <div className="w-full max-w-xs bg-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[6px_6px_0px_0px_#1F1D2B] rounded-none p-5 text-center flex flex-col gap-3.5 relative z-10">
        {/* Ícone */}
        <div
          className={`
            w-12 h-12 mx-auto border-4 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] flex items-center justify-center
            ${isWon ? 'bg-[#F2C230]' : 'bg-[#D63C3C] text-[#F8F8F0]'}
          `}
        >
          <span className="text-xl" aria-hidden="true">
            {isWon ? '🏆' : '💀'}
          </span>
        </div>

        {/* Mensagem Principal */}
        <div>
          <h2 id="gameover-title" className="text-sm sm:text-base font-bold text-[#1F1D2B] uppercase">
            {isWon ? t.pokemonMaster : t.timeOutTitle}
          </h2>
          <p className="text-[8px] text-[#1F1D2B]/80 mt-1 uppercase">
            {isWon ? t.allPairsCaught : t.timeOutDesc}
          </p>
        </div>

        {/* Destaque Novo Recorde */}
        {isNewRecord && isWon && (
          <div
            role="status"
            className="px-2 py-1 bg-[#F2C230] text-[#1F1D2B] border-2 border-[#1F1D2B] text-[8px] font-bold uppercase shadow-[2px_2px_0px_0px_#1F1D2B]"
          >
            {t.newRecordBadge}
          </div>
        )}

        {/* Estatísticas Finais */}
        <div className="grid grid-cols-2 gap-2 bg-[#E6E1D6] p-2.5 border-2 border-[#1F1D2B] text-left">
          <div className="flex flex-col">
            <span className="text-[7px] text-[#1F1D2B]/70 uppercase font-bold">{t.score}</span>
            <span className="text-base font-bold text-[#3B5BA9]">{score} PTS</span>
          </div>

          <div className="flex flex-col border-l-2 border-[#1F1D2B] pl-2">
            <span className="text-[7px] text-[#1F1D2B]/70 uppercase font-bold">{t.maxCombo}</span>
            <span className="text-base font-bold text-[#D63C3C]">
              {maxCombo > 1 ? `${maxCombo}x` : '—'}
            </span>
          </div>

          <div className="flex flex-col pt-1 border-t-2 border-[#1F1D2B]">
            <span className="text-[7px] text-[#1F1D2B]/70 uppercase font-bold">{t.moves}</span>
            <span className="text-sm font-bold text-[#1F1D2B]">{moves}</span>
          </div>

          <div className="flex flex-col pt-1 border-t-2 border-l-2 border-[#1F1D2B] pl-2">
            <span className="text-[7px] text-[#1F1D2B]/70 uppercase font-bold">
              {gameMode === 'timeAttack' ? t.timeRemaining : t.time}
            </span>
            <span className="text-sm font-bold text-[#1F1D2B]">
              {formatTime(timeSeconds)}
            </span>
          </div>
        </div>

        {/* Botões de Ação */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            ref={restartButtonRef}
            type="button"
            onClick={onRestart}
            className="w-full min-h-[48px] px-3 py-3 bg-[#D63C3C] text-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[10px] font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-transform rounded-none touch-manipulation focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2C230]"
          >
            <span aria-hidden="true" className="text-xs">↺</span>
            {isWon ? t.playAgain : t.tryAgain}
          </button>

          {isWon && (
            <button
              type="button"
              onClick={handleShare}
              className="w-full min-h-[44px] px-3 py-2 bg-[#25D366] text-[#1F1D2B] border-3 border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[9px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer rounded-none touch-manipulation"
            >
              <span>{copied ? t.copied : t.shareVictory}</span>
            </button>
          )}

          <button
            type="button"
            onClick={onChangeDifficulty}
            className="w-full min-h-[48px] px-3 py-3 bg-[#3B5BA9] text-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[9px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-transform rounded-none touch-manipulation focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2C230]"
          >
            <span aria-hidden="true" className="text-xs">≡</span>
            {t.mainMenu}
          </button>

          {onOpenPokedex && (
            <button
              type="button"
              onClick={onOpenPokedex}
              className="w-full min-h-[44px] px-3 py-2 bg-[#F2C230] text-[#1F1D2B] border-3 border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[9px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer rounded-none touch-manipulation"
            >
              <span aria-hidden="true">📖</span>
              {t.viewPokedex}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
