class HomeView {
  constructor() {
    this.app = document.getElementById("app") || document.body;
  }

  getTemplate() {
    return `
      <a href="#main-content" class="skip-link">Skip to content</a>
      <section class="container">
        <h1>Beranda</h1>
        <div id="auth-status"></div>
        <main id="main-content" tabindex="-1">
          <div id="stories-container" class="stories-grid">
            <p class="loading-text">Loading stories...</p>
          </div>
        </main>
      </section>
    `;
  }

  showLoginMessage() {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message">
        <p>Please log in to view stories</p>
        <a href="#/login" class="login-btn">Login</a>
        <span>or</span>
        <a href="#/register" class="register-btn">Register</a>
      </div>
    `;

    document.getElementById("stories-container").innerHTML = "";
  }

  showAuthenticatedUser(userName) {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome back, ${userName}!</p>
        <button id="logout-btn" class="logout-btn">Logout</button>
      </div>
    `;
  }

  displayStories(stories) {
    const storiesContainer = document.getElementById("stories-container");

    if (stories.length === 0) {
      storiesContainer.innerHTML = "<p>No stories found</p>";
      return;
    }

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
  }

  showErrorMessage(message) {
    const storiesContainer = document.getElementById("stories-container");
    storiesContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
  }

  bindLogoutButton(handler) {
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", handler);
    }
  }
}

export default HomeView;
