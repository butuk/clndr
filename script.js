import { Year } from "./js/Year.js";
import { YearVersion } from "./js/YearVersion.js";
import { YearVisualization } from "./js/YearVisualization.js";
import { InterfaceHeader } from "./js/InterfaceHeader.js";
import { DaysSequenceVisualization } from "./js/DaysSequenceVisualization.js";

//Year
const currentDate = new Date();
const currentYear = currentDate.getFullYear();
let year;

// User's browser tab title
document.title = `${currentDate.getDate()}.${
  currentDate.getMonth() + 1
}.${currentYear}`;

// Language and country
let language;
let country;
let savedYear = localStorage.getItem("year");
let savedLanguage = localStorage.getItem("language");
let savedCountry = localStorage.getItem("country");
year = savedYear ? savedYear : currentYear;
language = savedLanguage ? savedLanguage : "eng";
country = savedCountry ? savedCountry : "poland";

// Calendar
const newYear = new Year(2025);
const version = new YearVersion(newYear, country, language);
// const visualization = new YearVisualization(version, "content");
new DaysSequenceVisualization(version, "2025-4-5");

// Interface
new InterfaceHeader(version, " ", "header");
