import { getCachedStories, deleteStory } from '../database.js';

class SavedStoriesPresenter {
  constructor(view) {
    this.view = view;
  }

  async init() {
    await this._loadSavedStories();
    this._setupStoryDeletion();
  }

  async _loadSavedStories() {
    try {
      const cachedStories = await getCachedStories();
      this.view.displayStories(cachedStories);
    } catch (error) {
      console.error("Error loading saved stories:", error);
      this.view.showErrorMessage("Error loading saved stories: " + error.message);
    }
  }

  _setupStoryDeletion() {
    const savedStoriesContainer = document.getElementById("saved-stories-container");
    if (savedStoriesContainer) {
      savedStoriesContainer.addEventListener("click", async (event) => {
        if (event.target.classList.contains("delete-story-btn")) {
          const storyId = event.target.dataset.id;
          if (confirm("Are you sure you want to delete this saved story?")) {
            try {
              await deleteStory(storyId);
              console.log(`Saved story with ID ${storyId} deleted.`);
              await this._loadSavedStories(); // Refresh the view after deletion
            } catch (error) {
              console.error("Error deleting saved story:", error);
              this.view.showErrorMessage("Error: Failed to delete saved story: " + error.message);
            }
          }
        }
      });
    }
  }
}

export default SavedStoriesPresenter; 