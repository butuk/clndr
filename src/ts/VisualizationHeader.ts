import { createElement } from "./helpFunctions.ts";
import { Control } from "./Control.ts";
import State from "./State.ts";

export class VisualizationHeader {
  protected state = State.getInstance();
  constructor() {
    // VisualizationHeader with year indicator
    const header: HTMLElement | SVGElement = createElement("header", "header");

    // Control that decreases the year by 1
    new Control(header, "span", "−", "button", "minus", () => {
      this.state.set("year", this.state.get("year") - 1);
    });

    // Year indicator
    const yearIndicator: HTMLElement | SVGElement = createElement(
      "span",
      "year",
    );
    yearIndicator.textContent = this.state.get("year").toString();
    header.append(yearIndicator);

    // Control that increases the year by 1
    new Control(header, "span", "+", "button", "plus", () => {
      this.state.set("year", this.state.get("year") + 1);
    });

    document.body.append(header);

    // Control that resets the year to the current year
    const buttonReset = new Control(
      document.body,
      "div",
      "reset",
      "birka",
      "reset",
      () => {
        this.state.set("year", new Date().getFullYear());
      },
    );
    buttonReset.addClass("birka_hidden");

    // On year change action
    this.state.subscribeTo("year", (year: number) => {
      yearIndicator.textContent = year.toString();
      if (this.state.get("year") > new Date().getFullYear()) {
        buttonReset.removeClass("birka_hidden");
        buttonReset.removeClass("birka_top");
        buttonReset.addClass("birka_bottom");
        buttonReset.setText(`>${new Date().getFullYear()}`);
      } else if (this.state.get("year") < new Date().getFullYear()) {
        buttonReset.removeClass("birka_hidden");
        buttonReset.removeClass("birka_bottom");
        buttonReset.addClass("birka_top");
        buttonReset.setText(`${new Date().getFullYear().toString()}>`);
      } else {
        buttonReset.addClass("birka_hidden");
      }
    });
  }
}
