function generateParallaxStars() {
  const stars1 = [];
  const stars2 = [];
  const stars3 = [];

  for (let i = 0; i < 500; i++) {
    stars1.push(`${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`);
  }
  for (let i = 0; i < 200; i++) {
    stars2.push(`${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`);
  }
  for (let i = 0; i < 100; i++) {
    stars3.push(`${Math.random() * 2000}px ${Math.random() * 2000}px #FFF`);
  }

  document.documentElement.style.setProperty('--stars1-shadow', stars1.join(','));
  document.documentElement.style.setProperty('--stars2-shadow', stars2.join(','));
  document.documentElement.style.setProperty('--stars3-shadow', stars3.join(','));
}

/* Generate once on load */
window.addEventListener('DOMContentLoaded', generateParallaxStars);
