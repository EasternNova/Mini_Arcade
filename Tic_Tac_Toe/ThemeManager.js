function applyTheme(theme) {
  // Disable previously active animated themes to prevent overlap
  if (window.BlueWavesTheme) BlueWavesTheme.disable();
  if (window.ParallaxStars) ParallaxStars.disable();
  if (window.LavenderTheme) LavenderTheme.disable();

  // Clear any existing theme classes before applying a new one
  document.body.className = "";
  document.body.classList.add(`theme-${theme}`);

  // Enable animation only for themes that require it
  if (theme === "waves" && window.BlueWavesTheme) {
    BlueWavesTheme.enable();
  }

  if (theme === "stars" && window.ParallaxStars) {
    ParallaxStars.enable();
  }

  if (theme === "lavender" && window.LavenderTheme) {
    LavenderTheme.enable();
  }
}

// Apply default theme on initial load
applyTheme("lavender");

// Handle theme selection from UI buttons
document.querySelectorAll(".theme-option").forEach(btn => {
  btn.addEventListener("click", () => {
    applyTheme(btn.dataset.theme);
  });
});
