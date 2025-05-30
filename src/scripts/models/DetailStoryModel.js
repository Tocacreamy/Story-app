import { detailStory } from "../data/api.js";

class DetailStoryModel {
  async getStoryDetail(id) {
    try {
      const response = await detailStory(id);
      return response.story;
    } catch (error) {
      throw new Error(`Failed to fetch story details: ${error.message}`);
    }
  }

  isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  getUserName() {
    return localStorage.getItem("name") || "User";
  }
}

export default DetailStoryModel;
