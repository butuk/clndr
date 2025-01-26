import { Year } from "./js/Year.js";
import { CalendarVisualization } from "./js/CalendarVisualization.js";
import { InterfaceHeader } from "./js/InterfaceHeader.js";
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

// Settings
const settings = new Settings();

// Calendar
const year = new Year(settings);
const visualization = new CalendarVisualization(year, "content");
// new DatesSequenceVisualization(year, "2025-1-14");

// Interface
new InterfaceHeader(year, visualization, "header", settings);
