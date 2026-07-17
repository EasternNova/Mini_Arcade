// Game/AI.js
(function () {

  // Returns indices of all empty cells on the board
  function getEmpty(board) {
    return board
      .map((v, i) => (v === "" ? i : null))
      .filter(v => v !== null);
  }

  // Easy AI that plays like a casual human
  function easy(board, size) {
    const empties = getEmpty(board);
    if (!empties.length) return null;

    // Tries to make a winning move
    for (let i of empties) {
      board[i] = "O";
      if (GameLogic.checkWin?.(board, size, "O")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }

    // Tries to block the opponent from winning
    for (let i of empties) {
      board[i] = "X";
      if (GameLogic.checkWin?.(board, size, "X")) {
        board[i] = "";
        return i;
      }
      board[i] = "";
    }

    // Falls back to a random move
    return empties[Math.floor(Math.random() * empties.length)];
  }

  // Minimax algorithm for perfect 3x3 play
  function minimax(board, isMax) {
    const score = evaluate3x3(board);
    if (score !== null) return score;

    const empties = getEmpty(board);

    if (isMax) {
      let best = -Infinity;
      for (let i of empties) {
        board[i] = "O";
        best = Math.max(best, minimax(board, false));
        board[i] = "";
      }
      return best;
    } else {
      let best = Infinity;
      for (let i of empties) {
        board[i] = "X";
        best = Math.min(best, minimax(board, true));
        board[i] = "";
      }
      return best;
    }
  }

  // Evaluates terminal board states for 3x3 minimax
  function evaluate3x3(board) {
    const wins = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    for (let w of wins) {
      if (board[w[0]] && board[w[0]] === board[w[1]] && board[w[1]] === board[w[2]]) {
        return board[w[0]] === "O" ? 10 : -10;
      }
    }

    return board.every(c => c !== "") ? 0 : null;
  }

  // Selects the optimal move for a 3x3 board
  function hard3x3(board) {
    let bestScore = -Infinity;
    let move = null;

    for (let i of getEmpty(board)) {
      board[i] = "O";
      const score = minimax(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }

    return move;
  }

  // Hard AI logic for larger boards using heuristics
  function hardBig(board, size) {
    const empties = getEmpty(board);
    const count = size === 3 ? 3 : 4;

    let bestMove = null;
    let bestScore = -Infinity;

    for (let i of empties) {
      let score = 0;

      // Scores offensive potential
      board[i] = "O";
      score += evaluateLines(board, size, "O", count) * 2;
      board[i] = "";

      // Scores defensive pressure
      board[i] = "X";
      score -= evaluateLines(board, size, "X", count) * 1.8;
      board[i] = "";

      // Prefers center positions
      const center = Math.floor(board.length / 2);
      if (i === center) score += 5;

      if (score > bestScore) {
        bestScore = score;
        bestMove = i;
      }
    }

    return bestMove ?? empties[0];
  }

  // Scores partial winning lines for heuristic evaluation
  function evaluateLines(board, size, player, count) {
    let score = 0;
    const lines = [];

    // Generates horizontal lines
    for (let r = 0; r < size; r++) {
      for (let c = 0; c <= size - count; c++) {
        lines.push([...Array(count)].map((_, k) => r * size + c + k));
      }
    }

    // Generates vertical lines
    for (let c = 0; c < size; c++) {
      for (let r = 0; r <= size - count; r++) {
        lines.push([...Array(count)].map((_, k) => (r + k) * size + c));
      }
    }

    // Generates diagonal lines
    for (let r = 0; r <= size - count; r++) {
      for (let c = 0; c <= size - count; c++) {
        lines.push([...Array(count)].map((_, k) => (r + k) * size + (c + k)));
      }
      for (let c = count - 1; c < size; c++) {
        lines.push([...Array(count)].map((_, k) => (r + k) * size + (c - k)));
      }
    }

    for (let line of lines) {
      let p = 0, e = 0;
      for (let i of line) {
        if (board[i] === player) p++;
        else if (board[i] === "") e++;
      }
      if (p > 0 && e > 0) score += Math.pow(10, p);
    }

    return score;
  }

  // Exposes AI move selection to the game controller
  window.AI = {
    chooseMove({ board, size, level }) {
      if (level === "easy") return easy(board, size);
      if (size === 3) return hard3x3(board);
      return hardBig(board, size);
    }
  };

})();
