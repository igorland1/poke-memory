// Hook useMemoryGame: Corrigido com gameId e cardsRef para evitar re-execução indevida do pré-carregamento
import { useState, useEffect, useCallback, useRef } from 'react';
import { CardItem, Difficulty, BestScore, BestScoresRecord } from '../types/game';
import { generateDeckByDifficulty, DIFFICULTY_CONFIGS } from '../data/cards';
import { loadBestScores, saveBestScoreIfBetter } from '../utils/storage';

export function useMemoryGame(initialDifficulty: Difficulty = 'medium') {
  // 1. Dificuldade atual
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);

  // 2. Identificador único de cada partida iniciada (usado para disparar o pré-carregamento)
  const [gameId, setGameId] = useState<number>(0);

  // 3. Cartas do tabuleiro
  const [cards, setCards] = useState<CardItem[]>(() =>
    generateDeckByDifficulty(initialDifficulty)
  );

  // Ref para ler as cartas no pré-carregamento sem precisar colocar 'cards' no array de dependências
  const cardsRef = useRef<CardItem[]>(cards);
  cardsRef.current = cards;

  // 4. Estado de pré-carregamento de imagens (só fica true no início de uma nova partida)
  const [isPreloading, setIsPreloading] = useState<boolean>(true);

  // 5. Cartas selecionadas na rodada
  const [firstChoice, setFirstChoice] = useState<CardItem | null>(null);
  const [secondChoice, setSecondChoice] = useState<CardItem | null>(null);

  // 6. Trava do sistema durante a comparação
  const [isChecking, setIsChecking] = useState<boolean>(false);

  // 7. Placar
  const [moves, setMoves] = useState<number>(0);
  const [matches, setMatches] = useState<number>(0);

  // 8. Cronômetro
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timeSeconds, setTimeSeconds] = useState<number>(0);

  // 9. Recordes e persistência
  const [bestScores, setBestScores] = useState<BestScoresRecord>(() => loadBestScores());
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  // Ref de controle para salvar o recorde uma única vez por vitória
  const hasSavedRecordRef = useRef<boolean>(false);

  // Total de pares da dificuldade selecionada
  const totalPairs = DIFFICULTY_CONFIGS[difficulty].pairsCount;

  // Derivação pura do fim do jogo
  const isGameOver = matches === totalPairs && totalPairs > 0;

  // Recorde atual do nível selecionado
  const currentBestScore: BestScore | undefined = bestScores[difficulty];

  // Inicia ou reinicia uma partida
  const startNewGame = useCallback((targetDifficulty?: Difficulty) => {
    const nextDiff = targetDifficulty ?? difficulty;
    const newDeck = generateDeckByDifficulty(nextDiff);

    // Atualiza a ref e o estado com o novo baralho
    cardsRef.current = newDeck;
    setDifficulty(nextDiff);
    setCards(newDeck);

    // Incrementa gameId: este é o ÚNICO gatilho que ativa o pré-carregamento
    setGameId((prev) => prev + 1);

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

  // EFEITO DE PRÉ-CARREGAMENTO: Depende EXCLUSIVAMENTE de [gameId]
  // Não depende de 'cards', garantindo que virar cartas NUNCA reative o loading!
  useEffect(() => {
    let isCancelled = false;
    setIsPreloading(true);

    // Lê as cartas da partida atual através da ref estável
    const currentCards = cardsRef.current;
    const uniqueSpriteUrls = Array.from(new Set(currentCards.map((card) => card.spriteUrl)));

    // Timeout de segurança estrito de 5 segundos
    const safetyTimeoutId = window.setTimeout(() => {
      if (!isCancelled) {
        setIsPreloading(false);
      }
    }, 5000);

    // Pré-carrega cada imagem usando new Image()
    const loadPromises = uniqueSpriteUrls.map((url) => {
      return new Promise<void>((resolve) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Falha graciosa (carta usará fallback de texto)
      });
    });

    // Quando todas as imagens terminarem
    Promise.all(loadPromises).then(() => {
      if (!isCancelled) {
        window.clearTimeout(safetyTimeoutId);
        setIsPreloading(false);
      }
    });

    // Limpeza mandatória contra memory leak
    return () => {
      isCancelled = true;
      window.clearTimeout(safetyTimeoutId);
    };
  }, [gameId]); // <--- Dependência cirúrgica: só roda ao iniciar nova partida!

  // Manipulador de clique nas cartas
  const handleCardClick = (clickedCard: CardItem) => {
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
