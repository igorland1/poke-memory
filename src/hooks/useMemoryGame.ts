// Hook useMemoryGame: Suporte a modos de jogo (Classic / Time Attack), 3 Gerações e Sistema de Combos
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  CardItem,
  Difficulty,
  GameMode,
  Generation,
  BestScore,
  BestScoresRecord,
  PokedexRecord,
} from '../types/game';
import { generateDeck, DIFFICULTY_CONFIGS } from '../data/cards';
import {
  loadBestScores,
  saveBestScoreIfBetter,
  getScoreKey,
  loadPokedex,
  registerPokemonCapture,
} from '../utils/storage';
import { sounds } from '../utils/sound';

export function useMemoryGame(
  initialDifficulty: Difficulty = 'medium',
  initialMode: GameMode = 'classic',
  initialGeneration: Generation = 'kanto'
) {
  // 1. Configurações da partida
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [gameMode, setGameMode] = useState<GameMode>(initialMode);
  const [generation, setGeneration] = useState<Generation>(initialGeneration);

  // 2. Identificador único da partida
  const [gameId, setGameId] = useState<number>(0);

  // 3. Cartas do tabuleiro
  const [cards, setCards] = useState<CardItem[]>(() =>
    generateDeck(initialDifficulty, initialGeneration)
  );

  const cardsRef = useRef<CardItem[]>(cards);
  cardsRef.current = cards;

  // 4. Estados de carregamento e cartas selecionadas
  const [isPreloading, setIsPreloading] = useState<boolean>(true);
  const [firstChoice, setFirstChoice] = useState<CardItem | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardItem | null>(null);
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // 5. Placar e Métricas
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [maxCombo, setMaxCombo] = useState<number>(0);

  // 6. Cronômetro / Tempo
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeSeconds, setTimeSeconds] = useState<number>(() =>
    initialMode === 'timeAttack'
      ? DIFFICULTY_CONFIGS[initialDifficulty].timeLimitSeconds
      : 0
  );
  const [isTimeOut, setIsTimeOut] = useState<boolean>(false);

  // 7. Recordes e Pokédex
  const [bestScores, setBestScores] = useState<BestScoresRecord>(() => loadBestScores());
  const [pokedex, setPokedex] = useState<PokedexRecord>(() => loadPokedex());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(() => sounds.getMuted());

  const hasSavedRecordRef = useRef<boolean>(false);

  // Total de pares
  const totalPairs = DIFFICULTY_CONFIGS[difficulty].pairsCount;

  // Fim de jogo: Vitória ou Derrota por tempo
  const isWon = matches === totalPairs && totalPairs > 0;
  const isGameOver = isWon || isTimeOut;

  // Chave do recorde atual
  const currentKey = getScoreKey(gameMode, generation, difficulty);
  const currentBestScore: BestScore | undefined = bestScores[currentKey];

  // Iniciar / Reiniciar partida
  const startNewGame = useCallback(
    (targetDiff?: Difficulty, targetMode?: GameMode, targetGen?: Generation) => {
      const nextDiff = targetDiff ?? difficulty;
      const nextMode = targetMode ?? gameMode;
      const nextGen = targetGen ?? generation;

      const newDeck = generateDeck(nextDiff, nextGen);
      cardsRef.current = newDeck;

      setDifficulty(nextDiff);
      setGameMode(nextMode);
      setGeneration(nextGen);
      setCards(newDeck);

      // Gatilho de pré-carregamento
      setGameId((prev) => prev + 1);

      setFirstChoice(null);
      setSecondChoice(null);
      setIsChecking(false);
      setMoves(0);
      setMatches(0);
      setScore(0);
      setCombo(0);
      setMaxCombo(0);
      setIsTimeOut(false);
      setTimeSeconds(
        nextMode === 'timeAttack'
          ? DIFFICULTY_CONFIGS[nextDiff].timeLimitSeconds
          : 0
      );
      setIsTimerRunning(false);
      setIsNewRecord(false);
      hasSavedRecordRef.current = false;
      setBestScores(loadBestScores());
    },
    [difficulty, gameMode, generation]
  );

  // Efeito de Pré-carregamento das imagens
  useEffect(() => {
    let isCancelled = false;
    setIsPreloading(true);

    const currentCards = cardsRef.current;
    const uniqueSpriteUrls = Array.from(new Set(currentCards.map((card) => card.spriteUrl)));

    const safetyTimeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        setIsPreloading(false);
      }
    }, 4500);

    const loadPromises = uniqueSpriteUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve();
      });
    });

    Promise.all(loadPromises).then(() => {
      if (!isCancelled) {
        window.clearTimeout(safetyTimeoutId);
        setIsPreloading(false);

        // Se for o modo MEMORY FLASH ("Olho de Águia"): revela todas as cartas por 2.5 segundos!
        if (gameMode === 'memoryFlash') {
          setCards((prev) => prev.map((c) => ({ ...c, isFlipped: true })));
          setIsChecking(true);

          window.setTimeout(() => {
            if (!isCancelled) {
              setCards((prev) => prev.map((c) => ({ ...c, isFlipped: false })));
              setIsChecking(false);
            }
          }, 2400);
        }
      }
    });

    return () => {
      isCancelled = true;
      window.clearTimeout(safetyTimeoutId);
    };
  }, [gameId]);

  // Manipulador de clique nas cartas
  const handleCardClick = useCallback(
    (clickedCard: CardItem) => {
      if (isPreloading || isChecking || isGameOver) return;
      if (firstChoice !== null && secondChoice !== null) return;
      if (clickedCard.isFlipped || clickedCard.isMatched) return;
      if (firstChoice && firstChoice.id === clickedCard.id) return;

      if (!isTimerRunning && !isGameOver) {
        setIsTimerRunning(true);
      }

      sounds.playFlip();

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
    },
    [isPreloading, isChecking, isGameOver, firstChoice, secondChoice, isTimerRunning]
  );

  // Efeito do Timer (Progressivo no Classic, Regressivo no Time Attack)
  useEffect(() => {
    if (!isTimerRunning || isGameOver) return;

    const intervalId = window.setInterval(() => {
      setTimeSeconds((prev) => {
        if (gameMode === 'timeAttack') {
          if (prev <= 1) {
            setIsTimeOut(true);
            setIsTimerRunning(false);
            sounds.playDefeat();
            return 0;
          }
          return prev - 1;
        }
        return prev + 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isTimerRunning, isGameOver, gameMode]);

  // Efeito de Comparação das Cartas
  useEffect(() => {
    if (!firstChoice || !secondChoice) return;

    setIsChecking(true);
    setMoves((prev) => prev + 1);

    // É par se tiverem o mesmo pokemonId OU se uma das cartas for o Ditto (Wildcard)!
    const isMatch =
      firstChoice.pokemonId === secondChoice.pokemonId ||
      firstChoice.isWildcard ||
      secondChoice.isWildcard;

    if (isMatch) {
      const nextCombo = combo + 1;
      setCombo(nextCombo);
      setMaxCombo((prev) => Math.max(prev, nextCombo));

      if (nextCombo > 1) {
        sounds.playCombo(nextCombo);
      } else {
        sounds.playMatch();
      }

      // Pontuação: 100 base + bônus combo multiplicador (Ditto dá 150 extra!)
      const wildcardBonus = firstChoice.isWildcard || secondChoice.isWildcard ? 150 : 0;
      const gainedScore = 100 * nextCombo + wildcardBonus;
      setScore((prev) => prev + gainedScore);

      // Registra captura na Pokédex (se for wildcard, captura a outra carta)
      const targetCard = firstChoice.isWildcard ? secondChoice : firstChoice;
      const captureResult = registerPokemonCapture(
        targetCard.pokemonId,
        targetCard.name,
        targetCard.type,
        generation
      );
      setPokedex(captureResult.pokedex);

      // Bônus no Time Attack: +4 segundos ao acertar
      if (gameMode === 'timeAttack') {
        setTimeSeconds((prev) => prev + 4);
      }

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstChoice.id || card.id === secondChoice.id
            ? { ...card, isMatched: true, isFlipped: true, isJustMatched: true }
            : card
        )
      );
      setMatches((prev) => prev + 1);
      setFirstChoice(null);
      setSecondChoice(null);
      setIsChecking(false);
    } else {
      sounds.playMismatch();
      setCombo(0); // Quebra o combo

      // Penalidade de 25 pontos (sem deixar pontuação negativa)
      setScore((prev) => Math.max(0, prev - 25));

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === firstChoice.id || card.id === secondChoice.id
            ? { ...card, isWrong: true }
            : card
        )
      );

      const timer = setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card) =>
            card.id === firstChoice.id || card.id === secondChoice.id
              ? { ...card, isFlipped: false, isWrong: false }
              : card
          )
        );
        setFirstChoice(null);
        setSecondChoice(null);
        setIsChecking(false);
      }, 850);

      return () => clearTimeout(timer);
    }
  }, [firstChoice, secondChoice, combo, gameMode]);

  // Efeito de Fim de Jogo e Salvamento de Recorde
  useEffect(() => {
    if (isWon && !hasSavedRecordRef.current) {
      hasSavedRecordRef.current = true;
      setIsTimerRunning(false);
      sounds.playVictory();

      // Bônus final de tempo
      const finalScore = score + (gameMode === 'timeAttack' ? timeSeconds * 20 : Math.max(0, 500 - timeSeconds * 5));

      const result = saveBestScoreIfBetter(currentKey, {
        moves,
        timeSeconds,
        score: finalScore,
      });

      if (result.recordUpdated) {
        setIsNewRecord(true);
        setBestScores(result.scores);
      }
    }
  }, [isWon, score, gameMode, timeSeconds, moves, currentKey]);

  const toggleSound = useCallback(() => {
    const nextState = sounds.toggleMute();
    setIsMuted(nextState);
  }, []);

  return {
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
  };
}
