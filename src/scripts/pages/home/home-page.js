export default class HomePage {
  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>
      </section>
      <section>
        <h1>Selamat datang di Story App</h1>
        <a href="#/login">Login</a>
      <section/>
    `;
  }

  async afterRender() {
    // Do your job here
  }
}
