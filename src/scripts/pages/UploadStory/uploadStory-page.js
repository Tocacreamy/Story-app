import { addNewStory } from "../../data/api.js";
import CameraHandler from "../../utils/camera.js";
import FileHandler from "../../utils/fileHandler.js";
import MapHandler from "../../utils/mapHandler.js";

export default class UploadStoryPage {
  constructor() {
    this.cameraHandler = new CameraHandler();
    this.mapHandler = new MapHandler();
  }

  async render() {
    return `
      <section class="container">
        <h1>Upload Story</h1>
        <div id="auth-status"></div>
        
        <div id="upload-container" class="form-container">
          <form id="upload-form">
            <div class="form-group">
              <label for="description">Story Description</label>
              <textarea id="description" name="description" rows="5" placeholder="Write your story here..." required></textarea>
            </div>
            
            <div class="form-group">
              <label for="photo">Photo</label>
              <div class="file-input-container">
                <input type="file" id="photo" name="photo" accept="image/*" required>
                <button type="button" id="camera-button" class="camera-button">Open Camera</button>
              </div>
              <div class="camera-container" id="camera-container" style="display: none;">
                <video id="camera-preview" autoplay playsinline></video>
                <div class="camera-controls">
                  <button type="button" id="capture-button" class="capture-button">Capture Photo</button>
                  <button type="button" id="close-camera" class="close-camera">Close Camera</button>
                </div>
              </div>
              <div class="file-preview-container">
                <img id="image-preview" src="#" alt="Preview" style="display: none;">
              </div>
            </div>
            
            <div class="form-group">
              <label for="location">Add Location</label>
              <div class="location-input-container">
                <div class="location-buttons">
                  <button type="button" id="get-location" class="location-button">Get My Location</button>
                  <button type="button" id="reset-location" class="location-button reset-location">Reset Location</button>
                </div>
                <div id="location-status" class="location-status">No location selected</div>
                <div id="map-section" class="map-section">
                  <div id="location-map" class="location-map"></div>
                </div>
                <input type="hidden" id="latitude" name="latitude">
                <input type="hidden" id="longitude" name="longitude">
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" class="upload-button">Upload Story</button>
            </div>
            
            <div id="message" class="message"></div>
          </form>
        </div>
      </section>
    `;
  }

  async afterRender() {
    const authStatus = document.getElementById("auth-status");
    const uploadContainer = document.getElementById("upload-container");
    const uploadForm = document.getElementById("upload-form");
    const photoInput = document.getElementById("photo");
    const imagePreview = document.getElementById("image-preview");

    // Location elements
    const getLocationButton = document.getElementById("get-location");
    const resetLocationButton = document.getElementById("reset-location");
    const locationStatus = document.getElementById("location-status");
    const latitudeInput = document.getElementById("latitude");
    const longitudeInput = document.getElementById("longitude");

    // Camera elements
    const cameraButton = document.getElementById("camera-button");
    const cameraContainer = document.getElementById("camera-container");
    const cameraPreview = document.getElementById("camera-preview");
    const captureButton = document.getElementById("capture-button");
    const closeCamera = document.getElementById("close-camera");

    // Initialize camera handler
    this.cameraHandler.init(cameraPreview, cameraContainer);

    // Check authentication
    this._setupAuthentication(authStatus, uploadContainer);

    if (localStorage.getItem("token")) {
      // Initialize map if authenticated
      await this._initializeMap();

      // Handle image preview for file input
      this._setupFilePreview(photoInput, imagePreview);

      // Setup camera functionality
      this._setupCameraControls(
        cameraButton,
        closeCamera,
        captureButton,
        photoInput,
        imagePreview
      );

      // Setup location controls
      this._setupLocationControls(
        getLocationButton,
        resetLocationButton,
        locationStatus,
        latitudeInput,
        longitudeInput
      );

      // Handle form submission
      this._setupFormSubmission(
        uploadForm,
        photoInput,
        latitudeInput,
        longitudeInput
      );
    }
  }

