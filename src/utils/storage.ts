// Utilitários para persistência no localStorage, Pokédex e formatação de tempo
import {
  Difficulty,
  GameMode,
  Generation,
  BestScore,
  BestScoresRecord,
  PokedexRecord,
  PokemonType,
} from '../types/game';

const STORAGE_KEY = 'poke_memory_best_scores_v2';
const POKEDEX_STORAGE_KEY = 'poke_memory_pokedex_v1';
const LEGACY_STORAGE_KEY = 'jungle_memory_best_scores_v1';

// Formata segundos para o padrão mm:ss (ex: 65s -> 01:05)
export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, Math.floor(seconds));
  const mins = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function getScoreKey(mode: GameMode, generation: Generation, difficulty: Difficulty): string {
  return `${mode}_${generation}_${difficulty}`;
}

// Carrega os recordes do localStorage de forma segura
export function loadBestScores(): BestScoresRecord {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }

    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data) as BestScoresRecord;
    }

    const legacy = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacy) {
      const parsedLegacy = JSON.parse(legacy) as Record<string, { moves: number; timeSeconds: number }>;
      const migrated: BestScoresRecord = {};
      Object.entries(parsedLegacy).forEach(([diff, val]) => {
        const key = getScoreKey('classic', 'kanto', diff as Difficulty);
        migrated[key] = {
          moves: val.moves,
          timeSeconds: val.timeSeconds,
          score: Math.max(0, 1000 - val.moves * 25 - val.timeSeconds * 5),
        };
      });
      return migrated;
    }

    return {};
  } catch (error) {
    console.warn('Não foi possível ler do localStorage:', error);
    return {};
  }
}

// Salva o melhor resultado se for superior ao anterior
export function saveBestScoreIfBetter(
  key: string,
  newScore: BestScore
): { recordUpdated: boolean; scores: BestScoresRecord } {
  try {
    const currentScores = loadBestScores();
    const currentBest = currentScores[key];

    let isBetter = false;

    if (!currentBest) {
      isBetter = true;
    } else if (newScore.score > currentBest.score) {
      isBetter = true;
    } else if (newScore.score === currentBest.score && newScore.moves < currentBest.moves) {
      isBetter = true;
    }

    if (isBetter) {
      const updatedScores: BestScoresRecord = {
        ...currentScores,
        [key]: newScore,
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

// ============================================================================
// Pokédex: Carregamento e Registro de Capturas
// ============================================================================
export function loadPokedex(): PokedexRecord {
  try {
    if (typeof window === 'undefined' || !window.localStorage) {
      return {};
    }
    const data = localStorage.getItem(POKEDEX_STORAGE_KEY);
    if (!data) return {};
    return JSON.parse(data) as PokedexRecord;
  } catch (error) {
    console.warn('Não foi possível ler a Pokédex:', error);
    return {};
  }
}

export function registerPokemonCapture(
  pokemonId: number,
  name: string,
  type: PokemonType,
  generation: Generation
): { isFirstCapture: boolean; pokedex: PokedexRecord } {
  try {
    const pokedex = loadPokedex();
    const existing = pokedex[pokemonId];
    const isFirstCapture = !existing;

    const updatedEntry = {
      pokemonId,
      name,
      type,
      generation,
      capturedCount: (existing?.capturedCount ?? 0) + 1,
      firstCapturedAt: existing?.firstCapturedAt ?? new Date().toISOString(),
    };

    const updatedPokedex: PokedexRecord = {
      ...pokedex,
      [pokemonId]: updatedEntry,
    };

    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem(POKEDEX_STORAGE_KEY, JSON.stringify(updatedPokedex));
    }

    return { isFirstCapture, pokedex: updatedPokedex };
  } catch (error) {
    console.warn('Não foi possível salvar na Pokédex:', error);
    return { isFirstCapture: false, pokedex: {} };
  }
}
