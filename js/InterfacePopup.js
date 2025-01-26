import { createElement } from "./helpFunctions.js";
import { interfaceElements } from "../dictionaries/interfaceElements.js";

export class InterfacePopup {
  constructor(year, visualization, settings) {
    this.settings = settings;
    this.year = year;
    this.show = this.show.bind(this);
    this.hideOverlay = this.hideOverlay.bind(this);
    this.stopPropagation = this.stopPropagation.bind(this);
    this.switchParameter = this.switchParameter.bind(this);
    this.show(this.year, visualization);
  }

  show(year, visualization) {
    this.overlay = createElement("div", "overlay");
    const popup = createElement("div", "popup");
    // Options
    if (year.country) {
      this.createOptionsLine(
        "country",
        year.country,
        interfaceElements.countries,
        popup,
        visualization,
      );
    }
    if (year.language) {
      this.createOptionsLine(
        "language",
        year.language,
        interfaceElements.languages,
        popup,
        visualization,
      );
    }
    // Additional links line
    const line = createElement("div", "options-line");
    for (let link of interfaceElements.links) {
      const block = createElement("a", "option");
      block.innerHTML = link.text;
      block.href = link.url;
      block.target = "_blank";
      line.append(block);
    }
    popup.append(line);

    this.overlay.prepend(popup);
    document.body.prepend(this.overlay);
    this.overlay.addEventListener("click", this.hideOverlay);
    popup.addEventListener("click", this.stopPropagation);
  }

  createOptionsLine(
    parameter,
    setParameter,
    optionsGroup,
    block,
    visualization,
  ) {
    const line = createElement("div", "options-line");
    Object.keys(optionsGroup).forEach((key) => {
      const country = optionsGroup[key];
      const block = createElement("div", "option");
      block.dataset[`${parameter}`] = key;
      if (setParameter === key) {
        block.classList.add("option_active");
      }
      block.innerHTML = country;
      const datasetKey = Object.keys(block.dataset)[0];
      block.addEventListener("click", (event) => {
        this.switchParameter(
          event,
          datasetKey,
          block.dataset[`${parameter}`],
          this.year,
          visualization,
        );
      });
      line.append(block);
    });
    block.append(line);
  }

  switchParameter(event, parameterKey, setParameter, year, visualization) {
    const block = event.target;
    const optionsLine = block.parentElement;
    for (let element of optionsLine.children) {
      element.classList.remove("option_active");
    }
    block.classList.add("option_active");

    let indicator;
    switch (parameterKey) {
      case "country":
        this.settings.country = setParameter;
        localStorage.setItem("country", setParameter);
        indicator = document.querySelector(".country");
        indicator.innerHTML = interfaceElements.countries[setParameter];
        indicator.addEventListener("change", (event) => {
          const selectedCountry = event.target.value;
          this.settings.country = selectedCountry;
          console.log(
            `LanguageSwitcher: Country changed to ${selectedCountry}`,
          );
          visualization.render(year);
        });
        break;
      case "language":
        this.settings.language = setParameter;
        localStorage.setItem("language", setParameter);
        indicator = document.querySelector(".language");
        indicator.innerHTML = interfaceElements.languages[setParameter];
        indicator.addEventListener("change", (event) => {
          const selectedLanguage = event.target.value;
          this.settings.language = selectedLanguage;
          console.log(
            `LanguageSwitcher: Language changed to ${selectedLanguage}`,
          );
          visualization.render(year);
        });

        break;
    }
    visualization.render(year);
  }

  stopPropagation = (event) => {
    event.stopPropagation();
  };

  hideOverlay() {
    this.overlay.classList.add("overlay_fade");
    this.overlay.addEventListener("transitionend", () => {
      this.overlay.remove();
    });
  }
}
