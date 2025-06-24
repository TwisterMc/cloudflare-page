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

// Get all focusable elements in the modal
function getFocusableElements() {
  return modal.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
}

// Focus trap handling
function handleTabKey(e) {
  if (!modal.hidden) {
    const focusableElements = getFocusableElements();
    const firstFocusableElement = focusableElements[0];
    const lastFocusableElement = focusableElements[focusableElements.length - 1];

    // If shift + tab
    if (e.shiftKey) {
      if (document.activeElement === firstFocusableElement) {
        e.preventDefault();
        lastFocusableElement.focus();
      }
    } 
    // If just tab
    else {
      if (document.activeElement === lastFocusableElement) {
        e.preventDefault();
        firstFocusableElement.focus();
      }
    }
  }
}

// Set inert on all siblings of the modal
function setBackgroundInert(inert) {
  const wrapper = document.querySelector('.wrapper');
  const settingsBtn = document.querySelector('.settings-button');
  
  if (inert) {
    wrapper.inert = true;
    settingsBtn.inert = true;
  } else {
    wrapper.inert = false;
    settingsBtn.inert = false;
  }
}

// Open modal
settingsButton.addEventListener('click', () => {
  modal.hidden = false;
  setBackgroundInert(true);
  
  // Set current background as checked
  const currentBg = localStorage.getItem('selectedBackground');
  if (currentBg) {
    const radio = document.getElementById(currentBg.replace('.jpg', ''));
    if (radio) radio.checked = true;
  }
  
  // Focus first interactive element
  const firstFocusable = getFocusableElements()[0];
  if (firstFocusable) firstFocusable.focus();
});

// Close modal
function closeModal() {
  modal.hidden = true;
  setBackgroundInert(false);
  settingsButton.focus();
}

closeButton.addEventListener('click', closeModal);

// Handle keyboard events
document.addEventListener('keydown', (e) => {
  if (modal.hidden) return;
  
  if (e.key === 'Escape') {
    closeModal();
  } else if (e.key === 'Tab') {
    handleTabKey(e);
  }
});

// Close on outside click
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});

// Handle background selection
backgroundOptions.forEach(option => {
  option.addEventListener('change', (e) => {
    setBackground(e.target.value);
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
