import FileHandler from "../utils/fileHandler.js";

class UploadStoryPresenter {
  constructor(view, model, mapHandler, cameraHandler) {
    this.view = view;
    this.model = model;
    this.mapHandler = mapHandler;
    this.cameraHandler = cameraHandler;
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

    return true;
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

      // Setup map click handler
      this.mapHandler.map.on("click", (e) => {
        const { lat, lng } = e.latlng;

        // Update hidden inputs
        document.getElementById("latitude").value = lat;
        document.getElementById("longitude").value = lng;

        // Update view
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

      // Create a File object and update the file input
      const photoFile = await FileHandler.createFileFromBlob(
        captureResult.blob,
        "camera-photo.jpg"
      );

      // Update the file input with the captured photo
      const photoInput = document.getElementById("photo");
      FileHandler.updateFileInput(photoInput, photoFile);

      // Close camera
      this.cameraHandler.closeCamera();
    }
  }

  async handleGetLocation() {
    this.view.showMessage("Getting your location...", "info");

    const result = await this.mapHandler.getUserLocation();

    if (result.success) {
      // Update hidden inputs
      document.getElementById("latitude").value = result.latitude;
      document.getElementById("longitude").value = result.longitude;

      // Update view
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

    // Clear location inputs
    document.getElementById("latitude").value = "";
    document.getElementById("longitude").value = "";

    // Update view
    this.view.updateLocationStatus(null, null, false);
    this.view.showMessage("Location has been reset", "info");
  }

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
      // Show loading state
      this.view.disableForm(true);
      this.view.showMessage("Uploading your story...", "info");

      // Upload story using the model
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

        // Reset form
        this.view.resetForm();

        // Reset map location
        if (this.mapHandler) {
          this.mapHandler.clearMarker();
        }

        // Redirect to home page after successful upload
        setTimeout(() => {
          window.location.hash = "#/";
        }, 2000);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      this.view.showMessage(error.message || "Failed to upload story", "error");
      console.error("Upload error:", error);
    } finally {
      // Hide loading state
      this.view.disableForm(false);
    }
  }
}

export default UploadStoryPresenter;
