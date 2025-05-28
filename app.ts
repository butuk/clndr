/*
import { PageHeader } from "./js/PageHeader.js";
import { Year } from "./js/Year.js";
import { Display } from "./js/Display.js";
import { ViewTransitionController } from "./js/ViewTransitionController.js";
import { Settings } from "./js/Settings.js";
import { VisualizationOfCalendar } from "./js/VisualizationOfCalendar.js";

/*
// Fix for an experiment consequences
if (localStorage.getItem("year") !== null) {
  localStorage.removeItem("year");
}*/
import { Data } from "./ts/Data.js";

/*import { months } from "./dictionaries/months.js";

const today = new Date();
const todaysDay: number = today.getMonth();
const month = months.get(todaysDay);
const neededVersion = month?.bel_1;
console.log(neededVersion);*/

// User's browser tab title
const date = new Date();
document.title = `${date.getDate()}.${
  date.getMonth() + 1
}.${date.getFullYear()}`;

// Disable context menu
window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// Site header
//const controls = new PageHeader("header");

// Calendar
/*const data = new Data(2025);
console.log(data);*/

/*
// Display
const display = new Display(year, "content");
*/
//const container = document.querySelector('.content');
//const transitionController = new ViewTransitionController(year, container);

// Стартуем с годового календаря
//transitionController.transitionTo(VisualizationOfCalendar);

// Settings, switchers and indicators
//new Settings(year, controls);
type Translation = {
  [key: string]: string | Translation;
};

// Translations with JSON
let currentLang: string = "pol";
let translations: Translation = {};

function getNestedValue(obj: Translation, keyPath: string): string {
  const [key, ...rest] = keyPath.split(".");

  const value = obj?.[key];
  if (value === undefined) {
    return "";
  }
  if (rest.length === 0) {
    return value as string;
  }
  return getNestedValue(value as Translation, rest.join("."));
}

function applyTranslations(translations: Translation): void {
  document.querySelectorAll("[data-word]").forEach((el) => {
    const key: string = el.getAttribute("data-word") || "";
    const value: string = getNestedValue(translations, key);
    console.log(value);
    if (value) {
      el.textContent = value;
    }
  });
}

async function loadLanguage(lang: string): Promise<Translation> {
  const res = await fetch(`./dictionaries/${lang}.json`);
  translations = await res.json();
  return translations;
}

(async () => {
  const translations = await loadLanguage(currentLang);
  applyTranslations(translations);
})();
