// Utilitários para persistência no localStorage e formatação de tempo
import { Difficulty, BestScore, BestScoresRecord } from '../types/game';

const STORAGE_KEY = 'jungle_memory_best_scores_v1';

// Formata segundos para o padrão mm:ss (ex: 65s -> 01:05)
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// Carrega os recordes do localStorage de forma segura
export function loadBestScores(): BestScoresRecord {
  try {
    // Verifica se o localStorage está disponível no navegador
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return {};

    return JSON.parse(data) as BestScoresRecord;
  } catch (error) {
    // Trata bloqueio de cookies/storage no modo anônimo ou cotas esgotadas
    console.warn('Não foi possível ler do localStorage:', error);
    return {};
  }
}

// Salva o melhor resultado para a dificuldade atual, se for superior ao anterior
// Regra: Vence quem tiver MENOS jogadas; em caso de empate de jogadas, MENOR tempo.
export function saveBestScoreIfBetter(
  difficulty: Difficulty,
  newScore: BestScore
): { recordUpdated: boolean; scores: BestScoresRecord } {
  try {
    const currentScores = loadBestScores();
    const currentBest = currentScores[difficulty];

    let isBetter = false;

    if (!currentBest) {
      // Primeiro resultado registrado para este nível
      isBetter = true;
    } else if (newScore.moves < currentBest.moves) {
      // Menos jogadas = melhor resultado
      isBetter = true;
    } else if (newScore.moves === currentBest.moves && newScore.timeSeconds < currentBest.timeSeconds) {
      // Empate nas jogadas, mas foi mais rápido
      isBetter = true;
    }

    if (isBetter) {
      const updatedScores: BestScoresRecord = {
        ...currentScores,
        [difficulty]: newScore,
      };

      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedScores));
      }

      return { recordUpdated: true, scores: updatedScores };
    }

    return { recordUpdated: false, scores: currentScores };
  } catch (error) {
    console.warn('Não foi possível salvar no localStorage:', error);
    return { recordUpdated: false, scores: {} };
  }
}
