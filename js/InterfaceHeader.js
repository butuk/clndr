import { interfaceElements } from "../dictionaries/interfaceElements.js";
import { createElement } from "./helpFunctions.js";
import { InterfacePopup } from "./InterfacePopup.js";

export class InterfaceHeader {
  constructor(year, visualization, block, settings) {
    const place = document.querySelector(`.${block}`);
    // Year headline
    const headline = createElement("h1", "headline");
    headline.innerHTML = `${year.number}`;
    place.append(headline);
    // Country and language indicators
    if (year.country) {
      this.countryBlock = createElement("sup", "parameter");
      this.countryBlock.classList.add("country");
      this.countryBlock.innerHTML = interfaceElements.countries[year.country];
      headline.append(this.countryBlock);
    }
    if (year.language) {
      this.languageBlock = createElement("sup", "parameter");
      this.languageBlock.classList.add("language");
      this.languageBlock.innerHTML = interfaceElements.languages[year.language];
      headline.append(this.languageBlock);
    }
    // Burger menu
    const button = createElement("div", "button");
    place.append(button);
    button.addEventListener("click", (event) => {
      new InterfacePopup(year, visualization, settings);
    });
  }
}
