import { interfaceElements } from "../dictionaries/interfaceElements.js";
import { createElement } from "./helpFunctions.js";
import { PagePopup } from "./PagePopup.js";

export class PageHeader {
  constructor(block) {
    this.controlsArray = [];
    const place = document.querySelector(`.${block}`);
    // Year headline
    const headline = createElement("h1", "headline");
    headline.innerHTML = new Date().getFullYear();
    place.append(headline);
    // Burger menu
    const button = createElement("div", "button");
    place.append(button);
    button.addEventListener("click", (event) => {
      // Show popup by clicking on the burger menu
      new PagePopup(this.controlsArray);
    });
  }
}
