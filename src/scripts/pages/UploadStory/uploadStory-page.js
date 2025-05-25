import { addNewStory } from "../../data/api.js";
import CameraHandler from "../../utils/camera.js";
import FileHandler from "../../utils/fileHandler.js";

export default class UploadStoryPage {
  constructor() {
    this.cameraHandler = new CameraHandler();
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

    // Handle form submission
    this._setupFormSubmission(uploadForm, photoInput);
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

  _setupFormSubmission(uploadForm, photoInput) {
    uploadForm.addEventListener("submit", async (event) => {
      event.preventDefault();

      // Get form values
      const description = document.getElementById("description").value.trim();
      const photoFile = photoInput.files[0];

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
        const formInputs = uploadForm.querySelectorAll("input, textarea");
        submitButton.disabled = true;
        formInputs.forEach((input) => (input.disabled = true));

        // Send to API
        await addNewStory(description, photoFile);

        this._showMessage(
          "Your story has been uploaded successfully!",
          "success"
        );

        // Reset the form after success
        uploadForm.reset();
        document.getElementById("image-preview").style.display = "none";

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
