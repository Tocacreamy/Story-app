import HomePage from "../pages/home/home-page";
import Register from "../pages/register/regist-page";
import Login from "../pages/login/login-page";
import UploadStoryPage from "../pages/uploadStory/uploadStory-page";
import DetailStory from "../pages/detailStory/detailStory-page";
import NotificationsPage from "../pages/notifications/notifications-page.js";
import NotFoundPresenter from '../presenters/not-found-presenter.js';

const routes = {
  "/": new HomePage(),
  "/uploadStory": new UploadStoryPage(),
  "/login": new Login(),
  "/register": new Register(),
  "/detail/:id": new DetailStory(),
  "/notifications": new NotificationsPage(),
  "/not-found": NotFoundPresenter,
  "*": NotFoundPresenter // Catch all route for 404
};

export default routes;
