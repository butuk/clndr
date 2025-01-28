import { interfaceElements } from "../dictionaries/interfaceElements.js";

const languages = interfaceElements.languages;
const countries = interfaceElements.countries;

const currentDate = new Date(),
  today = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;

export class Settings {
  constructor(year) {
    this.eventTarget = new EventTarget();
    this._year = year;
    let savedLanguage = localStorage.getItem("language"),
      savedCountry = localStorage.getItem("country");
    this.language = savedLanguage ? savedLanguage : "eng";
    this.country = savedCountry ? savedCountry : "poland";
    this.year = year.number ? year.number : currentDate.getFullYear();
  }

  set year(value) {
    this._number = value;
    this._year.number = value;
  }

  get year() {
    return this._number;
  }

  set language(value) {
    if (languages.hasOwnProperty(value)) {
      this._language = value;
      localStorage.setItem("language", value);
      this._year.language = value;
      this.eventTarget.dispatchEvent(new CustomEvent("change"));
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
      this.eventTarget.dispatchEvent(new CustomEvent("change"));
    }
  }

  get country() {
    return this._country;
  }

  onChange(listener) {
    this.eventTarget.addEventListener("change", listener);
  }
}
