// Prevent player input while AI is thinking
let isAITurn = false;

// DOM references
const infoText = document.getElementById("infoText");
const modeBtns = document.querySelectorAll(".mode-btns button");
const gridBtns = document.querySelectorAll(".grid-btns .grid-btn");
const easyBtn = document.getElementById("easy-ai");
const hardBtn = document.getElementById("hard-ai");

// Game state (controller-level only)
let currentSize = 3;
let isSinglePlayer = true;
let aiLevel = "easy";

// AI difficulty (called by ButtonManager)
function setAIDifficulty(level) {
  aiLevel = level;

  if (level === "easy") {
    easyBtn.classList.add("active");
    hardBtn.classList.remove("active");
  } else {
    hardBtn.classList.add("active");
    easyBtn.classList.remove("active");
  }
}

// INIT BOARD (delegates to GameLogic)
function initBoard(size) {
  GameLogic.init(size);
  GridManager.createGrid(size, handleCellClick);
}

// CELL CLICK HANDLER (NO GAME STATE HERE)
function handleCellClick(e) {
  const idx = Number(e.target.dataset.idx);

  if (GameLogic.isOver() || isAITurn) return;

  const result = GameLogic.makeMove(idx);
  if (!result) return;

  const placedSymbol =
    result.player ?? (GameLogic.getTurn() === "O" ? "X" : "O");

  GridManager.setCell(idx, placedSymbol);

  if (result.type === "win") {
    infoText.textContent = `${result.player} Won!`;
    Scoreboard.addWin(result.player);
    GridManager.highlightCells(result.indices);
    return;
  }

  if (result.type === "draw") {
    infoText.textContent = "Draw!";
    return;
  }

  infoText.textContent = `Turn for ${result.nextTurn}`;

  if (isSinglePlayer && result.nextTurn === "O") {
    isAITurn = true;
    setTimeout(aiMove, 600);
  }
}

function aiMove() {
  const move = AI.chooseMove({
    board: GameLogic.getBoard(),
    size: currentSize,
    level: aiLevel,
    logic: GameLogic
  });

  if (move === null) return;

  const result = GameLogic.makeMove(move);
  GridManager.setCell(move, "O");

  if (result.type === "win") {
    infoText.textContent = "O Won!";
    Scoreboard.addWin("O");
    GridManager.highlightCells(result.indices);
  } else if (result.type === "draw") {
    infoText.textContent = "Draw!";
  } else {
    infoText.textContent = `Turn for ${result.nextTurn}`;
  }

  isAITurn = false;
}

// RESET & MODE HELPERS (called by ButtonManager)
function resetGame() {
  GameLogic.init(currentSize);
  GridManager.createGrid(currentSize, handleCellClick);

  infoText.textContent = "Turn for X";
  isAITurn = false;
}

function setMode(single) {
  isSinglePlayer = single;
  modeBtns.forEach(btn => btn.classList.remove("active"));
  modeBtns[single ? 0 : 1].classList.add("active");
  resetGame();
}

function setGridSize(size) {
  currentSize = size;

  gridBtns.forEach(btn => btn.classList.remove("active"));
  gridBtns.forEach(btn => {
    if (+btn.dataset.size === size) btn.classList.add("active");
  });

  GameLogic.init(size);
  GridManager.createGrid(size, handleCellClick);

  infoText.textContent = "Turn for X";
  isAITurn = false;
}

// INITIAL BOOT
initBoard(currentSize);
