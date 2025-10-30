import "./styles.scss";
import { Visualization } from "./ts/Visualization.ts";
import State from "./ts/State.ts";
import { IndicatorForYear } from "./ts/IndicatorForYear.ts";
import { ButtonPlus } from "./ts/ButtonPlus.ts";
import { ButtonMinus } from "./ts/ButtonMinus.ts";
import { IndicatorButtonReset } from "./ts/IndicatorButtonReset.js";

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
  const appHeader: HTMLElement | null = document.querySelector("#year");
  if (appHeader) {
    new IndicatorForYear(appHeader);
  }

  const buttonPlus: HTMLElement | null = document.querySelector("#plus");
  if (buttonPlus) {
    new ButtonPlus(buttonPlus);
  }
  const buttonMinus: HTMLElement | null = document.querySelector("#minus");
  if (buttonMinus) {
    new ButtonMinus(buttonMinus);
  }

  const buttonReset: HTMLElement | null = document.querySelector("#reset");
  if (buttonReset) {
    new IndicatorButtonReset(buttonReset);
  }

  if (!container) {
    throw new Error("Container element not found");
  } else {
    new Visualization(container);
  }
});
