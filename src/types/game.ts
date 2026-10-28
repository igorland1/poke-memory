// Definição dos tipos de dados para o Jogo da Memória Pokémon
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface DifficultyConfig {
  id: Difficulty;
  label: string;
  pairsCount: number; // 6, 8 ou 10 pares
  description: string;
}

export interface BestScore {
  moves: number;
  timeSeconds: number;
}

export type BestScoresRecord = Partial<Record<Difficulty, BestScore>>;

// Contrato básico do Pokémon
export interface PokemonCard {
  id: number;   // Número da Pokédex (ex: 25 para Pikachu)
  name: string; // Nome do Pokémon
}

// Representação de uma carta no tabuleiro
export interface CardItem {
  id: number;         // ID único da carta no tabuleiro (1 a N)
  pokemonId: number;  // ID do Pokémon para validar o par correspondente
  name: string;       // Nome do Pokémon
  spriteUrl: string;  // URL do sprite oficial pixel art da Gen 3 / FireRed
  isFlipped: boolean; // Se a carta está virada no turno atual
  isMatched: boolean; // Se o par já foi encontrado e resolvido
}
