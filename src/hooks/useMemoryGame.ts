// Hook useMemoryGame: Com pré-carregamento com new Image(), timeout de 5s e proteção contra desmontagem
import { useState, useEffect, useCallback, useRef } from 'react';
import { CardItem, Difficulty, BestScore, BestScoresRecord } from '../types/game';
import { generateDeckByDifficulty, DIFFICULTY_CONFIGS } from '../data/cards';
import { loadBestScores, saveBestScoreIfBetter } from '../utils/storage';

export function useMemoryGame(initialDifficulty: Difficulty = 'medium') {
  // 1. Dificuldade atual
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);

  // 2. Cartas do tabuleiro
  const [cards, setCards] = useState<CardItem[]>(() =>
    generateDeckByDifficulty(initialDifficulty)
  );

  // 3. Estado de pré-carregamento de imagens
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  // 4. Cartas selecionadas na rodada
  const [firstChoice, setFirstChoice] = useState<CardItem | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardItem | null>(null);

  // 5. Trava do sistema durante a comparação
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // 6. Placar
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);

  // 7. Cronômetro
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);

  // 8. Recordes e persistência
  const [bestScores, setBestScores] = useState<BestScoresRecord>(() => loadBestScores());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Ref de controle para garantir que a vitória só seja salva uma única vez por partida
  const hasSavedRecordRef = useRef<boolean>(false);

  // Total de pares da dificuldade selecionada
  const totalPairs = DIFFICULTY_CONFIGS[difficulty].pairsCount;

  // Derivação pura do fim do jogo (evita estado redundante)
  const isGameOver = matches === totalPairs && totalPairs > 0;

  // Recorde atual do nível selecionado
  const currentBestScore: BestScore | undefined = bestScores[difficulty];

  // Inicia ou reinicia uma partida
  const startNewGame = useCallback((targetDifficulty?: Difficulty) => {
    const nextDiff = targetDifficulty ?? difficulty;
    setDifficulty(nextDiff);
    setIsPreloading(true);
    setCards(generateDeckByDifficulty(nextDiff));
    setFirstChoice(null);
    setSecondChoice(null);
    setIsChecking(false);
    setMoves(0);
    setMatches(0);
    setTimeSeconds(0);
    setIsTimerRunning(false);
    setIsNewRecord(false);
    hasSavedRecordRef.current = false;
    setBestScores(loadBestScores());
  }, [difficulty]);

  // EFEITO DE PRÉ-CARREGAMENTO DOS SPRITES COM new Image()
  useEffect(() => {
    let isCancelled = false;
    setIsPreloading(true);

    // Obtém as URLs únicas dos sprites das cartas sorteadas
    const uniqueSpriteUrls = Array.from(new Set(cards.map((card) => card.spriteUrl)));

    // Timeout de segurança estrito de 5 segundos para nunca bloquear o usuário
    const safetyTimeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        setIsPreloading(false);
      }
    }, 5000);

    // Cria uma Promise para cada imagem usando a API nativa new Image()
    const loadPromises = uniqueSpriteUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        // Sucesso: imagem carregada e pronta em cache
        img.onload = () => resolve();
        // Falha: resolve mesmo assim para não travar (a carta usará fallback de texto)
        img.onerror = () => resolve();
      });
    });

    // Quando todas as imagens terminarem de carregar (ou falharem)
    Promise.all(loadPromises).then(() => {
      if (!isCancelled) {
        window.clearTimeout(safetyTimeoutId);
        setIsPreloading(false);
      }
    });

    // FUNÇÃO DE LIMPEZA (CLEANUP):
    // Se o componente for desmontado ou uma nova partida começar enquanto as imagens
    // ainda estiverem baixando, isCancelled vira true e o timeout é cancelado.
    // Isso impede qualquer tentativa de chamar setIsPreloading() em um componente desmontado!
    return () => {
      isCancelled = true;
      window.clearTimeout(safetyTimeoutId);
    };
  }, [cards]);

  // Manipulador de clique nas cartas
  const handleCardClick = (clickedCard: CardItem) => {
    // Não permite cliques durante pré-carregamento ou checagem
    if (isPreloading || isChecking) return;
    if (firstChoice !== null && secondChoice !== null) return;
    if (clickedCard.isFlipped || clickedCard.isMatched) return;
    if (firstChoice && firstChoice.id === clickedCard.id) return;

    if (!isTimerRunning && !isGameOver) {
      setIsTimerRunning(true);
    }

    setCards((prevCards) =>
      prevCards.map((card) =>
        card.id === clickedCard.id ? { ...card, isFlipped: true } : card
      )
    );

    if (!firstChoice) {
      setFirstChoice(clickedCard);
    } else {
      setSecondChoice(clickedCard);
    }
  };

  // Efeito do Timer
  useEffect(() => {
    if (!isTimerRunning || isGameOver) return;

    const intervalId = window.setInterval(() => {
      setTimeSeconds((prev) => prev + 1);
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerRunning, isGameOver]);

  // Efeito de Comparação das Cartas
  useEffect(() => {
    if (!firstChoice || !secondChoice) return;

    setIsChecking(true);
    setMoves((prev) => prev + 1);

    if (firstChoice.pokemonId === secondChoice.pokemonId) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstChoice.id || card.id === secondChoice.id
            ? { ...card, isMatched: true, isFlipped: true }
            : card
        )
      );
      setMatches((prev) => prev + 1);
      setFirstChoice(null);
      setSecondChoice(null);
      setIsChecking(false);
    } else {
      const timer = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstChoice.id || card.id === secondChoice.id
              ? { ...card, isFlipped: false }
              : card
          )
        );
        setFirstChoice(null);
        setSecondChoice(null);
        setIsChecking(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [firstChoice, secondChoice]);

  // Efeito de Fim de Jogo e Salvamento de Recorde
  useEffect(() => {
    if (isGameOver && !hasSavedRecordRef.current) {
      hasSavedRecordRef.current = true;
      setIsTimerRunning(false);

      const result = saveBestScoreIfBetter(difficulty, {
        moves,
        timeSeconds,
      });

      if (result.recordUpdated) {
        setIsNewRecord(true);
        setBestScores(result.scores);
      }
    }
  }, [isGameOver, difficulty, moves, timeSeconds]);

  return {
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
  };
}
