import { Visualization } from "./ts/Visualization.js";
/*
import { PageHeader } from "./js/PageHeader.js";
import { Year } from "./js/Year.js";
import { Display } from "./js/Display.js";
import { ViewTransitionController } from "./js/ViewTransitionController.js";
import { Settings } from "./js/Settings.js";


/*
// Fix for an experiment consequences
if (localStorage.getItem("year") !== null) {
  localStorage.removeItem("year");
}*/
/*import { months } from "./dictionaries/months.js";

const today = new Date();
const todaysDay: number = today.getMonth();
const month = months.get(todaysDay);
const neededVersion = month?.bel_1;
console.log(neededVersion);*/
// User's browser tab title
const date = new Date();
document.title = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
// Disable context menu
window.oncontextmenu = (event) => {
    event.preventDefault();
    event.stopPropagation();
    return false;
};
const container = document.querySelector(".content");
new Visualization(container, 2023);
