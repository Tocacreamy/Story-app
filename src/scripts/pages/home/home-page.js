import { getAllStories } from "../../data/api.js";

export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Beranda</h1>
        <div id="auth-status"></div>
        <div id="stories-container" class="stories-grid">
          <p class="loading-text">Loading stories...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const authStatus = document.getElementById("auth-status");
    const storiesContainer = document.getElementById("stories-container");

    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");

    if (!token) {
      authStatus.innerHTML = `
        <div class="auth-message">
          <p>Please log in to view stories</p>
          <a href="#/login" class="login-btn">Login</a>
          <span>or</span>
          <a href="#/register" class="register-btn">Register</a>
        </div>
      `;
      storiesContainer.innerHTML = "";
      return;
    }

    // User is logged in
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome back, ${userName || "User"}!</p>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    `;

    // Add logout functionality
    document.getElementById("logout-btn").addEventListener("click", () => {
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      localStorage.removeItem("name");
      window.location.hash = "#/login";
    });

    // Fetch and display stories
    try {
      const stories = await getAllStories();

      if (stories.length === 0) {
        storiesContainer.innerHTML = "<p>No stories found</p>";
        return;
      }

      // Display stories in a grid layout
      storiesContainer.innerHTML = stories
        .map(
          (story) => `
        <div class="story-card" style="view-transition-name: story-card-${story.id}">
          <img src="${story.photoUrl}" 
               alt="Story image uploaded by ${story.name}" 
               class="story-image"
               style="view-transition-name: story-image-${story.id}">
          <div class="story-content">
            <h3 style="view-transition-name: story-title-${story.id}">${story.name}</h3>
            <p class="story-desc">${story.description}</p>
            <a href="#/detail/${story.id}" class="read-more" aria-label="Read more about ${story.name}'s story">Read More</a>
          </div>
        </div>
      `
        )
        .join("");
    } catch (error) {
      storiesContainer.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
  }
}
