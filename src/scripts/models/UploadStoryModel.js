import { addNewStory } from "../data/api.js";

class UploadStoryModel {
  isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  getUserName() {
    return localStorage.getItem("name") || "User";
  }

  async uploadStory(description, photoFile, lat = null, lng = null) {
    try {
      if (!this.isUserLoggedIn()) {
        throw new Error("You must be logged in to upload stories");
      }

      // Use the API function to upload the story
      const response = await addNewStory(description, photoFile, lat, lng);
      return {
        success: true,
        data: response,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || "Failed to upload story",
      };
    }
  }

  validateStoryData(description, photoFile) {
    const errors = [];

    if (!description) {
      errors.push("Please enter a story description");
    }

    if (!photoFile) {
      errors.push("Please select an image or take a photo");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export default UploadStoryModel;
