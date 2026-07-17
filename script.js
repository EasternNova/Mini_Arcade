let isAITurn = false;

// Advanced Tic Tac Toe with Smart AI (Easy/Hard)
const gameGrid = document.getElementById('gameGrid');
const infoText = document.getElementById('infoText');
const modeBtns = document.querySelectorAll('.mode-btns button');
const gridBtns = document.querySelectorAll('.grid-btns .grid-btn');
const resetBtn = document.getElementById('reset');
const xScoreSpan = document.getElementById('x-score');
const oScoreSpan = document.getElementById('o-score');
const easyBtn = document.getElementById('easy-ai');
const hardBtn = document.getElementById('hard-ai');
let currentSize = 3;
let board = [];
let turn = "X";
let isGameOver = false;
let isSinglePlayer = true;
let xScore = 0;
let oScore = 0;
let aiLevel = "easy";

function initBoard(size) {
  board = Array(size * size).fill("");
  let gridStr = "";
  gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  gameGrid.style.gridTemplateRows = `repeat(${size}, 1fr)`;
  for (let i = 0; i < size * size; i++) {
    gridStr += `<div class='game-box' data-idx='${i}'></div>`;
  }
  gameGrid.innerHTML = gridStr;
  document.querySelectorAll('.game-box').forEach(box => {
    box.onclick = handleCellClick;
  });
}

function handleCellClick(e) {
  const idx = parseInt(e.target.getAttribute('data-idx'));

  if (board[idx] !== "" || isGameOver || isAITurn) return;


  board[idx] = turn;
  e.target.textContent = turn;

  const winIndices = checkWin(board, currentSize, turn);
  if (winIndices) {
    infoText.textContent = `${turn} Won!`;
    isGameOver = true;

    winIndices.forEach(i => {
      document.querySelector(`[data-idx='${i}']`).classList.add('winning-cell');
    });

    if (turn === "X") xScore++; else oScore++;
    xScoreSpan.textContent = xScore;
    oScoreSpan.textContent = oScore;
    return;
  }

  if (board.every(cell => cell !== "")) {
    infoText.textContent = "Draw!";
    isGameOver = true;
    return;
  }

  turn = turn === "X" ? "O" : "X";
  infoText.textContent = `Turn for ${turn}`;

 if (isSinglePlayer && turn === "O") {
  isAITurn = true;
  setTimeout(aiMove, 600);
 }

}


easyBtn.onclick = () => {
  aiLevel = "easy";
  easyBtn.classList.add('active');
  hardBtn.classList.remove('active');
};
hardBtn.onclick = () => {
  aiLevel = "hard";
  hardBtn.classList.add('active');
  easyBtn.classList.remove('active');
};

function aiMove() {
  if (aiLevel === "easy") {
    // Easy: random moves for all sizes
    let empties = board.map((cell, idx) => cell === "" ? idx : null).filter(x => x !== null);
    if (!isGameOver && empties.length > 0) {
      let choice = empties[Math.floor(Math.random() * empties.length)];
      board[choice] = "O";
      document.querySelector(`[data-idx='${choice}']`).textContent = "O";
      postAIMove();
    }
  } else if (aiLevel === "hard") {
    if (currentSize === 3) {
      // Use simple minimax for 3x3
      let move = minimax(board.slice(), "O").move;
      if (move !== null && !isGameOver) {
        board[move] = "O";
        document.querySelector(`[data-idx='${move}']`).textContent = "O";
        postAIMove();
      }
    } else if (currentSize === 5 || currentSize === 7) {
      // Use minimax with alpha-beta pruning for 5x5 and 7x7
      let result = minimaxAB(board.slice(), "O", -Infinity, Infinity, 0);
      let move = result.move;
      if (move !== null && !isGameOver) {
        board[move] = "O";
        document.querySelector(`[data-idx='${move}']`).textContent = "O";
        postAIMove();
      }
    }
  }
}

function postAIMove() {
  if (checkWin(board, currentSize, "O")) {
    infoText.textContent = `O Won!`;
    isGameOver = true;
    oScore++;
    oScoreSpan.textContent = oScore;
  } else if (board.every(cell => cell !== "")) {
    infoText.textContent = "Draw!";
    isGameOver = true;
  } else {
    turn = "X";
    infoText.textContent = `Turn for X`;
  }
  
  isAITurn = false;
}

