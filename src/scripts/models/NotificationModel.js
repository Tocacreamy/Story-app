export default class NotificationModel {
  isUserLoggedIn() {
    return !!localStorage.getItem("token");
  }

  getUserName() {
    const userData = localStorage.getItem("user_session");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        return parsed.name;
      } catch (error) {
        console.error("Error parsing user data:", error);
        return "User";
      }
    }
    return "User";
  }

  getNotificationPermission() {
    if ("Notification" in window) {
      return Notification.permission;
    }
    return "default";
  }

  isNotificationSupported() {
    return (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }
}
