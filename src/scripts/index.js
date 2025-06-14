// CSS imports
import "../styles/main.css";

import App from "./pages/app";
import PushNotificationManager from "./utils/pushNotification.js";

let deferredPrompt = null; // Initialize to null explicitly
const installButton = document.getElementById('install-button');

const setupInstallPrompt = () => {
  console.log('setupInstallPrompt function called.');
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    // Stash the event so it can be triggered later.
    deferredPrompt = e;
    console.log('beforeinstallprompt fired, deferredPrompt set:', deferredPrompt);
    // Update UI to notify the user they can install the PWA
    if (installButton) {
      installButton.style.display = 'block';
    }
  });

  if (installButton) {
    installButton.addEventListener('click', async () => {
      console.log('Install button clicked. deferredPrompt value:', deferredPrompt);
      // Hide the app provided install promotion
      if (installButton) {
        installButton.style.display = 'none';
      }
      // Show the install prompt
      if (deferredPrompt) {
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        // Optionally, send analytics event with outcome of user choice
        console.log(`User response to the install prompt: ${outcome}`);
        // We've used the prompt, and now it can't be used again, clear it
        deferredPrompt = null;
      } else {
        console.warn('deferredPrompt is null, cannot show install prompt.');
      }
    });
  }
};

function updateOnlineStatus() {
  const indicator = document.getElementById('offline-indicator');
  if (!navigator.onLine) {
    indicator.style.display = 'block';
    document.body.classList.add('has-offline-indicator');
  } else {
    indicator.style.display = 'none';
    document.body.classList.remove('has-offline-indicator');
  }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

document.addEventListener("DOMContentLoaded", async () => {
  updateOnlineStatus();
  setupInstallPrompt(); // Call the setup function

  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });

  // Initialize push notifications
  const pushManager = new PushNotificationManager();
  window.pushManager = pushManager; // Make it globally available

  // Initialize service worker and push notifications
  const initResult = await pushManager.init();
  if (initResult.success) {
    console.log("Push notifications initialized successfully");
  } else {
    console.warn("Push notifications initialization failed:", initResult.error);
  }

  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  // Enhanced skip link functionality
  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  if (skipLink && mainContent) {
    skipLink.addEventListener("click", function (event) {
      event.preventDefault();
      skipLink.blur();
      mainContent.focus();
      mainContent.scrollIntoView({ behavior: "smooth", block: "start" });

      // Announce the action for screen readers
      const announcement = document.createElement("div");
      announcement.setAttribute("aria-live", "assertive");
      announcement.className = "visually-hidden";
      announcement.textContent = "Skipped to main content";
      document.body.appendChild(announcement);

      setTimeout(() => {
        document.body.removeChild(announcement);
      }, 1000);
    });
  }
});
