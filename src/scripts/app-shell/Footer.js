export default class Footer {
  getTemplate() {
    return `
      <footer class="site-footer" role="contentinfo">
        <div class="container footer-content">
          <div class="footer-branding">
            <a href="#/" class="footer-brand">Story App</a>
            <p>Share your moments with the world.</p>
          </div>
          <div class="footer-info">
            <div class="app-status">
              <span id="online-status" class="status-indicator" aria-live="polite">
                <span class="status-dot"></span>
                <span class="status-text">Online</span>
              </span>
            </div>
            <div class="footer-made">
              <p>made with 💗 by Toca</p>
            </div>
          </div>
        </div>
        <div class="footer-copyright">
          <div class="container">
            <p>
              &copy; <span id="current-year">${new Date().getFullYear()}</span> Story App. 
              All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    `;
  }
}
