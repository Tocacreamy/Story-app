import LoginView from "../../views/LoginView.js";
import LoginPresenter from "../../presenters/LoginPresenter.js";
import UserModel from "../../models/UserModel.js";

export default class LoginPage {
  constructor() {
    this.view = new LoginView();
    this.model = new UserModel();
    this.presenter = null; // Will be initialized in afterRender
  }

  async render() {
    return this.view.getTemplate();
  }

  async afterRender() {
    // Initialize the presenter with the view and model
    this.presenter = new LoginPresenter(this.view, this.model, {
      navigateTo: (url) => {
        window.location.hash = url;
      },
    });
  }
}
