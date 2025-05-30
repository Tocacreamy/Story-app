import { getAllStories } from "../data/api.js";

class StoryModel {
  async getStories() {
    try {
      return await getAllStories();
    } catch (error) {
      throw new Error(`Failed to fetch stories: ${error.message}`);
    }
  }

  isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  getUserName() {
    return localStorage.getItem("name") || "User";
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
  }
}

export default StoryModel;
