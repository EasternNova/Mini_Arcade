document.addEventListener("DOMContentLoaded", () => {
  const grid = document.querySelector(".grid");
  const endlessButton = document.getElementById("endlessMode");
  const timedButton = document.getElementById("timedMode");
  const scoreDisplay = document.getElementById("score");
  const highScoreDisplay = document.getElementById("highScore");
  const timerDisplay = document.getElementById("timer");
  const larrySpeech = document.getElementById("larrySpeech");
  const larryImg = document.getElementById("larryImg");

  const width = 8;
  const baseCandies = [
    "url(images/red_candy.png)",
    "url(images/blue_candy.png)",
    "url(images/green_candy.png)",
    "url(images/yellow_candy.png)",
    "url(images/orange_candy.png)",
    "url(images/purple_candy.png)"
  ];

  let squares = [];
  let score = 0;
  let highScore = parseInt(localStorage.getItem("cc_highscore")) || 0;
  let currentMode = null;
  let timer = null;
  let timeLeft = 60;

  highScoreDisplay.textContent = highScore;

  endlessButton.onclick = () => startGame("endless");
  timedButton.onclick = () => startGame("timed");

  function startGame(mode) {
    currentMode = mode;
    score = 0;
    scoreDisplay.textContent = score;
    createBoard();
    if (mode === "timed") startTimer();
    setInterval(gameLoop, 120);
  }

  function generateValidColor(i) {
    let color;
    do {
      color = baseCandies[Math.floor(Math.random() * baseCandies.length)];
    } while (
      (i >= 2 && squares[i - 1]?.style.backgroundImage === color && squares[i - 2]?.style.backgroundImage === color) ||
      (i >= width * 2 && squares[i - width]?.style.backgroundImage === color && squares[i - width * 2]?.style.backgroundImage === color)
    );
    return color;
  }

  function createBoard() {
    grid.innerHTML = "";
    squares = [];
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement("div");
      square.setAttribute("draggable", true);
      square.setAttribute("id", i);
      const color = generateValidColor(i);
      square.style.backgroundImage = color;
      grid.appendChild(square);
      squares.push(square);
    }
    addListeners();
  }

  function addListeners() {
    squares.forEach(sq => {
      sq.addEventListener("dragstart", dragStart);
      sq.addEventListener("dragover", e => e.preventDefault());
      sq.addEventListener("drop", dragDrop);
      sq.addEventListener("dragend", dragEnd);
    });
  }

  let colorBeingDragged, colorBeingReplaced, squareIdBeingDragged, squareIdBeingReplaced;

  function dragStart() {
    colorBeingDragged = this.style.backgroundImage;
    squareIdBeingDragged = parseInt(this.id);
  }

  function dragDrop() {
    colorBeingReplaced = this.style.backgroundImage;
    squareIdBeingReplaced = parseInt(this.id);
    this.style.backgroundImage = colorBeingDragged;
    squares[squareIdBeingDragged].style.backgroundImage = colorBeingReplaced;
  }

  function dragEnd() {
    const validMoves = [
      squareIdBeingDragged - 1,
      squareIdBeingDragged + 1,
      squareIdBeingDragged - width,
      squareIdBeingDragged + width
    ];
    const validMove = validMoves.includes(squareIdBeingReplaced);
    if (!validMove && squareIdBeingReplaced !== null) {
      squares[squareIdBeingDragged].style.backgroundImage = colorBeingDragged;
      squares[squareIdBeingReplaced].style.backgroundImage = colorBeingReplaced;
    }
    squareIdBeingReplaced = null;
  }

  function checkRowForThree() {
    for (let i = 0; i < width * width; i++) {
      if (i % width >= width - 2) continue;
      const row = [i, i + 1, i + 2];
      const color = squares[i].style.backgroundImage;
      if (color && row.every(idx => squares[idx].style.backgroundImage === color)) {
        row.forEach(idx => squares[idx].style.backgroundImage = "");
        updateScore(score + 3);
        larryReact();
      }
    }
  }

  function checkColumnForThree() {
    for (let i = 0; i < width * (width - 2); i++) {
      const column = [i, i + width, i + 2 * width];
      const color = squares[i].style.backgroundImage;
      if (color && column.every(idx => squares[idx].style.backgroundImage === color)) {
        column.forEach(idx => squares[idx].style.backgroundImage = "");
        updateScore(score + 3);
        larryReact();
      }
    }
  }

  function moveIntoSquareBelow() {
    for (let i = 0; i < width * (width - 1); i++) {
      if (squares[i + width].style.backgroundImage === "") {
        squares[i + width].style.backgroundImage = squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = "";
      }
    }
    for (let i = 0; i < width; i++) {
      if (squares[i].style.backgroundImage === "") {
        const color = baseCandies[Math.floor(Math.random() * baseCandies.length)];
        squares[i].style.backgroundImage = color;
      }
    }
  }

  function updateScore(newScore) {
    score = newScore;
    scoreDisplay.textContent = score;
    if (score > highScore) {
      highScore = score;
      localStorage.setItem("cc_highscore", highScore);
      highScoreDisplay.textContent = highScore;
    }
  }

  function startTimer() {
    clearInterval(timer);
    timeLeft = 60;
    timerDisplay.textContent = `⏱️ ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      timerDisplay.textContent = `⏱️ ${timeLeft}s`;
      if (timeLeft <= 0) {
        clearInterval(timer);
        larryTalk("Time’s up! You crushed it!");
        alert("⏰ Time’s up! Your score: " + score);
      }
    }, 1000);
  }

  function gameLoop() {
    checkRowForThree();
    checkColumnForThree();
    moveIntoSquareBelow();
  }

  // 🎉 LARRY INTERACTIONS
  const phrases = [
    "Sweet!",
    "Tasty combo!",
    "Yum yum yum!",
    "You rock, sugar hero!",
    "Delicious!",
    "Keep matching, buddy!",
    "Crush them all!"
  ];

  function larryReact() {
    const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
    larryTalk(randomPhrase);
    larryAnimate();
  }

  function larryTalk(text) {
    larrySpeech.textContent = text;
  }

  function larryAnimate() {
    const animation = Math.random() > 0.5 ? "larry-bounce" : "larry-wave";
    larryImg.classList.add(animation);
    setTimeout(() => larryImg.classList.remove(animation), 1000);
  }
});
