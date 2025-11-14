import { IndicatorForYear } from "./IndicatorForYear.ts";
import { ButtonPlus } from "./ButtonPlus.ts";
import { ButtonMinus } from "./ButtonMinus.ts";
import { IndicatorButtonReset } from "./IndicatorButtonReset.ts";
import { createElement } from "./helpFunctions.ts";
import { Button } from "./Button.ts";

export class Header {
  constructor() {
    // Create elements
    const header: HTMLElement | SVGElement = createElement("header", "header");

    /*const buttonMinus: HTMLElement | SVGElement = createElement(
      "span",
      "buttonMinus",
      "minus",
    );
    buttonMinus.innerHTML = "−";*/

    const appHeader: HTMLElement | SVGElement = createElement(
      "h1",
      "app-header",
      "year",
    );
    /*const buttonPlus: HTMLElement | SVGElement = createElement(
      "span",
      "buttonPlus",
      "plus",
    );
    buttonPlus.innerHTML = "+";*/

    // Make elements work --------- !REDO
    // new ButtonMinus(buttonMinus);
    new IndicatorForYear(appHeader);
    // new ButtonPlus(buttonPlus);

    // header.appendChild(buttonMinus);
    header.appendChild(appHeader);
    // header.appendChild(buttonPlus);
    document.body.append(header);

    const buttonReset: HTMLElement | null = document.querySelector("#reset");
    if (buttonReset) {
      new IndicatorButtonReset(buttonReset);
    }
  }
}
