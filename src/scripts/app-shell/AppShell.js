import Header from "./Header.js";
import Navigation from "./Navigation.js";
import Footer from "./Footer.js";

export default class AppShell {
  constructor() {
    this.header = new Header();
    this.navigation = new Navigation();
    this.footer = new Footer();
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;

    this.renderShell();
    this.bindEvents();
    this.isInitialized = true;
  }

  renderShell() {
    document.body.innerHTML = `
      ${this.header.getTemplate()}
      <main id="main-content" class="main-content" tabindex="-1" role="main">
        <div id="content-loader" class="content-loader" aria-hidden="true">
          <div class="loader-spinner"></div>
          <p>Loading...</p>
        </div>
      </main>
      ${this.footer.getTemplate()}
    `;
  }

  bindEvents() {
    this.header.bindEvents();
    this.navigation.bindEvents();

    // Handle navigation drawer
    this.setupDrawer();

    // Handle skip link
    this.setupSkipLink();
  }

  setupDrawer() {
    const drawerButton = document.querySelector("#drawer-button");
    const navigationDrawer = document.querySelector("#navigation-drawer");

    if (drawerButton && navigationDrawer) {
      drawerButton.addEventListener("click", () => {
        const isOpen = navigationDrawer.classList.toggle("open");
        drawerButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });

      // Close drawer when clicking outside
      document.body.addEventListener("click", (event) => {
        if (
          !navigationDrawer.contains(event.target) &&
          !drawerButton.contains(event.target)
        ) {
          navigationDrawer.classList.remove("open");
          drawerButton.setAttribute("aria-expanded", "false");
        }
      });

      // Close drawer when clicking navigation links
      navigationDrawer.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          navigationDrawer.classList.remove("open");
          drawerButton.setAttribute("aria-expanded", "false");
        });
      });
    }
  }

  setupSkipLink() {
    const mainContent = document.querySelector("#main-content");
    const skipLink = document.querySelector(".skip-link");

    if (skipLink && mainContent) {
      skipLink.addEventListener("click", (event) => {
        event.preventDefault();
        skipLink.blur();
        mainContent.focus();
        mainContent.scrollIntoView({ behavior: "smooth", block: "start" });

        // Announce for screen readers
        this.announceToScreenReader("Skipped to main content");
      });
    }
  }

  announceToScreenReader(message) {
    const announcement = document.createElement("div");
    announcement.setAttribute("aria-live", "assertive");
    announcement.className = "visually-hidden";
    announcement.textContent = message;
    document.body.appendChild(announcement);

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }

  showLoader() {
    const loader = document.getElementById("content-loader");
    if (loader) {
      loader.style.display = "flex";
      loader.setAttribute("aria-hidden", "false");
    }
  }

  hideLoader() {
    const loader = document.getElementById("content-loader");
    if (loader) {
      loader.style.display = "none";
      loader.setAttribute("aria-hidden", "true");
    }
  }

  updateContent(content) {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      this.hideLoader();
      mainContent.innerHTML = content;
    }
  }

  announcePageChange(pageTitle) {
    this.announceToScreenReader(`Navigated to ${pageTitle}`);
  }
}