function checkWin(b, size, player) {
  const countToWin = size === 3 ? 3 : 4;
  const wins = [];
   // Rows
  for (let r = 0; r < size; r++) {
      for (let c = 0; c <= size - countToWin; c++) {
        let line = [];
        for (let k = 0; k < countToWin; k++) {
          const idx = r * size + c + k;
          if (b[idx] === player) line.push(idx);
        }
        if (line.length === countToWin) return line;
      }
    }
  // Columns
    for (let c = 0; c < size; c++) {
    for (let r = 0; r <= size - countToWin; r++) {
      let line = [];
      for (let k = 0; k < countToWin; k++) {
        const idx = (r + k) * size + c;
        if (b[idx] === player) line.push(idx);
      }
      if (line.length === countToWin) return line;
    }
  }
  // Diagonals left-right
  for (let r = 0; r <= size - countToWin; r++) {
    for (let c = 0; c <= size - countToWin; c++) {
      let line = [];
      for (let k = 0; k < countToWin; k++) {
        const idx = (r + k) * size + (c + k);
        if (b[idx] === player) line.push(idx);
      }
      if (line.length === countToWin) return line;
    }
  }
  // Diagonals right-left
  for (let r = 0; r <= size - countToWin; r++) {
    for (let c = countToWin - 1; c < size; c++) {
      let line = [];
      for (let k = 0; k < countToWin; k++) {
        const idx = (r + k) * size + (c - k);
        if (b[idx] === player) line.push(idx);
      }
      if (line.length === countToWin) return line;
    }
  }
  return null;
}

// Only for hard AI, 3x3 grid
function minimax(b, player) {
  const winner = getWinner(b, 3);
  if (winner === "O") return { score: 10, move: null };
  if (winner === "X") return { score: -10, move: null };
  if (b.every(cell => cell !== "")) return { score: 0, move: null };

  let moves = [];
  for (let i = 0; i < 9; i++) {
    if (b[i] === "") {
      b[i] = player;
      let result;
      if (player === "O") {
        result = minimax(b, "X");
      } else {
        result = minimax(b, "O");
      }
      moves.push({
        idx: i,
        score: result.score
      });
      b[i] = "";
    }
  }
  let bestMove;
  if (player === "O") {
    let maxScore = -Infinity;
    moves.forEach(m => { if (m.score > maxScore) { bestMove = m; maxScore = m.score; } });
  } else {
    let minScore = Infinity;
    moves.forEach(m => { if (m.score < minScore) { bestMove = m; minScore = m.score; } });
  }
  return { score: bestMove.score, move: bestMove.idx };
}

// For 5x5 and 7x7 hard AI with alpha-beta pruning
const MAX_DEPTH = 4;  // Adjust for performance and difficulty

function minimaxAB(b, player, alpha, beta, depth) {
  const opponent = (player === "O") ? "X" : "O";

  if (checkWin(b, currentSize, "O")) return { score: 10 - depth, move: null };
  if (checkWin(b, currentSize, "X")) return { score: depth - 10, move: null };
  if (b.every(cell => cell !== "") || depth >= MAX_DEPTH) {
    return { score: 0, move: null };
  }

  let bestMove = null;

  if (player === "O") {
    let maxEval = -Infinity;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === "") {
        b[i] = player;
        let scoreEval = minimaxAB(b, opponent, alpha, beta, depth + 1).score;
        b[i] = "";
        if (scoreEval > maxEval) {
          maxEval = scoreEval;
          bestMove = i;
        }
        alpha = Math.max(alpha, scoreEval);
        if (beta <= alpha) break;  // Beta cutoff
      }
    }
    return { score: maxEval, move: bestMove };
  } else {
    let minEval = Infinity;
    for (let i = 0; i < b.length; i++) {
      if (b[i] === "") {
        b[i] = player;
        let scoreEval = minimaxAB(b, opponent, alpha, beta, depth + 1).score;
        b[i] = "";
        if (scoreEval < minEval) {
          minEval = scoreEval;
          bestMove = i;
        }
        beta = Math.min(beta, scoreEval);
        if (beta <= alpha) break;  // Alpha cutoff
      }
    }
    return { score: minEval, move: bestMove };
  }
}


