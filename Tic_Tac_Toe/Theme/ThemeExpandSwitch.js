// Initializes theme switcher interactions after the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  const themeSwitcher = document.getElementById('themeSwitcher');
  const toggle = themeSwitcher.querySelector('.theme-toggle');

  // Toggles the theme list on button click and updates accessibility state
  toggle.addEventListener('click', () => {
    const open = themeSwitcher.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });

  // Opens the theme list on hover for pointer-based devices
  themeSwitcher.addEventListener('mouseenter', () => {
    if (window.matchMedia('(hover: hover)').matches) {
      themeSwitcher.classList.add('open');
    }
  });

  // Closes the theme list when the pointer leaves the switcher
  themeSwitcher.addEventListener('mouseleave', () => {
    if (window.matchMedia('(hover: hover)').matches) {
      themeSwitcher.classList.remove('open');
    }
  });
});

// ThemeExpandSwitch.js
const themeSwitcher = document.getElementById("themeSwitcher");

let collapseTimer;

// Cancels pending collapse when the switcher is re-entered
themeSwitcher.addEventListener("mouseenter", () => {
  clearTimeout(collapseTimer);
});

// Delays collapse slightly to improve hover usability
themeSwitcher.addEventListener("mouseleave", () => {
  collapseTimer = setTimeout(() => {
    themeSwitcher.classList.remove("open");
  }, 400);
});
