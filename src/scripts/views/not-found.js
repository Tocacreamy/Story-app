const createNotFoundView = () => {
  const view = document.createElement('div');
  view.setAttribute('role', 'main');
  view.setAttribute('aria-label', 'Page not found');
  view.classList.add('not-found-container');

  view.innerHTML = `
    <div class="not-found-content">
      <h1>404</h1>
      <h2>Page Not Found</h2>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="#/" class="back-home-button" aria-label="Back to home page">
        Back to Home
      </a>
    </div>
  `;

  return view;
};

export default createNotFoundView; 