import CONFIG from "../config";

export default class UserModel {
  constructor() {
    this.baseUrl = CONFIG.BASE_URL;
    this.endpoints = {
      LOGIN: `${this.baseUrl}/login`,
      REGISTER: `${this.baseUrl}/register`,
    };
    this.storageKey = "user_session";
  }

  async login(email, password) {
    try {
      const response = await fetch(this.endpoints.LOGIN, {
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
        // Store user data in localStorage
        this.setUserSession(data.loginResult.token, {
          userId: data.loginResult.userId,
          name: data.loginResult.name,
        });

        return data.loginResult;
      }

      throw new Error("Invalid response format");
    } catch (error) {
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const response = await fetch(this.endpoints.REGISTER, {
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
      throw error;
    }
  }

  isLoggedIn() {
    const token = this.getToken();
    return !!token;
  }

  getToken() {
    return localStorage.getItem("token");
  }

  getUserName() {
    const userData = localStorage.getItem(this.storageKey);
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.name;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return null;
      }
    }
    return null;
  }

  setUserSession(token, userData) {
    localStorage.setItem("token", token);
    localStorage.setItem(this.storageKey, JSON.stringify(userData));
  }

  clearUserSession() {
    localStorage.removeItem("token");
    localStorage.removeItem(this.storageKey);
  }

  logout() {
    this.clearUserSession();
  }
}
