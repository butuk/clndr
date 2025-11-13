import "./styles.scss";
import { Visualization } from "./ts/Visualization.ts";
import State from "./ts/State.ts";
import { IndicatorOfScroll } from "./ts/InicatorOfScroll.ts";
import { Header } from "./ts/Header.ts";

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
  // System state
  const state = State.getInstance();
  state.set("year", new Date().getFullYear());

  const container: HTMLElement | null = document.querySelector(".content");

  if (!container) {
    throw new Error("Container element not found");
  } else {
    new Visualization(container);
  }

  new Header();

  new IndicatorOfScroll();
});