  _setupAuthentication(authStatus, uploadContainer) {
    const token = localStorage.getItem("token");
    const userName = localStorage.getItem("name");

    if (!token) {
      authStatus.innerHTML = `
        <div class="auth-message">
          <p>You must be logged in to upload stories</p>
          <a href="#/login" class="login-btn">Login</a>
          <span>or</span>
          <a href="#/register" class="register-btn">Register</a>
        </div>
      `;
      uploadContainer.style.display = "none";
      return;
    }

    // Show welcome message if authenticated
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome, ${userName || "User"}! Share your story below.</p>
      </div>
    `;
  }

  async _initializeMap() {
    try {
      // Initialize the map
      const result = await this.mapHandler.init("location-map");

      if (!result.success) {
        this._showMessage(`Error initializing map: ${result.error}`, "error");
      }
    } catch (error) {
      this._showMessage(`Failed to load map: ${error.message}`, "error");
      console.error("Map initialization error:", error);
    }
  }

  _setupFilePreview(photoInput, imagePreview) {
    photoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.style.display = "none";
      }
    });
  }

  _setupCameraControls(
    cameraButton,
    closeCamera,
    captureButton,
    photoInput,
    imagePreview
  ) {
    // Open camera button
    cameraButton.addEventListener("click", async () => {
      const result = await this.cameraHandler.openCamera();

      if (result.success) {
        this._showMessage(
          "Camera activated. Click 'Capture Photo' when ready.",
          "info"
        );
      } else {
        this._showMessage(result.error, "error");
      }
    });

    // Close camera button
    closeCamera.addEventListener("click", () => {
      this.cameraHandler.closeCamera();
    });

    // Capture photo button
    captureButton.addEventListener("click", async () => {
      const captureResult = this.cameraHandler.capturePhoto();

      if (captureResult.success) {
        // Update image preview
        imagePreview.src = captureResult.imageDataUrl;
        imagePreview.style.display = "block";

        // Create a File object and update the input
        const photoFile = await FileHandler.createFileFromBlob(
          captureResult.blob,
          "camera-photo.jpg"
        );

        FileHandler.updateFileInput(photoInput, photoFile);

        // Close camera
        this.cameraHandler.closeCamera();
        this._showMessage("Photo captured successfully!", "success");
      }
    });
  }

  _setupLocationControls(
    getLocationButton,
    resetLocationButton,
    locationStatus,
    latitudeInput,
    longitudeInput
  ) {
    // Get user location
    getLocationButton.addEventListener("click", async () => {
      this._showMessage("Getting your location...", "info");

      const result = await this.mapHandler.getUserLocation();

      if (result.success) {
        // Update hidden inputs
        latitudeInput.value = result.latitude;
        longitudeInput.value = result.longitude;

        // Update status
        locationStatus.textContent = `Location set: ${result.latitude.toFixed(
          6
        )}, ${result.longitude.toFixed(6)}`;
        locationStatus.classList.add("location-set");

        this._showMessage("Location detected successfully!", "success");
      } else {
        this._showMessage(result.error, "error");
      }
    });

    // Reset location
    resetLocationButton.addEventListener("click", () => {
      // Clear marker
      this.mapHandler.clearMarker();

      // Reset view
      this.mapHandler.resetView();

      // Clear inputs
      latitudeInput.value = "";
      longitudeInput.value = "";

      // Reset status
      locationStatus.textContent = "No location selected";
      locationStatus.classList.remove("location-set");

      this._showMessage("Location has been reset", "info");
    });

    // Update form values when map is clicked
    this.mapHandler.map?.on("click", (e) => {
      const { lat, lng } = e.latlng;

      // Update hidden inputs
      latitudeInput.value = lat;
      longitudeInput.value = lng;

      // Update status
      locationStatus.textContent = `Location set: ${lat.toFixed(
        6
      )}, ${lng.toFixed(6)}`;
      locationStatus.classList.add("location-set");
    });
  }

  _setupFormSubmission(uploadForm, photoInput, latitudeInput, longitudeInput) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form values
      const description = document.getElementById("description").value.trim();
      const photoFile = photoInput.files[0];
      const latitude = latitudeInput.value || null;
      const longitude = longitudeInput.value || null;

      // Validate inputs
      if (!description) {
        this._showMessage("Please enter a story description", "error");
        return;
      }

      if (!photoFile) {
        this._showMessage("Please select an image or take a photo", "error");
        return;
      }

      try {
        this._showMessage("Uploading your story...", "info");


        // Disable form while submitting
        const submitButton = uploadForm.querySelector('button[type="submit"]');
        const formInputs = uploadForm.querySelectorAll(
          "input, textarea, button"
        );
        submitButton.disabled = true;
        formInputs.forEach((input) => (input.disabled = true));

        // Send to API with location if available
        await addNewStory(description, photoFile, latitude, longitude);

        this._showMessage(
          "Your story has been uploaded successfully!",
          "success"
        );

        // Reset the form after success
        uploadForm.reset();
        document.getElementById("image-preview").style.display = "none";

        // Reset location
        if (this.mapHandler) {
          this.mapHandler.clearMarker();
          document.getElementById("location-status").textContent =
            "No location selected";
          document
            .getElementById("location-status")
            .classList.remove("location-set");
        }

        // Redirect to home page
        setTimeout(() => {
          window.location.hash = "#/";
        }, 2000);
      } catch (error) {
        this._showMessage(error.message || "Failed to upload story", "error");
        console.error("Upload error:", error);
      } finally {
        // Re-enable form
        submitButton.disabled = false;
        formInputs.forEach((input) => (input.disabled = false));
      }
    });
  }

  _showMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = "message";
    messageEl.classList.add(type);
  }
}
