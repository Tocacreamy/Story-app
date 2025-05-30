import { safeAnimate } from "../utils/index.js";

class DetailStoryView {
  getTemplate() {
    return `
      <a href="#main-content" class="skip-link">Skip to content</a>
      <section class="container">
        <a href="#/" class="back-button">← Back to Stories</a>
        <h1>Story Details</h1>
        <div id="auth-status"></div>
        <main id="main-content" tabindex="-1">
          <div id="story-container" class="detail-story-container">
            <p class="loading-text">Loading story details...</p>
          </div>
        </main>
      </section>
    `;
  }

  showLoginMessage() {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message">
        <p>You must be logged in to view story details</p>
        <a href="#/login" class="login-btn">Login</a>
        <span>or</span>
        <a href="#/register" class="register-btn">Register</a>
      </div>
    `;
    document.getElementById("story-container").innerHTML = "";
  }

  showAuthenticatedUser(userName) {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome, ${userName}!</p>
      </div>
    `;
  }

  showLoading() {
    const storyContainer = document.getElementById("story-container");
    storyContainer.innerHTML =
      "<p class='loading-text'>Loading story details...</p>";
  }

  showError(message) {
    const storyContainer = document.getElementById("story-container");
    storyContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
  }

  displayStory(storyData, formattedDate, hasLocation = false) {
    const storyContainer = document.getElementById("story-container");

    let storyHTML = `
      <div class="detail-story">
        <div class="detail-story-header">
          <h2 style="view-transition-name: story-title-${storyData.id}">${storyData.name}</h2>
          <p class="story-date">${formattedDate}</p>
        </div>
        
        <div class="detail-story-image">
          <img src="${storyData.photoUrl}" 
               alt="${storyData.name}'s story" 
               class="story-photo" 
               style="view-transition-name: story-image-${storyData.id}">
        </div>
        
        <div class="detail-story-content">
          <p class="story-description">${storyData.description}</p>
        </div>
    `;

    if (hasLocation) {
      storyHTML += `
        <div class="detail-story-location">
          <h3>Location</h3>
          <div id="story-map" class="story-map"></div>
        </div>
      `;
    }

    storyHTML += `</div>`;

    storyContainer.innerHTML = storyHTML;
  }

  animateStoryElements() {
    // Get the elements to animate
    const storyHeader = document.querySelector(".detail-story-header");
    const storyImage = document.querySelector(".detail-story-image");
    const storyContent = document.querySelector(".detail-story-content");
    const storyLocation = document.querySelector(".detail-story-location");

    // Header animation
    if (storyHeader) {
      safeAnimate(
        storyHeader,
        [
          { opacity: 0, transform: "translateY(-20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.2, 0, 0.2, 1)",
          fill: "forwards",
        }
      );
    }

    // Image animation - scale up
    if (storyImage) {
      safeAnimate(
        storyImage,
        [
          { opacity: 0, transform: "scale(0.95)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        {
          duration: 800,
          easing: "cubic-bezier(0.2, 0, 0.2, 1)",
          fill: "forwards",
          delay: 200,
        }
      );
    }

    // Content animation - fade in
    if (storyContent) {
      safeAnimate(
        storyContent,
        [
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.2, 0, 0.2, 1)",
          fill: "forwards",
          delay: 400,
        }
      );
    }

    // Location section animation if it exists
    if (storyLocation) {
      safeAnimate(
        storyLocation,
        [
          { opacity: 0, transform: "translateY(20px)" },
          { opacity: 1, transform: "translateY(0)" },
        ],
        {
          duration: 600,
          easing: "cubic-bezier(0.2, 0, 0.2, 1)",
          fill: "forwards",
          delay: 600,
        }
      );
    }
  }

  animateMapContainer() {
    const mapContainer = document.getElementById("story-map");
    if (mapContainer) {
      safeAnimate(
        mapContainer,
        [
          { opacity: 0, transform: "scale(0.95)" },
          { opacity: 1, transform: "scale(1)" },
        ],
        {
          duration: 800,
          easing: "ease-out",
          fill: "forwards",
        }
      );
    }
  }
}

export default DetailStoryView;
