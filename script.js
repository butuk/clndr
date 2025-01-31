import { Year } from "./js/Year.js";
import { CalendarVisualization } from "./js/CalendarVisualization.js";
import { PageHeader } from "./js/PageHeader.js";
import { DatesSequenceVisualization } from "./js/DatesSequenceVisualization.js";
import { Settings } from "./js/Settings.js";

/*
// Fix for an experiment consequences
if (localStorage.getItem("year") !== null) {
  localStorage.removeItem("year");
}*/

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

// Calendar
const year = new Year();

// Visualizations
const calendarViz = new CalendarVisualization(year, "content");
const daySequenceViz = new DatesSequenceVisualization(year);

// Site header
const controls = new PageHeader("header");

// Settings, switchers and indicators
new Settings(year, [calendarViz, daySequenceViz], controls);
