import RegisterView from "../../views/RegisterView.js";
import RegisterPresenter from "../../presenters/RegisterPresenter.js";
import UserModel from "../../models/UserModel.js";

export default class Register {
  constructor() {
    this.view = new RegisterView();
    this.model = new UserModel();
    this.presenter = null; // Will be initialized in afterRender
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Initialize the presenter with the view and model
    this.presenter = new RegisterPresenter(this.view, this.model, {
      navigateTo: (url) => {
        window.location.hash = url;
      },
    });
  }
}
