// src/Character.js

//  Select elements
const pacmanSpeech = document.getElementById("pacmanSpeech");
const pacmanImg = document.getElementById("pacmanImg");

// Pac-Man voice lines
const pacmanPhrases = [
  "Go, Pac-Man!",
  "Watch out for ghosts!",
  "Power up !",
  "You’re unstoppable!",
  "Eat smarter!"
];

// Animation helpers
function pacmanAnimate(animationName, duration = 1000) {
  pacmanImg.classList.add(animationName);
  setTimeout(() => pacmanImg.classList.remove(animationName), duration);
}

function pacmanSpeak(message) {
  pacmanSpeech.textContent = message;

  // Restart fade animation
  pacmanSpeech.style.animation = "none";
  void pacmanSpeech.offsetWidth; // reflow
  pacmanSpeech.style.animation = "fadeIn 1s ease";
}

// 🎯 Random talk function
function pacmanRandomSpeak() {
  const randomMessage = pacmanPhrases[Math.floor(Math.random() * pacmanPhrases.length)];
  pacmanSpeak(randomMessage);

  // Randomly choose an animation
  const randomAnim = Math.random() > 0.5 ? "pacman-bounce" : "pacman-wave";
  pacmanAnimate(randomAnim);
}

// 🕒 Make Pac-Man speak randomly every few seconds
setInterval(pacmanRandomSpeak, 5000); // every 5 seconds

// 🟢 Optional: start with an intro animation
pacmanAnimate("pacman-wave", 1200);
