// Game/GridManager.js
(function () {
  let clickHandler = null;

  function createGrid(size, onCellClick) {
    const gameGrid = document.getElementById("gameGrid");
    clickHandler = onCellClick; // Delegates cell clicks back to the game controller

    gameGrid.innerHTML = "";

    gameGrid.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    gameGrid.style.gridTemplateRows = `repeat(${size}, 1fr)`;

    for (let i = 0; i < size * size; i++) {
      const cell = document.createElement("div");
      cell.className = "game-box";
      cell.dataset.idx = i;
      cell.onclick = handleClick;
      gameGrid.appendChild(cell);
    }
  }

  // Centralizes click handling to keep grid logic UI-only
  function handleClick(e) {
    if (typeof clickHandler === "function") {
      clickHandler(e);
    }
  }

  function setCell(index, value) {
    const cell = document.querySelector(`[data-idx="${index}"]`);
    if (cell) cell.textContent = value;
  }

  function highlightCells(indices) {
    indices.forEach(i => {
      const cell = document.querySelector(`[data-idx="${i}"]`);
      if (cell) cell.classList.add("winning-cell");
    });
  }

  window.GridManager = {
    createGrid,
    setCell,
    highlightCells
  };
})();
