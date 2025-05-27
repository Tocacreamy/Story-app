import { detailStory } from "../../data/api.js";
import { parseActivePathname } from "../../routes/url-parser.js";
import { showFormattedDate, safeAnimate } from "../../utils/index.js";
import MapHandler from "../../utils/mapHandler.js";

export default class DetailStory {
  constructor() {
    this.mapHandler = new MapHandler();
  }

  async render() {
    return `
      <section class="container">
        <a href="#/" class="back-button">← Back to Stories</a>
        <h1>Story Details</h1>
        <div id="auth-status"></div>
        
        <div id="story-container" class="detail-story-container">
          <p class="loading-text">Loading story details...</p>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const authStatus = document.getElementById("auth-status");
    const storyContainer = document.getElementById("story-container");

    // Check authentication
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");

    if (!token) {
      authStatus.innerHTML = `
        <div class="auth-message">
          <p>You must be logged in to view story details</p>
          <a href="#/login" class="login-btn">Login</a>
          <span>or</span>
          <a href="#/register" class="register-btn">Register</a>
        </div>
      `;
      storyContainer.innerHTML = "";
      return;
    }

    // User is logged in
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome, ${userName || "User"}!</p>
      </div>
    `;

    try {
      // Get the story ID from URL
      const { id } = parseActivePathname();

      if (!id) {
        storyContainer.innerHTML =
          "<p class='error-message'>Story ID not found in URL</p>";
        return;
      }

      // Fetch the story details
      const story = await detailStory(id);

      if (!story || !story.story) {
        storyContainer.innerHTML =
          "<p class='error-message'>Story not found</p>";
        return;
      }
      const storyData = story.story;

      // Format the date
      const formattedDate = showFormattedDate(storyData.createdAt);

      // Create the HTML for the story
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

      if (storyData.lat && storyData.lon) {
        storyHTML += `
          <div class="detail-story-location">
            <h3>Location</h3>
            <div id="story-map" class="story-map"></div>
          </div>
        `;
      }

      storyHTML += `</div>`;

      storyContainer.innerHTML = storyHTML;

      // Initialize the map if coordinates are available
      if (storyData.lat && storyData.lon) {
        await this.initializeMap(storyData);
      }

      // Animate elements after they're added to the DOM
      const animateStoryElements = () => {
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
      };

      // Call animation function after content is loaded
      animateStoryElements();
    } catch (error) {
      storyContainer.innerHTML = `<p class="error-message">Error: ${error.message}</p>`;
    }
  }

  async initializeMap(storyData) {
    try {
      // Initialize the map
      const result = await this.mapHandler.init("story-map", {
        center: [storyData.lat, storyData.lon],
        zoom: 15,
      });

      if (result.success) {
        // Add a marker for the story location
        this.mapHandler.setMarker(storyData.lat, storyData.lon);

        // Animate map container
        const mapContainer = document.getElementById("story-map");

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
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }
}
