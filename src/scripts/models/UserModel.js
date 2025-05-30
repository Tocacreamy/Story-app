import CONFIG from "../config";

class UserModel {
  constructor() {
    this.baseUrl = CONFIG.BASE_URL;
    this.endpoints = {
      LOGIN: `${this.baseUrl}/login`,
      REGISTER: `${this.baseUrl}/register`,
    };
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
        localStorage.setItem("token", data.loginResult.token);
        localStorage.setItem("userId", data.loginResult.userId);
        localStorage.setItem("name", data.loginResult.name);

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
    return !!localStorage.getItem("token");
  }

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("name");
  }

  getUserName() {
    return localStorage.getItem("name") || "User";
  }
}

export default UserModel;
