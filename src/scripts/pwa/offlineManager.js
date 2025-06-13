export default class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine;
    this.init();
  }

  init() {
    // Listen for online/offline events
    window.addEventListener('online', this.handleOnline.bind(this));
    window.addEventListener('offline', this.handleOffline.bind(this));
    
    // Update initial status
    this.updateConnectionStatus();
  }

  handleOnline() {
    console.log('📶 App is online');
    this.isOnline = true;
    this.updateConnectionStatus();
    this.showConnectionMessage('You are back online!', 'success');
    
    // Trigger background sync if available
    this.triggerBackgroundSync();
  }

  handleOffline() {
    console.log('📵 App is offline');
    this.isOnline = false;
    this.updateConnectionStatus();
    this.showConnectionMessage('You are offline. Some features may be limited.', 'warning');
  }

  updateConnectionStatus() {
    const statusIndicator = document.getElementById('online-status');
    const statusDot = statusIndicator?.querySelector('.status-dot');
    const statusText = statusIndicator?.querySelector('.status-text');

    if (statusIndicator) {
      statusIndicator.className = `status-indicator ${this.isOnline ? 'online' : 'offline'}`;
      
      if (statusText) {
        statusText.textContent = this.isOnline ? 'Online' : 'Offline';
      }
      
      if (statusDot) {
        statusDot.style.backgroundColor = this.isOnline ? '#03dac6' : '#cf6679';
      }
    }
  }

  showConnectionMessage(message, type = 'info') {
    // Create connection message
    const messageEl = document.createElement('div');
    messageEl.className = `connection-message ${type}`;
    messageEl.innerHTML = `
      <div class="message-content">
        <span class="message-icon">${type === 'success' ? '✅' : '⚠️'}</span>
        <span class="message-text">${message}</span>
      </div>
    `;

    document.body.appendChild(messageEl);

    // Animate in
    setTimeout(() => {
      messageEl.classList.add('visible');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      messageEl.classList.remove('visible');
      setTimeout(() => {
        if (document.body.contains(messageEl)) {
          document.body.removeChild(messageEl);
        }
      }, 300);
    }, 3000);
  }

  async triggerBackgroundSync() {
    if ('serviceWorker' in navigator && 'sync' in window.ServiceWorkerRegistration.prototype) {
      try {
        const registration = await navigator.serviceWorker.ready;
        await registration.sync.register('background-sync');
        console.log('🔄 Background sync registered');
      } catch (error) {
        console.error('❌ Background sync registration failed:', error);
      }
    }
  }

  getConnectionStatus() {
    return {
      isOnline: this.isOnline,
      effectiveType: navigator.connection?.effectiveType || 'unknown',
      downlink: navigator.connection?.downlink || 0,
      rtt: navigator.connection?.rtt || 0
    };
  }
}