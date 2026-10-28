// Definição dos tipos de dados para o Jogo da Memória Pokémon
export type Difficulty = 'easy' | 'medium' | 'hard';
export type GameMode = 'classic' | 'timeAttack' | 'memoryFlash';
export type Generation = 'kanto' | 'johto' | 'hoenn';

// Tipos elementais de Pokémon
export type PokemonType =
  | 'grass'
  | 'fire'
  | 'water'
  | 'bug'
  | 'normal'
  | 'electric'
  | 'poison'
  | 'psychic'
  | 'fighting'
  | 'rock'
  | 'ground'
  | 'ghost'
  | 'ice'
  | 'dragon';

export interface TypeVisualInfo {
  name: string;
  badge: string;
  bgColor: string;     // Fundo da etiqueta (Tailwind hex)
  textColor: string;   // Texto da etiqueta
  borderHex: string;   // Cor para realce retrô
}

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  pairsCount: number; // 6, 8 ou 10 pares
  description: string;
  timeLimitSeconds: number; // Limite para o modo Time Attack
}

export interface GenerationConfig {
  id: Generation;
  label: string;
  region: string;
  badge: string;
}

export interface BestScore {
  moves: number;
  timeSeconds: number;
  score: number;
}

export type BestScoresRecord = Record<string, BestScore | undefined>;

// Registro de cada Pokémon capturado na Pokédex
export interface PokedexEntry {
  pokemonId: number;
  name: string;
  type: PokemonType;
  generation: Generation;
  capturedCount: number;
  firstCapturedAt: string;
}

export type PokedexRecord = Record<number, PokedexEntry | undefined>;

// Contrato básico do Pokémon com tipo elemental
export interface PokemonCard {
  id: number;
  name: string;
  type: PokemonType;
}

// Representação de uma carta no tabuleiro
export interface CardItem {
  id: number;         // ID único da carta no tabuleiro (1 a N)
  pokemonId: number;  // ID do Pokémon para validar o par correspondente
  name: string;       // Nome do Pokémon
  type: PokemonType;  // Tipo elemental
  spriteUrl: string;  // URL do sprite oficial pixel art
  isFlipped: boolean; // Se a carta está virada no turno atual
  isMatched: boolean; // Se o par já foi encontrado e resolvido
  isWrong?: boolean;  // Carta recém-comparada que errou (gatilho para shake)
  isJustMatched?: boolean; // Carta recém-encontrada com sucesso (gatilho para pop)
  isWildcard?: boolean; // Carta especial: Ditto (combina com qualquer Pokémon!)
}
