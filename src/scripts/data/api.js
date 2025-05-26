import CONFIG from "../config";

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  GETALLSTORIES: `${CONFIG.BASE_URL}/stories`,
  ADDNEWSTORY: `${CONFIG.BASE_URL}/stories`,
};

export const register = async (name, email, password) => {
  try {
    const response = await fetch(ENDPOINTS.REGISTER, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data;
  } catch (error) {
    console.error("Registration error", error);
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    const response = await fetch(ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (data.loginResult && data.loginResult.token) {
      localStorage.setItem("token", data.loginResult.token);
      localStorage.setItem("userId", data.loginResult.userId);
      localStorage.setItem("name", data.loginResult.name);

      window.location.hash = "#/";
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const getAllStories = async () => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must be logged in to view stories");
    }

    const response = await fetch(ENDPOINTS.GETALLSTORIES, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch stories");
    }

    return data.listStory || [];
  } catch (error) {
    console.error("Error fetching stories:", error);
    throw error;
  }
};

export const addNewStory = async (description, photo ,lat = null, lon = null) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("You must be logged in to add a story");
    }

    const formData = new FormData();
    formData.append("description", description);
    formData.append("photo", photo);

    if (lat !== null && lon !== null) {
      formData.append("lat", lat);
      formData.append("lon", lon);
    }

    const response = await fetch(ENDPOINTS.ADDNEWSTORY, {
      method: `POST`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Failed to add story");
    }

    return data;
  } catch (error) {
    console.error("Error adding new story:", error);
    throw error;
  }
};
