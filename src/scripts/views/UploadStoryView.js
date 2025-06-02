class UploadStoryView {
  getTemplate() {
    return `
      <section class="container">
        <h1>Upload Story</h1>
        <div id="auth-status"></div>
        <div id="upload-container" class="form-container">
          <form id="upload-form" aria-labelledby="upload-form-title">
            <h2 id="upload-form-title" class="visually-hidden">Story Upload Form</h2>
            
            <div class="form-group">
              <label for="description">Story Description</label>
              <textarea id="description" name="description" rows="5" placeholder="Write your story here..." required></textarea>
            </div>
            
            <div class="form-group">
              <label for="photo">Photo</label>
              <div class="file-input-container">
                <input type="file" id="photo" name="photo" accept="image/*" required aria-describedby="photo-requirements">
                <button type="button" id="camera-button" class="camera-button" aria-controls="camera-container">Open Camera</button>
                <p id="photo-requirements" class="visually-hidden">Please select an image file or capture a photo with the camera</p>
              </div>
              <div class="camera-container" id="camera-container" style="display: none;" aria-live="polite">
                <video id="camera-preview" autoplay playsinline aria-label="Camera preview"></video>
                <div class="camera-controls">
                  <button type="button" id="capture-button" class="capture-button">Capture Photo</button>
                  <button type="button" id="close-camera" class="close-camera">Close Camera</button>
                </div>
              </div>
              <div class="file-preview-container">
                <img id="image-preview" src="#" alt="Preview of uploaded image" style="display: none;">
              </div>
            </div>
            
            <div class="form-group">
              <label for="location">Add Location</label>
              <div class="location-input-container">
                <div class="location-buttons">
                  <button type="button" id="get-location" class="location-button" aria-describedby="location-help">Get My Location</button>
                  <button type="button" id="reset-location" class="location-button reset-location" aria-controls="location-status">Reset Location</button>
                </div>
                <p id="location-help" class="visually-hidden">This will use your device's geolocation to determine your current coordinates</p>
                <div id="location-status" class="location-status" aria-live="polite">No location selected</div>
                <div id="map-section" class="map-section">
                  <div id="location-map" class="location-map" aria-label="Map to select location"></div>
                </div>
                <input type="hidden" id="latitude" name="latitude">
                <input type="hidden" id="longitude" name="longitude">
              </div>
            </div>
            
            <div class="form-group">
              <button type="submit" class="upload-button">Upload Story</button>
            </div>
            
            <div id="message" class="message" role="alert" aria-live="assertive"></div>
          </form>
        </div>
      </section>
    `;
  }

  showLoginMessage() {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message">
        <p>You must be logged in to upload stories</p>
        <a href="#/login" class="login-btn">Login</a>
        <span>or</span>
        <a href="#/register" class="register-btn">Register</a>
      </div>
    `;
    document.getElementById("upload-container").style.display = "none";
  }

  showAuthenticatedUser(userName) {
    const authStatus = document.getElementById("auth-status");
    authStatus.innerHTML = `
      <div class="auth-message success">
        <p>Welcome, ${userName || "User"}! Share your story below.</p>
      </div>
    `;
  }

  getDescription() {
    return document.getElementById("description").value.trim();
  }

  getPhotoFile() {
    return document.getElementById("photo").files[0];
  }

  getLocationCoordinates() {
    const lat = document.getElementById("latitude").value || null;
    const lng = document.getElementById("longitude").value || null;
    return { lat, lng };
  }

  setLocationCoordinates(lat, lng) {
    document.getElementById("latitude").value = lat;
    document.getElementById("longitude").value = lng;
  }

  clearLocationCoordinates() {
    document.getElementById("latitude").value = "";
    document.getElementById("longitude").value = "";
  }

  updatePhotoInput(photoFile) {
    const photoInput = document.getElementById("photo");
    const dt = new DataTransfer();
    dt.items.add(photoFile);
    photoInput.files = dt.files;
  }

  showMessage(text, type) {
    const messageEl = document.getElementById("message");
    messageEl.textContent = text;
    messageEl.className = "message";
    messageEl.classList.add(type);
  }

  setupFilePreview() {
    const photoInput = document.getElementById("photo");
    const imagePreview = document.getElementById("image-preview");

    photoInput.addEventListener("change", (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          imagePreview.src = e.target.result;
          imagePreview.style.display = "block";
          // Announce image selected for screen readers
          this.showMessage(`Image ${file.name} selected`, "info");
        };
        reader.readAsDataURL(file);
      } else {
        imagePreview.style.display = "none";
      }
    });
  }

  updateLocationStatus(lat, lng, isSet = true) {
    const locationStatus = document.getElementById("location-status");

    if (isSet && lat && lng) {
      locationStatus.textContent = `Location set: ${Number(lat).toFixed(
        6
      )}, ${Number(lng).toFixed(6)}`;
      locationStatus.classList.add("location-set");
    } else {
      locationStatus.textContent = "No location selected";
      locationStatus.classList.remove("location-set");
    }
  }

  disableForm(disabled = true) {
    const form = document.getElementById("upload-form");
    const submitButton = form.querySelector('button[type="submit"]');
    const formInputs = form.querySelectorAll("input, textarea, button");

    submitButton.disabled = disabled;
    formInputs.forEach((input) => (input.disabled = disabled));

    if (disabled) {
      submitButton.setAttribute("aria-busy", "true");
      submitButton.textContent = "Uploading...";
    } else {
      submitButton.removeAttribute("aria-busy");
      submitButton.textContent = "Upload Story";
    }
  }

  resetForm() {
    const form = document.getElementById("upload-form");
    const imagePreview = document.getElementById("image-preview");

    form.reset();
    imagePreview.style.display = "none";
    this.updateLocationStatus(null, null, false);
  }

  bindCameraButton(handler) {
    const cameraButton = document.getElementById("camera-button");
    cameraButton.addEventListener("click", handler);
  }

  bindCloseCamera(handler) {
    const closeCamera = document.getElementById("close-camera");
    closeCamera.addEventListener("click", handler);
  }

  bindCaptureButton(handler) {
    const captureButton = document.getElementById("capture-button");
    captureButton.addEventListener("click", handler);
  }

  bindGetLocationButton(handler) {
    const getLocationButton = document.getElementById("get-location");
    getLocationButton.addEventListener("click", handler);
  }

  bindResetLocationButton(handler) {
    const resetLocationButton = document.getElementById("reset-location");
    resetLocationButton.addEventListener("click", handler);
  }

  bindFormSubmit(handler) {
    const form = document.getElementById("upload-form");
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      handler();
    });
  }

  updateImagePreview(imageDataUrl) {
    const imagePreview = document.getElementById("image-preview");
    imagePreview.src = imageDataUrl;
    imagePreview.style.display = "block";
    // Announce for screen readers
    this.showMessage("Photo captured successfully", "success");
  }

  navigateToHome() {
    setTimeout(() => {
      window.location.hash = "#/";
    }, 2000);
  }
}

export default UploadStoryView;
