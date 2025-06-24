const backgroundImages = [
  'pink-blue-wave.jpg',
  'blue-pink-grad.jpg',
  'dark-circuits.jpg'
];

// Theme handling
function setTheme(isDark) {
  document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

function initializeTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = savedTheme ? savedTheme === 'dark' : prefersDark;
  setTheme(isDark);
  document.getElementById('theme-switch').checked = isDark;
}

// Background handling
function setBackground(imageName) {
  document.documentElement.style.setProperty('--random-bg-image', `url('images/${imageName}')`);
  localStorage.setItem('selectedBackground', imageName);
}

function setRandomBackground() {
  const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];
  setBackground(randomImage);
}

// Modal handling
const settingsButton = document.querySelector('.settings-button');
const modal = document.getElementById('settings-modal');
const closeButton = document.querySelector('.close-button');
const backgroundOptions = document.querySelectorAll('input[name="background"]');

// Open modal
settingsButton.addEventListener('click', () => {
  modal.hidden = false;
  // Set current background as checked
  const currentBg = localStorage.getItem('selectedBackground');
  if (currentBg) {
    const radio = document.getElementById(currentBg.replace('.jpg', ''));
    if (radio) radio.checked = true;
  }
  // Focus first radio button
  backgroundOptions[0].focus();
});

// Close modal
function closeModal() {
  modal.hidden = true;
  settingsButton.focus();
}

closeButton.addEventListener('click', closeModal);

// Close on escape key
modal.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Close on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Handle background selection
backgroundOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    setBackground(e.target.value);
    closeModal();
  });
});

// Theme switch handling
const themeSwitch = document.getElementById('theme-switch');
themeSwitch.addEventListener('change', (e) => {
  setTheme(e.target.checked);
});

// Initialize theme
initializeTheme();

// Set initial background
const savedBackground = localStorage.getItem('selectedBackground');
if (savedBackground) {
  setBackground(savedBackground);
} else {
  setRandomBackground();
}
