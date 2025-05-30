import HomeView from "../../views/HomeView.js";
import StoryModel from "../../models/StoryModel.js";
import HomePresenter from "../../presenters/HomePresenter.js";

export default class HomePage {
  constructor() {
    this.view = new HomeView();
    this.model = new StoryModel();
    this.presenter = new HomePresenter(this.view, this.model);
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    await this.presenter.init();
  }
}
