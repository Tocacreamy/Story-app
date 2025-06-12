class NotificationPresenter {
  constructor(view, model, pushManager) {
    this.view = view;
    this.model = model;
    this.pushManager = pushManager;
  }

  async init() {
    // Check if user is logged in
    if (!this.model.isUserLoggedIn()) {
      this.view.showLoginMessage();
      return false;
    }

    // Show authenticated user info
    const userName = this.model.getUserName();
    this.view.showAuthenticatedUser(userName);

    // Bind event handlers
    this.bindEventHandlers();

    // Check notification status
    await this.checkNotificationStatus();

    return true;
  }

  bindEventHandlers() {
    this.view.bindEnableNotifications(
      this.handleEnableNotifications.bind(this)
    );
    this.view.bindDisableNotifications(
      this.handleDisableNotifications.bind(this)
    );
  }

  async checkNotificationStatus() {
    try {
      const isSupported = this.model.isNotificationSupported();

      if (!isSupported) {
        this.view.updateNotificationStatus(false, false);
        return;
      }

      const status = await this.pushManager.getSubscriptionStatus();
      this.view.updateNotificationStatus(status.isSubscribed, true);
    } catch (error) {
      console.error("Error checking notification status:", error);
      this.view.showMessage("Error checking notification status", "error");
    }
  }

  async handleEnableNotifications() {
    try {
      this.view.setLoading(true);
      this.view.showMessage("Setting up notifications...", "info");

      // Request permission
      const permissionResult = await this.pushManager.requestPermission();

      if (!permissionResult.success) {
        throw new Error(permissionResult.error);
      }

      // Subscribe to push notifications
      const subscribeResult = await this.pushManager.subscribe();

      if (!subscribeResult.success) {
        throw new Error(subscribeResult.error);
      }

      this.view.updateNotificationStatus(true, true);
      this.view.showMessage("Notifications enabled successfully!", "success");
    } catch (error) {
      console.error("Error enabling notifications:", error);
      this.view.showMessage(
        error.message || "Failed to enable notifications",
        "error"
      );
    } finally {
      this.view.setLoading(false);
    }
  }

  async handleDisableNotifications() {
    try {
      this.view.setLoading(true);
      this.view.showMessage("Disabling notifications...", "info");

      const result = await this.pushManager.unsubscribe();

      if (!result.success) {
        throw new Error(result.error);
      }

      this.view.updateNotificationStatus(false, true);
      this.view.showMessage("Notifications disabled successfully", "success");
    } catch (error) {
      console.error("Error disabling notifications:", error);
      this.view.showMessage(
        error.message || "Failed to disable notifications",
        "error"
      );
    } finally {
      this.view.setLoading(false);
    }
  }
}

export default NotificationPresenter;
