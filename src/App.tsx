/**
 * Componente Principal: App.tsx
 * Estética 8-bit com paleta clássica de Game Boy / Famicom.
 * Título: "Pixel Memory" | Subtítulo: "Edição Kanto"
 */
import { useState } from 'react';
import { useMemoryGame } from './hooks/useMemoryGame';
import { Difficulty } from './types/game';
import { StartScreen } from './components/StartScreen';
import { Scoreboard } from './components/Scoreboard';
import { Board } from './components/Board';
import { LoadingScreen } from './components/LoadingScreen';
import { GameOver } from './components/GameOver';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const {
    cards,
    moves,
    matches,
    totalPairs,
    isGameOver,
    isChecking,
    isPreloading,
    difficulty,
    timeSeconds,
    bestScores,
    currentBestScore,
    isNewRecord,
    handleCardClick,
    startNewGame,
    setDifficulty,
  } = useMemoryGame('medium');

  const handleStartGame = () => {
    startNewGame(difficulty);
    setIsPlaying(true);
  };

  const handleOpenDifficultySelector = () => {
    setIsPlaying(false);
  };

  return (
    <main className="min-h-screen bg-[#E6E1D6] text-[#1F1D2B] flex flex-col justify-between items-center p-3 sm:p-4 selection:bg-[#F2C230] selection:text-[#1F1D2B]">
      {/* Container vertical centralizado para celular */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-3 my-auto">
        {/* Cabeçalho 8-bit */}
        <header className="text-center pt-1">
          <div className="inline-block px-2.5 py-1 bg-[#D63C3C] text-[#F8F8F0] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] text-[8px] uppercase font-bold mb-2">
            EDIÇÃO KANTO
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-[#1F1D2B] uppercase">
            PIXEL <span className="text-[#3B5BA9]">MEMORY</span>
          </h1>
        </header>

        {/* Alternância de Telas */}
        {!isPlaying ? (
          <StartScreen
            selectedDifficulty={difficulty}
            onSelectDifficulty={(diff: Difficulty) => setDifficulty(diff)}
            onStartGame={handleStartGame}
            bestScores={bestScores}
          />
        ) : (
          <>
            <Scoreboard
              moves={moves}
              matches={matches}
              totalPairs={totalPairs}
              timeSeconds={timeSeconds}
              difficulty={difficulty}
              bestScore={currentBestScore}
              onRestart={() => startNewGame(difficulty)}
              onChangeDifficulty={handleOpenDifficultySelector}
            />

            {/* Enquanto os sprites estiverem sendo pré-carregados, exibe o LoadingScreen 8-bit */}
            {isPreloading ? (
              <LoadingScreen />
            ) : (
              <Board
                cards={cards}
                onCardClick={handleCardClick}
                disabled={isChecking}
              />
            )}
          </>
        )}
      </div>

      {/* Rodapé 8-bit */}
      <footer className="text-center text-[7px] sm:text-[8px] text-[#1F1D2B]/60 uppercase py-2">
        PROJETO PORTFÓLIO • REACT + TAILWIND CSS
      </footer>

      {/* Modal de Vitória */}
      <GameOver
        isOpen={isGameOver}
        moves={moves}
        timeSeconds={timeSeconds}
        isNewRecord={isNewRecord}
        onRestart={() => startNewGame(difficulty)}
        onChangeDifficulty={handleOpenDifficultySelector}
      />
    </main>
  );
}
