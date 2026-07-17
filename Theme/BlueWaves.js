// Blue Waves theme controller
(function () {
  const container = document.getElementById("container");

  if (!container) return;

  window.BlueWavesTheme = {
    enable() {
      container.style.display = "block";
    },
    disable() {
      container.style.display = "none";
    }
  };
})();

function applyTheme(theme) {
  // Disable Blue Waves by default
  if (window.BlueWavesTheme) {
    BlueWavesTheme.disable();
  }

  // Reset body classes before applying the selected theme
  document.body.className = "";
  document.body.classList.add(`theme-${theme}`);

  if (theme === "waves" && window.BlueWavesTheme) {
    BlueWavesTheme.enable();
  }
}
