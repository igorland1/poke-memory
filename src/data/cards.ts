// Catálogo de Pokémon das 3 Gerações clássicas e gerador de baralhos
import {
  PokemonCard,
  CardItem,
  Difficulty,
  DifficultyConfig,
  Generation,
  GenerationConfig,
  PokemonType,
  TypeVisualInfo,
} from '../types/game';

// Base URL oficial do repositório da PokeAPI para sprites pixel art estilo GBA / FireRed / Emerald
const SPRITE_BASE_URL =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-iii/emerald';

export function getPokemonSpriteUrl(pokemonId: number): string {
  return `${SPRITE_BASE_URL}/${pokemonId}.png`;
}

// Configurações visuais dos Tipos Elementais retrô
export const TYPE_INFO: Record<PokemonType, TypeVisualInfo> = {
  grass: { name: 'PLANTA', badge: '🌿', bgColor: '#4E8234', textColor: '#F8F8F0', borderHex: '#4E8234' },
  fire: { name: 'FOGO', badge: '🔥', bgColor: '#C03028', textColor: '#F8F8F0', borderHex: '#C03028' },
  water: { name: 'ÁGUA', badge: '💧', bgColor: '#3B5BA9', textColor: '#F8F8F0', borderHex: '#3B5BA9' },
  electric: { name: 'ELÉTRICO', badge: '⚡', bgColor: '#D4A017', textColor: '#1F1D2B', borderHex: '#D4A017' },
  bug: { name: 'INSETO', badge: '🐛', bgColor: '#728A25', textColor: '#F8F8F0', borderHex: '#728A25' },
  normal: { name: 'NORMAL', badge: '⚪', bgColor: '#7D7A73', textColor: '#F8F8F0', borderHex: '#7D7A73' },
  poison: { name: 'VENENO', badge: '☠️', bgColor: '#7D3B7D', textColor: '#F8F8F0', borderHex: '#7D3B7D' },
  psychic: { name: 'PSÍQUICO', badge: '👁️', bgColor: '#D13B62', textColor: '#F8F8F0', borderHex: '#D13B62' },
  fighting: { name: 'LUTADOR', badge: '🥊', bgColor: '#962A1E', textColor: '#F8F8F0', borderHex: '#962A1E' },
  rock: { name: 'PEDRA', badge: '🪨', bgColor: '#8D7B2B', textColor: '#F8F8F0', borderHex: '#8D7B2B' },
  ground: { name: 'TERRA', badge: '🏜️', bgColor: '#B89B48', textColor: '#1F1D2B', borderHex: '#B89B48' },
  ghost: { name: 'FANTASMA', badge: '👻', bgColor: '#4D436D', textColor: '#F8F8F0', borderHex: '#4D436D' },
  ice: { name: 'GELO', badge: '❄️', bgColor: '#5EA8A8', textColor: '#1F1D2B', borderHex: '#5EA8A8' },
  dragon: { name: 'DRAGÃO', badge: '🐉', bgColor: '#4A28B3', textColor: '#F8F8F0', borderHex: '#4A28B3' },
};

// Configurações das Gerações
export const GENERATION_CONFIGS: Record<Generation, GenerationConfig> = {
  kanto: {
    id: 'kanto',
    label: 'Gen 1',
    region: 'Kanto',
    badge: 'EDIÇÃO KANTO',
  },
  johto: {
    id: 'johto',
    label: 'Gen 2',
    region: 'Johto',
    badge: 'EDIÇÃO JOHTO',
  },
  hoenn: {
    id: 'hoenn',
    label: 'Gen 3',
    region: 'Hoenn',
    badge: 'EDIÇÃO HOENN',
  },
};

// 20 Pokémon icônicos de Kanto (Gen 1)
export const KANTO_POKEMON: PokemonCard[] = [
  { id: 1, name: 'Bulbasaur', type: 'grass' },
  { id: 4, name: 'Charmander', type: 'fire' },
  { id: 7, name: 'Squirtle', type: 'water' },
  { id: 10, name: 'Caterpie', type: 'bug' },
  { id: 16, name: 'Pidgey', type: 'normal' },
  { id: 25, name: 'Pikachu', type: 'electric' },
  { id: 37, name: 'Vulpix', type: 'fire' },
  { id: 39, name: 'Jigglypuff', type: 'normal' },
  { id: 41, name: 'Zubat', type: 'poison' },
  { id: 43, name: 'Oddish', type: 'grass' },
  { id: 52, name: 'Meowth', type: 'normal' },
  { id: 54, name: 'Psyduck', type: 'water' },
  { id: 58, name: 'Growlithe', type: 'fire' },
  { id: 63, name: 'Abra', type: 'psychic' },
  { id: 66, name: 'Machop', type: 'fighting' },
  { id: 74, name: 'Geodude', type: 'rock' },
  { id: 92, name: 'Gastly', type: 'ghost' },
  { id: 104, name: 'Cubone', type: 'ground' },
  { id: 129, name: 'Magikarp', type: 'water' },
  { id: 133, name: 'Eevee', type: 'normal' },
];

