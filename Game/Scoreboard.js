// Game/Scoreboard.js
(function () {
  let xScore = 0;
  let oScore = 0;

  const xScoreSpan = document.getElementById("x-score");
  const oScoreSpan = document.getElementById("o-score");

  // Updates the scoreboard UI to reflect the current score state
  function render() {
    xScoreSpan.textContent = xScore;
    oScoreSpan.textContent = oScore;
  }

  function addWin(player) {
    if (player === "X") xScore++;
    if (player === "O") oScore++;
    render();
  }

  function reset() {
    xScore = 0;
    oScore = 0;
    render();
  }

  function get() {
    return { x: xScore, o: oScore };
  }

  window.Scoreboard = {
    addWin,
    reset,
    get
  };
})();
