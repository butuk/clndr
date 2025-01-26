import { interfaceElements } from "../dictionaries/interfaceElements.js";

const languages = interfaceElements.languages;
const countries = interfaceElements.countries;

const currentDate = new Date(),
  today = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;

export class Settings {
  constructor() {
    let savedLanguage = localStorage.getItem("language"),
      savedCountry = localStorage.getItem("country");
    this._language = savedLanguage ? savedLanguage : "eng";
    this._country = savedCountry ? savedCountry : "poland";
    this._year = currentDate.getFullYear();
    this.eventTarget = new EventTarget();
  }

  set year(value) {
    this._year = value;
  }

  get year() {
    return this._year;
  }

  set language(value) {
    if (languages.hasOwnProperty(value)) {
      this._language = value;
      localStorage.setItem("language", value);
      this.eventTarget.dispatchEvent(
        new CustomEvent("languageChanged", { detail: { language: value } }),
      );
    }
  }

  get language() {
    return this._language;
  }

  set country(value) {
    if (countries.hasOwnProperty(value)) {
      this._country = value;
      localStorage.setItem("country", value);
      this.eventTarget.dispatchEvent(
        new CustomEvent("countryChanged", { detail: { country: value } }),
      );
    }
  }

  get country() {
    return this._country;
  }

  // Subscribe to language changes
  onLanguageChange(listener) {
    this.eventTarget.addEventListener("languageChanged", listener);
  }

  // Subscribe to country changes
  onCountryChange(listener) {
    this.eventTarget.addEventListener("countryChanged", listener);
  }
}
