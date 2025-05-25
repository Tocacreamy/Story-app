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
              <div class="password-input-container">
                <input type="password" id="password" name="password" placeholder="Create a password" required minlength="8">
                <button type="button" id="toggle-password" class="toggle-password">Show</button>
              </div>
              <small class="password-requirements">Minimum 8 characters</small>
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

      // More comprehensive password validation
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
        this._showMessage(
          "Password must be at least 8 characters and include uppercase, lowercase, and numbers",
          "error"
        );
        return;
      }

      try {
        this._showMessage("Creating your account...", "info");

        // Disable form while submitting
        const submitButton = registerForm.querySelector(
          'button[type="submit"]'
        );
        const formInputs = registerForm.querySelectorAll("input");
        submitButton.disabled = true;
        formInputs.forEach((input) => (input.disabled = true));

        await register(name, email, password);

        this._showMessage(
          "Registration successful! Redirecting to login...",
          "success"
        );

        // Redirect to login page
        setTimeout(() => {
          window.location.hash = "#/login";
        }, 1500);
      } catch (error) {
        this._showMessage(error.message || "Registration failed", "error");
        console.error("Regist error", error);
      } finally {
        // Re-enable form
        submitButton.disabled = false;
        formInputs.forEach((input) => (input.disabled = false));
      }
    });

    const togglePasswordButton = document.getElementById("toggle-password");
    const passwordInput = document.getElementById("password");

    togglePasswordButton.addEventListener("click", () => {
      if (passwordInput.type === "password") {
        passwordInput.type = "text";
        togglePasswordButton.textContent = "Hide";
      } else {
        passwordInput.type = "password";
        togglePasswordButton.textContent = "Show";
      }
    });
  }

  _showMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = "message";
    messageEl.classList.add(type);
  }
}
