// Componente GameOver: Tela de vitória 8-bit com foco automático e sem dependências externas
import React, { useEffect, useRef } from 'react';
import { formatTime } from '../utils/storage';

interface GameOverProps {
  isOpen: boolean;
  moves: number;
  timeSeconds: number;
  isNewRecord: boolean;
  onRestart: () => void;
  onChangeDifficulty: () => void;
}

export const GameOver: React.FC<GameOverProps> = ({
  isOpen,
  moves,
  timeSeconds,
  isNewRecord,
  onRestart,
  onChangeDifficulty,
}) => {
  const restartButtonRef = useRef<HTMLButtonElement | null>(null);

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

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="victory-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1F1D2B]/85"
    >
      <div className="w-full max-w-xs bg-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[6px_6px_0px_0px_#1F1D2B] rounded-none p-5 text-center flex flex-col gap-3.5">
        {/* Troféu 8-bit */}
        <div className="w-12 h-12 mx-auto bg-[#F2C230] border-4 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] flex items-center justify-center">
          <span className="text-xl" aria-hidden="true">🏆</span>
        </div>

        {/* Mensagem de Vitória */}
        <div>
          <h2 id="victory-title" className="text-sm sm:text-base font-bold text-[#1F1D2B] uppercase">
            MESTRE POKÉMON!
          </h2>
          <p className="text-[8px] text-[#1F1D2B]/80 mt-1 uppercase">
            Você capturou todos os pares!
          </p>
        </div>

        {/* Destaque Novo Recorde */}
        {isNewRecord && (
          <div
            role="status"
            className="px-2 py-1 bg-[#F2C230] text-[#1F1D2B] border-2 border-[#1F1D2B] text-[8px] font-bold uppercase shadow-[2px_2px_0px_0px_#1F1D2B]"
          >
            ★ NOVO RECORDE ★
          </div>
        )}

        {/* Estatísticas Finais */}
        <div className="grid grid-cols-2 gap-2 bg-[#E6E1D6] p-2.5 border-2 border-[#1F1D2B]">
          <div className="flex flex-col items-center">
            <span className="text-[7px] text-[#1F1D2B] uppercase font-bold">
              JOGADAS
            </span>
            <span className="text-lg font-bold text-[#1F1D2B] mt-1">
              {moves}
            </span>
          </div>
          <div className="flex flex-col items-center border-l-2 border-[#1F1D2B] pl-2">
            <span className="text-[7px] text-[#1F1D2B] uppercase font-bold">
              TEMPO
            </span>
            <span className="text-lg font-bold text-[#D63C3C] mt-1">
              {formatTime(timeSeconds)}
            </span>
          </div>
        </div>

        {/* Botões de Ação (mínimo 48px de altura) com ícones puros */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            ref={restartButtonRef}
            type="button"
            onClick={onRestart}
            className="w-full min-h-[48px] px-3 py-3 bg-[#D63C3C] text-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[10px] font-bold uppercase flex items-center justify-center gap-2 cursor-pointer transition-transform rounded-none touch-manipulation focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2C230]"
          >
            <span aria-hidden="true" className="text-xs">↺</span>
            JOGAR DE NOVO
          </button>

          <button
            type="button"
            onClick={onChangeDifficulty}
            className="w-full min-h-[48px] px-3 py-3 bg-[#3B5BA9] text-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[4px_4px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[9px] font-bold uppercase flex items-center justify-center gap-1.5 cursor-pointer transition-transform rounded-none touch-manipulation focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#F2C230]"
          >
            <span aria-hidden="true" className="text-xs">≡</span>
            TROCAR NÍVEL
          </button>
        </div>
      </div>
    </div>
  );
};
