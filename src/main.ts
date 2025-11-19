import "./styles.scss";
import State from "./ts/State.ts";
import { Visualization } from "./ts/Visualization.ts";
import { IndicatorOfScroll } from "./ts/InicatorOfScroll.ts";

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

// Create main content
document.addEventListener("DOMContentLoaded", () => {
  // System start state
  const state = State.getInstance();
  state.set("year", new Date().getFullYear());

  // Calendar visualization
  new Visualization(document.body);

  // Scroll indicator
  new IndicatorOfScroll();
});
