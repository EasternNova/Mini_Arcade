// Character speech
const speeches = [
  "You can't beat me!",
  "Nice move!",
  "Ouch, my turn!",
  "Think again!",
  "Hehe, I'm winning!"
];

// Randomized phrases displayed in the character speech bubble
function randomSpeech() {
  const bubble = document.getElementById('speech');
  bubble.innerText = speeches[Math.floor(Math.random() * speeches.length)];
}

setInterval(randomSpeech, 6000);