// 20 Pokémon icônicos de Johto (Gen 2)
export const JOHTO_POKEMON: PokemonCard[] = [
  { id: 152, name: 'Chikorita', type: 'grass' },
  { id: 155, name: 'Cyndaquil', type: 'fire' },
  { id: 158, name: 'Totodile', type: 'water' },
  { id: 161, name: 'Sentret', type: 'normal' },
  { id: 165, name: 'Ledyba', type: 'bug' },
  { id: 172, name: 'Pichu', type: 'electric' },
  { id: 175, name: 'Togepi', type: 'normal' },
  { id: 179, name: 'Mareep', type: 'electric' },
  { id: 183, name: 'Marill', type: 'water' },
  { id: 185, name: 'Sudowoodo', type: 'rock' },
  { id: 194, name: 'Wooper', type: 'water' },
  { id: 196, name: 'Espeon', type: 'psychic' },
  { id: 197, name: 'Umbreon', type: 'ghost' },
  { id: 202, name: 'Wobbuffet', type: 'psychic' },
  { id: 215, name: 'Sneasel', type: 'ice' },
  { id: 216, name: 'Teddiursa', type: 'normal' },
  { id: 220, name: 'Swinub', type: 'ice' },
  { id: 231, name: 'Phanpy', type: 'ground' },
  { id: 246, name: 'Larvitar', type: 'rock' },
  { id: 249, name: 'Lugia', type: 'psychic' },
];

// 20 Pokémon icônicos de Hoenn (Gen 3)
export const HOENN_POKEMON: PokemonCard[] = [
  { id: 252, name: 'Treecko', type: 'grass' },
  { id: 255, name: 'Torchic', type: 'fire' },
  { id: 258, name: 'Mudkip', type: 'water' },
  { id: 263, name: 'Zigzagoon', type: 'normal' },
  { id: 270, name: 'Lotad', type: 'water' },
  { id: 280, name: 'Ralts', type: 'psychic' },
  { id: 285, name: 'Shroomish', type: 'grass' },
  { id: 300, name: 'Skitty', type: 'normal' },
  { id: 304, name: 'Aron', type: 'rock' },
  { id: 311, name: 'Plusle', type: 'electric' },
  { id: 312, name: 'Minun', type: 'electric' },
  { id: 316, name: 'Gulpin', type: 'poison' },
  { id: 320, name: 'Wailmer', type: 'water' },
  { id: 324, name: 'Torkoal', type: 'fire' },
  { id: 327, name: 'Spinda', type: 'normal' },
  { id: 328, name: 'Trapinch', type: 'ground' },
  { id: 333, name: 'Swablu', type: 'normal' },
  { id: 349, name: 'Feebas', type: 'water' },
  { id: 359, name: 'Absol', type: 'ghost' },
  { id: 384, name: 'Rayquaza', type: 'dragon' },
];

export const POKEMON_BY_GENERATION: Record<Generation, PokemonCard[]> = {
  kanto: KANTO_POKEMON,
  johto: JOHTO_POKEMON,
  hoenn: HOENN_POKEMON,
};

// Configurações dos 3 níveis de dificuldade
export const DIFFICULTY_CONFIGS: Record<Difficulty, DifficultyConfig> = {
  easy: {
    id: 'easy',
    label: 'Fácil',
    pairsCount: 6, // 12 cartas
    description: '6 pares • Treinador Iniciante',
    timeLimitSeconds: 45,
  },
  medium: {
    id: 'medium',
    label: 'Médio',
    pairsCount: 8, // 16 cartas
    description: '8 pares • Líder de Ginásio',
    timeLimitSeconds: 60,
  },
  hard: {
    id: 'hard',
    label: 'Difícil',
    pairsCount: 10, // 20 cartas
    description: '10 pares • Mestre Pokémon',
    timeLimitSeconds: 75,
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
 * Gera o baralho embaralhado para a dificuldade e geração selecionadas
 * Com 10% de chance de spawnar uma carta especial: DITTO (Wildcard Coringa)!
 */
export function generateDeck(difficulty: Difficulty, generation: Generation): CardItem[] {
  const config = DIFFICULTY_CONFIGS[difficulty];
  const pool = POKEMON_BY_GENERATION[generation] || KANTO_POKEMON;

  // 1. Embaralha a lista completa de 20 Pokémon da geração
  const shuffledPool = shuffleArray(pool);

  // 2. Sorteia N Pokémon aleatórios para a partida atual (6, 8 ou 10)
  const selectedPokemon = shuffledPool.slice(0, config.pairsCount);

  // 10% de chance de ativar evento raro: Ditto Wildcard em um dos pares
  const hasDitto = Math.random() < 0.12;
  const dittoPairIndex = hasDitto ? Math.floor(Math.random() * selectedPokemon.length) : -1;

  const deck: CardItem[] = [];
  let idCounter = 1;

  // 3. Duplica cada Pokémon sorteado para formar os pares
  selectedPokemon.forEach((pokemon, index) => {
    const spriteUrl = getPokemonSpriteUrl(pokemon.id);

    // Se for o par sorteado para o Ditto, a segunda carta é o Ditto (ID 132)
    const isThisDitto = index === dittoPairIndex;

    // Primeira carta do par
    deck.push({
      id: idCounter++,
      pokemonId: pokemon.id,
      name: pokemon.name,
      type: pokemon.type,
      spriteUrl,
      isFlipped: false,
      isMatched: false,
    });

    // Segunda carta do par
    if (isThisDitto) {
      deck.push({
        id: idCounter++,
        pokemonId: pokemon.id, // herda para validar match
        name: 'Ditto',
        type: 'normal',
        spriteUrl: getPokemonSpriteUrl(132), // Ditto oficial
        isFlipped: false,
        isMatched: false,
        isWildcard: true,
      });
    } else {
      deck.push({
        id: idCounter++,
        pokemonId: pokemon.id,
        name: pokemon.name,
        type: pokemon.type,
        spriteUrl,
        isFlipped: false,
        isMatched: false,
      });
    }
  });

  // 4. Embaralha as cartas finais no tabuleiro
  return shuffleArray(deck);
}
