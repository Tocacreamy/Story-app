import createNotFoundView from '../views/not-found.js';

const NotFoundPresenter = {
  async render() {
    const view = createNotFoundView();
    return view;
  },

  async afterRender() {
    // Add any event listeners or additional setup here
    const backButton = document.querySelector('.back-home-button');
    if (backButton) {
      backButton.addEventListener('click', (event) => {
        event.preventDefault();
        window.location.hash = '/';
      });
    }
  }
};

export default NotFoundPresenter; 