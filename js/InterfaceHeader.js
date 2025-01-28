import { interfaceElements } from "../dictionaries/interfaceElements.js";
import { createElement } from "./helpFunctions.js";
import { InterfacePopup } from "./InterfacePopup.js";

export class InterfaceHeader {
  constructor(block, settings) {
    const place = document.querySelector(`.${block}`);
    // Year headline
    const headline = createElement("h1", "headline");
    headline.innerHTML = settings
      ? `${settings.year}`
      : `${new Date().getFullYear()}`;
    place.append(headline);
    // Country and language indicators
    if (settings && settings.country) {
      this.countryBlock = createElement("sup", "parameter");
      this.countryBlock.classList.add("country");
      this.countryBlock.innerHTML =
        interfaceElements.countries[settings.country];
      headline.append(this.countryBlock);
    }
    if (settings && settings.language) {
      this.languageBlock = createElement("sup", "parameter");
      this.languageBlock.classList.add("language");
      this.languageBlock.innerHTML =
        interfaceElements.languages[settings.language];
      headline.append(this.languageBlock);
    }
    // Burger menu
    const button = createElement("div", "button");
    place.append(button);
    button.addEventListener("click", (event) => {
      new InterfacePopup(settings);
    });
  }
}
