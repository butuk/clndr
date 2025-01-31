import { interfaceElements } from "../dictionaries/interfaceElements.js";
import { SettingIndicator } from "./SettingIndicator.js";
import { SettingControls } from "./SettingsControls.js";

const languages = interfaceElements.languages;
const countries = interfaceElements.countries;

const currentDate = new Date();

export class Settings {
  constructor(year, visualizations, controlsObject) {
    this.switchSettings = this.switchSettings.bind(this);
    this.visualizations = visualizations ? visualizations : null;
    if (this.visualizations) {
      this.visualizationsUpdate();
    }
    this._year = year;
    this.controlObject = controlsObject;
    let savedLanguage = localStorage.getItem("language"),
      savedCountry = localStorage.getItem("country");
    this.language = savedLanguage ? savedLanguage : "eng";
    this.country = savedCountry ? savedCountry : "poland";
    this.year = year.number ? year.number : currentDate.getFullYear();
    this.createIndicators();
    this.createControls();
  }

  set year(value) {
    this._number = value;
    this._year.number = value;
    this.visualizationsUpdate();
  }

  get year() {
    return this._number;
  }

  set language(value) {
    if (languages.hasOwnProperty(value)) {
      this._language = value;
      localStorage.setItem("language", value);
      this._year.language = value;
      this.visualizationsUpdate();
    }
  }

  get language() {
    return this._language;
  }

  set country(value) {
    if (countries.hasOwnProperty(value)) {
      this._country = value;
      localStorage.setItem("country", value);
      this._year.country = value;
      this.visualizationsUpdate();
    }
  }

  get country() {
    return this._country;
  }

  visualizationsUpdate() {
    if (this.visualizations) {
      this.visualizations.forEach((visualization) => {
        if (visualization) {
          visualization.render();
        }
      });
    }
  }

  createIndicators() {
    document.querySelector(".headline").innerHTML = this.year;
    new SettingIndicator("countries", this.country, "sup", "headline");
    new SettingIndicator("languages", this.language, "sup", "headline");
  }

  createControls() {
    const countryLine = new SettingControls("country", this.country, countries);
    const languageLine = new SettingControls(
      "language",
      this.language,
      languages,
    );
    countryLine.element.addEventListener("click", (event) => {
      this.switchSettings(event, "country");
      countryLine.switch("country", this.country);
    });
    languageLine.element.addEventListener("click", (event) => {
      this.switchSettings(event, "language");
      languageLine.switch("language", this.language);
    });
    this.controlObject.controlsArray.push(countryLine.element);
    this.controlObject.controlsArray.push(languageLine.element);
  }

  switchSettings(event, parameter) {
    if (event.target.classList.contains("option")) {
      const element = event.target;
      this[parameter] = element.dataset[parameter];
    }
  }
}
