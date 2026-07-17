// Game/ButtonManager.js
(function () {
  const modeBtns = document.querySelectorAll(".mode-btns button");
  const gridBtns = document.querySelectorAll(".grid-btns .grid-btn");
  const easyBtn = document.getElementById("easy-ai");
  const hardBtn = document.getElementById("hard-ai");
  const resetBtn = document.getElementById("reset");

  // Game mode selection (1P / 2P)
  modeBtns[0].onclick = () => {
    setMode(true);
  };

  modeBtns[1].onclick = () => {
    setMode(false);
  };

  // Grid size selection
  gridBtns.forEach(btn => {
    btn.onclick = () => {
      const size = Number(btn.dataset.size);
      setGridSize(size);
    };
  });

  // AI difficulty selection
  easyBtn.onclick = () => {
    setAIDifficulty("easy");
  };

  hardBtn.onclick = () => {
    setAIDifficulty("hard");
  };

  // Reset game and scoreboard state
  resetBtn.onclick = () => {
    resetGame();
    Scoreboard.reset();
  };
})();
