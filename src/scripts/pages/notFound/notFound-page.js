import NotFoundView from '../../views/NotFoundView.js';

class NotFoundPage {
  async render() {
    return new NotFoundView().getTemplate();
  }

  async afterRender() {
    // No specific logic needed after rendering for a simple 404 page
  }
}

export default NotFoundPage; 