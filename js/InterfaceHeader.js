import { interfaceElements } from "../dictionaries/interface.js";
import { createElement } from "./helpFunctions.js";
import { InterfacePopup } from "./InterfacePopup.js";

export class InterfaceHeader {
  constructor(version, visualization, block) {
    const place = document.querySelector(`.${block}`);
    // Year headline
    const headline = createElement("h1", "headline");
    headline.innerHTML = `${version.year.yearNum}`;
    place.append(headline);
    // Country and language indicators
    if (version.country) {
      this.countryBlock = createElement("sup", "parameter");
      this.countryBlock.classList.add("country");
      this.countryBlock.innerHTML =
        interfaceElements.countries[version.country];
      headline.append(this.countryBlock);
    }
    if (version.language) {
      this.languageBlock = createElement("sup", "parameter");
      this.languageBlock.classList.add("language");
      this.languageBlock.innerHTML =
        interfaceElements.languages[version.language];
      headline.append(this.languageBlock);
    }
    // Burger menu
    const button = createElement("div", "button");
    place.append(button);
    button.addEventListener("click", (event) => {
      new InterfacePopup(version, visualization);
    });
  }
}
