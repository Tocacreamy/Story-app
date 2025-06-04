export default class CameraHandler {
  constructor() {
    this.stream = null;
    this.videoElement = null;
    this.containerElement = null;
    this.isActive = false;
  }

  /**
   * Initialize the camera with given elements
   * @param {HTMLVideoElement} videoElement - Video element to show camera feed
   * @param {HTMLElement} containerElement - Container to show/hide
   */
  init(videoElement, containerElement) {
    this.videoElement = videoElement;
    this.containerElement = containerElement;
  }

  /**
   * Open the camera
   * @returns {Promise} - Resolves when camera is ready
   */
  async openCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      this.videoElement.srcObject = this.stream;
      this.containerElement.style.display = "block";
      this.isActive = true;
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: `Could not access camera: ${error.message}`,
      };
    }
  }

  /**
   * Close the camera
   */
  closeCamera() {
    if (this.stream) {
      // Stop all tracks to release camera
      this.stream.getTracks().forEach((track) => {
        track.stop();
        console.log("Camera track stopped:", track.kind);
      });
      this.stream = null;
    }

    if (this.videoElement) {
      this.videoElement.srcObject = null;
    }

    if (this.containerElement) {
      this.containerElement.style.display = "none";
    }

    this.isActive = false;
  }

  /**
   * Check if camera is currently active
   * @returns {boolean} - True if camera is active
   */
  isActiveCamera() {
    return this.isActive && this.stream && this.stream.active;
  }

  /**
   * Capture a photo from the camera
   * @returns {Object} - Contains the captured image data
   */
  capturePhoto() {
    if (!this.stream || !this.isActive) return { success: false };

    // Create canvas to capture frame
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    // Set canvas dimensions to video dimensions
    canvas.width = this.videoElement.videoWidth;
    canvas.height = this.videoElement.videoHeight;

    // Draw current video frame to canvas
    context.drawImage(this.videoElement, 0, 0, canvas.width, canvas.height);

    // Convert to data URL
    const imageDataUrl = canvas.toDataURL("image/jpeg");

    const blob = this._dataURLtoBlob(imageDataUrl);

    return {
      success: true,
      imageDataUrl,
      blob,
    };
  }

  /**
   * Convert data URL to Blob
   * @param {string} dataUrl - The data URL to convert
   * @returns {Blob} - A promise that resolves to a Blob
   */
  _dataURLtoBlob(dataUrl) {
    // Split the data URL to get the content type and base64 data
    const parts = dataUrl.split(";base64,");
    const contentType = parts[0].split(":")[1];
    const raw = window.atob(parts[1]);
    const rawLength = raw.length;

    // Create an array buffer of the right size
    const uInt8Array = new Uint8Array(rawLength);

    // Fill the array with the binary data
    for (let i = 0; i < rawLength; ++i) {
      uInt8Array[i] = raw.charCodeAt(i);
    }

    // Create a blob with the correct MIME type
    return new Blob([uInt8Array], { type: contentType });
  }
}
