import routes from "../routes/routes";
import { getActiveRoute } from "../routes/url-parser";

class App {
  #content = null;
  #drawerButton = null;
  #navigationDrawer = null;
  #currentPage = null;

  constructor({ navigationDrawer, drawerButton, content }) {
    this.#content = content;
    this.#drawerButton = drawerButton;
    this.#navigationDrawer = navigationDrawer;

    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      const isOpen = this.#navigationDrawer.classList.toggle("open");
      this.#drawerButton.setAttribute(
        "aria-expanded",
        isOpen ? "true" : "false"
      );
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  async renderPage() {
    const url = getActiveRoute();
    const page = routes[url];

    // Cleanup previous page if it has cleanup method
    if (this.#currentPage && typeof this.#currentPage.cleanup === "function") {
      this.#currentPage.cleanup();
    }

    // Check if View Transitions API is supported
    if (
      document.startViewTransition &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      // Use View Transitions API
      const transition = document.startViewTransition(async () => {
        // Render the new page content
        this.#content.innerHTML = await page.render();
        await page.afterRender();

        // Set focus to the main content area
        this.#content.focus();

        // Announce page change for screen readers
        this.#announcePageChange();
      });

      // Wait for the transition to finish
      await transition.finished;
    } else {
      // Fallback for browsers that don't support View Transitions API
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      this.#content.focus();
      this.#announcePageChange();
    }

    // Store current page reference
    this.#currentPage = page;
  }

  #announcePageChange() {
    const pageTitle = this.#content.querySelector("h1");
    if (pageTitle) {
      const announcer = document.createElement("div");
      announcer.setAttribute("aria-live", "assertive");
      announcer.classList.add("visually-hidden");
      announcer.textContent = `Navigated to ${pageTitle.textContent}`;
      document.body.appendChild(announcer);

      setTimeout(() => {
        document.body.removeChild(announcer);
      }, 1000);
    }
  }
}

export default App;
