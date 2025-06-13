import "../styles/main.css";
import "../styles/app-shell.css";

import App from "./pages/app";
import AppShell from "./app-shell/AppShell.js";
import PushNotificationManager from "./utils/pushNotification.js";
import InstallPromptManager from "./pwa/installPrompt.js";
import OfflineManager from "./pwa/offlineManager.js";
import CacheManager from "./pwa/cacheManager.js";

class StoryApp {
  constructor() {
    this.appShell = new AppShell();
    this.app = null;
    this.pushManager = new PushNotificationManager();
    this.installPrompt = new InstallPromptManager();
    this.offlineManager = new OfflineManager();
    this.cacheManager = new CacheManager();
  }

  async init() {
    try {
      // Initialize app shell first (static content)
      this.appShell.init();

      // Initialize PWA features
      await this.initializePWA();

      // Initialize main app (dynamic content)
      await this.initializeApp();

      // Setup navigation
      this.setupNavigation();

      console.log("✅ Story App initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize Story App:", error);
      this.showInitializationError(error);
    }
  }

  async initializePWA() {
    // Initialize service worker and push notifications
    const initResult = await this.pushManager.init();
    if (initResult.success) {
      console.log("✅ Push notifications initialized");
    } else {
      console.warn("⚠️ Push notifications failed:", initResult.error);
    }

    // Cache app shell
    await this.cacheManager.cacheShellResources();

    // Make managers globally available
    window.pushManager = this.pushManager;
    window.offlineManager = this.offlineManager;
    window.cacheManager = this.cacheManager;
  }

  async initializeApp() {
    this.app = new App({
      content: document.querySelector("#main-content"),
      appShell: this.appShell,
    });

    await this.app.renderPage();
  }

  setupNavigation() {
    window.addEventListener("hashchange", async () => {
      if (this.app) {
        this.appShell.showLoader();
        await this.app.renderPage();
        this.appShell.hideLoader();
      }
    });

    // Handle back/forward browser navigation
    window.addEventListener("popstate", async () => {
      if (this.app) {
        await this.app.renderPage();
      }
    });
  }

  showInitializationError(error) {
    document.body.innerHTML = `
      <div class="initialization-error">
        <h1>Initialization Error</h1>
        <p>Failed to initialize Story App. Please refresh the page and try again.</p>
        <p class="error-details">Error: ${error.message}</p>
        <button onclick="window.location.reload()" class="retry-button">
          Retry
        </button>
      </div>
    `;
  }
}

// Initialize app when DOM is ready
document.addEventListener("DOMContentLoaded", async () => {
  const storyApp = new StoryApp();
  await storyApp.init();
});

// Handle service worker updates
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    console.log("🔄 Service worker updated, reloading page");
    window.location.reload();
  });
}
