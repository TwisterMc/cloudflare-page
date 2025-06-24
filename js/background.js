'use strict';

// Configuration
const CONFIG = Object.freeze({
  backgrounds: [
    'pink-blue-wave.jpg',
    'blue-pink-grad.jpg',
    'dark-circuits.jpg'
  ]
});

class ThemeManager {
  constructor() {
    this.root = document.documentElement;
    this.themeSwitch = document.getElementById('theme-switch');
    this.setupThemeHandler();
  }

  setTheme(isDark) {
    try {
      this.root.setAttribute('data-theme', isDark ? 'dark' : 'light');
    } catch (error) {
      console.error('Failed to set theme:', error);
    }
  }

  setupThemeHandler() {
    this.themeSwitch?.addEventListener('change', (e) => {
      this.setTheme(e.target.checked);
    });
  }

  initialize() {
    this.setTheme(false);
    if (this.themeSwitch) {
      this.themeSwitch.checked = false;
    }
  }
}

class BackgroundManager {
  constructor() {
    this.root = document.documentElement;
  }

  setBackground(imageName) {
    try {
      this.root.style.setProperty('--random-bg-image', `url('images/${imageName}')`);
    } catch (error) {
      console.error('Failed to set background:', error);
    }
  }

  setRandomBackground() {
    const randomImage = CONFIG.backgrounds[Math.floor(Math.random() * CONFIG.backgrounds.length)];
    this.setBackground(randomImage);
  }
}

class ModalManager {
  constructor() {
    this.modal = document.getElementById('settings-modal');
    this.settingsButton = document.querySelector('.settings-button');
    this.closeButton = document.querySelector('.close-button');
    this.backgroundOptions = document.querySelectorAll('input[name="background"]');
    this.backgroundManager = new BackgroundManager();
    
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleOutsideClick = this.handleOutsideClick.bind(this);
    
    this.setupEventListeners();
  }

  getFocusableElements() {
    return [...this.modal?.querySelectorAll(
      'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
    ) ?? []];
  }

  handleTabKey(e) {
    if (this.modal?.hidden) return;

    const focusableElements = this.getFocusableElements();
    if (!focusableElements.length) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey && document.activeElement === firstElement) {
      e.preventDefault();
      lastElement.focus();
    } else if (!e.shiftKey && document.activeElement === lastElement) {
      e.preventDefault();
      firstElement.focus();
    }
  }

  setBackgroundInert(inert) {
    const elements = [
      document.querySelector('.wrapper'),
      document.querySelector('.settings-button')
    ];

    elements.forEach(element => {
      if (element) {
        element.inert = inert;
      }
    });
  }

  openModal() {
    if (!this.modal) return;
    
    this.modal.hidden = false;
    this.setBackgroundInert(true);
    
    const firstFocusable = this.getFocusableElements()[0];
    firstFocusable?.focus();
  }

  closeModal() {
    if (!this.modal) return;
    
    this.modal.hidden = true;
    this.setBackgroundInert(false);
    this.settingsButton?.focus();
  }

  handleKeyDown(e) {
    if (this.modal?.hidden) return;
    
    if (e.key === 'Escape') {
      this.closeModal();
    } else if (e.key === 'Tab') {
      this.handleTabKey(e);
    }
  }

  handleOutsideClick(e) {
    if (e.target === this.modal) {
      this.closeModal();
    }
  }

  setupEventListeners() {
    this.settingsButton?.addEventListener('click', () => this.openModal());
    this.closeButton?.addEventListener('click', () => this.closeModal());
    
    document.addEventListener('keydown', this.handleKeyDown);
    this.modal?.addEventListener('click', this.handleOutsideClick);

    this.backgroundOptions?.forEach(option => {
      option.addEventListener('change', (e) => {
        this.backgroundManager.setBackground(e.target.value);
      });
    });
  }

  cleanup() {
    document.removeEventListener('keydown', this.handleKeyDown);
    this.modal?.removeEventListener('click', this.handleOutsideClick);
  }
}

// Initialize application
function initializeApp() {
  try {
    const themeManager = new ThemeManager();
    const backgroundManager = new BackgroundManager();
    const modalManager = new ModalManager();

    // Initialize theme and background
    themeManager.initialize();
    backgroundManager.setRandomBackground();

    // Cleanup on page unload
    window.addEventListener('unload', () => {
      modalManager.cleanup();
    });

  } catch (error) {
    console.error('Failed to initialize application:', error);
  }
}

// Start the application when DOM is fully loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
}
