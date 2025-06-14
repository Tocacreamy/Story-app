class SavedStoriesView {
  constructor() {
    this.app = document.getElementById("app") || document.body;
  }

  getTemplate() {
    return `
      <section class="container">
        <h1>Saved Stories</h1>
        <div id="saved-stories-container" class="stories-grid">
          <p class="loading-text">Loading saved stories...</p>
        </div>
      </section>
    `;
  }

  displayStories(stories) {
    const storiesContainer = document.getElementById("saved-stories-container");

    if (stories.length === 0) {
      storiesContainer.innerHTML = "<p>No saved stories found.</p>";
      return;
    }

    storiesContainer.innerHTML = stories
      .map((story) => {
        const createdDate = new Date(story.createdAt).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "short",
            day: "numeric",
          }
        );

        return `
            <div class="story-card" style="view-transition-name: story-card-${story.id}">
              <img src="${story.photoUrl || '/images/placeholder.png'}" 
                   alt="Story image uploaded by ${story.name || 'Anonymous'}" 
                   class="story-image"
                   onerror="this.onerror=null; this.src='/images/placeholder.png'; this.classList.add('placeholder-image');"
                   style="view-transition-name: story-image-${story.id}">
              <div class="story-content">
                <div class="story-header">
                  <h1 class="story-name" style="view-transition-name: story-title-${story.id}">${story.name}</h1>
                  <span class="story-date">${createdDate}</span>
                </div>
                <p class="story-desc">${story.description}</p>
                <div class="story-actions">
                  <a href="#/detail/${story.id}" class="read-more" aria-label="Read more about ${story.name}'s story">Read More</a>
                  <button class="delete-story-btn" data-id="${story.id}" aria-label="Delete ${story.name}'s story">Delete</button>
                </div>
              </div>
            </div>
          `;
      })
      .join("");

    // After displaying stories, attach event listeners for deletion
    // this.bindDeleteStory(stories); // Remove this line
  }

  showErrorMessage(message) {
    const storiesContainer = document.getElementById("saved-stories-container");
    storiesContainer.innerHTML = `<p class="error-message">Error: ${message}</p>`;
  }
}

export default SavedStoriesView; 