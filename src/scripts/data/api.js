import CONFIG from "../config";

const ENDPOINTS = {
  LOGIN: `${CONFIG.BASE_URL}/login`,
  REGISTER: `${CONFIG.BASE_URL}/register`,
  GETALLSTORIES: `${CONFIG.BASE_URL}/stories`,
};

export const getData = async () => {
  const fetchResponse = await fetch(ENDPOINTS.GETALLSTORIES);
  return await fetchResponse.json();
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
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    alert("REGIST BERHASIL");
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
    }

    alert("LOGIN BERHASIL");
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};
