import { login } from "../../data/api.js";

export default class Login {
  async render() {
    return `
      <section class="container login-container">
        <div class="login-card">
          <h1 class="login-title">Login to Your Account</h1>
          
          <form id="login-form">
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" placeholder="Enter your email" required>
            </div>
            
            <div class="form-group">
              <label for="password">Password</label>
              <input type="password" id="password" name="password" placeholder="Enter your password" required>
            </div>
            
            <div class="form-group">
              <button type="submit" class="login-button">Login</button>
            </div>
            
            <div id="message" class="message"></div>
          </form>
          
          <div class="register-link">
            <p>Don't have an account? <a href="#/register">Register here</a></p>
          </div>
        </div>
      </section>
      `;
  }

  async afterRender() {
    const loginForm = document.getElementById("login-form");

    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form values
      const email = document.getElementById("email").value.trim();
      const password = document.getElementById("password").value;

      // Basic validation
      if (!email || !password) {
        this._showMessage("Please fill in all fields", "error");
        return;
      }

      try {
        // Call login API
        await login(email, password);

        alert("LOGIN BERHASIl event");
      } catch (error) {
        this._showMessage(error.message || "Login failed", "error");
      }
    });
  }
}
