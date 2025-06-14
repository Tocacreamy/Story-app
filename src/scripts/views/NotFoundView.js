class NotFoundView {
  getTemplate() {
    return `
      <section class="container text-center py-5">
        <h1 class="not-found-heading">404 - Not Found</h1>
        <p class="not-found-message">The page you are looking for does not exist.</p>
        <a href="#/" class="btn btn-primary mt-3">Go to Homepage</a>
      </section>
    `;
  }
}

export default NotFoundView; 