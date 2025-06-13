export default class InstallPromptManager {
  constructor() {
    this.deferredPrompt = null;
    this.isInstalled = false;
    this.init();
  }

  init() {
    // Listen for the beforeinstallprompt event
    window.addEventListener('beforeinstallprompt', (event) => {
      console.log('👍 beforeinstallprompt event was fired.');
      
      // Prevent the mini-infobar from appearing on mobile
      event.preventDefault();
      
      // Stash the event so it can be triggered later
      this.deferredPrompt = event;
      
      // Show install button
      this.showInstallPrompt();
    });

    // Listen for the app being installed
    window.addEventListener('appinstalled', () => {
      console.log('👍 Story App was installed');
      this.hideInstallPrompt();
      this.isInstalled = true;
      this.showInstallSuccessMessage();
    });

    // Check if app is already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      this.isInstalled = true;
    }

    // Bind install button click
    this.bindInstallButton();
  }

  showInstallPrompt() {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt && !this.isInstalled) {
      installPrompt.style.display = 'block';
      
      // Animate in
      setTimeout(() => {
        installPrompt.classList.add('visible');
      }, 100);
    }
  }

  hideInstallPrompt() {
    const installPrompt = document.getElementById('install-prompt');
    if (installPrompt) {
      installPrompt.style.display = 'none';
      installPrompt.classList.remove('visible');
    }
  }

  bindInstallButton() {
    document.addEventListener('click', (event) => {
      if (event.target.closest('#install-button')) {
        this.handleInstallClick();
      }
    });
  }

  async handleInstallClick() {
    if (!this.deferredPrompt) {
      console.log('❌ No deferred prompt available');
      return;
    }

    // Show the install prompt
    this.deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const { outcome } = await this.deferredPrompt.userChoice;
    
    console.log(`👍 User response to the install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('👍 User accepted the install prompt');
    } else {
      console.log('👎 User dismissed the install prompt');
    }

    // Clear the deferredPrompt
    this.deferredPrompt = null;
    this.hideInstallPrompt();
  }

  showInstallSuccessMessage() {
    // Create and show success message
    const message = document.createElement('div');
    message.className = 'install-success-message';
    message.innerHTML = `
      <div class="success-content">
        <span class="success-icon">✅</span>
        <span>Story App installed successfully!</span>
      </div>
    `;
    
    document.body.appendChild(message);
    
    // Animate in
    setTimeout(() => {
      message.classList.add('visible');
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      message.classList.remove('visible');
      setTimeout(() => {
        document.body.removeChild(message);
      }, 300);
    }, 3000);
  }
}