import CONFIG from "../config.js";

export default class PushNotificationManager {
  constructor() {
    this.vapidPublicKey =
      "BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk";
    this.subscription = null;
    this.isSupported = this.checkSupport();
    this.eventListeners = [];
  }

  /**
   * Check if push notifications are supported
   */
  checkSupport() {
    return (
      "serviceWorker" in navigator &&
      "PushManager" in window &&
      "Notification" in window
    );
  }

  /**
   * Initialize service worker and push notifications
   */
  async init() {
    if (!this.isSupported) {
      console.warn("Push notifications are not supported in this browser");
      return { success: false, error: "Not supported" };
    }

    try {
      // Register service worker
      const registration = await navigator.serviceWorker.register(import.meta.env.BASE_URL + "sw.js");
      console.log("Service Worker registered:", registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;

      return { success: true, registration };
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Request notification permission from user
   */
  async requestPermission() {
    if (!this.isSupported) {
      return { success: false, error: "Not supported" };
    }

    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        return { success: true, permission };
      } else {
        return { success: false, error: "Permission denied" };
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;

      // Check for existing subscription
      const existingSubscription =
        await registration.pushManager.getSubscription();
      if (existingSubscription) {
        this.subscription = existingSubscription;
        return { success: true, subscription: existingSubscription };
      }

      // Create new subscription
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(this.vapidPublicKey),
      });

      this.subscription = subscription;

      // Send subscription to server
      await this.sendSubscriptionToServer(subscription);

      return { success: true, subscription };
    } catch (error) {
      console.error("Error subscribing to push notifications:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      if (subscription) {
        // Unsubscribe from browser
        await subscription.unsubscribe();

        // Remove from server
        await this.removeSubscriptionFromServer(subscription);

        this.subscription = null;
        return { success: true };
      }

      return { success: true, message: "No active subscription" };
    } catch (error) {
      console.error("Error unsubscribing from push notifications:", error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send subscription to server
   */
  async sendSubscriptionToServer(subscription) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const subscriptionData = {
      endpoint: subscription.endpoint,
      keys: {
        p256dh: this.arrayBufferToBase64(subscription.getKey("p256dh")),
        auth: this.arrayBufferToBase64(subscription.getKey("auth")),
      },
    };

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(subscriptionData),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to subscribe to notifications");
    }

    return data;
  }

  /**
   * Remove subscription from server
   */
  async removeSubscriptionFromServer(subscription) {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${CONFIG.BASE_URL}/notifications/subscribe`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        endpoint: subscription.endpoint,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to unsubscribe from notifications"
      );
    }

    return data;
  }

  /**
   * Get current subscription status
   */
  async getSubscriptionStatus() {
    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();

      return {
        isSubscribed: !!subscription,
        subscription: subscription,
      };
    } catch (error) {
      console.error("Error getting subscription status:", error);
      return { isSubscribed: false, subscription: null };
    }
  }

  /**
   * Convert VAPID key to Uint8Array
   */
  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  /**
   * Convert ArrayBuffer to Base64
   */
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = "";
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
  }

  /**
   * Cleanup method
   */
  cleanup() {
    this.eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    this.eventListeners = [];
  }
}
