# 🔴 Pixel Memory — Edição Kanto (8-Bit)

> Um jogo da memória retrô inspirado nos clássicos de Game Boy da 1ª Geração Pokémon, desenvolvido em React 19, TypeScript e Tailwind CSS v4. Projeto focado em performance pura, acessibilidade (a11y) e fidelidade estética aos jogos 8-bit dos anos 90.

[![Deploy](https://img.shields.io/badge/Deploy-Online-red?style=for-the-badge&logo=vercel)](SEU_LINK_DE_DEPLOY_AQUI)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vitejs.dev/)

---

## 🔗 Link do Jogo Online
👉 **Jogue agora no seu navegador ou celular:** [CLIQUE AQUI PARA JOGAR](SEU_LINK_DE_DEPLOY_AQUI)
*(Substitua `SEU_LINK_DE_DEPLOY_AQUI` pela URL da sua aplicação hospedada no Vercel, Netlify ou GitHub Pages)*

---

## 📸 Demonstração Visual

<!-- ================================================================= -->
<!-- ESPAÇO PARA PRINTS: Tire prints do jogo no celular ou no navegador -->
<!-- ================================================================= -->

<div align="center">
  <h3>Menu 8-Bit • Carregamento • Tabuleiro Kanto</h3>
  
  <!-- INSERIR PRINT 1: Tela Inicial (Menu de Níveis) -->
  <!-- <img src="./docs/menu-8bit.png" alt="Tela Inicial Pixel Memory" width="320"/> -->
  
  <!-- INSERIR PRINT 2: Tabuleiro de Cartas com Sprites e Pokébolas -->
  <!-- <img src="./docs/gameplay-8bit.png" alt="Tabuleiro Pixel Memory" width="320"/> -->

  <p><em>[Insira aqui capturas de tela do jogo demonstrando o visual 8-bit e o verso com Pokébola em CSS]</em></p>
</div>

---

## 🎮 Funcionalidades Principais

- 👾 **Estética 8-Bit Autêntica:**
  - Tipografia retrô com a fonte Google Fonts **"Press Start 2P"**.
  - Paleta restrita clássica: Fundo Creme (`#E6E1D6`), Tinta (`#1F1D2B`), Vermelho (`#D63C3C`), Branco (`#F8F8F0`), Azul (`#3B5BA9`) e Amarelo (`#F2C230`).
  - Cantos 100% retos, bordas grossas de 4px e sombras duras sem desfoque (`shadow-[4px_4px_0px_0px_#1F1D2B]`).
- ⚡ **20 Pokémon da 1ª Geração (Kanto):**
  - Sprites pixel art oficiais (Bulbasaur, Charmander, Squirtle, Pikachu, Eevee, Gengar, etc.) renderizados com `image-rendering: pixelated` em múltiplos inteiros (64px) sem desfoque.
- 🔄 **Animação de Virada em `steps(5)`:**
  - Efeito 3D `rotateY` com função de temporização discreta `steps(5)`, simulando o quadro a quadro mecânico de jogos de Game Boy.
- ⚪ **Pokébola em CSS Puro no Verso:**
  - Desenhada exclusivamente com geometria e classes utilitárias CSS, sem depender de nenhuma imagem externa no verso.
- ⏳ **Pré-carregamento Assíncrono com `new Image()`:**
  - Antes do tabuleiro ser revelado, todos os sprites da rodada são baixados em segundo plano.
  - Tela de *"CARREGANDO..."* temática com Pokébola animada.
  - Timeout de segurança de 5 segundos para nunca travar a tela em conexões instáveis.
  - Fallback textual automático caso algum sprite não possa ser exibido.
- 🎲 **Embaralhamento Imparcial Duplo (Fisher-Yates):**
  - Cada partida sorteia um subconjunto aleatório diferente de Pokémon dentre os 20 disponíveis, garantindo que nenhum jogo seja igual ao anterior.
- ⏱️ **Timer Automático & Recordes no LocalStorage:**
  - O cronômetro dispara na primeira jogada e para na vitória.
  - Guarda os melhores resultados (menos jogadas e menor tempo) individualmente por nível.
- ♿ **Acessibilidade Completa (WCAG 2.1 AA):**
  - Botões táteis com altura mínima de 48px (`min-h-[48px]`).
  - Navegação fluida por teclado (**Tab**, **Enter**, **Espaço** e **Escape** no modal).
  - Anéis de foco claros e visíveis (`focus-visible:ring-4`).
  - Leitores de tela suportados com `aria-label` descritivo e ordinal.
  - Respeito à preferência do sistema operacional via `@media (prefers-reduced-motion: reduce)`.

---

## 🛠️ Tecnologias Utilizadas

- **[React 19](https://react.dev/):** Componentização moderna, hooks nativos e gerenciamento de estado limpo.
- **[TypeScript](https://www.typescriptlang.org/):** Tipagem estática rígida garantindo integridade de dados e interfaces.
- **[Tailwind CSS v4](https://tailwindcss.com/):** Estilização utilitária de alta performance sem bibliotecas de CSS-in-JS.
- **[Vite 8](https://vitejs.dev/):** Servidor de desenvolvimento rápido e empacotamento otimizado.

> **Zero dependências supérfluas:** O projeto não utiliza bibliotecas externas de estado (Redux/Zustand), nem bibliotecas pesadas de animação (Framer Motion) ou pacotes de ícones externos, mantendo o bundle ultra-leve e o carregamento instantâneo.

---

## 📂 Estrutura de Pastas

```text
src/
├── components/          # Componentes visuais atômicos e acessíveis
│   ├── Board.tsx        # Grade adaptável para celulares e telas maiores
│   ├── Card.tsx         # Carta com sprite pixelated, fallback e Pokébola CSS
│   ├── GameOver.tsx     # Modal de vitória com foco automático e suporte a Escape
│   ├── LoadingScreen.tsx# Tela de carregamento 8-bit exibida durante o pré-carregamento
│   ├── Scoreboard.tsx   # Placar com jogadas, tempo, recorde e botões táteis (>=48px)
│   └── StartScreen.tsx  # Menu inicial para seleção dos 3 níveis de desafio
├── data/
│   └── cards.ts         # Catálogo dos 20 Pokémon de Kanto e Fisher-Yates
├── hooks/
│   └── useMemoryGame.ts # Custom Hook com pré-carregamento, regras e timer
├── types/
│   └── game.ts          # Definições de tipos TypeScript (PokemonCard, CardItem, etc.)
├── utils/
│   └── storage.ts       # Utilitários para LocalStorage seguro e formatação de tempo
├── App.tsx              # Componente raiz que orquestra a alternância de telas
├── main.tsx             # Ponto de montagem do React
└── index.css            # Tipografia "Press Start 2P", flip com steps(5) e Tailwind
```

---

## 🧠 Decisões Técnicas e Arquiteturais

### 1. Pré-carregamento com `new Image()` e Limpeza no `useEffect`
- **O Problema:** Em conexões lentas ou instáveis, exibir as cartas enquanto os sprites ainda estão baixando pode causar "flickers" visuais ou cartas vazias quando o jogador as vira rapidamente.
- **A Solução:** Usamos a API nativa `new Image()` dentro de um `Promise.all` acoplado a um `setTimeout` de segurança de 5 segundos.
- **Proteção contra Memory Leak:** O efeito implementa uma flag `let isCancelled = false` e limpa o timeout na função de cleanup do `useEffect`. Se o jogador reiniciar a partida ou fechar a tela antes do download concluir, o React não tentará atualizar o estado de um componente desmontado.

### 2. Por que virar com `steps(5)` no CSS?
- Animações CSS com transições suaves (`ease-in-out`) são excelentes para aplicações corporativas, mas destoam completamente da proposta 8-bit. O timing `steps(5)` quebra a rotação contínua em 5 passos secos, emulando com precisão a taxa de quadros e a memória limitada dos cartuchos clássicos.

### 3. Fisher-Yates Duplo
- O algoritmo é executado em duas fases:
  1. Primeiro sobre o banco de 20 Pokémon para selecionar $N$ espécies distintas a cada jogo.
  2. Depois sobre as $2N$ cartas geradas para distribuir as posições no tabuleiro.
- Diferente de `array.sort(() => Math.random() - 0.5)` (que tem viés probabilístico e não é uniforme), o Fisher-Yates tem garantia matemática de aleatoriedade uniforme com complexidade $O(n)$.

---

## 🚀 Como Rodar o Projeto Localmente

### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- `npm` ou `yarn`

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/pixel-memory.git
   cd pixel-memory
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000) e divirta-se!

---

## ⚠️ Aviso Legal / Disclaimer & Créditos

- Este é um projeto de fã, sem fins lucrativos, desenvolvido estritamente para fins educacionais e demonstração em portfólio de engenharia front-end.
- **Pokémon** e todos os nomes e imagens de personagens relacionados são marcas registradas da **Nintendo**, **Creatures Inc.**, **Game Freak Inc.** e **The Pokémon Company**. Este projeto não possui qualquer afiliação, patrocínio ou vínculo comercial com estas entidades.
- **Crédito dos Sprites:** Os sprites pixel art originais da Geração 1/3 utilizados neste projeto foram disponibilizados pela comunidade do repositório de código aberto [PokeAPI/sprites](https://github.com/PokeAPI/sprites).

---

## 👨‍💻 Autor

Desenvolvido por **[Seu Nome Aqui]**.

- **LinkedIn:** [linkedin.com/in/SEU_LINKEDIN](https://linkedin.com/in/)
- **GitHub:** [github.com/SEU_GITHUB](https://github.com/)
- **Email:** seu.email@exemplo.com

---
*Pixel Memory — Edição Kanto • Portfólio Front-end React*
