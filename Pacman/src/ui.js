// src/ui.js
// Simple UI helper module for score/high-score live updates.

const scoreEl = () => document.getElementById("scoreValue");
const highScoreEl = () => document.getElementById("highScoreValue");

let currentScore = 0;
let highScore = 0;

// initialize high score from localStorage (if present)
export function initUI() {
  try {
    const stored = localStorage.getItem("pacman_highscore");
    highScore = stored ? parseInt(stored, 10) : 0;
  } catch (e) {
    highScore = 0;
  }
  // update DOM if elements exist
  if (highScoreEl()) highScoreEl().textContent = highScore;
  if (scoreEl()) scoreEl().textContent = currentScore;
}

// call this to add points and update the DOM
export function updateScore(points) {
  currentScore += points;
  if (scoreEl()) scoreEl().textContent = currentScore;
  maybeUpdateHighScore();
  return currentScore;
}

// returns current score (useful for end screen)
export function getScore() {
  return currentScore;
}

// force set score (if you need to reset)
export function setScore(val) {
  currentScore = val;
  if (scoreEl()) scoreEl().textContent = currentScore;
  maybeUpdateHighScore();
}

// internal: check and store high score
function maybeUpdateHighScore() {
  if (currentScore > highScore) {
    highScore = currentScore;
    if (highScoreEl()) highScoreEl().textContent = highScore;
    try {
      localStorage.setItem("pacman_highscore", String(highScore));
    } catch (e) {
      // ignore storage errors (private mode)
    }
  }
}

// export high score getter for convenience
export function getHighScore() {
  return highScore;
}
