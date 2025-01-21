import { Year } from "./js/Year.js";
import { YearVersion } from "./js/YearVersion.js";
import { CalendarVisualization } from "./js/CalendarVisualization.js";
import { InterfaceHeader } from "./js/InterfaceHeader.js";
import { DatesSequenceVisualization } from "./js/DatesSequenceVisualization.js";

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
//const visualization = new CalendarVisualization(version, "content");
new DatesSequenceVisualization(version, today);

// Interface
new InterfaceHeader(version, " ", "header");
