import UploadStoryView from "../../views/UploadStoryView.js";
import UploadStoryModel from "../../models/UploadStoryModel.js";
import UploadStoryPresenter from "../../presenters/UploadStoryPresenter.js";
import CameraHandler from "../../utils/camera.js";
import MapHandler from "../../utils/mapHandler.js";

export default class UploadStoryPage {
  constructor() {
    this.view = new UploadStoryView();
    this.model = new UploadStoryModel();
    this.mapHandler = new MapHandler();
    this.cameraHandler = new CameraHandler();
    this.presenter = null;
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Initialize camera handler with DOM elements
    const cameraPreview = document.getElementById("camera-preview");
    const cameraContainer = document.getElementById("camera-container");

    if (cameraPreview && cameraContainer) {
      this.cameraHandler.init(cameraPreview, cameraContainer);
    }

    // Initialize the presenter
    this.presenter = new UploadStoryPresenter(
      this.view,
      this.model,
      this.mapHandler,
      this.cameraHandler
    );

    // Initialize the presenter
    await this.presenter.init();
  }

  // Add cleanup method that can be called when page is destroyed
  cleanup() {
    if (this.presenter) {
      this.presenter.cleanup();
    }
  }
}
