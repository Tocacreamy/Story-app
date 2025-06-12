import NotificationSettingsView from "../../views/NotificationSettingsView.js";
import NotificationModel from "../../models/NotificationModel.js";
import NotificationPresenter from "../../presenters/NotificationPresenter.js";

export default class NotificationsPage {
  constructor() {
    this.view = new NotificationSettingsView();
    this.model = new NotificationModel();
    this.presenter = null;
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Get global push manager
    const pushManager = window.pushManager;

    if (!pushManager) {
      console.error("Push manager not initialized");
      return;
    }

    // Initialize the presenter
    this.presenter = new NotificationPresenter(
      this.view,
      this.model,
      pushManager
    );

    // Initialize the presenter
    await this.presenter.init();
  }

  cleanup() {
    // Cleanup if needed
    if (this.presenter && typeof this.presenter.cleanup === "function") {
      this.presenter.cleanup();
    }
  }
}
