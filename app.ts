/*
import { PageHeader } from "./js/PageHeader.js";
import { Year } from "./js/Year.js";
import { Display } from "./js/Display.js";
import { ViewTransitionController } from "./js/ViewTransitionController.js";
import { Settings } from "./js/Settings.js";
import { VisualizationOfCalendar } from "./js/VisualizationOfCalendar.js";
*/
import { Year } from "./ts/Year";

/*
// Fix for an experiment consequences
if (localStorage.getItem("year") !== null) {
  localStorage.removeItem("year");
}*/
import { Data } from "./ts/Data.js";

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
const data = new Data(2025);
console.log(data);

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
