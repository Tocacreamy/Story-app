import SavedStoriesView from '../../views/SavedStoriesView.js';
import SavedStoriesPresenter from '../../presenters/SavedStoriesPresenter.js';

class SavedStoriesPage {
  async render() {
    return `
      <div class="content">
        <div id="saved-stories-content"></div>
      </div>
    `;
  }

  async afterRender() {
    const savedStoriesView = new SavedStoriesView();

    // Append the template to the content div FIRST
    const contentDiv = document.getElementById("saved-stories-content");
    if (contentDiv) {
      contentDiv.innerHTML = savedStoriesView.getTemplate();
    }

    // THEN initialize the presenter
    const savedStoriesPresenter = new SavedStoriesPresenter(savedStoriesView);
    await savedStoriesPresenter.init();
  }
}

export default SavedStoriesPage; 