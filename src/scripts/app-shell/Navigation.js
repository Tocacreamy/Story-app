export default class Navigation {
  constructor() {
    this.currentPath = window.location.hash.replace("#", "") || "/";
  }

  getTemplate() {
    return `
      <nav
        id="navigation-drawer"
        class="navigation-drawer"
        aria-label="Main navigation"
      >
        <ul id="nav-list" class="nav-list" role="menubar">
          <li role="none">
            <a href="#/" 
               role="menuitem" 
               class="nav-link ${this.currentPath === "/" ? "active" : ""}"
               aria-current="${this.currentPath === "/" ? "page" : "false"}">
              <span class="nav-icon">🏠</span>
              <span class="nav-text">Beranda</span>
            </a>
          </li>
          <li role="none">
            <a href="#/uploadStory" 
               role="menuitem" 
               class="nav-link ${
                 this.currentPath === "/uploadStory" ? "active" : ""
               }"
               aria-current="${
                 this.currentPath === "/uploadStory" ? "page" : "false"
               }">
              <span class="nav-icon">📷</span>
              <span class="nav-text">Upload Story</span>
            </a>
          </li>
          <li role="none">
            <a href="#/notifications" 
               role="menuitem" 
               class="nav-link ${
                 this.currentPath === "/notifications" ? "active" : ""
               }"
               aria-current="${
                 this.currentPath === "/notifications" ? "page" : "false"
               }">
              <span class="nav-icon">🔔</span>
              <span class="nav-text">Notifications</span>
            </a>
          </li>
        </ul>
      </nav>
    `;
  }

  bindEvents() {
    // Update active states on navigation
    window.addEventListener("hashchange", () => {
      this.updateActiveStates();
    });
  }

  updateActiveStates() {
    this.currentPath = window.location.hash.replace("#", "") || "/";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
      const href = link.getAttribute("href").replace("#", "");
      const isActive = href === this.currentPath;

      link.classList.toggle("active", isActive);
      link.setAttribute("aria-current", isActive ? "page" : "false");
    });
  }
}
