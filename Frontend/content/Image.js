export class ImageUpdater {
  constructor(apiUrl, selector) {
    this.apiUrl = apiUrl;
    this.selector = selector;
  }

  async updateImage() {
    try {
      const response = await fetch(this.apiUrl);
      const data = await response.json();
      const elements = document.querySelectorAll(this.selector);
      elements.forEach((element) => {
        element.style.backgroundImage = `url(${data.url})`;
      });
    } catch (error) {
      console.error("Error al obtener la URL de la imagen:", error);
    }
  }
}
