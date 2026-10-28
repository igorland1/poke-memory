/**
 * Componente Principal: App.tsx
 * Estética 8-bit com paleta clássica de Game Boy / Famicom.
 * Título: "Pixel Memory"
 */
import { useState, useCallback, useEffect } from 'react';
import { useMemoryGame } from './hooks/useMemoryGame';
import { Difficulty, GameMode, Generation } from './types/game';
import { GENERATION_CONFIGS } from './data/cards';
import { StartScreen } from './components/StartScreen';
import { Scoreboard } from './components/Scoreboard';
import { Board } from './components/Board';
import { LoadingScreen } from './components/LoadingScreen';
import { GameOver } from './components/GameOver';
import { PokedexModal } from './components/PokedexModal';

export default function App() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPokedexOpen, setIsPokedexOpen] = useState<boolean>(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallApp = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const choiceResult = await installPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      setInstallPrompt(null);
    }
  };

  const {
    cards,
    moves,
    matches,
    totalPairs,
    score,
    combo,
    maxCombo,
    isWon,
    isTimeOut,
    isGameOver,
    isChecking,
    isPreloading,
    difficulty,
    gameMode,
    generation,
    timeSeconds,
    bestScores,
    currentBestScore,
    isNewRecord,
    pokedex,
    isMuted,
    toggleSound,
    handleCardClick,
    startNewGame,
    setDifficulty,
    setGameMode,
    setGeneration,
  } = useMemoryGame('medium', 'classic', 'kanto');

  const handleStartGame = useCallback(() => {
    startNewGame(difficulty, gameMode, generation);
    setIsPlaying(true);
  }, [startNewGame, difficulty, gameMode, generation]);

  const handleOpenDifficultySelector = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleOpenPokedex = useCallback(() => {
    setIsPokedexOpen(true);
  }, []);

  const handleClosePokedex = useCallback(() => {
    setIsPokedexOpen(false);
  }, []);

  const currentGenBadge = GENERATION_CONFIGS[generation]?.badge ?? 'EDIÇÃO KANTO';
  const totalCaptured = Object.keys(pokedex).length;

  return (
    <main className="min-h-screen bg-[#E6E1D6] text-[#1F1D2B] flex flex-col justify-between items-center p-3 sm:p-4 selection:bg-[#F2C230] selection:text-[#1F1D2B]">
      {/* Container vertical centralizado para celular */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-2.5 my-auto">
        {/* Cabeçalho 8-bit */}
        <header className="text-center pt-1">
          <div className="inline-block px-2.5 py-1 bg-[#D63C3C] text-[#F8F8F0] border-2 border-[#1F1D2B] shadow-[2px_2px_0px_0px_#1F1D2B] text-[8px] uppercase font-bold mb-2">
            {currentGenBadge}
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
            selectedMode={gameMode}
            onSelectMode={(mode: GameMode) => setGameMode(mode)}
            selectedGeneration={generation}
            onSelectGeneration={(gen: Generation) => setGeneration(gen)}
            onStartGame={handleStartGame}
            onOpenPokedex={handleOpenPokedex}
            bestScores={bestScores}
            capturedCount={totalCaptured}
          />
        ) : (
          <>
            <Scoreboard
              moves={moves}
              matches={matches}
              totalPairs={totalPairs}
              timeSeconds={timeSeconds}
              score={score}
              combo={combo}
              difficulty={difficulty}
              gameMode={gameMode}
              bestScore={currentBestScore}
              isMuted={isMuted}
              onToggleSound={toggleSound}
              onRestart={() => startNewGame(difficulty, gameMode, generation)}
              onChangeDifficulty={handleOpenDifficultySelector}
              onOpenPokedex={handleOpenPokedex}
            />

            {/* Enquanto os sprites estiverem sendo pré-carregados, exibe o LoadingScreen 8-bit */}
            {isPreloading ? (
              <LoadingScreen />
            ) : (
              <Board
                cards={cards}
                onCardClick={handleCardClick}
                disabled={isChecking || isGameOver}
              />
            )}
          </>
        )}
      </div>

      {/* Rodapé 8-bit com atalho da Pokédex e botão de instalação PWA */}
      <footer className="text-center text-[7px] sm:text-[8px] text-[#1F1D2B]/70 uppercase py-2 flex flex-wrap items-center justify-center gap-2">
        <span>PROJETO PORTFÓLIO • REACT + TAILWIND</span>
        <span>•</span>
        <button
          type="button"
          onClick={handleOpenPokedex}
          className="text-[#3B5BA9] font-bold underline cursor-pointer hover:text-[#D63C3C]"
        >
          POKÉDEX ({totalCaptured}/60)
        </button>
        {installPrompt && (
          <>
            <span>•</span>
            <button
              type="button"
              onClick={handleInstallApp}
              className="text-[#D63C3C] font-bold underline cursor-pointer hover:text-[#3B5BA9]"
            >
              📲 INSTALAR APP
            </button>
          </>
        )}
      </footer>

      {/* Modal de Fim de Jogo (Vitória ou Derrota por Tempo) */}
      <GameOver
        isOpen={isGameOver}
        isWon={isWon}
        isTimeOut={isTimeOut}
        moves={moves}
        timeSeconds={timeSeconds}
        score={score}
        maxCombo={maxCombo}
        gameMode={gameMode}
        isNewRecord={isNewRecord}
        onRestart={() => startNewGame(difficulty, gameMode, generation)}
        onChangeDifficulty={handleOpenDifficultySelector}
        onOpenPokedex={handleOpenPokedex}
      />

      {/* Modal Colecionável da Pokédex Retrô */}
      <PokedexModal
        isOpen={isPokedexOpen}
        onClose={handleClosePokedex}
        pokedex={pokedex}
      />
    </main>
  );
}
