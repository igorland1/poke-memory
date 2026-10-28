// Sistema de Internacionalização leve (PT-BR / EN) sem dependências externas
export type Language = 'pt' | 'en';

export interface Translations {
  // Cabeçalho e Rodapé
  editionKanto: string;
  editionJohto: string;
  editionHoenn: string;
  footerText: string;
  pokedexShortcut: string;
  installApp: string;

  // Tela Inicial
  regionLabel: string;
  gameModeLabel: string;
  difficultyLabel: string;
  classicMode: string;
  classicDesc: string;
  timeAttackMode: string;
  timeAttackDesc: string;
  memoryFlashMode: string;
  memoryFlashDesc: string;
  pairsCount: string;
  currentRecord: string;
  noRecord: string;
  startGame: string;
  openPokedex: string;

  // Dificuldades
  diffEasy: string;
  diffEasyDesc: string;
  diffMedium: string;
  diffMediumDesc: string;
  diffHard: string;
  diffHardDesc: string;

  // Placar (Scoreboard)
  level: string;
  record: string;
  score: string;
  combo: string;
  noCombo: string;
  moves: string;
  pairs: string;
  time: string;
  timeRemaining: string;
  restartTitle: string;
  muteBgm: string;
  unmuteBgm: string;
  muteSfx: string;
  unmuteSfx: string;
  viewPokedex: string;

  // Loading
  loading: string;
  preparingSprites: string;

  // GameOver
  pokemonMaster: string;
  allPairsCaught: string;
  timeOutTitle: string;
  timeOutDesc: string;
  newRecordBadge: string;
  maxCombo: string;
  playAgain: string;
  tryAgain: string;
  mainMenu: string;
  shareVictory: string;
  copied: string;
  shareTitle: string;
  shareBeatRecord: string;

  // Pokédex
  pokedexTitle: string;
  totalProgress: string;
  regionalCatch: string;
  foundOf: string;
  backToGame: string;
  unknownPokemon: string;

