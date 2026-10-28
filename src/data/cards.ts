// Catálogo dos 20 Pokémon da 1ª Geração e gerador de baralhos aleatórios
import { PokemonCard, CardItem, Difficulty, DifficultyConfig } from '../types/game';

// Base URL oficial do repositório da PokeAPI para sprites pixel art (estilo FireRed / LeafGreen)
const SPRITE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/firered-leafgreen';

export function getPokemonSpriteUrl(pokemonId: number): string {
  return `${SPRITE_BASE_URL}/${pokemonId}.png`;
}

// Lista fixa dos 20 Pokémon da 1ª Geração selecionados
export const POKEMON_LIST: PokemonCard[] = [
  { id: 1, name: 'Bulbasaur' },
  { id: 4, name: 'Charmander' },
  { id: 7, name: 'Squirtle' },
  { id: 10, name: 'Caterpie' },
  { id: 16, name: 'Pidgey' },
  { id: 25, name: 'Pikachu' },
  { id: 37, name: 'Vulpix' },
  { id: 39, name: 'Jigglypuff' },
  { id: 41, name: 'Zubat' },
  { id: 43, name: 'Oddish' },
  { id: 52, name: 'Meowth' },
  { id: 54, name: 'Psyduck' },
  { id: 58, name: 'Growlithe' },
  { id: 63, name: 'Abra' },
  { id: 66, name: 'Machop' },
  { id: 74, name: 'Geodude' },
  { id: 92, name: 'Gastly' },
  { id: 104, name: 'Cubone' },
  { id: 129, name: 'Magikarp' },
  { id: 133, name: 'Eevee' },
];

// Configurações dos 3 níveis de dificuldade
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    pairsCount: 6, // 12 cartas
    description: '6 pares • Treinador Iniciante',
  },
  medium: {
    id: 'medium',
    label: 'Médio',
    pairsCount: 8, // 16 cartas
    description: '8 pares • Líder de Ginásio',
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    pairsCount: 10, // 20 cartas
    description: '10 pares • Mestre Pokémon',
  },
};

// Algoritmo Fisher-Yates para embaralhamento uniforme O(n)
export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Gera o baralho embaralhado para a dificuldade:
 * Em vez de pegar sempre os mesmos N Pokémon com slice(0, N),
 * embaralha primeiro a lista de 20 Pokémon para sortear pares diferentes a cada partida!
 */
export function generateDeckByDifficulty(difficulty: Difficulty): CardItem[] {
  const config = DIFFICULTY_CONFIGS[difficulty];

  // 1. Embaralha a lista completa de 20 Pokémon
  const shuffledPool = shuffleArray(POKEMON_LIST);

  // 2. Sorteia N Pokémon aleatórios para a partida atual (6, 8 ou 10)
  const selectedPokemon = shuffledPool.slice(0, config.pairsCount);

  const deck: CardItem[] = [];
  let idCounter = 1;

  // 3. Duplica cada Pokémon sorteado para formar os pares
  selectedPokemon.forEach((pokemon) => {
    const spriteUrl = getPokemonSpriteUrl(pokemon.id);

    // Primeira carta do par
    deck.push({
      id: idCounter++,
      pokemonId: pokemon.id,
      name: pokemon.name,
      spriteUrl,
      isFlipped: false,
      isMatched: false,
    });

    // Segunda carta do par
    deck.push({
      id: idCounter++,
      pokemonId: pokemon.id,
      name: pokemon.name,
      spriteUrl,
      isFlipped: false,
      isMatched: false,
    });
  });

  // 4. Embaralha as cartas finais no tabuleiro
  return shuffleArray(deck);
}
