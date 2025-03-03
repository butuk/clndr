import { PageHeader } from "./js/PageHeader.js";
import { Year } from "./js/Year.js";
import { Display } from "./js/Display.js";
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

// Site header
const controls = new PageHeader("header");

// Calendar
const year = new Year();

// Display
const display = new Display(year, "content");

// Settings, switchers and indicators
new Settings(year, display.visualizations, controls);
