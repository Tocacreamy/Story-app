import { register } from "../../data/api.js";

export default class Register {
  async render() {
    return `
        <section class="container register-container">
        <div class="register-card">
          <h1 class="register-title">Create an Account</h1>
          
          <form id="register-form">
            <div class="form-group">
              <label for="name">Full Name</label>
              <input type="text" id="name" name="name" placeholder="Enter your full name" required>
            </div>
            
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email address" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Create a password" required minlength="8">
            </div>
            
            <div class="form-group">
              <button type="submit" class="register-button">Register</button>
            </div>
            
            <div id="message" class="message"></div>
          </form>
          
          <div class="login-link">
            <p>Already have an account? <a href="#/login">Login here</a></p>
          </div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const registerForm = document.getElementById("register-form");

    registerForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form values
      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Validate inputs
      if (!name || !email || !password) {
        this._showMessage("Please fill in all fields", "error");
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        this._showMessage("Please enter a valid email address", "error");
        return;
      }

      // Validate password length
      if (password.length < 8) {
        this._showMessage("Password must be at least 8 characters", "error");
        return;
      }

      try {
        await register(name, email, password);
      } catch (error) {
        console.error("Regist error", error);
      }
    });
  }
}
