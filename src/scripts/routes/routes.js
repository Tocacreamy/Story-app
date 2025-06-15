import HomePage from "../pages/home/home-page";
import Register from "../pages/register/regist-page";
import Login from "../pages/login/login-page";
import UploadStoryPage from "../pages/uploadStory/uploadStory-page.js";
import DetailStory from "../pages/detailStory/detailStory-page";
import NotificationsPage from "../pages/notifications/notifications-page.js";
import SavedStoriesPage from "../pages/savedStories/savedStories-page.js";
import NotFoundPage from "../pages/notFound/notFound-page.js";

const routes = {
  "/": new HomePage(),
  "/uploadStory": new UploadStoryPage(),
  "/login": new Login(),
  "/register": new Register(),
  "/detail/:id": new DetailStory(),
  "/notifications": new NotificationsPage(),
  "/saved-stories": new SavedStoriesPage(),
};

export default routes;
