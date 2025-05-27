import HomePage from "../pages/home/home-page";
import Register from "../pages/register/regist-page";
import Login from "../pages/login/login-page";
import UploadStoryPage from "../pages/UploadStory/uploadStory-page";
import DetailStory from "../pages/detailStory/detailStory-page";

const routes = {
  "/": new HomePage(),
  "/uploadStory": new UploadStoryPage(),
  "/login": new Login(),
  "/register": new Register(),
  "/detail/:id": new DetailStory(),
};

export default routes;
