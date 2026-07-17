// Game/GameLogic.js
(function () {
  let board = [];
  let size = 3;
  let turn = "X";
  let isGameOver = false;

  // Initialize or reset the game state for a given board size
  function init(newSize) {
    size = newSize;
    board = Array(size * size).fill("");
    turn = "X";
    isGameOver = false;
  }

  function reset() {
    init(size);
  }

  function getBoard() {
    return board.slice();
  }

  function getTurn() {
    return turn;
  }

  function isOver() {
    return isGameOver;
  }

  // Applies a move and evaluates win/draw before switching turns
  function makeMove(index) {
    if (board[index] !== "" || isGameOver) return null;

    const player = turn; // Lock the current player for evaluation
    board[index] = player;

    const win = checkWin(board, size, player);
    if (win) {
      isGameOver = true;
      return { type: "win", player, indices: win };
    }

    if (board.every(cell => cell !== "")) {
      isGameOver = true;
      return { type: "draw" };
    }

    turn = player === "X" ? "O" : "X";
    return { type: "continue", nextTurn: turn };
  }

  // Determines winning sequences based on board size rules
  function checkWin(b, s, p) {
    const countToWin = s === 3 ? 3 : 4;
    const lines = [];

    for (let r = 0; r < s; r++) {
      for (let c = 0; c <= s - countToWin; c++) {
        lines.push(
          [...Array(countToWin)].map((_, k) => r * s + c + k)
        );
      }
    }

    for (let c = 0; c < s; c++) {
      for (let r = 0; r <= s - countToWin; r++) {
        lines.push(
          [...Array(countToWin)].map((_, k) => (r + k) * s + c)
        );
      }
    }

    for (let r = 0; r <= s - countToWin; r++) {
      for (let c = 0; c <= s - countToWin; c++) {
        lines.push(
          [...Array(countToWin)].map((_, k) => (r + k) * s + (c + k))
        );
      }
    }

    for (let r = 0; r <= s - countToWin; r++) {
      for (let c = countToWin - 1; c < s; c++) {
        lines.push(
          [...Array(countToWin)].map((_, k) => (r + k) * s + (c - k))
        );
      }
    }

    for (const line of lines) {
      if (line.every(i => b[i] === p)) return line;
    }

    return null;
  }

  // Exposes game logic methods to the controller layer
  window.GameLogic = {
    init,
    reset,
    makeMove,
    getBoard,
    getTurn,
    isOver,
    checkWin
  };
})();
