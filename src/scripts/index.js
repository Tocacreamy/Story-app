// CSS imports
import "../styles/main.css";

import App from "./pages/app";

document.addEventListener("DOMContentLoaded", async () => {
  const app = new App({
    content: document.querySelector("#main-content"),
    drawerButton: document.querySelector("#drawer-button"),
    navigationDrawer: document.querySelector("#navigation-drawer"),
  });
  await app.renderPage();

  window.addEventListener("hashchange", async () => {
    await app.renderPage();
  });

  // Set up the skip link functionality
  const mainContent = document.querySelector("#main-content");
  const skipLink = document.querySelector(".skip-link");

  skipLink.addEventListener("click", function (event) {
    event.preventDefault(); 
    skipLink.blur(); 
    mainContent.focus(); 
    mainContent.scrollIntoView(); 
  });
});
