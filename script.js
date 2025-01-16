import { Year } from "./js/Year.js";
import { YearVersion } from "./js/YearVersion.js";
import { YearVisualization } from "./js/YearVisualization.js";
import { InterfaceHeader } from "./js/InterfaceHeader.js";
import { DaysSequenceVisualization } from "./js/DaysSequenceVisualization.js";

//Year
const currentDate = new Date(),
  currentYear = currentDate.getFullYear(),
  today = `${currentDate.getFullYear()}-${
    currentDate.getMonth() + 1
  }-${currentDate.getDate()}`;

// Fix for an experiment consequences
if (localStorage.getItem("year") !== null) {
  localStorage.removeItem("year");
}

// User's browser tab title
document.title = `${currentDate.getDate()}.${
  currentDate.getMonth() + 1
}.${currentYear}`;

// Disable context menu
window.oncontextmenu = (event) => {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

// Language and country
let language,
  country,
  savedLanguage = localStorage.getItem("language"),
  savedCountry = localStorage.getItem("country");
language = savedLanguage ? savedLanguage : "eng";
country = savedCountry ? savedCountry : "poland";

// Calendar
const newYear = new Year(currentYear);
const version = new YearVersion(newYear, country, language);
// const visualization = new YearVisualization(version, "content");
new DaysSequenceVisualization(version, today);

// Interface
new InterfaceHeader(version, " ", "header");
