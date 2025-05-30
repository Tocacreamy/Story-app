import { parseActivePathname } from "../../routes/url-parser.js";
import DetailStoryView from "../../views/DetailStoryView.js";
import DetailStoryModel from "../../models/DetailStoryModel.js";
import DetailStoryPresenter from "../../presenters/DetailStoryPresenter.js";
import MapHandler from "../../utils/mapHandler.js";

export default class DetailStory {
  constructor() {
    this.view = new DetailStoryView();
    this.model = new DetailStoryModel();
    this.mapHandler = new MapHandler();
    this.presenter = null; // Will be initialized in afterRender
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Initialize the presenter
    this.presenter = new DetailStoryPresenter(
      this.view,
      this.model,
      this.mapHandler
    );

    // Get the story ID from URL
    const { id } = parseActivePathname();

    // Initialize the presenter with the story ID
    await this.presenter.init(id);
  }
}