function getWinner(b, size) {
  // 3x3 only
  const wins = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
    [0, 4, 8], [2, 4, 6]          // diags
  ];
  for (let win of wins) {
    if (b[win[0]] && b[win[0]] === b[win[1]] && b[win[1]] === b[win[2]]) {
      return b[win[0]];
    }
  }
  return null;
}

function setMode(single) {
  isSinglePlayer = single;
  modeBtns.forEach(btn => btn.classList.remove('active'));
  if (single) modeBtns[0].classList.add('active');
  else modeBtns[1].classList.add('active');
  resetGame();
}
function setGridSize(size) {
  currentSize = size;
  gridBtns.forEach(btn => btn.classList.remove('active'));
  gridBtns.forEach(btn => {
    if (parseInt(btn.getAttribute('data-size')) === size) btn.classList.add('active');
  })
  resetGame();
}
function resetGame() {
  isGameOver = false;
  turn = "X";
  infoText.textContent = "Turn for X";
  initBoard(currentSize);
}

resetBtn.onclick = resetGame;
modeBtns[0].onclick = () => setMode(true);
modeBtns[1].onclick = () => setMode(false);
gridBtns.forEach(btn => {
  btn.onclick = () => setGridSize(parseInt(btn.getAttribute('data-size')));
});
// Character speech
const speeches = [
  "You can't beat me!",
  "Nice move!",
  "Ouch, my turn!",
  "Think again!",
  "Hehe, I'm winning!"
];
function randomSpeech() {
  const bubble = document.getElementById('speech');
  bubble.innerText = speeches[Math.floor(Math.random() * speeches.length)];
}
setInterval(randomSpeech, 6000);
// Initialize
initBoard(currentSize);

let lavenderInstance = null;

// Theme switcher toggle (UI only for now)
const themeSwitcher = document.getElementById('themeSwitcher');
const themeToggleBtn = themeSwitcher.querySelector('.theme-toggle');

themeToggleBtn.addEventListener('click', () => {
  const isOpen = themeSwitcher.classList.toggle('open');
  themeToggleBtn.setAttribute('aria-expanded', isOpen);
});

const DEFAULT_THEME = 'lavender';

function applyTheme(theme) {
  document.body.classList.remove(
    'theme-lavender',
    'theme-yellow',
    'theme-stars',
    'theme-waves'
  );

  document.body.classList.add(`theme-${theme}`);

  // Stop lavender particles if running
  if (lavenderInstance) {
    lavenderInstance = null;
  }

  // Start lavender particles only for lavender theme
  if (theme === 'lavender') {
    lavenderInstance = new LavenderParticles();
  }

  // Generate stars only for stars theme
  if (theme === 'stars') {
    generateParallaxStars();
  }
}


applyTheme(DEFAULT_THEME);
const themeButtons = document.querySelectorAll('.theme-option');

themeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const selectedTheme = button.getAttribute('data-theme');

    themeButtons.forEach(b => b.classList.remove('active'));
    button.classList.add('active');

    applyTheme(selectedTheme);
  });
});

let collapseTimer;

themeSwitcher.addEventListener("mouseenter", () => {
  clearTimeout(collapseTimer);
});

themeSwitcher.addEventListener("mouseleave", () => {
  collapseTimer = setTimeout(() => {
    themeSwitcher.classList.remove("open");
  }, 400);
});

/* ===============================
   PARALLAX STARS GENERATOR
================================ */
function generateParallaxStars() {
  const stars1 = [];
  const stars2 = [];
  const stars3 = [];

  for (let i = 0; i < 500; i++) {
    stars1.push(`${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`);
  }
  for (let i = 0; i < 200; i++) {
    stars2.push(`${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`);
  }
  for (let i = 0; i < 100; i++) {
    stars3.push(`${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`);
  }

  document.documentElement.style.setProperty('--stars1-shadow', stars1.join(','));
  document.documentElement.style.setProperty('--stars2-shadow', stars2.join(','));
  document.documentElement.style.setProperty('--stars3-shadow', stars3.join(','));
}

