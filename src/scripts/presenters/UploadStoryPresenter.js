import FileHandler from "../utils/fileHandler.js";

class UploadStoryPresenter {
  constructor(view, model, mapHandler, cameraHandler) {
    this.view = view;
    this.model = model;
    this.mapHandler = mapHandler;
    this.cameraHandler = cameraHandler;
    this.isInitialized = false;
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

    // Setup file preview
    this.view.setupFilePreview();

    // Bind event handlers
    this.bindEventHandlers();

    // Initialize map
    await this.initializeMap();

    // Setup cleanup on page unload/navigation
    this.setupCleanup();
    this.isInitialized = true;

    return true;
  }

  setupCleanup() {
    // Cleanup when page is about to unload
    window.addEventListener("beforeunload", this.cleanup.bind(this));

    // Cleanup when hash changes (navigation)
    window.addEventListener("hashchange", this.cleanup.bind(this));

    // Cleanup when page becomes hidden (mobile/tab switching)
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.cleanup();
      }
    });
  }

  cleanup() {
    if (this.cameraHandler && this.isInitialized) {
      // Close camera stream if it's active
      this.cameraHandler.closeCamera();
    }
  }

  bindEventHandlers() {
    // Camera controls
    this.view.bindCameraButton(this.handleOpenCamera.bind(this));
    this.view.bindCloseCamera(this.handleCloseCamera.bind(this));
    this.view.bindCaptureButton(this.handleCapturePhoto.bind(this));

    // Location controls
    this.view.bindGetLocationButton(this.handleGetLocation.bind(this));
    this.view.bindResetLocationButton(this.handleResetLocation.bind(this));

    // Form submission
    this.view.bindFormSubmit(this.handleFormSubmit.bind(this));
  }

  async initializeMap() {
    try {
      const result = await this.mapHandler.init("location-map");

      if (!result.success) {
        this.view.showMessage(
          `Error initializing map: ${result.error}`,
          "error"
        );
        return false;
      }

      // Setup map click handler through view
      this.mapHandler.map.on("click", (e) => {
        const { lat, lng } = e.latlng;
        // Use view methods instead of direct DOM access
        this.view.setLocationCoordinates(lat, lng);
        this.view.updateLocationStatus(lat, lng);
        this.view.showMessage("Location selected from map", "info");
      });

      return true;
    } catch (error) {
      this.view.showMessage(`Failed to load map: ${error.message}`, "error");
      console.error("Map initialization error:", error);
      return false;
    }
  }

  async handleOpenCamera() {
    const result = await this.cameraHandler.openCamera();

    if (result.success) {
      this.view.showMessage(
        "Camera activated. Click 'Capture Photo' when ready.",
        "info"
      );
    } else {
      this.view.showMessage(result.error, "error");
    }
  }

  handleCloseCamera() {
    this.cameraHandler.closeCamera();
    this.view.showMessage("Camera closed", "info");
  }

  async handleCapturePhoto() {
    const captureResult = this.cameraHandler.capturePhoto();

    if (captureResult.success) {
      // Update image preview in view
      this.view.updateImagePreview(captureResult.imageDataUrl);

      // Create a File object and update the file input through view
      const photoFile = await FileHandler.createFileFromBlob(
        captureResult.blob,
        "camera-photo.jpg"
      );

      // Use view method instead of direct DOM access
      this.view.updatePhotoInput(photoFile);

      // Close camera
      this.cameraHandler.closeCamera();
    }
  }

  async handleGetLocation() {
    this.view.showMessage("Getting your location...", "info");

    const result = await this.mapHandler.getUserLocation();

    if (result.success) {
      // Use view methods instead of direct DOM access
      this.view.setLocationCoordinates(result.latitude, result.longitude);
      this.view.updateLocationStatus(result.latitude, result.longitude);
      this.view.showMessage("Location detected successfully!", "success");
    } else {
      this.view.showMessage(result.error, "error");
    }
  }

  handleResetLocation() {
    // Clear marker from map
    this.mapHandler.clearMarker();
    // Reset map view
    this.mapHandler.resetView();
    // Use view methods instead of direct DOM access
    this.view.clearLocationCoordinates();
    this.view.updateLocationStatus(null, null, false);
    this.view.showMessage("Location has been reset", "info");
  }

  // Clean up when form is submitted and user navigates away
  async handleFormSubmit() {
    // Get form data from view
    const description = this.view.getDescription();
    const photoFile = this.view.getPhotoFile();
    const { lat, lng } = this.view.getLocationCoordinates();

    // Validate form data
    const validation = this.model.validateStoryData(description, photoFile);

    if (!validation.isValid) {
      this.view.showMessage(validation.errors[0], "error");
      return;
    }

    try {
      this.view.disableForm(true);
      this.view.showMessage("Uploading your story...", "info");

      const result = await this.model.uploadStory(
        description,
        photoFile,
        lat,
        lng
      );

      if (result.success) {
        this.view.showMessage(
          "Your story has been uploaded successfully!",
          "success"
        );

        this.view.resetForm();

        if (this.mapHandler) {
          this.mapHandler.clearMarker();
        }

        // Clean up camera before navigation
        this.cleanup();

        // Use view method for navigation instead of direct window access
        this.view.navigateToHome();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.view.showMessage(error.message || "Failed to upload story", "error");
      console.error("Upload error:", error);
    } finally {
      this.view.disableForm(false);
    }
  }
}

export default UploadStoryPresenter;
