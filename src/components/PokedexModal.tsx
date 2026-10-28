// Componente PokedexModal: Pokédex retrô com 60 Pokémon das 3 Gerações e estatísticas de captura
import React, { useState } from 'react';
import { Generation, PokedexRecord } from '../types/game';
import { POKEMON_BY_GENERATION, GENERATION_CONFIGS, TYPE_INFO, getPokemonSpriteUrl } from '../data/cards';

interface PokedexModalProps {
  isOpen: boolean;
  onClose: () => void;
  pokedex: PokedexRecord;
}

export const PokedexModal: React.FC<PokedexModalProps> = ({ isOpen, onClose, pokedex }) => {
  const [selectedGen, setSelectedGen] = useState<Generation>('kanto');

  if (!isOpen) return null;

  const currentPokemonList = POKEMON_BY_GENERATION[selectedGen];
  const capturedInGen = currentPokemonList.filter((p) => Boolean(pokedex[p.id])).length;
  const totalInGen = currentPokemonList.length;

  const totalCapturedAll = Object.keys(pokedex).length;
  const totalAll = 60; // 20 * 3

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pokedex-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#1F1D2B]/90 overflow-y-auto"
    >
      <div className="w-full max-w-md bg-[#F8F8F0] border-4 border-[#1F1D2B] shadow-[6px_6px_0px_0px_#1F1D2B] rounded-none p-3.5 sm:p-4 flex flex-col gap-3 my-auto max-h-[90vh]">
        {/* Cabeçalho da Pokédex estilo Game Boy Red */}
        <div className="flex items-center justify-between border-b-3 border-[#1F1D2B] pb-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-[#3B5BA9] border-2 border-[#1F1D2B] animate-pulse" />
            <h2 id="pokedex-title" className="text-xs sm:text-sm font-bold text-[#1F1D2B] uppercase tracking-tight">
              POKÉDEX RETRÔ
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar Pokédex"
            className="w-7 h-7 bg-[#D63C3C] text-[#F8F8F0] border-2 border-[#1F1D2B] font-bold text-xs flex items-center justify-center cursor-pointer shadow-[2px_2px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
          >
            ✕
          </button>
        </div>

        {/* Estatísticas Globais */}
        <div className="bg-[#1F1D2B] text-[#F8F8F0] p-2 border-2 border-[#1F1D2B] text-[8px] flex items-center justify-between">
          <span>PROGRESSO TOTAL:</span>
          <span className="text-[#F2C230] font-bold">
            {totalCapturedAll} / {totalAll} ({Math.round((totalCapturedAll / totalAll) * 100)}%)
          </span>
        </div>

        {/* Abas das Gerações */}
        <div className="grid grid-cols-3 gap-1.5">
          {(['kanto', 'johto', 'hoenn'] as Generation[]).map((genKey) => {
            const config = GENERATION_CONFIGS[genKey];
            const isSelected = selectedGen === genKey;
            return (
              <button
                key={genKey}
                type="button"
                onClick={() => setSelectedGen(genKey)}
                className={`
                  py-1.5 px-1 border-2 border-[#1F1D2B] text-[8px] sm:text-[9px] font-bold uppercase cursor-pointer rounded-none touch-manipulation
                  flex flex-col items-center justify-center
                  ${
                    isSelected
                      ? 'bg-[#D63C3C] text-[#F8F8F0] shadow-[2px_2px_0px_0px_#1F1D2B] translate-x-0.5 translate-y-0.5'
                      : 'bg-[#E6E1D6] text-[#1F1D2B] hover:bg-[#F8F8F0]'
                  }
                `}
              >
                <span>{config.label}</span>
                <span className="text-[7px] opacity-80">{config.region}</span>
              </button>
            );
          })}
        </div>

        {/* Sub-barra da Geração atual */}
        <div className="text-[7.5px] uppercase font-bold text-[#1F1D2B]/80 flex items-center justify-between px-1">
          <span>CAPTURA REGIONAL:</span>
          <span className="text-[#3B5BA9] font-bold">
            {capturedInGen} DE {totalInGen} ENCONTRADOS
          </span>
        </div>

        {/* Grade de 20 Pokémon da Geração */}
        <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 overflow-y-auto max-h-[46vh] p-1 border-2 border-[#1F1D2B] bg-[#E6E1D6]">
          {currentPokemonList.map((pokemon) => {
            const entry = pokedex[pokemon.id];
            const isCaptured = Boolean(entry);
            const typeVisual = TYPE_INFO[pokemon.type];
            const spriteUrl = getPokemonSpriteUrl(pokemon.id);

            return (
              <div
                key={pokemon.id}
                className={`
                  border-2 border-[#1F1D2B] p-1 flex flex-col items-center justify-between text-center aspect-square
                  ${
                    isCaptured
                      ? 'bg-[#F8F8F0] shadow-[2px_2px_0px_0px_#1F1D2B]'
                      : 'bg-[#1F1D2B]/10 opacity-75'
                  }
                `}
              >
                {/* ID Pokédex */}
                <div className="w-full flex items-center justify-between text-[6px] text-[#1F1D2B]/70 font-mono">
                  <span>#{String(pokemon.id).padStart(3, '0')}</span>
                  {isCaptured && <span className="text-[#D63C3C]">★</span>}
                </div>

                {/* Sprite ou Silhueta */}
                <div className="w-10 h-10 flex items-center justify-center my-0.5">
                  <img
                    src={spriteUrl}
                    alt={isCaptured ? pokemon.name : 'Pokémon desconhecido'}
                    width={48}
                    height={48}
                    style={{ imageRendering: 'pixelated' }}
                    className={`
                      w-10 h-10 object-contain select-none [image-rendering:pixelated]
                      ${!isCaptured ? 'brightness-0 opacity-40 contrast-200' : ''}
                    `}
                    draggable={false}
                  />
                </div>

                {/* Nome ou ??? */}
                <div className="w-full">
                  <div className="text-[7px] font-bold text-[#1F1D2B] truncate uppercase">
                    {isCaptured ? pokemon.name : '???'}
                  </div>

                  {isCaptured && (
                    <span
                      style={{
                        backgroundColor: typeVisual?.bgColor,
                        color: typeVisual?.textColor,
                      }}
                      className="inline-block text-[5.5px] px-1 py-0.2 border border-[#1F1D2B] font-bold uppercase truncate max-w-full"
                    >
                      {typeVisual?.badge} {typeVisual?.name}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Botão de Fechar */}
        <button
          type="button"
          onClick={onClose}
          className="w-full min-h-[44px] px-3 py-2 bg-[#3B5BA9] text-[#F8F8F0] border-3 border-[#1F1D2B] shadow-[3px_3px_0px_0px_#1F1D2B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none text-[9px] font-bold uppercase cursor-pointer"
        >
          VOLTAR AO JOGO
        </button>
      </div>
    </div>
  );
};
