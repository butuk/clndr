import { IndicatorButtonReset } from "./IndicatorButtonReset.ts";
import { createElement } from "./helpFunctions.ts";
import { Button } from "./Button.ts";
import State from "./State.ts";

export class Header {
  protected state = State.getInstance();
  constructor() {
    // Create element
    const header: HTMLElement | SVGElement = createElement("header", "header");

    // Button that decreases the year by 1
    new Button(header, "span", "−", "button", "minus", () => {
      this.state.set("year", this.state.get("year") - 1);
    });

    // Year indicator
    const yearIndicator = new Button(
      header,
      "span",
      ` ${this.state.get("year")}`,
      "button",
      "year",
      (): void => {},
    );
    this.state.subscribeTo("year", (year: number) => {
      yearIndicator.setText(year.toString());
    });

    // Button that increases the year by 1
    new Button(header, "span", "+", "button", "plus", () => {
      this.state.set("year", this.state.get("year") + 1);
    });

    document.body.append(header);

    /*const buttonReset: HTMLElement | null = document.querySelector("#reset");
    if (buttonReset) {
      new IndicatorButtonReset(buttonReset);
    }*/
  }
}
