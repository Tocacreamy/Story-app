class NotificationSettingsView {
  getTemplate() {
    return `
      <section class="container">
        <h1>Notification Settings</h1>
        <div id="auth-status"></div>
        <div class="notification-settings">
          <div class="setting-card">
            <h2>Push Notifications</h2>
            <p>Get notified when your stories are successfully uploaded and other important updates.</p>
            
            <div id="notification-status" class="notification-status">
              <p class="loading-text">Checking notification status...</p>
            </div>
            
            <div id="notification-controls" class="notification-controls">
              <button id="enable-notifications" class="btn btn-primary" style="display: none;">
                Enable Notifications
              </button>
              <button id="disable-notifications" class="btn" style="display: none;">
                Disable Notifications
              </button>
            </div>
            
            <div id="notification-message" class="message" role="alert" aria-live="assertive"></div>
          </div>
        </div>
      </section>
    `;
  }

  showAuthenticatedUser(userName) {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome, ${userName}! Manage your notification preferences below.</p>
      </div>
    `;
  }

  showLoginMessage() {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message">
        <p>You must be logged in to manage notification settings</p>
        <a href="#/login" class="login-btn">Login</a>
      </div>
    `;
  }

  updateNotificationStatus(isSubscribed, isSupported = true) {
    const statusEl = document.getElementById("notification-status");
    const enableBtn = document.getElementById("enable-notifications");
    const disableBtn = document.getElementById("disable-notifications");

    if (!isSupported) {
      statusEl.innerHTML = `
        <div class="status-indicator error">
          <span class="status-icon">❌</span>
          <span>Push notifications are not supported in this browser</span>
        </div>
      `;
      enableBtn.style.display = "none";
      disableBtn.style.display = "none";
      return;
    }

    if (isSubscribed) {
      statusEl.innerHTML = `
        <div class="status-indicator success">
          <span class="status-icon">✅</span>
          <span>Push notifications are enabled</span>
        </div>
      `;
      enableBtn.style.display = "none";
      disableBtn.style.display = "inline-block";
    } else {
      statusEl.innerHTML = `
        <div class="status-indicator">
          <span class="status-icon">🔕</span>
          <span>Push notifications are disabled</span>
        </div>
      `;
      enableBtn.style.display = "inline-block";
      disableBtn.style.display = "none";
    }
  }

  showMessage(message, type = "info") {
    const messageEl = document.getElementById("notification-message");
    messageEl.textContent = message;
    messageEl.className = "message";
    messageEl.classList.add(type);
  }

  setLoading(isLoading) {
    const enableBtn = document.getElementById("enable-notifications");
    const disableBtn = document.getElementById("disable-notifications");

    if (isLoading) {
      enableBtn.disabled = true;
      disableBtn.disabled = true;
      enableBtn.textContent = "Processing...";
      disableBtn.textContent = "Processing...";
    } else {
      enableBtn.disabled = false;
      disableBtn.disabled = false;
      enableBtn.textContent = "Enable Notifications";
      disableBtn.textContent = "Disable Notifications";
    }
  }

  bindEnableNotifications(handler) {
    const enableBtn = document.getElementById("enable-notifications");
    enableBtn.addEventListener("click", handler);
  }

  bindDisableNotifications(handler) {
    const disableBtn = document.getElementById("disable-notifications");
    disableBtn.addEventListener("click", handler);
  }
}

export default NotificationSettingsView;
