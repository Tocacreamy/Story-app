import { showFormattedDate } from "../utils/index.js";

class DetailStoryPresenter {
  constructor(view, model, mapHandler) {
    this.view = view;
    this.model = model;
    this.mapHandler = mapHandler;
  }

  async init(storyId) {
    // Check if user is logged in
    if (!this.model.isUserLoggedIn()) {
      this.view.showLoginMessage();
      return;
    }

    // Show authenticated user info
    const userName = this.model.getUserName();
    this.view.showAuthenticatedUser(userName);

    if (!storyId) {
      this.view.showError("Story ID not found in URL");
      return;
    }

    try {
      this.view.showLoading();

      // Fetch story details
      const storyData = await this.model.getStoryDetail(storyId);

      if (!storyData) {
        this.view.showError("Story not found");
        return;
      }

      // Format the date
      const formattedDate = showFormattedDate(storyData.createdAt);

      // Display story with location info if available
      const hasLocation = !!(storyData.lat && storyData.lon);
      this.view.displayStory(storyData, formattedDate, hasLocation);

      // Animate story elements
      this.view.animateStoryElements();

      // Initialize map if location is available
      if (hasLocation) {
        await this.initializeMap(storyData);
      }
    } catch (error) {
      this.view.showError(error.message);
      console.error("Error loading story:", error);
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

        // Animate the map container
        this.view.animateMapContainer();
      }
    } catch (error) {
      console.error("Error initializing map:", error);
    }
  }
}

export default DetailStoryPresenter;
