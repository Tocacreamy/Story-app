import HomePage from '../pages/home/home-page';
import Register from '../pages/register/regist-page';
import Login from '../pages/login/login-page';
import UploadStoryPage from '../pages/UploadStory/uploadStory-page';

const routes = {
  '/': new HomePage(),
  '/uploadStory': new UploadStoryPage(),
  '/login': new Login(),
  '/register':new Register(),

};

export default routes;
