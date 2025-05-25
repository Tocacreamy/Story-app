/**
 * Camera utility module for handling camera operations
 */
export default class CameraHandler {
  constructor() {
    this.stream = null;
    this.videoElement = null;
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
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.containerElement.style.display = "none";
  }

  /**
   * Capture a photo from the camera
   * @returns {Object} - Contains the captured image data
   */
  capturePhoto() {
    if (!this.stream) return { success: false };

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

    return {
      success: true,
      imageDataUrl,
      blob: this._dataURLtoBlob(imageDataUrl),
    };
  }

  /**
   * Convert data URL to Blob
   * @param {string} dataUrl - The data URL to convert
   * @returns {Promise<Blob>} - A promise that resolves to a Blob
   */
  async _dataURLtoBlob(dataUrl) {
    const res = await fetch(dataUrl);
    return await res.blob();
  }
}
