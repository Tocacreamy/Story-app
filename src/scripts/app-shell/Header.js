import Navigation from "./Navigation.js";

export default class Header {
  constructor() {
    this.navigation = new Navigation();
  }

  getTemplate() {
    return `
      <header class="app-header" role="banner">
        <div class="main-header container">
          <a href="#main-content" class="skip-link">Skip to main content</a>
          <a class="brand-name" href="#/" aria-label="Story App - Go to home page">
            <span class="brand-text">Story App</span>
          </a>

          ${this.navigation.getTemplate()}

          <button
            id="drawer-button"
            class="drawer-button"
            aria-expanded="false"
            aria-controls="navigation-drawer"
            aria-label="Toggle navigation menu"
          >
            <span class="hamburger-icon">☰</span>
          </button>

          <div id="install-prompt" class="install-prompt" style="display: none;">
            <button id="install-button" class="install-button" aria-label="Install Story App">
              <span>📱</span>
              <span>Install App</span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  bindEvents() {
    // Install prompt will be handled by PWA utilities
  }
}