  // Tipos
  types: Record<string, string>;
  wildcard: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  pt: {
    editionKanto: 'EDIÇÃO KANTO',
    editionJohto: 'EDIÇÃO JOHTO',
    editionHoenn: 'EDIÇÃO HOENN',
    footerText: 'PROJETO PORTFÓLIO • REACT + TAILWIND',
    pokedexShortcut: 'POKÉDEX',
    installApp: 'INSTALAR APP',

    regionLabel: 'REGIÃO / GERAÇÃO',
    gameModeLabel: 'MODO DE JOGO',
    difficultyLabel: 'DIFICULDADE',
    classicMode: 'CLÁSSICO',
    classicDesc: 'Sem pressa',
    timeAttackMode: 'TEMPO',
    timeAttackDesc: 'Corrida',
    memoryFlashMode: 'FLASH',
    memoryFlashDesc: 'Espia 2s',
    pairsCount: 'PARES',
    currentRecord: 'RECORDE ATUAL:',
    noRecord: 'NENHUM RECORDE',
    startGame: 'COMEÇAR JOGO',
    openPokedex: 'ABRIR POKÉDEX',

    diffEasy: 'Fácil',
    diffEasyDesc: '6 pares • Treinador Iniciante',
    diffMedium: 'Médio',
    diffMediumDesc: '8 pares • Líder de Ginásio',
    diffHard: 'Difícil',
    diffHardDesc: '10 pares • Mestre Pokémon',

    level: 'NÍVEL',
    record: 'RECORDE',
    score: 'SCORE',
    combo: 'COMBO',
    noCombo: 'SEM COMBO',
    moves: 'JOGADAS',
    pairs: 'PARES',
    time: 'TEMPO',
    timeRemaining: 'TEMPO REST.',
    restartTitle: 'Reiniciar partida',
    muteBgm: 'Desativar música',
    unmuteBgm: 'Ativar música',
    muteSfx: 'Desativar efeitos sonoros',
    unmuteSfx: 'Ativar efeitos sonoros',
    viewPokedex: 'Ver Pokédex',

    loading: 'CARREGANDO',
    preparingSprites: 'PREPARANDO SPRITES POKÉMON',

    pokemonMaster: 'MESTRE POKÉMON!',
    allPairsCaught: 'Você capturou todos os pares!',
    timeOutTitle: 'TEMPO ESGOTADO!',
    timeOutDesc: 'O tempo acabou antes de capturar todos!',
    newRecordBadge: '★ NOVO RECORDE ★',
    maxCombo: 'MAX COMBO',
    playAgain: 'JOGAR DE NOVO',
    tryAgain: 'TENTAR DE NOVO',
    mainMenu: 'MENU PRINCIPAL',
    shareVictory: '📤 COMPARTILHAR VITÓRIA',
    copied: '✓ COPIADO!',
    shareTitle: '🎮 PIXEL MEMORY — Vitória Pokémon! 🏆',
    shareBeatRecord: 'Consegue bater meu recorde?',

    pokedexTitle: 'POKÉDEX RETRÔ',
    totalProgress: 'PROGRESSO TOTAL:',
    regionalCatch: 'CAPTURA REGIONAL:',
    foundOf: 'ENCONTRADOS',
    backToGame: 'VOLTAR AO JOGO',
    unknownPokemon: 'Pokémon desconhecido',

    types: {
      grass: 'PLANTA',
      fire: 'FOGO',
      water: 'ÁGUA',
      electric: 'ELÉTRICO',
      bug: 'INSETO',
      normal: 'NORMAL',
      poison: 'VENENO',
      psychic: 'PSÍQUICO',
      fighting: 'LUTADOR',
      rock: 'PEDRA',
      ground: 'TERRA',
      ghost: 'FANTASMA',
      ice: 'GELO',
      dragon: 'DRAGÃO',
    },
    wildcard: 'CORINGA',
  },
  en: {
    editionKanto: 'KANTO EDITION',
    editionJohto: 'JOHTO EDITION',
    editionHoenn: 'HOENN EDITION',
    footerText: 'PORTFOLIO PROJECT • REACT + TAILWIND',
    pokedexShortcut: 'POKÉDEX',
    installApp: 'INSTALL APP',

    regionLabel: 'REGION / GENERATION',
    gameModeLabel: 'GAME MODE',
    difficultyLabel: 'DIFFICULTY',
    classicMode: 'CLASSIC',
    classicDesc: 'No rush',
    timeAttackMode: 'TIME ATTACK',
    timeAttackDesc: 'Speed run',
    memoryFlashMode: 'FLASH',
    memoryFlashDesc: 'Peek 2s',
    pairsCount: 'PAIRS',
    currentRecord: 'CURRENT RECORD:',
    noRecord: 'NO RECORD',
    startGame: 'START GAME',
    openPokedex: 'OPEN POKÉDEX',

    diffEasy: 'Easy',
    diffEasyDesc: '6 pairs • Rookie Trainer',
    diffMedium: 'Medium',
    diffMediumDesc: '8 pairs • Gym Leader',
    diffHard: 'Hard',
    diffHardDesc: '10 pairs • Pokémon Master',

    level: 'LEVEL',
    record: 'RECORD',
    score: 'SCORE',
    combo: 'COMBO',
    noCombo: 'NO COMBO',
    moves: 'MOVES',
    pairs: 'PAIRS',
    time: 'TIME',
    timeRemaining: 'TIME LEFT',
    restartTitle: 'Restart match',
    muteBgm: 'Mute music',
    unmuteBgm: 'Play music',
    muteSfx: 'Mute sound effects',
    unmuteSfx: 'Play sound effects',
    viewPokedex: 'View Pokédex',

    loading: 'LOADING',
    preparingSprites: 'PREPARING POKÉMON SPRITES',

    pokemonMaster: 'POKÉMON MASTER!',
    allPairsCaught: 'You caught all the pairs!',
    timeOutTitle: 'TIME IS UP!',
    timeOutDesc: 'Time ran out before catching them all!',
    newRecordBadge: '★ NEW RECORD ★',
    maxCombo: 'MAX COMBO',
    playAgain: 'PLAY AGAIN',
    tryAgain: 'TRY AGAIN',
    mainMenu: 'MAIN MENU',
    shareVictory: '📤 SHARE VICTORY',
    copied: '✓ COPIED!',
    shareTitle: '🎮 PIXEL MEMORY — Pokémon Victory! 🏆',
    shareBeatRecord: 'Can you beat my record?',

    pokedexTitle: 'RETRO POKÉDEX',
    totalProgress: 'TOTAL PROGRESS:',
    regionalCatch: 'REGIONAL CATCH:',
    foundOf: 'FOUND',
    backToGame: 'BACK TO GAME',
    unknownPokemon: 'Unknown Pokémon',

    types: {
      grass: 'GRASS',
      fire: 'FIRE',
      water: 'WATER',
      electric: 'ELECTRIC',
      bug: 'BUG',
      normal: 'NORMAL',
      poison: 'POISON',
      psychic: 'PSYCHIC',
      fighting: 'FIGHTING',
      rock: 'ROCK',
      ground: 'GROUND',
      ghost: 'GHOST',
      ice: 'ICE',
      dragon: 'DRAGON',
    },
    wildcard: 'WILDCARD',
  },
};
